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
  CategoryCard,
  CardTitle,
  CardDescription,
  PaginationContainer,
  PaginationButton,
  PaginationDots,
} from '../settings/styles'
import { useAuthPermissions } from '@/contexts/auth-context'
import PlatformLayout from '@/layouts/platform/layout'
import { RoleProtectedRoute } from '@/guards/RoleProtectedRoute'
import { AddCategoryModal } from '@/pages/settings/components/AddCategoryModal'
import { EditCategoryModal } from '@/pages/settings/components/EditCategoryModal'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CategoryResponse } from '../../lib/api/generated/models/categoryResponse'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { LoadErrorState } from '@/components'
import { invalidateTrashQueries } from '@/pages/trash/trash-cache'

type CategoryItem = CategoryResponse
type CategoriesListResponse<T> = {
  page: number
  pageSize: number
  total: number
  categories?: T[]
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

export default function CategoriesPage() {
  const queryClient = useQueryClient()
  const { canAccessCategories } = useAuthPermissions()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false)
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] =
    useState<CategoryItem | null>(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const {
    data: categoriesData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<CategoriesListResponse<CategoryResponse>>({
    queryKey: ['categories', debouncedSearchTerm, statusFilter, currentPage],
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

      const url = `/api/categories${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Falha ao buscar categorias.')
      }

      return response.json() as Promise<
        CategoriesListResponse<CategoryResponse>
      >
    },
    retry: false,
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
  })

  const filteredCategories = useMemo(
    () => (categoriesData?.categories || []).filter((item) => item.id),
    [categoriesData],
  )

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
    onSuccess: async (data) => {
      await invalidateTrashQueries(queryClient)
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setSelectedItems([])
      setShowDeleteConfirmation(false)
      toast.success(data.message || 'Categorias movidas para a lixeira.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao mover categorias para a lixeira.')
    },
  })

  const totalItems = categoriesData?.total ?? 0
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
    const currentItemIds = filteredCategories
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
    filteredCategories.length > 0 &&
    filteredCategories.every((item) =>
      item.id ? selectedItems.includes(item.id) : false,
    )

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      toast.warning('Selecione pelo menos um item para mover para a lixeira.')
      return
    }

    setShowDeleteConfirmation(true)
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

  const handlePageChange = (page: number) => {
    if (totalPages === 0) return
    const next = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(next)
  }

  const renderPaginationButtons = () => {
    const buttons: JSX.Element[] = []

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
      <RoleProtectedRoute canAccess={canAccessCategories()}>
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
      <RoleProtectedRoute canAccess={canAccessCategories()}>
        <PlatformLayout>
          <MainContainer>
            <HeaderContainer>
              <PageTitle>Categoria</PageTitle>
            </HeaderContainer>

            <LoadErrorState
              badge="Categorias indisponíveis"
              title="Não conseguimos carregar as categorias agora"
              description="As categorias não puderam ser buscadas neste momento. Isso normalmente acontece quando o servidor está temporariamente indisponível."
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
    <RoleProtectedRoute canAccess={canAccessCategories()}>
      <PlatformLayout>
        <MainContainer>
          <HeaderContainer>
            <PageTitle>Categoria</PageTitle>
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
                    placeholder="Busque pelo nome ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </SearchInputContainer>
                <ActionButton
                  variant="mobile-add"
                  onClick={() => setIsAddCategoryModalOpen(true)}
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
                  onClick={() => setIsAddCategoryModalOpen(true)}
                >
                  <Plus size={16} />
                  Adicionar Categoria
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

          {filteredCategories.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>Nenhum resultado encontrado</p>
              <p style={{ color: '#666', fontSize: '0.9em' }}>
                {searchTerm
                  ? 'Tente ajustar sua busca e tente novamente.'
                  : 'Não há categorias cadastradas ainda.'}
              </p>
            </div>
          )}

          {filteredCategories.length > 0 && (
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
                      <TableHeader>Descrição</TableHeader>
                    </TableRow>
                  </thead>
                  <tbody>
                    {filteredCategories.map((item) => {
                      if (!item.id) return null

                      return (
                        <TableRow
                          key={item.id}
                          isHeader={false}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleEditCategory(item)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleSelectItem(item.id!)}
                            />
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.description}</TableCell>
                        </TableRow>
                      )
                    })}
                  </tbody>
                </Table>
              </TableWrapper>
            </DesktopTableWrapper>
          )}

          {filteredCategories.length > 0 && (
            <MobileCardsWrapper>
              {filteredCategories.map((item) => {
                if (!item.id) return null

                return (
                  <div key={item.id}>
                    <CategoryCard
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEditCategory(item)}
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

          <EditCategoryModal
            isOpen={isEditCategoryModalOpen}
            onClose={handleEditCategoryClose}
            onSuccess={handleEditCategorySuccess}
            category={selectedCategoryForEdit}
          />

          <ConfirmationModal
            isOpen={showDeleteConfirmation}
            onClose={() => setShowDeleteConfirmation(false)}
            onConfirm={() => deleteCategoriesMutation.mutate(selectedItems)}
            title="Mover categorias para a lixeira?"
            message={`${selectedItems.length} ${selectedItems.length === 1 ? 'item será movido' : 'itens serão movidos'} para a lixeira. Você poderá restaurá-${selectedItems.length === 1 ? 'lo' : 'los'} posteriormente.`}
            confirmText="Mover para lixeira"
            cancelText="Cancelar"
          />
        </MainContainer>
      </PlatformLayout>
    </RoleProtectedRoute>
  )
}
