import { useState, useEffect } from 'react'
import {
  MagnifyingGlass,
  Trash,
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
} from 'phosphor-react'
import {
  MainContainer,
  HeaderContainer,
  PageTitle,
  SearchActionsContainer,
  FiltersAndActionRow,
  FiltersContainer,
  SearchContainer,
  SearchInputContainer,
  SearchIcon,
  SearchInput,
  ActionsContainer,
  SelectionToolbar,
  ActionButton,
  DesktopTableWrapper,
  TableWrapper,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Checkbox,
  MobileCardsWrapper,
  ItemCard,
  CardTitle,
  CardInfo,
  CardDescription,
  PaginationContainer,
  PaginationButton,
  PaginationDots,
  ItemsCount,
  SelectedCount,
  EmptyState,
  EmptyStateTitle,
  EmptyStateMessage,
} from './styles'
import { colors } from '@/styles/tokens'
import PlatformLayout from '@/layouts/platform/layout'
import { RoleProtectedRoute } from '@/guards/RoleProtectedRoute'
import { useAuthPermissions } from '@/contexts/auth-context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { LoadErrorState } from '@/components'
import { ViewProblemModal } from './components/ViewProblemModal'
import { ViewLocationModal } from './components/ViewLocationModal'
import { ViewCategoryModal } from './components/ViewCategoryModal'
import type { LocationResponse } from '../../lib/api/generated/models/locationResponse'
import type { CategoryResponse } from '../../lib/api/generated/models/categoryResponse'
import {
  removeTrashDetailsFromCache,
  getTrashDetailQueryKey,
  removeTrashItemsFromCache,
  TRASH_QUERY_KEY,
  type TrashItemType,
} from './trash-cache'

interface ProblemData {
  id: string
  title: string
  description?: string
  locationName?: string
  categoryName?: string
  authorId?: string
  authorName?: string
  createdAt?: string
  deletedAt?: string
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

interface TrashItem {
  id: string
  name: string
  itemType: TrashItemType
  code?: string
  description?: string
  local?: string
  deletedAt?: string
  reporterId?: string
  createdAt?: string
}

interface BulkActionPayload {
  ids: string[]
  type: TrashItemType
}

interface BulkTrashItemPayload {
  id: string
  type: TrashItemType
}

export default function TrashPage() {
  const queryClient = useQueryClient()
  const { hasRoleLevel } = useAuthPermissions()
  const canSeeLocationsAndCategories = hasRoleLevel(2)
  const currentYear = new Date().getFullYear()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'location' | 'category' | 'problem'
  >('all')
  const [dateFilter, setDateFilter] = useState<
    'all' | 'today' | 'last7days' | 'last30days' | 'thisyear'
  >('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isViewLocationModalOpen, setIsViewLocationModalOpen] = useState(false)
  const [selectedLocationForView, setSelectedLocationForView] =
    useState<LocationResponse | null>(null)
  const [isViewCategoryModalOpen, setIsViewCategoryModalOpen] = useState(false)
  const [selectedCategoryForView, setSelectedCategoryForView] =
    useState<CategoryResponse | null>(null)
  const [isViewProblemModalOpen, setIsViewProblemModalOpen] = useState(false)
  const [selectedProblemForView, setSelectedProblemForView] =
    useState<ProblemData | null>(null)
  const itemsPerPage = 10

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const {
    data: trashData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: [
      ...TRASH_QUERY_KEY,
      debouncedSearchTerm,
      currentPage,
      typeFilter,
      dateFilter,
    ],
    queryFn: async () => {
      const params = new URLSearchParams()

      params.append('page', currentPage.toString())

      if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '') {
        params.append('query', debouncedSearchTerm.trim())
      }

      if (typeFilter && typeFilter !== 'all') {
        params.append('type', typeFilter)
      }

      if (dateFilter && dateFilter !== 'all') {
        params.append('dateFilter', dateFilter)
      }

      const url = `/api/trash${params.toString() ? `?${params.toString()}` : ''}`

      const response = await fetch(url, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Falha ao buscar itens da lixeira.')
      }

      return response.json()
    },
    placeholderData: (previousData) => previousData,
    retry: false,
  })

  const restoreMutation = useMutation({
    mutationFn: async (
      payload: BulkActionPayload | { items: BulkTrashItemPayload[] },
    ) => {
      const response = await fetch('/api/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'restore',
          ...payload,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao restaurar itens.')
      }

      return response.json()
    },
    onSuccess: async (data?: {
      message?: string
      restoredCount?: number
      failedCount?: number
    }) => {
      const restoredTypes = new Set(
        selectedTrashItems.map((item) => item.itemType),
      )

      const invalidations: Promise<unknown>[] = []

      if (restoredTypes.has('location')) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: ['locations'],
            refetchType: 'all',
          }),
        )
      }

      if (restoredTypes.has('category')) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: ['categories'],
            refetchType: 'all',
          }),
        )
      }

      if (restoredTypes.has('problem')) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: ['problems'],
            refetchType: 'all',
          }),
          queryClient.invalidateQueries({
            queryKey: ['problem'],
            refetchType: 'all',
          }),
          queryClient.invalidateQueries({
            queryKey: ['dashboard'],
            refetchType: 'all',
          }),
        )
      }

      await Promise.all(invalidations)
      removeTrashDetailsFromCache(queryClient, selectedTrashItems)
      removeTrashItemsFromCache(queryClient, selectedTrashItems)
      setSelectedItems([])
      if (data?.failedCount) {
        toast.success(
          data.restoredCount
            ? `${data.restoredCount} item(ns) restaurado(s). ${data.failedCount} falharam.`
            : 'Nenhum item pôde ser restaurado.',
        )
        return
      }

      toast.success(data?.message || 'Itens restaurados com sucesso.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao restaurar itens.')
    },
  })

  const deletePermanentlyMutation = useMutation({
    mutationFn: async (
      payload: BulkActionPayload | { items: BulkTrashItemPayload[] },
    ) => {
      const response = await fetch('/api/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'delete',
          ...payload,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || 'Falha ao excluir itens permanentemente.',
        )
      }

      return response.json()
    },
    onSuccess: (data?: {
      message?: string
      deletedCount?: number
      failedCount?: number
    }) => {
      removeTrashItemsFromCache(queryClient, selectedTrashItems)
      setSelectedItems([])
      setShowDeleteConfirmation(false)
      if (data?.failedCount) {
        toast.success(
          data.deletedCount
            ? `${data.deletedCount} item(ns) excluído(s). ${data.failedCount} falharam.`
            : 'Nenhum item pôde ser excluído.',
        )
        return
      }

      toast.success(data?.message || 'Itens excluídos permanentemente.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao excluir itens.')
    },
  })

  const items: TrashItem[] = trashData?.items || []
  const selectedTrashItems = items.filter((item) =>
    selectedItems.includes(item.id),
  )
  const totalItems = trashData?.total || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const effectiveCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : currentPage
  const bulkActionIsPending =
    restoreMutation.isPending || deletePermanentlyMutation.isPending

  const getBulkActionPayload = ():
    | BulkActionPayload
    | { items: BulkTrashItemPayload[] }
    | null => {
    if (selectedTrashItems.length === 0) {
      return null
    }

    if (typeFilter !== 'all') {
      return {
        ids: selectedTrashItems.map((item) => item.id),
        type: selectedTrashItems[0].itemType,
      }
    }

    return {
      items: selectedTrashItems.map((item) => ({
        id: item.id,
        type: item.itemType,
      })),
    }
  }

  const handleSearch = (query: string) => {
    setSearchTerm(query)
    setCurrentPage(1)
  }

  const handleInputChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleFilterChange = (
    filter: 'all' | 'location' | 'category' | 'problem',
  ) => {
    setTypeFilter(filter)
    setCurrentPage(1)
    setSelectedItems([])
  }

  const handleDateFilterChange = (
    filter: 'all' | 'today' | 'last7days' | 'last30days' | 'thisyear',
  ) => {
    setDateFilter(filter)
    setCurrentPage(1)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map((item) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (item: TrashItem, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, item.id])
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== item.id))
    }
  }

  const handleRestore = () => {
    if (selectedTrashItems.length === 0) {
      toast.warning('Selecione pelo menos um item para restaurar.')
      return
    }

    const payload = getBulkActionPayload()

    if (!payload) {
      toast.warning('Selecione pelo menos um item para restaurar.')
      return
    }

    restoreMutation.mutate(payload)
  }

  const handleDeletePermanently = () => {
    if (selectedTrashItems.length === 0) {
      toast.warning('Selecione pelo menos um item para excluir.')
      return
    }

    const payload = getBulkActionPayload()

    if (!payload) {
      toast.warning('Selecione pelo menos um item para excluir.')
      return
    }

    setShowDeleteConfirmation(true)
  }

  const confirmDelete = () => {
    const payload = getBulkActionPayload()

    if (!payload) {
      toast.warning('Selecione pelo menos um item para excluir.')
      return
    }

    deletePermanentlyMutation.mutate(payload)
  }

  const handleItemClick = async (item: TrashItem) => {
    if (item.itemType === 'location') {
      try {
        const location = await queryClient.fetchQuery({
          queryKey: getTrashDetailQueryKey('location', item.id),
          queryFn: async () => {
            const response = await fetch(
              `/api/locations/${item.id}?includeDeleted=true`,
              {
                credentials: 'include',
              },
            )

            if (!response.ok) {
              throw new Error('Localização não encontrada')
            }

            return response.json() as Promise<LocationResponse>
          },
          staleTime: 5 * 60 * 1000,
        })

        setSelectedLocationForView(location)
        setIsViewLocationModalOpen(true)
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Falha ao carregar detalhes da localização.',
        )
      }
    } else if (item.itemType === 'category') {
      try {
        const category = await queryClient.fetchQuery({
          queryKey: getTrashDetailQueryKey('category', item.id),
          queryFn: async () => {
            const response = await fetch(
              `/api/categories/${item.id}?includeDeleted=true`,
              {
                credentials: 'include',
              },
            )

            if (!response.ok) {
              throw new Error('Categoria não encontrada')
            }

            return response.json() as Promise<CategoryResponse>
          },
          staleTime: 5 * 60 * 1000,
        })

        setSelectedCategoryForView(category)
        setIsViewCategoryModalOpen(true)
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Falha ao carregar detalhes da categoria.',
        )
      }
    } else if (item.itemType === 'problem') {
      const problemData: ProblemData = {
        id: item.id,
        title: item.name,
        description: item.description,
        locationName: item.local,
        authorId: item.reporterId,
        createdAt: item.createdAt,
        deletedAt: item.deletedAt,
      }
      setSelectedProblemForView(problemData)
      setIsViewProblemModalOpen(true)
    }
  }

  const handleViewLocationSuccess = () => {
    setIsViewLocationModalOpen(false)
    setSelectedLocationForView(null)
  }

  const handleViewLocationClose = () => {
    setIsViewLocationModalOpen(false)
    setSelectedLocationForView(null)
  }

  const handleViewCategorySuccess = () => {
    setIsViewCategoryModalOpen(false)
    setSelectedCategoryForView(null)
  }

  const handleViewCategoryClose = () => {
    setIsViewCategoryModalOpen(false)
    setSelectedCategoryForView(null)
  }

  const handleViewProblemSuccess = () => {
    setIsViewProblemModalOpen(false)
    setSelectedProblemForView(null)
  }

  const handleViewProblemClose = () => {
    setIsViewProblemModalOpen(false)
    setSelectedProblemForView(null)
  }

  const handlePageChange = (page: number) => {
    if (totalPages === 0) return
    const next = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(next)
  }

  const renderPaginationButtons = () => {
    const buttons: React.ReactNode[] = []

    const addPageButton = (page: number) =>
      buttons.push(
        <PaginationButton
          key={page}
          onClick={() => handlePageChange(page)}
          isActive={effectiveCurrentPage === page}
          variant="number"
        >
          {page}
        </PaginationButton>,
      )

    if (effectiveCurrentPage > 1) {
      buttons.push(
        <PaginationButton
          key="prev"
          onClick={() => handlePageChange(effectiveCurrentPage - 1)}
          variant="nav"
          aria-label="Página anterior"
        >
          <ArrowLeft size={22} weight="bold" />
          Anterior
        </PaginationButton>,
      )
    }

    if (totalPages <= 7) {
      for (let p = 1; p <= totalPages; p++) addPageButton(p)
    } else {
      const left = Math.max(2, effectiveCurrentPage - 1)
      const right = Math.min(totalPages - 1, effectiveCurrentPage + 1)
      addPageButton(1)

      if (left > 2)
        buttons.push(<PaginationDots key="dots-left">...</PaginationDots>)

      for (let p = left; p <= right; p++) addPageButton(p)

      if (right < totalPages - 1)
        buttons.push(<PaginationDots key="dots-right">...</PaginationDots>)

      addPageButton(totalPages)
    }

    if (effectiveCurrentPage < totalPages) {
      buttons.push(
        <PaginationButton
          key="next"
          onClick={() => handlePageChange(effectiveCurrentPage + 1)}
          variant="nav"
          aria-label="Próxima página"
        >
          Próximo
          <ArrowRight size={22} weight="bold" />
        </PaginationButton>,
      )
    }

    return buttons
  }

  const getTableHeaders = () => {
    if (typeFilter === 'category') {
      return (
        <TableRow isHeader>
          <TableHeader>
            <Checkbox
              type="checkbox"
              checked={
                selectedItems.length === items.length && items.length > 0
              }
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </TableHeader>
          <TableHeader>Nome</TableHeader>
          <TableHeader>Descrição</TableHeader>
        </TableRow>
      )
    }

    return (
      <TableRow isHeader>
        <TableHeader>
          <Checkbox
            type="checkbox"
            checked={selectedItems.length === items.length && items.length > 0}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
        </TableHeader>
        <TableHeader>Nome</TableHeader>
        <TableHeader>Local</TableHeader>
        <TableHeader>Descrição</TableHeader>
      </TableRow>
    )
  }

  if (error) {
    return (
      <RoleProtectedRoute requiredLevel={1}>
        <PlatformLayout>
          <MainContainer>
            <HeaderContainer>
              <PageTitle>Lixeira</PageTitle>
            </HeaderContainer>
            <LoadErrorState
              badge="Lixeira indisponível"
              title="Não conseguimos abrir a lixeira agora"
              description="Os itens removidos temporariamente não puderam ser carregados neste momento. Assim que a conexão com o servidor voltar, você poderá revisar e restaurar os registros normalmente."
              onRetry={() => refetch()}
              isRetrying={isRefetching}
              tips={[
                'Se o servidor acabou de voltar, aguarde alguns segundos antes de tentar novamente.',
                'Se a instabilidade continuar, atualize a página para refazer a sincronização.',
              ]}
            />
          </MainContainer>
        </PlatformLayout>
      </RoleProtectedRoute>
    )
  }

  return (
    <RoleProtectedRoute requiredLevel={1}>
      <PlatformLayout>
        <MainContainer>
          <HeaderContainer>
            <PageTitle>Lixeira</PageTitle>
          </HeaderContainer>

          <SearchActionsContainer>
            <SearchContainer>
              <SearchInputContainer>
                <SearchIcon>
                  <MagnifyingGlass size={20} weight="regular" />
                </SearchIcon>
                <SearchInput
                  type="text"
                  placeholder="Busque pelo nome..."
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleSearch(searchTerm)
                  }
                />
              </SearchInputContainer>
            </SearchContainer>

            <FiltersAndActionRow>
              <FiltersContainer>
                <select
                  value={typeFilter}
                  onChange={(e) =>
                    handleFilterChange(e.target.value as typeof typeFilter)
                  }
                  style={{
                    padding: '0.5rem 2rem 0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    border: `1px solid ${colors.gray300}`,
                    backgroundColor: colors.white,
                    color: colors.gray700,
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                  }}
                >
                  <option value="all">Tipo</option>
                  <option value="problem">Problema</option>
                  {canSeeLocationsAndCategories && (
                    <>
                      <option value="category">Categoria</option>
                      <option value="location">Localização</option>
                    </>
                  )}
                </select>

                <select
                  value={dateFilter}
                  onChange={(e) =>
                    handleDateFilterChange(e.target.value as typeof dateFilter)
                  }
                  style={{
                    padding: '0.5rem 2rem 0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    border: `1px solid ${colors.gray300}`,
                    backgroundColor: colors.white,
                    color: colors.gray700,
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                  }}
                >
                  <option value="all">Modificado</option>
                  <option value="today">Hoje</option>
                  <option value="last7days">Últimos 7 dias</option>
                  <option value="last30days">Últimos 30 dias</option>
                  <option value="thisyear">{`Este ano (${currentYear})`}</option>
                </select>
              </FiltersContainer>
            </FiltersAndActionRow>
          </SearchActionsContainer>

          <ItemsCount>
            {totalItems}{' '}
            {totalItems === 1 ? 'item na lixeira' : 'itens na lixeira'}
          </ItemsCount>

          {selectedItems.length > 0 && (
            <SelectionToolbar>
              <SelectedCount>
                Itens selecionados ({selectedItems.length})
              </SelectedCount>
              <ActionsContainer>
                <ActionButton
                  variant="primary"
                  onClick={handleRestore}
                  disabled={selectedItems.length === 0 || bulkActionIsPending}
                >
                  <ArrowCounterClockwise size={20} weight="bold" />
                  <span>
                    {restoreMutation.isPending
                      ? 'Restaurando...'
                      : 'Restaurar selecionados'}
                  </span>
                </ActionButton>
                <ActionButton
                  variant="danger"
                  onClick={handleDeletePermanently}
                  disabled={selectedItems.length === 0 || bulkActionIsPending}
                >
                  <Trash size={20} weight="bold" />
                  <span>
                    {deletePermanentlyMutation.isPending
                      ? 'Excluindo...'
                      : 'Excluir permanentemente'}
                  </span>
                </ActionButton>
              </ActionsContainer>
            </SelectionToolbar>
          )}

          {isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              Carregando...
            </div>
          ) : items.length === 0 ? (
            <EmptyState>
              <EmptyStateTitle>A lixeira está vazia</EmptyStateTitle>
              <EmptyStateMessage>
                Os itens que você mover para a lixeira aparecerão aqui. Quando
                isso acontecer, você poderá restaurá-los ou excluí-los
                permanentemente.
              </EmptyStateMessage>
            </EmptyState>
          ) : (
            <>
              <DesktopTableWrapper>
                <TableWrapper>
                  <Table>
                    <thead>{getTableHeaders()}</thead>
                    <tbody>
                      {items.map((item) => (
                        <TableRow
                          key={item.id}
                          isHeader={false}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleItemClick(item)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={(e) =>
                                handleSelectItem(item, e.target.checked)
                              }
                            />
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          {typeFilter !== 'category' && (
                            <TableCell>
                              {item.itemType === 'location'
                                ? item.code || '-'
                                : item.itemType === 'problem'
                                  ? item.local || '-'
                                  : '-'}
                            </TableCell>
                          )}
                          <TableCell>{item.description || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              </DesktopTableWrapper>

              <MobileCardsWrapper>
                {items.map((item) => (
                  <ItemCard key={item.id} onClick={() => handleItemClick(item)}>
                    <Checkbox
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleSelectItem(item, e.target.checked)
                      }}
                    />
                    <CardTitle>{item.name}</CardTitle>
                    {item.local && <CardInfo>{item.local}</CardInfo>}
                    {item.description && (
                      <CardDescription>{item.description}</CardDescription>
                    )}
                  </ItemCard>
                ))}
              </MobileCardsWrapper>
            </>
          )}

          {totalPages > 1 && (
            <PaginationContainer>
              {renderPaginationButtons()}
            </PaginationContainer>
          )}
        </MainContainer>

        <ConfirmationModal
          isOpen={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={confirmDelete}
          title="Excluir permanentemente?"
          message="Esta ação não pode ser desfeita. Os itens selecionados serão excluídos permanentemente do sistema."
          confirmText="Excluir permanentemente"
          cancelText="Cancelar"
          variant="danger"
        />

        <ViewLocationModal
          isOpen={isViewLocationModalOpen}
          onClose={handleViewLocationClose}
          onSuccess={handleViewLocationSuccess}
          location={selectedLocationForView}
        />

        <ViewCategoryModal
          isOpen={isViewCategoryModalOpen}
          onClose={handleViewCategoryClose}
          onSuccess={handleViewCategorySuccess}
          category={selectedCategoryForView}
        />

        <ViewProblemModal
          isOpen={isViewProblemModalOpen}
          onClose={handleViewProblemClose}
          onSuccess={handleViewProblemSuccess}
          problem={selectedProblemForView}
        />
      </PlatformLayout>
    </RoleProtectedRoute>
  )
}
