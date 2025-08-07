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
} from './styles'
import ProblemCard from './components/ProblemCard'
import { FilterButton } from './components/FilterButton'
import { problems } from './mocks/problems'
import { FilterDialog, FilterOption, Text } from '@campusativo-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Status } from '@/data/static/status-data'

export default function Problems() {
  const router = useRouter()
  const [filteredProblems, setFilteredProblems] = useState(problems)
  const [searchValue, setSearchValue] = useState('')
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([])

  const filterOptions: FilterOption[] = [
    { id: Status.ToAnalysis, label: 'Para análise', checked: false },
    { id: Status.InAnalysis, label: 'Em análise', checked: false },
    { id: Status.Accepted, label: 'Aceito', checked: false },
    { id: Status.Rejected, label: 'Recusado', checked: false },
    { id: Status.InProgress, label: 'Em andamento', checked: false },
    { id: Status.Finished, label: 'Concluído', checked: false },
  ]

  async function goToAddProblem() {
    await router.push('/problems/add')
  }

  const applyFilters = (
    searchQuery: string = searchValue,
    filters: FilterOption[] = activeFilters,
  ) => {
    let filtered = problems

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (problem) =>
          problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          problem.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    const activeFilterIds = filters.filter((f) => f.checked).map((f) => f.id)

    if (activeFilterIds.length > 0) {
      filtered = filtered.filter((problem) => {
        return activeFilterIds.includes(problem.badgeId)
      })
    }

    setFilteredProblems(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchValue(query)
    applyFilters(query, activeFilters)
  }

  const handleInputChange = (value: string) => {
    setSearchValue(value)
    applyFilters(value, activeFilters)
  }

  const handleFilterApply = (filters: FilterOption[]) => {
    setActiveFilters(filters)
    applyFilters(searchValue, filters)
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
              buttonText="Pesquisar"
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

        <GridView>
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} {...problem} />
          ))}
        </GridView>
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
