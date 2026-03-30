import { useMemo, useState, useEffect } from 'react'
import {
  MagnifyingGlass,
  Trash,
  Plus,
  ArrowLeft,
  ArrowRight,
} from 'phosphor-react'
import {
  MainContainer,
  HeaderContainer,
  PageTitle,
  SearchActionsContainer,
  SearchAndFiltersRow,
  FiltersContainer,
  FilterButton,
  SearchContainer,
  SearchInputContainer,
  SearchIcon,
  SearchInput,
  ActionsContainer,
  ActionButton,
  DesktopTableWrapper,
  TableWrapper,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Checkbox,
  MobileCardsWrapper,
  LocationCard,
  CardTitle,
  CardDescription,
  PaginationContainer,
  PaginationButton,
  PaginationDots,
} from './styles'
import { useAuthPermissions } from '@/contexts/auth-context'
import PlatformLayout from '@/layouts/platform/layout'
import { RoleProtectedRoute } from '@/guards/RoleProtectedRoute'
import { AddLocationModal } from '@/pages/locations/components/AddLocationModal'
import { EditLocationModal } from '@/pages/locations/components/EditLocationModal'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { LocationResponse } from '../../lib/api/generated/models/locationResponse'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { LoadErrorState } from '@/components'
import { invalidateTrashQueries } from '@/pages/trash/trash-cache'

type LocationItem = LocationResponse
type LocationsListResponse<T> = {
  page: number
  pageSize: number
  total: number
  locations?: T[]
}

const ITEMS_PER_PAGE = 10

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

export default function LocationsPage() {
  const queryClient = useQueryClient()
  const { canAccessLocations } = useAuthPermissions()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false)
  const [isEditLocationModalOpen, setIsEditLocationModalOpen] = useState(false)
  const [selectedLocationForEdit, setSelectedLocationForEdit] =
    useState<LocationItem | null>(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const {
    data: locationsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<LocationsListResponse<LocationResponse>>({
    queryKey: ['locations', debouncedSearchTerm, statusFilter, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams()

      params.append('page', currentPage.toString())
      params.append('pageSize', ITEMS_PER_PAGE.toString())

      if (debouncedSearchTerm) {
        params.append('query', debouncedSearchTerm)
      }

      if (statusFilter !== 'all') {
        params.append('isActive', statusFilter === 'active' ? 'true' : 'false')
      }

      const url = `/api/locations${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Falha ao buscar localizações.')
      }

      return response.json() as Promise<LocationsListResponse<LocationResponse>>
    },
    retry: false,
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
  })

  const filteredLocations = useMemo(
    () => (locationsData?.locations || []).filter((item) => item.id),
    [locationsData],
  )

  const hasDisplayValue = (value?: string | null) => Boolean(value?.trim())

  const deleteLocationsMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await fetch('/api/locations/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ids }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || 'Falha ao mover localizações para a lixeira.',
        )
      }

      return response.json()
    },
    onSuccess: async (data) => {
      await invalidateTrashQueries(queryClient)
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      setSelectedItems([])
      setShowDeleteConfirmation(false)
      toast.success(data.message || 'Localizações movidas para a lixeira.')
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Falha ao mover localizações para a lixeira.',
      )
    },
  })

  const totalItems = locationsData?.total ?? 0
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const effectiveCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (filter: 'all' | 'active' | 'inactive') => {
    setStatusFilter(filter)
    setCurrentPage(1)
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handleSelectAll = () => {
    const currentItemIds = filteredLocations
      .map((item) => item.id)
      .filter((id): id is string => id !== undefined)

    const allCurrentSelected = currentItemIds.every((id: string) =>
      selectedItems.includes(id),
    )

    if (allCurrentSelected) {
      setSelectedItems((prev) =>
        prev.filter((id) => !currentItemIds.includes(id)),
      )
    } else {
      setSelectedItems((prev) => [
        ...prev,
        ...currentItemIds.filter((id: string) => !prev.includes(id)),
      ])
    }
  }

  const isAllCurrentSelected =
    filteredLocations.length > 0 &&
    filteredLocations.every((item) =>
      item.id ? selectedItems.includes(item.id) : false,
    )

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      toast.warning('Selecione pelo menos um item para mover para a lixeira.')
      return
    }

    setShowDeleteConfirmation(true)
  }

  const handleEditLocation = (location: LocationItem) => {
    setSelectedLocationForEdit(location)
    setIsEditLocationModalOpen(true)
  }

  const handleEditLocationSuccess = () => {
    setIsEditLocationModalOpen(false)
    setSelectedLocationForEdit(null)
  }

  const handleEditLocationClose = () => {
    setIsEditLocationModalOpen(false)
    setSelectedLocationForEdit(null)
  }

  const handlePageChange = (page: number) => {
    if (totalPages === 0) return
    const next = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(next)
  }

  const renderPaginationButtons = () => {
    const buttons: React.ReactElement[] = []

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
      for (let page = 1; page <= totalPages; page++) addPageButton(page)
    } else {
      const left = Math.max(2, effectiveCurrentPage - 1)
      const right = Math.min(totalPages - 1, effectiveCurrentPage + 1)
      addPageButton(1)

      if (left > 2) {
        buttons.push(<PaginationDots key="dots-left">...</PaginationDots>)
      }

      for (let page = left; page <= right; page++) addPageButton(page)

      if (right < totalPages - 1) {
        buttons.push(<PaginationDots key="dots-right">...</PaginationDots>)
      }

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

  if (isLoading) {
    return (
      <RoleProtectedRoute canAccess={canAccessLocations()}>
        <PlatformLayout>
          <MainContainer>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              Carregando...
            </div>
          </MainContainer>
        </PlatformLayout>
      </RoleProtectedRoute>
    )
  }

  if (error) {
    return (
      <RoleProtectedRoute canAccess={canAccessLocations()}>
        <PlatformLayout>
          <MainContainer>
            <HeaderContainer>
              <PageTitle>Localização</PageTitle>
            </HeaderContainer>

            <LoadErrorState
              badge="Localizações indisponíveis"
              title="Não conseguimos carregar as localizações agora"
              description="As localizações não puderam ser buscadas neste momento. Isso normalmente acontece quando o servidor está temporariamente indisponível."
              onRetry={() => refetch()}
              isRetrying={isRefetching}
              tips={[
                'Assim que a conexão voltar, você poderá retomar a gestão sem precisar reconfigurar os filtros atuais.',
                'Se o servidor acabou de reiniciar, aguarde alguns segundos antes de tentar de novo.',
              ]}
            />
          </MainContainer>
        </PlatformLayout>
      </RoleProtectedRoute>
    )
  }

  return (
    <RoleProtectedRoute canAccess={canAccessLocations()}>
      <PlatformLayout>
        <MainContainer>
          <HeaderContainer>
            <PageTitle>Localização</PageTitle>
          </HeaderContainer>

          <SearchActionsContainer>
            <SearchAndFiltersRow>
              <SearchContainer>
                <SearchInputContainer>
                  <SearchIcon>
                    <MagnifyingGlass size={20} weight="regular" />
                  </SearchIcon>
                  <SearchInput
                    type="text"
                    placeholder="Busque por nome, código ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </SearchInputContainer>
                <ActionButton
                  variant="mobile-add"
                  onClick={() => setIsAddLocationModalOpen(true)}
                >
                  <Plus size={16} />
                </ActionButton>
              </SearchContainer>

              <ActionsContainer>
                <ActionButton
                  variant="delete"
                  onClick={handleDeleteSelected}
                  disabled={selectedItems.length === 0}
                >
                  <Trash size={20} weight="bold" />
                  <span>Mover para lixeira</span>
                </ActionButton>
                <ActionButton
                  variant="add"
                  onClick={() => setIsAddLocationModalOpen(true)}
                >
                  <Plus size={16} />
                  Adicionar Localização
                </ActionButton>
              </ActionsContainer>
            </SearchAndFiltersRow>

            <FiltersContainer>
              <FilterButton
                isActive={statusFilter === 'all'}
                onClick={() => handleStatusFilterChange('all')}
              >
                Todos
              </FilterButton>
              <FilterButton
                isActive={statusFilter === 'active'}
                onClick={() => handleStatusFilterChange('active')}
              >
                Ativos
              </FilterButton>
              <FilterButton
                isActive={statusFilter === 'inactive'}
                onClick={() => handleStatusFilterChange('inactive')}
              >
                Inativos
              </FilterButton>
            </FiltersContainer>
          </SearchActionsContainer>

          {filteredLocations.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>Nenhum resultado encontrado</p>
              <p style={{ color: '#666', fontSize: '0.9em' }}>
                {searchTerm
                  ? 'Tente ajustar sua busca e tente novamente.'
                  : 'Não há localizações cadastradas ainda.'}
              </p>
            </div>
          )}

          {filteredLocations.length > 0 && (
            <DesktopTableWrapper>
              <TableWrapper>
                <Table>
                  <thead>
                    <TableRow isHeader>
                      <TableHeader>
                        <Checkbox
                          type="checkbox"
                          checked={isAllCurrentSelected}
                          onChange={handleSelectAll}
                        />
                      </TableHeader>
                      <TableHeader>Nome</TableHeader>
                      <TableHeader>Código</TableHeader>
                      <TableHeader>Descrição</TableHeader>
                    </TableRow>
                  </thead>
                  <tbody>
                    {filteredLocations.map((item) => {
                      if (!item.id) return null

                      return (
                        <TableRow
                          key={item.id}
                          isHeader={false}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleEditLocation(item)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleSelectItem(item.id!)}
                            />
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.code?.trim() ?? ''}</TableCell>
                          <TableCell>
                            {item.description?.trim() ?? ''}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </tbody>
                </Table>
              </TableWrapper>
            </DesktopTableWrapper>
          )}

          {filteredLocations.length > 0 && (
            <MobileCardsWrapper>
              {filteredLocations.map((item) => {
                if (!item.id) return null

                return (
                  <div key={item.id}>
                    <LocationCard
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEditLocation(item)}
                    >
                      <div>
                        <CardTitle>
                          <strong>Nome:</strong> {item.name}
                        </CardTitle>
                        {hasDisplayValue(item.code) && (
                          <CardDescription>
                            <strong>Código:</strong> {item.code?.trim()}
                          </CardDescription>
                        )}
                        {hasDisplayValue(item.description) && (
                          <CardDescription>
                            <strong>Descrição</strong>
                            <br />
                            {item.description?.trim()}
                          </CardDescription>
                        )}
                      </div>
                    </LocationCard>
                  </div>
                )
              })}
            </MobileCardsWrapper>
          )}

          {totalPages > 1 && (
            <PaginationContainer>
              {renderPaginationButtons()}
            </PaginationContainer>
          )}

          <AddLocationModal
            isOpen={isAddLocationModalOpen}
            onClose={() => setIsAddLocationModalOpen(false)}
            onSuccess={() => setIsAddLocationModalOpen(false)}
          />

          <EditLocationModal
            isOpen={isEditLocationModalOpen}
            onClose={handleEditLocationClose}
            onSuccess={handleEditLocationSuccess}
            location={selectedLocationForEdit}
          />

          <ConfirmationModal
            isOpen={showDeleteConfirmation}
            onClose={() => setShowDeleteConfirmation(false)}
            onConfirm={() => deleteLocationsMutation.mutate(selectedItems)}
            title="Mover localizações para a lixeira?"
            message={`${selectedItems.length} ${selectedItems.length === 1 ? 'item será movido' : 'itens serão movidos'} para a lixeira. Você poderá restaurá-${selectedItems.length === 1 ? 'lo' : 'los'} posteriormente.`}
            confirmText="Mover para lixeira"
            cancelText="Cancelar"
          />
        </MainContainer>
      </PlatformLayout>
    </RoleProtectedRoute>
  )
}
