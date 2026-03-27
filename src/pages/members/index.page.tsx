import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MagnifyingGlass, ArrowRight, ArrowLeft } from 'phosphor-react'
import {
  HeaderContainer,
  SearchContainer,
  SearchInputContainer,
  SearchIcon,
  SearchInput,
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
  FiltersContainer,
  FilterButton,
} from './styles'
import PlatformLayout from '@/layouts/platform/layout'
import { useAuthPermissions, useAuthSession } from '@/contexts/auth-context'
import { useQuery } from '@tanstack/react-query'
import type { FetchUsersControllerHandle200UsersItem } from '../../lib/api/generated/models'
import { EditMemberModal } from './components/EditMemberModal'
import { LoadErrorState } from '@/components'

type MembersListResponse = {
  users: FetchUsersControllerHandle200UsersItem[]
  total: number
  page: number
  pageSize: number
}

const MEMBERS_ITEMS_PER_PAGE = 10

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

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] =
    useState<FetchUsersControllerHandle200UsersItem | null>(null)

  const { hasRoleLevel } = useAuthPermissions()
  const { isLoading: isAuthLoading } = useAuthSession()
  const router = useRouter()
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

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

  useEffect(() => {
    if (!isAuthLoading && !canLoad) {
      const backTo =
        typeof window !== 'undefined' ? window.location.pathname : '/problems'
      router.replace({ pathname: '/unauthorized', query: { back: backTo } })
    }
  }, [canLoad, router, isAuthLoading])

  const { data, isLoading, error, refetch, isRefetching } =
    useQuery<MembersListResponse>({
      queryKey: ['users', debouncedSearchTerm, statusFilter, currentPage],
      queryFn: async () => {
        const params = new URLSearchParams()

        params.append('page', currentPage.toString())
        params.append('pageSize', MEMBERS_ITEMS_PER_PAGE.toString())

        if (debouncedSearchTerm) {
          params.append('query', debouncedSearchTerm)
        }

        if (statusFilter === 'active') {
          params.append('isActive', 'true')
        } else if (statusFilter === 'inactive') {
          params.append('isActive', 'false')
        }

        const url = `/api/users${params.toString() ? `?${params.toString()}` : ''}`

        const response = await fetch(url, {
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
      enabled: !isAuthLoading && canLoad,
      retry: false,
      placeholderData: (previousData) => previousData,
    })

  const usersData = useMemo(() => data?.users ?? [], [data])

  const totalItems = data?.total ?? 0
  const totalPages = Math.ceil(totalItems / MEMBERS_ITEMS_PER_PAGE)
  const effectiveCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1
  const currentUsers = usersData

  const handleInputChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (filter: 'all' | 'active' | 'inactive') => {
    setStatusFilter(filter)
    setCurrentPage(1)
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

  if (isAuthLoading) {
    return (
      <PlatformLayout>
        <MainContainer>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Carregando autenticação...
          </div>
        </MainContainer>
      </PlatformLayout>
    )
  }

  if (!canLoad) {
    return null // Will be redirected by useEffect
  }

  if (isLoading) {
    return (
      <PlatformLayout>
        <MainContainer>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Carregando membros...
          </div>
        </MainContainer>
      </PlatformLayout>
    )
  }

  if (error) {
    return (
      <PlatformLayout>
        <MainContainer>
          <HeaderContainer>
            <SectionTitle>Gerenciamento de membros</SectionTitle>
          </HeaderContainer>
          <LoadErrorState
            badge="Equipe indisponível"
            title="Não conseguimos carregar os membros agora"
            description="A lista de usuários não pôde ser atualizada neste momento. Se o servidor acabou de reiniciar, aguarde alguns segundos e tente novamente."
            onRetry={() => refetch()}
            isRetrying={isRefetching}
            tips={[
              'Quando a conexão voltar, você poderá continuar editando os membros sem perder a navegação.',
              'Se a falha persistir, atualize a página para refazer a autenticação e a busca.',
            ]}
          />
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
                placeholder="Busque pelo nome ou email..."
                value={searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
              />
            </SearchInputContainer>
          </SearchContainer>
          <SectionTitle>Gerenciamento de membros</SectionTitle>
        </HeaderContainer>

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

        {currentUsers.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Nenhum resultado encontrado</p>
            <p style={{ color: '#666', fontSize: '0.9em' }}>
              {debouncedSearchTerm || statusFilter !== 'all'
                ? 'Tente ajustar sua busca ou filtros e tente novamente.'
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
