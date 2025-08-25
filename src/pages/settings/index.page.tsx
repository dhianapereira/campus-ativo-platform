import { useMemo, useState } from 'react'
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
import EmptyState from '@/components/empty-state'
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderPaginationButtons = () => {
    const buttons = []

    buttons.push(
      <PaginationButton
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="nav"
        aria-label="Página anterior"
      >
        <ArrowLeft size={22} weight="bold" />
        Anterior
      </PaginationButton>,
    )

    buttons.push(
      <PaginationButton
        key={1}
        onClick={() => handlePageChange(1)}
        isActive={currentPage === 1}
        variant="number"
      >
        1
      </PaginationButton>,
    )

    if (totalPages >= 2) {
      buttons.push(
        <PaginationButton
          key={2}
          onClick={() => handlePageChange(2)}
          isActive={currentPage === 2}
          variant="number"
        >
          2
        </PaginationButton>,
      )
    }

    if (totalPages >= 3) {
      buttons.push(
        <PaginationButton
          key={3}
          onClick={() => handlePageChange(3)}
          isActive={currentPage === 3}
          variant="number"
        >
          3
        </PaginationButton>,
      )
    }

    if (totalPages > 5) {
      buttons.push(<PaginationDots key="dots">...</PaginationDots>)
    }

    if (totalPages > 5) {
      const secondToLast = totalPages - 1
      const last = totalPages

      buttons.push(
        <PaginationButton
          key={secondToLast}
          onClick={() => handlePageChange(secondToLast)}
          isActive={currentPage === secondToLast}
          variant="number"
        >
          {secondToLast}
        </PaginationButton>,
      )

      buttons.push(
        <PaginationButton
          key={last}
          onClick={() => handlePageChange(last)}
          isActive={currentPage === last}
          variant="number"
        >
          {last}
        </PaginationButton>,
      )
    }

    buttons.push(
      <PaginationButton
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="nav"
        aria-label="Próxima página"
      >
        Próximo
        <ArrowRight size={22} weight="bold" />
      </PaginationButton>,
    )

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
            <EmptyState onAction={() => window.location.reload()} />
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
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
            <EmptyState
              title="Nenhum resultado encontrado"
              message={
                searchTerm
                  ? 'Tente ajustar sua busca e tente novamente.'
                  : activeTab === 'localizacao'
                    ? 'Não há localizações cadastradas ainda.'
                    : 'Não há categorias cadastradas ainda.'
              }
              onAction={() => window.location.reload()}
            />
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
              <EmptyState
                title="Nenhum resultado encontrado"
                message={
                  searchTerm
                    ? 'Tente ajustar sua busca e tente novamente.'
                    : activeTab === 'localizacao'
                      ? 'Não há localizações cadastradas ainda.'
                      : 'Não há categorias cadastradas ainda.'
                }
                onAction={() => window.location.reload()}
              />
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

          {currentItems.length > 0 && (
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
