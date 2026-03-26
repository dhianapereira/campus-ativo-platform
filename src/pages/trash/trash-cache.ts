import type { QueryClient } from '@tanstack/react-query'

export const TRASH_QUERY_KEY = ['trash'] as const

export type TrashItemType = 'location' | 'category' | 'problem'

export interface TrashCacheItem {
  id: string
  itemType: TrashItemType
}

export interface TrashQueryData {
  items: TrashCacheItem[]
  total: number
  type?: string
}

export function removeTrashItemsFromCache(
  queryClient: QueryClient,
  removedItems: TrashCacheItem[],
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
