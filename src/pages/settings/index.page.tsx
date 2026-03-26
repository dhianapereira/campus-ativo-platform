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
  TabsContainer,
  Tab,
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
  CategoryCard,
  CardTitle,
  CardInfo,
  CardDescription,
  PaginationContainer,
  PaginationButton,
  PaginationDots,
} from './styles'
import PlatformLayout from '@/layouts/platform/layout'
import { RoleProtectedRoute } from '@/guards/RoleProtectedRoute'
import { AddCategoryModal } from './components/AddCategoryModal'
import { AddLocationModal } from './components/AddLocationModal'
import { EditLocationModal } from './components/EditLocationModal'
import { EditCategoryModal } from './components/EditCategoryModal'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { LocationResponse } from '../../lib/api/generated/models/locationResponse'
import type { CategoryResponse } from '../../lib/api/generated/models/categoryResponse'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { colors } from '@/styles/tokens'
import {
  createTrashItemFromCategory,
  createTrashItemFromLocation,
  upsertTrashItemsInCache,
} from '@/pages/trash/trash-cache'

type LocationItem = LocationResponse
type CategoryItem = CategoryResponse

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

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'localizacao' | 'categoria'>(
    'localizacao',
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false)
  const [isEditLocationModalOpen, setIsEditLocationModalOpen] = useState(false)
  const [selectedLocationForEdit, setSelectedLocationForEdit] =
    useState<LocationItem | null>(null)
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false)
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] =
    useState<CategoryItem | null>(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const itemsPerPage = 10

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const {
    data: locationsData,
    isLoading: locationsLoading,
    error: locationsError,
  } = useQuery({
    queryKey: ['locations', debouncedSearchTerm, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()

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

      return response.json() as Promise<{ locations: LocationResponse[] }>
    },
    retry: false,
    placeholderData: (previousData) => previousData,
    staleTime: 30000, // 30 seconds
  })

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ['categories', debouncedSearchTerm, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()

      if (debouncedSearchTerm) {
        params.append('query', debouncedSearchTerm)
      }
      if (statusFilter !== 'all') {
        params.append('isActive', statusFilter === 'active' ? 'true' : 'false')
      }

      const url = `/api/categories${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Falha ao buscar categorias.')
      }

      return response.json() as Promise<{ categories: CategoryResponse[] }>
    },
    retry: false,
    placeholderData: (previousData) => previousData,
    staleTime: 30000, // 30 seconds
  })

  // Store the filtered data to avoid unnecessary recalculations.
  const filteredLocations = useMemo(
    () => (locationsData?.locations || []).filter((item) => item.id),
    [locationsData],
  )

  const filteredCategories = useMemo(
    () => (categoriesData?.categories || []).filter((item) => item.id),
    [categoriesData],
  )

  const selectedLocationItems = filteredLocations.filter(
    (item) => item.id && selectedItems.includes(item.id),
  )
  const selectedCategoryItems = filteredCategories.filter(
    (item) => item.id && selectedItems.includes(item.id),
  )

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
    onSuccess: (data) => {
      upsertTrashItemsInCache(
        queryClient,
        selectedLocationItems.map((item) => createTrashItemFromLocation(item)),
      )
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

  const deleteCategoriesMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await fetch('/api/categories/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ids }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || 'Falha ao mover categorias para a lixeira.',
        )
      }

      return response.json()
    },
    onSuccess: (data) => {
      upsertTrashItemsInCache(
        queryClient,
        selectedCategoryItems.map((item) => createTrashItemFromCategory(item)),
      )
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setSelectedItems([])
      setShowDeleteConfirmation(false)
      toast.success(data.message || 'Categorias movidas para a lixeira.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao mover categorias para a lixeira.')
    },
  })

  const currentData: (LocationItem | CategoryItem)[] = useMemo(() => {
    if (activeTab === 'localizacao') {
      return filteredLocations
    } else {
      return filteredCategories
    }
  }, [activeTab, filteredLocations, filteredCategories])

  const isLoading =
    activeTab === 'localizacao' ? locationsLoading : categoriesLoading
  const error = activeTab === 'localizacao' ? locationsError : categoriesError

  const totalPages = Math.ceil(currentData.length / itemsPerPage)
  const effectiveCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1
  const startIndex = (effectiveCurrentPage - 1) * itemsPerPage
  const currentItems: (LocationItem | CategoryItem)[] = currentData.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  const handleTabChange = (tab: 'localizacao' | 'categoria') => {
    setActiveTab(tab)
    setSearchTerm('')
    setStatusFilter('all')
    setCurrentPage(1)
    setSelectedItems([])
  }

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
    const currentItemIds = currentItems
      .map((item: LocationItem | CategoryItem) => item.id)
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
    currentItems.length > 0 &&
    currentItems.every((item: LocationItem | CategoryItem) =>
      item.id ? selectedItems.includes(item.id) : false,
    )

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      toast.warning('Selecione pelo menos um item para mover para a lixeira.')
      return
    }
    setShowDeleteConfirmation(true)
  }

  const confirmDelete = () => {
    if (activeTab === 'localizacao') {
      deleteLocationsMutation.mutate(selectedItems)
    } else {
      deleteCategoriesMutation.mutate(selectedItems)
    }
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

  const handleEditCategory = (category: CategoryItem) => {
    setSelectedCategoryForEdit(category)
    setIsEditCategoryModalOpen(true)
  }

  const handleEditCategorySuccess = () => {
    setIsEditCategoryModalOpen(false)
    setSelectedCategoryForEdit(null)
  }

  const handleEditCategoryClose = () => {
    setIsEditCategoryModalOpen(false)
    setSelectedCategoryForEdit(null)
  }

  const handleAddNew = () => {
    if (activeTab === 'localizacao') {
      setIsAddLocationModalOpen(true)
    } else {
      setIsAddCategoryModalOpen(true)
    }
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

  if (isLoading) {
    return (
      <RoleProtectedRoute requiredLevel={2}>
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
      <RoleProtectedRoute requiredLevel={2}>
        <PlatformLayout>
          <MainContainer>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>Não foi possível buscar as informações no momento.</p>
              <p>Por favor, tente novamente mais tarde.</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: colors.greenMuted,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Recarregar
              </button>
            </div>
          </MainContainer>
        </PlatformLayout>
      </RoleProtectedRoute>
    )
  }

  return (
    <RoleProtectedRoute requiredLevel={2}>
      <PlatformLayout>
        <MainContainer>
          <HeaderContainer>
            <TabsContainer>
              <Tab
                isActive={activeTab === 'localizacao'}
                onClick={() => handleTabChange('localizacao')}
              >
                Localização
              </Tab>
              <Tab
                isActive={activeTab === 'categoria'}
                onClick={() => handleTabChange('categoria')}
              >
                Categoria
              </Tab>
            </TabsContainer>
          </HeaderContainer>

          <PageTitle>
            {activeTab === 'localizacao' ? 'Localização' : 'Categoria'}
          </PageTitle>

          <SearchActionsContainer>
            <SearchAndFiltersRow>
              <SearchContainer>
                <SearchInputContainer>
                  <SearchIcon>
                    <MagnifyingGlass size={20} weight="regular" />
                  </SearchIcon>
                  <SearchInput
                    type="text"
                    placeholder={
                      activeTab === 'localizacao'
                        ? 'Busque por nome, número ou descrição...'
                        : 'Busque pelo nome ou descrição...'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </SearchInputContainer>
                <ActionButton variant="mobile-add" onClick={handleAddNew}>
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
                <ActionButton variant="add" onClick={handleAddNew}>
                  <Plus size={16} />
                  {activeTab === 'localizacao'
                    ? 'Adicionar Localização'
                    : 'Adicionar Categoria'}
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

          {currentItems.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>Nenhum resultado encontrado</p>
              <p style={{ color: '#666', fontSize: '0.9em' }}>
                {searchTerm
                  ? 'Tente ajustar sua busca e tente novamente.'
                  : activeTab === 'localizacao'
                    ? 'Não há localizações cadastradas ainda.'
                    : 'Não há categorias cadastradas ainda.'}
              </p>
            </div>
          )}

          {currentItems.length > 0 && (
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
                      {activeTab === 'localizacao' && (
                        <TableHeader>Número</TableHeader>
                      )}
                      <TableHeader>Descrição</TableHeader>
                    </TableRow>
                  </thead>
                  <tbody>
                    {currentItems.map((item: LocationItem | CategoryItem) => {
                      if (!item.id) return null
                      const itemId = item.id
                      return (
                        <TableRow
                          key={itemId}
                          isHeader={false}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            if (activeTab === 'localizacao') {
                              handleEditLocation(item as LocationItem)
                            } else {
                              handleEditCategory(item as CategoryItem)
                            }
                          }}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              type="checkbox"
                              checked={selectedItems.includes(itemId)}
                              onChange={() => handleSelectItem(itemId)}
                            />
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          {activeTab === 'localizacao' && (
                            <TableCell>{(item as LocationItem).code}</TableCell>
                          )}
                          <TableCell>{item.description}</TableCell>
                        </TableRow>
                      )
                    })}
                  </tbody>
                </Table>
              </TableWrapper>
            </DesktopTableWrapper>
          )}

          {currentItems.length > 0 && (
            <MobileCardsWrapper>
              {currentItems.map((item: LocationItem | CategoryItem) => {
                if (!item.id) return null
                return (
                  <div key={item.id}>
                    {activeTab === 'localizacao' ? (
                      <LocationCard
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleEditLocation(item as LocationItem)}
                      >
                        <div>
                          <CardTitle>
                            <strong>Nome:</strong> {item.name}
                          </CardTitle>
                          <CardInfo>
                            <strong>Número:</strong>{' '}
                            {(item as LocationItem).code}
                          </CardInfo>
                          <CardDescription>
                            <strong>Descrição</strong>
                            <br />
                            {item.description}
                          </CardDescription>
                        </div>
                      </LocationCard>
                    ) : (
                      <CategoryCard
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleEditCategory(item as CategoryItem)}
                      >
                        <div>
                          <CardTitle>
                            <strong>Nome:</strong> {item.name}
                          </CardTitle>
                          <CardDescription>
                            <strong>Descrição</strong>
                            <br />
                            {item.description}
                          </CardDescription>
                        </div>
                      </CategoryCard>
                    )}
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

          <AddCategoryModal
            isOpen={isAddCategoryModalOpen}
            onClose={() => setIsAddCategoryModalOpen(false)}
            onSuccess={() => setIsAddCategoryModalOpen(false)}
          />

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

          <EditCategoryModal
            isOpen={isEditCategoryModalOpen}
            onClose={handleEditCategoryClose}
            onSuccess={handleEditCategorySuccess}
            category={selectedCategoryForEdit}
          />

          <ConfirmationModal
            isOpen={showDeleteConfirmation}
            onClose={() => setShowDeleteConfirmation(false)}
            onConfirm={confirmDelete}
            title={`Mover ${activeTab === 'localizacao' ? 'localizações' : 'categorias'} para a lixeira?`}
            message={`${selectedItems.length} ${selectedItems.length === 1 ? 'item será movido' : 'itens serão movidos'} para a lixeira. Você poderá restaurá-${selectedItems.length === 1 ? 'lo' : 'los'} posteriormente.`}
            confirmText="Mover para lixeira"
            cancelText="Cancelar"
          />
        </MainContainer>
      </PlatformLayout>
    </RoleProtectedRoute>
  )
}
