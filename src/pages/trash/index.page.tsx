import { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import {
  MagnifyingGlass,
  Trash,
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
} from 'phosphor-react'
import noTrashImage from '@/assets/no-trash.svg'
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
  SearchButton,
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
  EmptyStateIcon,
  ErrorState,
  ErrorStateIcon,
  ErrorStateTitle,
  ErrorStateMessage,
  RetryButton,
} from './styles'
import PlatformLayout from '@/app/platform/layout'
import { RoleProtectedRoute } from '@/styles'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ConfirmationModal } from '@/components/confirmation-modal'

// Hook customizado para debounce
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
  itemType: 'location' | 'category' | 'problem'
  code?: string
  description?: string
  local?: string
  deletedAt?: string
}

export default function TrashPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'location' | 'category' | 'problem'
  >('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const itemsPerPage = 10

  // Debounce do termo de busca
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const {
    data: trashData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['trash', debouncedSearchTerm, currentPage, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (debouncedSearchTerm) params.append('query', debouncedSearchTerm)
      params.append('page', currentPage.toString())
      if (typeFilter !== 'all') params.append('type', typeFilter)

      const response = await fetch(`/api/trash?${params.toString()}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Falha ao buscar itens da lixeira')
      }

      return response.json()
    },
    retry: false,
  })

  const restoreMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await fetch('/api/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'restore',
          ids,
          type:
            typeFilter !== 'all' ? typeFilter : trashData?.items[0]?.itemType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao restaurar itens')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      setSelectedItems([])
      toast.success('Itens restaurados com sucesso')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao restaurar itens')
    },
  })

  const deletePermanentlyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await fetch('/api/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'delete',
          ids,
          type:
            typeFilter !== 'all' ? typeFilter : trashData?.items[0]?.itemType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || 'Falha ao excluir itens permanentemente',
        )
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      setSelectedItems([])
      setShowDeleteConfirmation(false)
      toast.success('Itens excluídos permanentemente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao excluir itens')
    },
  })

  const items: TrashItem[] = useMemo(() => {
    return trashData?.items || []
  }, [trashData])

  const totalItems = trashData?.total || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Reset para última página se a página atual exceder o total
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map((item) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    }
  }

  const handleRestore = () => {
    if (selectedItems.length === 0) {
      toast.warning('Selecione pelo menos um item para restaurar')
      return
    }
    restoreMutation.mutate(selectedItems)
  }

  const handleDeletePermanently = () => {
    if (selectedItems.length === 0) {
      toast.warning('Selecione pelo menos um item para excluir')
      return
    }
    setShowDeleteConfirmation(true)
  }

  const confirmDelete = () => {
    deletePermanentlyMutation.mutate(selectedItems)
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
          isActive={currentPage === page}
          variant="number"
        >
          {page}
        </PaginationButton>,
      )

    if (currentPage > 1) {
      buttons.push(
        <PaginationButton
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
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
      const left = Math.max(2, currentPage - 1)
      const right = Math.min(totalPages - 1, currentPage + 1)
      addPageButton(1)

      if (left > 2)
        buttons.push(<PaginationDots key="dots-left">...</PaginationDots>)

      for (let p = left; p <= right; p++) addPageButton(p)

      if (right < totalPages - 1)
        buttons.push(<PaginationDots key="dots-right">...</PaginationDots>)

      addPageButton(totalPages)
    }

    if (currentPage < totalPages) {
      buttons.push(
        <PaginationButton
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
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
    // Quando "todos" os tipos, usamos cabeçalho padrão (Nome, Local, Descrição)
    if (typeFilter === 'all') {
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
          <TableHeader>Local</TableHeader>
          <TableHeader>Descrição</TableHeader>
        </TableRow>
      )
    }

    if (typeFilter === 'location') {
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
          <TableHeader>Local</TableHeader>
          <TableHeader>Descrição</TableHeader>
        </TableRow>
      )
    }

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

    return null
  }

  if (error) {
    return (
      <RoleProtectedRoute requiredLevel={2}>
        <PlatformLayout>
          <MainContainer>
            <HeaderContainer>
              <PageTitle>Lixeira</PageTitle>
            </HeaderContainer>
            <ErrorState>
              <ErrorStateIcon>
                <Trash size={64} weight="duotone" />
              </ErrorStateIcon>
              <ErrorStateTitle>Erro ao carregar lixeira</ErrorStateTitle>
              <ErrorStateMessage>
                Não foi possível buscar as informações no momento.
                <br />
                Por favor, tente novamente mais tarde.
              </ErrorStateMessage>
              <RetryButton onClick={() => refetch()}>
                Tentar novamente
              </RetryButton>
            </ErrorState>
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
              <SearchButton
                onClick={() => handleSearch(searchTerm)}
                type="button"
              >
                Pesquisar
              </SearchButton>
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
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                  }}
                >
                  <option value="all">Tipo</option>
                  <option value="location">Localizações</option>
                  <option value="category">Categorias</option>
                  <option value="problem">Problemas</option>
                </select>

                <select
                  style={{
                    padding: '0.5rem 2rem 0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                  }}
                >
                  <option>Modificado</option>
                </select>
              </FiltersContainer>

              <ActionButton
                variant="danger"
                onClick={handleDeletePermanently}
                disabled={selectedItems.length === 0}
              >
                <Trash size={20} weight="bold" />
                <span>Excluir permanentemente</span>
              </ActionButton>
            </FiltersAndActionRow>
          </SearchActionsContainer>

          <ItemsCount>
            {totalItems}{' '}
            {totalItems === 1 ? 'item na lixeira' : 'itens na lixeira'}
          </ItemsCount>

          {selectedItems.length > 0 && (
            <>
              <SelectedCount>
                Itens selecionados ({selectedItems.length})
              </SelectedCount>
              <ActionsContainer>
                <ActionButton
                  variant="primary"
                  onClick={handleRestore}
                  disabled={selectedItems.length === 0}
                >
                  <ArrowCounterClockwise size={20} weight="bold" />
                  <span>Restaurar</span>
                </ActionButton>
              </ActionsContainer>
            </>
          )}

          {isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              Carregando...
            </div>
          ) : items.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <Image
                  src={noTrashImage}
                  alt="Lixeira vazia"
                  width={200}
                  height={200}
                  priority
                />
              </EmptyStateIcon>
            </EmptyState>
          ) : (
            <>
              <DesktopTableWrapper>
                <TableWrapper>
                  <Table>
                    <thead>{getTableHeaders()}</thead>
                    <tbody>
                      {items.map((item) => (
                        <TableRow key={item.id} isHeader={false}>
                          <TableCell>
                            <Checkbox
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={(e) =>
                                handleSelectItem(item.id, e.target.checked)
                              }
                            />
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          {/* "Local" e "Descrição" adaptados por tipo */}
                          <TableCell>
                            {item.itemType === 'location'
                              ? item.code || '-'
                              : item.itemType === 'problem'
                                ? item.local || '-'
                                : '-'}
                          </TableCell>
                          <TableCell>{item.description || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              </DesktopTableWrapper>

              <MobileCardsWrapper>
                {items.map((item) => (
                  <ItemCard key={item.id} onClick={() => {}}>
                    <Checkbox
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleSelectItem(item.id, e.target.checked)
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
        />
      </PlatformLayout>
    </RoleProtectedRoute>
  )
}
