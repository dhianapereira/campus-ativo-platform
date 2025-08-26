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
  LocationCard,
  CategoryCard,
  CardTitle,
  CardInfo,
  CardDescription,
  PaginationContainer,
  PaginationButton,
  PaginationDots,
} from './styles'
import PlatformLayout from '@/app/platform/layout'
import { RoleProtectedRoute } from '@/components/role-protected-route'
import { AddCategoryModal } from './components/AddCategoryModal'
import { AddLocationModal } from './components/AddLocationModal'
import { EditLocationModal } from './components/EditLocationModal'
import { EditCategoryModal } from './components/EditCategoryModal'
import { useQuery } from '@tanstack/react-query'

interface LocationItem {
  id: string
  name: string
  code: string
  description: string
}

interface CategoryItem {
  id: string
  name: string
  description: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'localizacao' | 'categoria'>(
    'localizacao',
  )
  const [searchTerm, setSearchTerm] = useState('')
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
  const itemsPerPage = 10

  const {
    data: locationsData,
    isLoading: locationsLoading,
    error: locationsError,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await fetch('/api/locations', {
        credentials: 'include',
      })
      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(
          `Falha ao buscar localizações: ${response.status} ${response.statusText} ${text}`,
        )
      }
      return response.json()
    },
    retry: false,
  })

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories', {
        credentials: 'include',
      })
      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(
          `Falha ao buscar categorias: ${response.status} ${response.statusText} ${text}`,
        )
      }
      return response.json()
    },
    retry: false,
  })

  const currentData: (LocationItem | CategoryItem)[] = useMemo(() => {
    if (activeTab === 'localizacao') {
      return locationsData?.locations || []
    } else {
      return categoriesData?.categories || []
    }
  }, [activeTab, locationsData, categoriesData])

  const filteredData = useMemo<(LocationItem | CategoryItem)[]>(() => {
    if (!searchTerm) return currentData
    return currentData.filter(
      (item: LocationItem | CategoryItem) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activeTab === 'localizacao' &&
          'code' in item &&
          item.code?.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [currentData, searchTerm, activeTab])

  const isLoading =
    activeTab === 'localizacao' ? locationsLoading : categoriesLoading
  const error = activeTab === 'localizacao' ? locationsError : categoriesError

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems: (LocationItem | CategoryItem)[] = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  const handleTabChange = (tab: 'localizacao' | 'categoria') => {
    setActiveTab(tab)
    setSearchTerm('')
    setCurrentPage(1)
    setSelectedItems([])
  }

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handleSelectAll = () => {
    const currentItemIds = currentItems.map(
      (item: LocationItem | CategoryItem) => item.id,
    )
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
      selectedItems.includes(item.id),
    )

  const handleDeleteSelected = () => {
    setSelectedItems([])
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

  // Reset to last page if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

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

    // Only show Previous if not on first page
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

    // Only show Next if not on last page
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
                  backgroundColor: '#2d5a3d',
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
            <SearchContainer>
              <SearchInputContainer>
                <SearchIcon>
                  <MagnifyingGlass size={20} weight="regular" />
                </SearchIcon>
                <SearchInput
                  type="text"
                  placeholder={
                    activeTab === 'localizacao'
                      ? 'Busque por no...'
                      : 'Busque pelo nome da categoria...'
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </SearchInputContainer>
              <SearchButton onClick={handleSearch} type="button">
                Pesquisar
              </SearchButton>
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
                <Trash size={16} />
                Mover para lixeira
              </ActionButton>
              <ActionButton variant="add" onClick={handleAddNew}>
                <Plus size={16} />
                {activeTab === 'localizacao'
                  ? 'Adicionar Localização'
                  : 'Adicionar Categoria'}
              </ActionButton>
            </ActionsContainer>
          </SearchActionsContainer>

          {/* Desktop Table */}
          {currentItems.length === 0 ? (
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
          ) : (
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
                    {currentItems.map((item: LocationItem | CategoryItem) => (
                      <TableRow
                        key={item.id}
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
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        {activeTab === 'localizacao' && (
                          <TableCell>{(item as LocationItem).code}</TableCell>
                        )}
                        <TableCell>{item.description}</TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>
            </DesktopTableWrapper>
          )}

          {/* Mobile Cards */}
          <MobileCardsWrapper>
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
            {currentItems.map((item: LocationItem | CategoryItem) => (
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
                        <strong>Número:</strong> {(item as LocationItem).code}
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
            ))}
          </MobileCardsWrapper>

          {totalPages > 1 && (
            <PaginationContainer>
              {renderPaginationButtons()}
            </PaginationContainer>
          )}

          {/* Modals */}
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
        </MainContainer>
      </PlatformLayout>
    </RoleProtectedRoute>
  )
}
