import PlatformLayout from '@/layouts/platform/layout'
import {
  GridView,
  HeaderContainer,
  SearchContainer,
  ControlsContainer,
  FilterGroup,
  AddButton,
  ResultsCounter,
  FilterBadge,
  ResponsiveSearchBar,
  MainContainer,
  EmptyStateContainer,
  EmptyStateImage,
  PaginationContainer,
  PaginationButton,
  PaginationDots,
} from './styles'
import ProblemCard from './components/ProblemCard'
import { FilterButton } from './components/FilterButton'
import { FilterDialog, LoadErrorState, Text } from '@/components'
import type { FilterOption } from '@/components'
import { useRouter } from 'next/router'
import { useState, useMemo } from 'react'
import {
  backendStatusToProblemStatus,
  ProblemStatus,
} from '@/constants/problems/status'
import { toBackendStatus } from './problem-mapping'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight } from 'phosphor-react'
import NoProblemSvg from '@/assets/no-problem.svg'
import Image from 'next/image'
import type {
  FetchProblemsControllerHandle200,
  ProblemWithDetailsResponse,
} from '@/lib/api/generated/models'

const PROBLEMS_ITEMS_PER_PAGE = 9

export default function Problems() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([])

  const activeBackendStatuses = useMemo(
    () =>
      activeFilters
        .filter((filter) => filter.checked)
        .map((filter) => toBackendStatus(filter.id))
        .filter((status): status is string => Boolean(status)),
    [activeFilters],
  )

  const { data, isLoading, error, refetch, isRefetching } =
    useQuery<FetchProblemsControllerHandle200>({
      queryKey: ['problems', currentPage, searchValue, activeBackendStatuses],
      queryFn: async () => {
        const params = new URLSearchParams()
        if (currentPage) params.append('page', currentPage.toString())
        params.append('pageSize', PROBLEMS_ITEMS_PER_PAGE.toString())
        if (searchValue) params.append('query', searchValue)
        if (activeBackendStatuses.length > 0) {
          params.append('statuses', activeBackendStatuses.join(','))
        }

        const response = await fetch(`/api/problems?${params.toString()}`, {
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Falha ao buscar problemas.')
        }

        return response.json() as Promise<FetchProblemsControllerHandle200>
      },
      retry: false,
      placeholderData: (previousData) => previousData,
      staleTime: 30000,
    })

  const filterOptions: FilterOption[] = [
    { id: ProblemStatus.ToAnalysis, label: 'Para análise', checked: false },
    { id: ProblemStatus.InAnalysis, label: 'Em análise', checked: false },
    { id: ProblemStatus.Accepted, label: 'Aceito', checked: false },
    { id: ProblemStatus.Rejected, label: 'Recusado', checked: false },
    { id: ProblemStatus.InProgress, label: 'Em andamento', checked: false },
    { id: ProblemStatus.Finished, label: 'Concluído', checked: false },
  ]

  type ProblemItem = {
    id: string
    slug: string
    title: string
    location: string
    description: string
    badgeId: ProblemStatus
  }

  // The detail route resolves by slug, so legacy responses without `id` still
  // need a stable fallback for list rendering and navigation.
  const problems = useMemo<ProblemItem[]>(() => {
    if (!data?.problems) return []

    return data.problems.map((problem: ProblemWithDetailsResponse) => ({
      id: problem.id || problem.slug || '',
      slug: problem.slug || problem.id || '',
      title: problem.title || '',
      location: problem.locationName,
      description: problem.excerpt || '',
      badgeId: backendStatusToProblemStatus[problem.status],
    }))
  }, [data])

  async function goToAddProblem() {
    await router.push('/problems/add')
  }

  const handleSearch = (query: string) => {
    setSearchValue(query)
    setCurrentPage(1)
  }

  const handleInputChange = (value: string) => {
    setSearchValue(value)
  }

  const handleFilterApply = (filters: FilterOption[]) => {
    setActiveFilters(filters)
    setCurrentPage(1)
  }

  const openFilterDialog = () => {
    setIsFilterDialogOpen(true)
  }

  const closeFilterDialog = () => {
    setIsFilterDialogOpen(false)
  }

  const getActiveFiltersCount = () => {
    return activeFilters.filter((f) => f.checked).length
  }

  const totalItems = data?.total ?? 0
  const totalPages = Math.ceil(totalItems / PROBLEMS_ITEMS_PER_PAGE)
  const effectiveCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1

  const currentFilterOptions = filterOptions.map((option) => {
    const activeFilter = activeFilters.find((f) => f.id === option.id)
    return activeFilter || option
  })

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

      if (left > 2) {
        buttons.push(<PaginationDots key="dots-left">...</PaginationDots>)
      }

      for (let p = left; p <= right; p++) addPageButton(p)

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

  return (
    <PlatformLayout>
      <MainContainer>
        <HeaderContainer>
          <SearchContainer>
            <ResponsiveSearchBar
              value={searchValue}
              onSearch={handleSearch}
              onInputChange={handleInputChange}
              placeholder="Busque pelo título ou local do problema..."
            />
            <ControlsContainer>
              <FilterGroup>
                <FilterButton onClick={openFilterDialog} />
              </FilterGroup>

              <AddButton
                onClick={() => goToAddProblem()}
                variant="primary"
                aria-label="Adicionar novo problema"
                tabIndex={0}
              >
                Adicionar Problema
              </AddButton>
            </ControlsContainer>
          </SearchContainer>
        </HeaderContainer>

        <ResultsCounter>
          <Text size="sm">{totalItems} problemas ao total</Text>
          {getActiveFiltersCount() > 0 && (
            <FilterBadge size="sm">
              {getActiveFiltersCount()} filtro(s) ativo(s)
            </FilterBadge>
          )}
        </ResultsCounter>

        {isLoading && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <Text>Carregando problemas...</Text>
          </div>
        )}

        {error && (
          <LoadErrorState
            badge="Lista indisponível"
            title="Não conseguimos carregar os problemas agora"
            description="A lista de problemas não pôde ser buscada neste momento. Quando a conexão com o servidor voltar, os registros aparecerão normalmente."
            onRetry={() => refetch()}
            isRetrying={isRefetching}
            tips={[
              'Confira se o servidor já voltou a responder.',
              'Se você aplicou filtros ou busca, eles serão mantidos ao tentar de novo.',
            ]}
          />
        )}

        {!isLoading && !error && problems.length === 0 && (
          <EmptyStateContainer>
            <EmptyStateImage>
              <Image
                src={NoProblemSvg}
                alt="Nenhum problema cadastrado"
                width={364}
                height={141}
                priority
              />
            </EmptyStateImage>
          </EmptyStateContainer>
        )}

        {!isLoading && !error && problems.length > 0 && (
          <GridView>
            {problems.map((problem: ProblemItem) => (
              <ProblemCard key={problem.id} {...problem} />
            ))}
          </GridView>
        )}

        {!isLoading && !error && totalPages > 1 && (
          <PaginationContainer>{renderPaginationButtons()}</PaginationContainer>
        )}
      </MainContainer>

      {isFilterDialogOpen && (
        <FilterDialog
          isOpen={isFilterDialogOpen}
          onClose={closeFilterDialog}
          onApply={handleFilterApply}
          filterOptions={currentFilterOptions}
          title="Filtrar Problemas"
          description="Selecione os status para refinar sua busca"
        />
      )}
    </PlatformLayout>
  )
}
