import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
  SectionTitle,
} from './styles'
import PlatformLayout from '@/app/platform/layout'
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
  const router = useRouter()

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

  // Redirect to unauthorized page if user doesn't have permission
  useEffect(() => {
    if (!canLoad) {
      const backTo =
        typeof window !== 'undefined' ? window.location.pathname : '/problems'
      router.replace({ pathname: '/unauthorized', query: { back: backTo } })
    }
  }, [canLoad, router])

  const { data, isLoading, error, refetch } = useQuery({
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

  // Reset to last page if current page exceeds total pages
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

  if (!canLoad) {
    return null // Will be redirected by useEffect
  }

  if (isLoading) {
    return (
      <PlatformLayout>
        <MainContainer>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Carregando...
          </div>
        </MainContainer>
      </PlatformLayout>
    )
  }

  if (error) {
    return (
      <PlatformLayout>
        <MainContainer>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Não foi possível buscar as informações no momento.</p>
            <p>Por favor, tente novamente mais tarde.</p>
            <button
              onClick={() => refetch()}
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
    )
  }

  return (
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              />
            </SearchInputContainer>
            <SearchButton
              onClick={() => handleSearch(searchTerm)}
              type="button"
            >
              Pesquisar
            </SearchButton>
          </SearchContainer>
          <SectionTitle>Gerenciamento de membros</SectionTitle>
        </HeaderContainer>

        {currentUsers.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Nenhum resultado encontrado</p>
            <p style={{ color: '#666', fontSize: '0.9em' }}>
              {searchTerm
                ? 'Tente ajustar sua busca e tente novamente.'
                : 'Não há membros cadastrados ainda.'}
            </p>
          </div>
        ) : (
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
                  {currentUsers.map(
                    (userData: FetchUsersControllerHandle200UsersItem) => (
                      <TableRow
                        key={userData.id || userData.email}
                        isHeader={false}
                        onClick={() => handleMemberClick(userData)}
                      >
                        <TableCell>
                          {userData.name || 'Não informado'}
                        </TableCell>
                        <TableCell>
                          {userData.email || 'Não informado'}
                        </TableCell>
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
        )}

        {currentUsers.length > 0 && (
          <MobileCardsWrapper>
            {currentUsers.map(
              (userData: FetchUsersControllerHandle200UsersItem) => (
                <MemberCard
                  key={userData.id || userData.email}
                  onClick={() => handleMemberClick(userData)}
                >
                  <MemberCardName>
                    {userData.name || 'Não informado'}
                  </MemberCardName>
                  <MemberCardEmail>
                    {userData.email || 'Não informado'}
                  </MemberCardEmail>
                  <MemberCardPosition>
                    <span className="label">Cargo:</span>{' '}
                    {userData.position || 'Não informado'}
                  </MemberCardPosition>
                </MemberCard>
              ),
            )}
          </MobileCardsWrapper>
        )}

        {totalPages > 1 && (
          <PaginationContainer>{renderPaginationButtons()}</PaginationContainer>
        )}
      </MainContainer>

      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        member={selectedMember}
      />
    </PlatformLayout>
  )
}
