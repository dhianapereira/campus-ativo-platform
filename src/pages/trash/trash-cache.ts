import type { QueryClient, QueryKey } from '@tanstack/react-query'
import type { CategoryResponse } from '@/lib/api/generated/models/categoryResponse'
import type { LocationResponse } from '@/lib/api/generated/models/locationResponse'

export const TRASH_QUERY_KEY = ['trash'] as const
export const TRASH_DETAIL_QUERY_KEY = ['trash', 'details'] as const

export type TrashItemType = 'location' | 'category' | 'problem'
export type TrashTypeFilter = 'all' | TrashItemType
export type TrashDateFilter =
  | 'all'
  | 'today'
  | 'last7days'
  | 'last30days'
  | 'thisyear'

export interface TrashCacheItem {
  id: string
  itemType: TrashItemType
  name?: string
  code?: string
  description?: string
  local?: string
  deletedAt?: string
  reporterId?: string
  createdAt?: string
}

export interface TrashQueryData {
  items: TrashCacheItem[]
  total: number
  type?: string
}

interface TrashQueryFilters {
  searchTerm: string
  typeFilter: TrashTypeFilter
  dateFilter: TrashDateFilter
}

export function getTrashDetailQueryKey(type: TrashItemType, id: string) {
  return [...TRASH_DETAIL_QUERY_KEY, type, id] as const
}

export function invalidateTrashQueries(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: TRASH_QUERY_KEY,
    refetchType: 'all',
  })
}

export function removeTrashDetailsFromCache(
  queryClient: QueryClient,
  removedItems: Array<Pick<TrashCacheItem, 'id' | 'itemType'>>,
) {
  removedItems.forEach((item) => {
    queryClient.removeQueries({
      queryKey: getTrashDetailQueryKey(item.itemType, item.id),
    })
  })
}

export function removeTrashItemsFromCache(
  queryClient: QueryClient,
  removedItems: Array<Pick<TrashCacheItem, 'id' | 'itemType'>>,
) {
  if (removedItems.length === 0) {
    return
  }

  const removedKeys = new Set(
    removedItems.map((item) => `${item.itemType}:${item.id}`),
  )

  queryClient.setQueriesData<TrashQueryData>(
    { queryKey: TRASH_QUERY_KEY },
    (currentData) => {
      if (!currentData) {
        return currentData
      }

      const nextItems = currentData.items.filter(
        (item) => !removedKeys.has(`${item.itemType}:${item.id}`),
      )

      if (nextItems.length === currentData.items.length) {
        return currentData
      }

      return {
        ...currentData,
        items: nextItems,
        total: Math.max(
          0,
          currentData.total - (currentData.items.length - nextItems.length),
        ),
      }
    },
  )
}

export function upsertTrashItemsInCache(
  queryClient: QueryClient,
  incomingItems: TrashCacheItem[],
) {
  if (incomingItems.length === 0) {
    return
  }

  const cachedQueries = queryClient.getQueriesData<TrashQueryData>({
    queryKey: TRASH_QUERY_KEY,
  })

  cachedQueries.forEach(([queryKey, data]) => {
    if (!data) {
      return
    }

    const filters = getTrashQueryFilters(queryKey)
    const itemsToInsert = incomingItems.filter((item) =>
      matchesTrashFilters(item, filters),
    )

    if (itemsToInsert.length === 0) {
      return
    }

    const existingKeys = new Set(
      data.items.map((item) => `${item.itemType}:${item.id}`),
    )

    const dedupedItems = itemsToInsert.filter(
      (item) => !existingKeys.has(`${item.itemType}:${item.id}`),
    )

    if (dedupedItems.length === 0) {
      return
    }

    queryClient.setQueryData<TrashQueryData>(queryKey, {
      ...data,
      items: [...dedupedItems, ...data.items],
      total: data.total + dedupedItems.length,
    })
  })
}

export function createTrashItemFromLocation(
  location: Pick<LocationResponse, 'id' | 'name' | 'code' | 'description'>,
  deletedAt = new Date().toISOString(),
): TrashCacheItem {
  return {
    id: location.id,
    name: location.name,
    code: location.code ?? undefined,
    description: location.description ?? undefined,
    deletedAt,
    itemType: 'location',
  }
}

export function createTrashItemFromCategory(
  category: Pick<CategoryResponse, 'id' | 'name' | 'description'>,
  deletedAt = new Date().toISOString(),
): TrashCacheItem {
  return {
    id: category.id,
    name: category.name,
    description: category.description ?? undefined,
    deletedAt,
    itemType: 'category',
  }
}

export function createTrashItemFromProblem(problem: {
  id: string
  title: string
  description?: string | null
  location?: { name?: string | null } | null
  reporter?: { id?: string | null } | null
  createdAt?: string | null
  deletedAt?: string | null
}) {
  return {
    id: problem.id,
    name: problem.title,
    description: problem.description ?? undefined,
    local: problem.location?.name ?? undefined,
    reporterId: problem.reporter?.id ?? undefined,
    createdAt: problem.createdAt ?? undefined,
    deletedAt: problem.deletedAt ?? new Date().toISOString(),
    itemType: 'problem' as const,
  }
}

function getTrashQueryFilters(queryKey: QueryKey): TrashQueryFilters {
  return {
    searchTerm: typeof queryKey[1] === 'string' ? queryKey[1] : '',
    typeFilter:
      queryKey[3] === 'location' ||
      queryKey[3] === 'category' ||
      queryKey[3] === 'problem'
        ? queryKey[3]
        : 'all',
    dateFilter:
      queryKey[4] === 'today' ||
      queryKey[4] === 'last7days' ||
      queryKey[4] === 'last30days' ||
      queryKey[4] === 'thisyear'
        ? queryKey[4]
        : 'all',
  }
}

function matchesTrashFilters(item: TrashCacheItem, filters: TrashQueryFilters) {
  if (filters.typeFilter !== 'all' && item.itemType !== filters.typeFilter) {
    return false
  }

  if (!matchesSearch(item, filters.searchTerm)) {
    return false
  }

  return matchesDeletedDate(item.deletedAt, filters.dateFilter)
}

function matchesSearch(item: TrashCacheItem, searchTerm: string) {
  const normalizedSearch = normalizeText(searchTerm)

  if (!normalizedSearch) {
    return true
  }

  const haystack = normalizeText(
    [
      item.name,
      item.code,
      item.description,
      item.local,
      item.reporterId,
      item.createdAt,
    ]
      .filter(Boolean)
      .join(' '),
  )

  return haystack.includes(normalizedSearch)
}

function matchesDeletedDate(
  deletedAt: string | undefined,
  dateFilter: TrashDateFilter,
) {
  if (dateFilter === 'all') {
    return true
  }

  if (!deletedAt) {
    return false
  }

  const deletedDate = new Date(deletedAt)

  if (Number.isNaN(deletedDate.getTime())) {
    return false
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (dateFilter) {
    case 'today':
      return deletedDate >= today
    case 'last7days': {
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return deletedDate >= sevenDaysAgo
    }
    case 'last30days': {
      const thirtyDaysAgo = new Date(today)
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return deletedDate >= thirtyDaysAgo
    }
    case 'thisyear':
      return deletedDate.getFullYear() === now.getFullYear()
    default:
      return true
  }
}

function normalizeText(value: string) {
  return value.trim().toLocaleLowerCase('pt-BR')
}
