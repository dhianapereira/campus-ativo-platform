import { useMemo, useState } from 'react'
import { MagnifyingGlass, ArrowRight, ArrowLeft } from 'phosphor-react'
import {
  HeaderContainer,
  SearchContainer,
  SearchInputContainer,
  SearchIcon,
  SearchInput,
  SearchButton,
  TableWrapper,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  DesktopTableWrapper,
  MobileCardsWrapper,
  MemberCard,
  MemberCardName,
  MemberCardEmail,
  MemberCardPosition,
  PaginationContainer,
  PaginationButton,
  PaginationDots,
  MainContainer,
} from './styles'
import PlatformLayout from '@/app/platform/layout'
import { RoleProtectedRoute } from '@/components/role-protected-route'
import { useAuth } from '@/contexts/auth-context'
import { useQuery } from '@tanstack/react-query'
import type { FetchUsersControllerHandle200UsersItem } from '../../../server/client/models'
import { EditMemberModal } from './components/EditMemberModal'

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] =
    useState<FetchUsersControllerHandle200UsersItem | null>(null)
  const itemsPerPage = 10

  const { hasRoleLevel } = useAuth()

  const handleMemberClick = (
    member: FetchUsersControllerHandle200UsersItem,
  ) => {
    setSelectedMember(member)
    setIsEditModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
    setSelectedMember(null)
  }

  const handleModalSuccess = () => {
    setIsEditModalOpen(false)
    setSelectedMember(null)
  }

  const canLoad = hasRoleLevel(3)

  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users', {
        credentials: 'include',
      })
      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(
          `Falha ao buscar usuários: ${response.status} ${response.statusText} ${text}`,
        )
      }
      return response.json()
    },
    enabled: canLoad,
    retry: false,
  })

  const usersData: FetchUsersControllerHandle200UsersItem[] = useMemo(() => {
    if (!data) return []
    if (Array.isArray(data)) {
      return data as FetchUsersControllerHandle200UsersItem[]
    }
    const maybeObj = data as unknown as { users?: unknown }
    if (Array.isArray(maybeObj.users)) {
      return maybeObj.users as FetchUsersControllerHandle200UsersItem[]
    }
    return []
  }, [data])

  const filteredUsers = usersData.filter(
    (userData: FetchUsersControllerHandle200UsersItem) => {
      if (!searchTerm) return true
      const name = userData.name?.toLowerCase() || ''
      const position = userData.position?.toLowerCase() || ''
      const searchLower = searchTerm.toLowerCase()
      return name.includes(searchLower) || position.includes(searchLower)
    },
  )

  const totalItems = filteredUsers.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  const handleSearch = (query: string) => {
    setSearchTerm(query)
    setCurrentPage(1)
  }

  const handleInputChange = (value: string) => {
    setSearchTerm(value)
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

  if (!canLoad) {
    return (
      <RoleProtectedRoute requiredLevel={3}>
        <PlatformLayout>
          <MainContainer>
            <div>Você não tem permissão para visualizar os membros.</div>
          </MainContainer>
        </PlatformLayout>
      </RoleProtectedRoute>
    )
  }

  if (isLoading) {
    return (
      <RoleProtectedRoute requiredLevel={3}>
        <PlatformLayout>
          <MainContainer>
            <div>Carregando...</div>
          </MainContainer>
        </PlatformLayout>
      </RoleProtectedRoute>
    )
  }

  if (error) {
    const errorMessage = error.message || 'Erro desconhecido'
    return (
      <RoleProtectedRoute requiredLevel={3}>
        <PlatformLayout>
          <MainContainer>
            <div>Erro ao carregar membros: {errorMessage}</div>
          </MainContainer>
        </PlatformLayout>
      </RoleProtectedRoute>
    )
  }

  return (
    <RoleProtectedRoute requiredLevel={3}>
      <PlatformLayout>
        <MainContainer>
          <HeaderContainer>
            <SearchContainer>
              <SearchInputContainer>
                <SearchIcon>
                  <MagnifyingGlass size={20} weight="regular" />
                </SearchIcon>
                <SearchInput
                  type="text"
                  placeholder="Busque pelo nome ou cargo do membro..."
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyPress={(e) =>
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
          </HeaderContainer>

          <DesktopTableWrapper>
            <TableWrapper>
              <Table>
                <thead>
                  <TableRow isHeader>
                    <TableHeader>Nome</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Cargo</TableHeader>
                  </TableRow>
                </thead>
                <tbody>
                  {currentUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        {searchTerm
                          ? 'Nenhum membro encontrado para a busca.'
                          : 'Nenhum membro cadastrado.'}
                      </TableCell>
                    </TableRow>
                  )}
                  {currentUsers.map(
                    (userData: FetchUsersControllerHandle200UsersItem) => (
                      <TableRow
                        key={userData.id || userData.email}
                        isHeader={false}
                        onClick={() => handleMemberClick(userData)}
                      >
                        <TableCell>{userData.name || 'Sem nome'}</TableCell>
                        <TableCell>{userData.email || 'Sem e-mail'}</TableCell>
                        <TableCell>
                          {userData.position || 'Não informado'}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </DesktopTableWrapper>

          <MobileCardsWrapper>
            {currentUsers.length === 0 && (
              <MemberCard style={{ border: '1px dashed #e5e7eb' }}>
                <MemberCardName style={{ fontSize: '1rem' }}>
                  {searchTerm
                    ? 'Nenhum resultado para a busca.'
                    : 'Nenhum membro cadastrado.'}
                </MemberCardName>
              </MemberCard>
            )}
            {currentUsers.map(
              (userData: FetchUsersControllerHandle200UsersItem) => (
                <MemberCard
                  key={userData.id || userData.email}
                  onClick={() => handleMemberClick(userData)}
                >
                  <MemberCardName>{userData.name || 'Sem nome'}</MemberCardName>
                  <MemberCardEmail>
                    {userData.email || 'Sem e-mail'}
                  </MemberCardEmail>
                  <MemberCardPosition>
                    <span className="label">Cargo:</span>{' '}
                    {userData.position || 'Não informado'}
                  </MemberCardPosition>
                </MemberCard>
              ),
            )}
          </MobileCardsWrapper>

          <PaginationContainer>{renderPaginationButtons()}</PaginationContainer>
        </MainContainer>

        <EditMemberModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          member={selectedMember}
        />
      </PlatformLayout>
    </RoleProtectedRoute>
  )
}
