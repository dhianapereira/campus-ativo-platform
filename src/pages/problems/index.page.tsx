import PlatformLayout from '@/app/platform/layout'
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
} from './styles'
import ProblemCard from './components/ProblemCard'
import { FilterButton } from './components/FilterButton'
import { FilterDialog, FilterOption, Text } from '@/styles'
import { useRouter } from 'next/router'
import { useState, useMemo } from 'react'
import { Status } from '@/data/static/status-data'
import { useQuery } from '@tanstack/react-query'
import NoProblemSvg from '@/assets/no-problem.svg'
import Image from 'next/image'

export default function Problems() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(1)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([])

  // Fetch problems from Next.js API route
  const { data, isLoading, error } = useQuery({
    queryKey: ['problems', page, searchValue],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (page) params.append('page', page.toString())
      if (searchValue) params.append('query', searchValue)

      const response = await fetch(`/api/problems?${params.toString()}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Falha ao buscar problemas')
      }

      return response.json()
    },
    retry: false,
  })

  const filterOptions: FilterOption[] = [
    { id: Status.ToAnalysis, label: 'Para análise', checked: false },
    { id: Status.InAnalysis, label: 'Em análise', checked: false },
    { id: Status.Accepted, label: 'Aceito', checked: false },
    { id: Status.Rejected, label: 'Recusado', checked: false },
    { id: Status.InProgress, label: 'Em andamento', checked: false },
    { id: Status.Finished, label: 'Concluído', checked: false },
  ]

  // Transform API data to match current component structure
  const problems = useMemo(() => {
    if (!data?.problems) return []

    return data.problems.map((problem: any) => ({
      id: problem.id || problem.slug || '',
      title: problem.title || '',
      location: problem.locationName || 'Localização excluída',
      description: problem.excerpt || problem.description || '',
      badgeId: problem.status || Status.ToAnalysis,
    }))
  }, [data])

  // Apply status filters on client side
  const filteredProblems = useMemo(() => {
    const activeFilterIds = activeFilters.filter((f) => f.checked).map((f) => f.id)

    if (activeFilterIds.length === 0) {
      return problems
    }

    return problems.filter((problem) => activeFilterIds.includes(problem.badgeId))
  }, [problems, activeFilters])

  async function goToAddProblem() {
    await router.push('/problems/add')
  }

  const handleSearch = (query: string) => {
    setSearchValue(query)
    setPage(1) // Reset to first page on new search
  }

  const handleInputChange = (value: string) => {
    setSearchValue(value)
  }

  const handleFilterApply = (filters: FilterOption[]) => {
    setActiveFilters(filters)
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

  const currentFilterOptions = filterOptions.map((option) => {
    const activeFilter = activeFilters.find((f) => f.id === option.id)
    return activeFilter || option
  })

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
          <Text size="sm">{filteredProblems.length} problemas ao total</Text>
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
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <Text>Erro ao carregar problemas. Tente novamente mais tarde.</Text>
          </div>
        )}

        {!isLoading && !error && filteredProblems.length === 0 && (
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

        {!isLoading && !error && filteredProblems.length > 0 && (
          <GridView>
            {filteredProblems.map((problem) => (
              <ProblemCard key={problem.id} {...problem} />
            ))}
          </GridView>
        )}
      </MainContainer>

      <FilterDialog
        isOpen={isFilterDialogOpen}
        onClose={closeFilterDialog}
        onApply={handleFilterApply}
        filterOptions={currentFilterOptions}
        title="Filtrar Problemas"
        description="Selecione os status para refinar sua busca"
      />
    </PlatformLayout>
  )
}
