import type { NextApiRequest, NextApiResponse } from 'next'
import {
  fetchLocationsControllerHandle,
  restoreLocationControllerHandle,
  deleteLocationControllerHandle,
} from '../../lib/api/generated/locations/locations'
import {
  fetchCategoriesControllerHandle,
  restoreCategoryControllerHandle,
  deleteCategoryControllerHandle,
} from '../../lib/api/generated/categories/categories'
import {
  fetchProblemsControllerHandle,
  restoreProblemControllerHandle,
  deleteProblemControllerHandle,
} from '../../lib/api/generated/problems/problems'
import { getUserProfileControllerHandle } from '../../lib/api/generated/user-profile/user-profile'
import { getRoleLevel } from '../../contexts/auth/role-mapping'

const TRASH_PAGE_SIZE = 20
type TrashItemType = 'location' | 'category' | 'problem'

interface BulkTrashItemPayload {
  id: string
  type: TrashItemType
}

function filterByDeletedDate(
  items: Array<{ deletedAt?: string | null }>,
  dateFilter?: string,
) {
  if (!dateFilter || dateFilter === 'all') {
    return items
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return items.filter((item) => {
    if (!item.deletedAt) return false

    const deletedDate = new Date(item.deletedAt)

    switch (dateFilter) {
      case 'today': {
        return deletedDate >= today
      }
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
      case 'thisyear': {
        return deletedDate.getFullYear() === now.getFullYear()
      }
      default:
        return true
    }
  })
}

function extractComparableId(value: unknown): string | null {
  if (!value) return null

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    const candidates = ['id', '_id', 'value', '$oid']

    for (const key of candidates) {
      const candidate = record[key]
      if (typeof candidate === 'string' && candidate.trim() !== '') {
        return candidate
      }
    }
  }

  return null
}

function extractUserProfile(
  payload: unknown,
): { id?: string | null; role?: string | null } | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const directProfile = payload as { id?: string | null; role?: string | null }

  if (
    typeof directProfile.id === 'string' ||
    typeof directProfile.role === 'string'
  ) {
    return directProfile
  }

  const wrappedProfile = (payload as { profile?: unknown }).profile

  if (!wrappedProfile || typeof wrappedProfile !== 'object') {
    return null
  }

  return wrappedProfile as { id?: string | null; role?: string | null }
}

function extractRoleFromToken(token: string): string | null {
  try {
    const tokenPayload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString(),
    ) as { role?: unknown }

    return typeof tokenPayload.role === 'string' ? tokenPayload.role : null
  } catch {
    return null
  }
}

async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<T[]>,
): Promise<T[]> {
  const items: T[] = []
  let page = 1

  while (true) {
    const currentPageItems = await fetchPage(page)

    if (currentPageItems.length === 0) {
      break
    }

    items.push(...currentPageItems)

    if (currentPageItems.length < TRASH_PAGE_SIZE) {
      break
    }

    page += 1
  }

  return items
}

function normalizeBulkItems(
  body: NextApiRequest['body'],
): BulkTrashItemPayload[] {
  const items = Array.isArray(body?.items) ? body.items : null

  if (items) {
    return items.filter(
      (item): item is BulkTrashItemPayload =>
        !!item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        (item.type === 'location' ||
          item.type === 'category' ||
          item.type === 'problem'),
    )
  }

  const ids = Array.isArray(body?.ids) ? body.ids : []
  const type = body?.type

  if (type !== 'location' && type !== 'category' && type !== 'problem') {
    return []
  }

  return ids
    .filter((id): id is string => typeof id === 'string')
    .map((id) => ({ id, type }))
}

async function executeTrashAction(
  action: 'restore' | 'delete',
  item: BulkTrashItemPayload,
  authToken: string,
) {
  const request = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }

  if (action === 'restore') {
    if (item.type === 'location') {
      return restoreLocationControllerHandle(item.id, request)
    }
    if (item.type === 'category') {
      return restoreCategoryControllerHandle(item.id, request)
    }

    return restoreProblemControllerHandle(item.id, request)
  }

  if (item.type === 'location') {
    return deleteLocationControllerHandle(item.id, request)
  }
  if (item.type === 'category') {
    return deleteCategoryControllerHandle(item.id, request)
  }

  return deleteProblemControllerHandle(item.id, request)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authToken = req.cookies['auth-token']

  if (!authToken) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const { query, type, dateFilter } = req.query

      const searchQuery = query && typeof query === 'string' ? query : undefined

      const itemType = type && typeof type === 'string' ? type : undefined

      const dateFilterValue =
        dateFilter && typeof dateFilter === 'string' ? dateFilter : undefined

      let currentUserId: string | null = null
      let roleLevel = 0
      try {
        const profileResponse = await getUserProfileControllerHandle({
          headers: { Authorization: `Bearer ${authToken}` },
        })
        const profile = extractUserProfile(profileResponse)
        const roleFromToken = extractRoleFromToken(authToken)

        currentUserId = profile?.id ?? null
        roleLevel = getRoleLevel(profile?.role || roleFromToken || '')
      } catch {
        // Mantém a lixeira vazia em caso de erro no perfil para evitar expor itens de outros usuários.
      }

      const canSeeLocationsAndCategories = roleLevel >= 2
      const onlyOwnProblems = (problems: Array<Record<string, unknown>>) =>
        currentUserId
          ? problems.filter((p) => {
              const reporterId = extractComparableId(p.reporterId)
              return reporterId === currentUserId
            })
          : []

      const results: {
        items: unknown[]
        total: number
        type?: string
      } = { items: [], total: 0 }

      if (!itemType || itemType === 'all') {
        const fetchPayload = {
          headers: { Authorization: `Bearer ${authToken}` },
        }

        const [locationsResult, categoriesResult, problemsResult] =
          await Promise.allSettled([
            canSeeLocationsAndCategories
              ? fetchAllPages(async (page) => {
                  const response = await fetchLocationsControllerHandle(
                    { includeDeleted: true, query: searchQuery, page },
                    fetchPayload,
                  )

                  return response?.locations || []
                })
              : Promise.resolve([]),
            canSeeLocationsAndCategories
              ? fetchAllPages(async (page) => {
                  const response = await fetchCategoriesControllerHandle(
                    { includeDeleted: true, query: searchQuery, page },
                    fetchPayload,
                  )

                  return response?.categories || []
                })
              : Promise.resolve([]),
            fetchAllPages(async (page) => {
              const response = await fetchProblemsControllerHandle(
                { includeDeleted: true, query: searchQuery, page },
                fetchPayload,
              )

              return response?.problems || []
            }),
          ])

        const locationsData =
          locationsResult.status === 'fulfilled' ? locationsResult.value : []
        const categoriesData =
          categoriesResult.status === 'fulfilled' ? categoriesResult.value : []
        const problemsData =
          problemsResult.status === 'fulfilled' ? problemsResult.value : []

        const deletedLocations =
          locationsData.filter(
            (loc: { deletedAt?: string | null }) =>
              loc.deletedAt !== null && loc.deletedAt !== undefined,
          ) || []
        const deletedCategories =
          categoriesData.filter(
            (cat: { deletedAt?: string | null }) =>
              cat.deletedAt !== null && cat.deletedAt !== undefined,
          ) || []
        const deletedProblemsRaw =
          (problemsData as unknown as Array<Record<string, unknown>>).filter(
            (prob) => prob.deletedAt !== null && prob.deletedAt !== undefined,
          ) || []
        const deletedProblems = onlyOwnProblems(deletedProblemsRaw)

        const filteredLocations = filterByDeletedDate(
          deletedLocations,
          dateFilterValue,
        )
        const filteredCategories = filterByDeletedDate(
          deletedCategories,
          dateFilterValue,
        )
        const filteredProblems = filterByDeletedDate(
          deletedProblems as Array<{ deletedAt?: string | null }>,
          dateFilterValue,
        )

        const allItems = [
          ...filteredLocations.map((item) => ({
            ...(item as Record<string, unknown>),
            itemType: 'location',
          })),
          ...filteredCategories.map((item) => ({
            ...(item as Record<string, unknown>),
            itemType: 'category',
          })),
          ...filteredProblems.map((item) => {
            const prob = item as Record<string, unknown> & {
              location?: { name?: string }
            }
            return {
              ...prob,
              itemType: 'problem',
              name: prob.title,
              local: prob.location?.name ?? prob.locationName,
              description: prob.excerpt || prob.description,
            }
          }),
        ]

        results.items = allItems
        results.total = allItems.length
      } else if (itemType === 'location') {
        if (!canSeeLocationsAndCategories) {
          results.items = []
          results.total = 0
          results.type = 'location'

          return res.status(200).json(results)
        }

        const data = await fetchAllPages(async (page) => {
          const response = await fetchLocationsControllerHandle(
            {
              includeDeleted: true,
              query: searchQuery,
              page,
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          )

          return response?.locations || []
        })

        const deletedItems =
          data.filter(
            (loc: { deletedAt?: string | null }) =>
              loc.deletedAt !== null && loc.deletedAt !== undefined,
          ) || []

        const filteredItems = filterByDeletedDate(deletedItems, dateFilterValue)

        results.items = filteredItems.map((item) => ({
          ...(item as Record<string, unknown>),
          itemType: 'location',
        }))
        results.total = filteredItems.length
        results.type = 'location'
      } else if (itemType === 'category') {
        if (!canSeeLocationsAndCategories) {
          results.items = []
          results.total = 0
          results.type = 'category'

          return res.status(200).json(results)
        }

        const data = await fetchAllPages(async (page) => {
          const response = await fetchCategoriesControllerHandle(
            {
              includeDeleted: true,
              query: searchQuery,
              page,
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          )

          return response?.categories || []
        })

        const deletedItems =
          data.filter(
            (cat: { deletedAt?: string | null }) =>
              cat.deletedAt !== null && cat.deletedAt !== undefined,
          ) || []

        const filteredItems = filterByDeletedDate(deletedItems, dateFilterValue)

        results.items = filteredItems.map((item) => ({
          ...(item as Record<string, unknown>),
          itemType: 'category',
        }))
        results.total = filteredItems.length
        results.type = 'category'
      } else if (itemType === 'problem') {
        const data = await fetchAllPages(async (page) => {
          const response = await fetchProblemsControllerHandle(
            {
              includeDeleted: true,
              query: searchQuery,
              page,
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          )

          return response?.problems || []
        })

        const deletedItemsRaw =
          (data as unknown as Array<Record<string, unknown>>).filter(
            (prob) => prob.deletedAt !== null && prob.deletedAt !== undefined,
          ) || []
        const deletedItems = onlyOwnProblems(deletedItemsRaw)

        const filteredItems = filterByDeletedDate(
          deletedItems as Array<{ deletedAt?: string | null }>,
          dateFilterValue,
        )

        results.items = filteredItems.map((item) => {
          const prob = item as Record<string, unknown> & {
            location?: { name?: string }
          }

          return {
            ...prob,
            itemType: 'problem',
            name: prob.title,
            local: prob.location?.name ?? prob.locationName,
            description: prob.excerpt || prob.description,
          }
        })
        results.total = filteredItems.length
        results.type = 'problem'
      }

      return res.status(200).json(results)
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as unknown as {
          response?: { status?: number; data?: { message?: string } }
        }
        const status = axiosError.response?.status || 500
        const message =
          axiosError.response?.data?.message || 'Internal server error'

        return res.status(status).json({ message })
      }

      return res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const { action } = req.body
      const items = normalizeBulkItems(req.body)

      if (!action || items.length === 0) {
        return res
          .status(400)
          .json({ message: 'Ação e itens são obrigatórios.' })
      }

      if (action === 'restore' || action === 'delete') {
        const results = await Promise.allSettled(
          items.map((item) => executeTrashAction(action, item, authToken)),
        )

        const failedItems = results.flatMap((result, index) => {
          if (result.status === 'fulfilled') {
            return []
          }

          const error =
            result.reason &&
            typeof result.reason === 'object' &&
            'response' in result.reason
              ? (result.reason as {
                  response?: { data?: { message?: string }; status?: number }
                })
              : undefined

          return [
            {
              id: items[index].id,
              type: items[index].type,
              status: error?.response?.status ?? 500,
              message:
                error?.response?.data?.message || 'Internal server error',
            },
          ]
        })

        const successCount = results.length - failedItems.length
        const successKey =
          action === 'restore' ? 'restoredCount' : 'deletedCount'
        const successMessage =
          action === 'restore'
            ? 'Itens restaurados com sucesso.'
            : 'Itens excluídos permanentemente.'
        const partialMessage =
          action === 'restore'
            ? 'Alguns itens não puderam ser restaurados.'
            : 'Alguns itens não puderam ser excluídos.'

        if (successCount === 0) {
          return res.status(400).json({
            message: failedItems[0]?.message || partialMessage,
            failedCount: failedItems.length,
            failedItems,
            [successKey]: 0,
          })
        }

        return res.status(200).json({
          message: failedItems.length > 0 ? partialMessage : successMessage,
          failedCount: failedItems.length,
          failedItems,
          [successKey]: successCount,
        })
      } else {
        return res.status(400).json({ message: 'Ação inválida.' })
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as unknown as {
          response?: { status?: number; data?: { message?: string } }
        }
        const status = axiosError.response?.status || 500
        const errorData = axiosError.response?.data || {}

        return res.status(status).json(errorData)
      }

      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}
