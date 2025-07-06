import PlatformLayout from '@/app/platform/layout'
import { GridView } from './styles'
import ProblemCard from '../home/components/ProblemCard'
import { SearchBar } from '../home/components/SearchBar'
import { problems } from '../home/mocks/problems'
import { Button } from '@campusativo-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FilterButton } from '../home/components/FilterButton'

export default function Home() {
  const router = useRouter()
  const [filteredProblems, setFilteredProblems] = useState(problems)
  const [searchValue, setSearchValue] = useState('')

  async function goToAddProblem() {
    await router.push('/problems/add')
  }

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredProblems(problems)
      return
    }

    const filtered = problems.filter(
      (problem) =>
        problem.title.toLowerCase().includes(query.toLowerCase()) ||
        problem.location.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredProblems(filtered)
  }

  const handleInputChange = (value: string) => {
    setSearchValue(value)

    if (!value.trim()) {
      setFilteredProblems(problems)
    } else {
      const filtered = problems.filter(
        (problem) =>
          problem.title.toLowerCase().includes(value.toLowerCase()) ||
          problem.location.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredProblems(filtered)
    }
  }

  return (
    <PlatformLayout>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <SearchBar
          value={searchValue}
          onSearch={handleSearch}
          onInputChange={handleInputChange}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FilterButton />
          <Button
            onClick={() => goToAddProblem()}
            variant="primary"
            aria-label="Adicionar novo problema"
          >
            Adicionar Problema
          </Button>
        </div>
      </div>

      <div
        style={{ marginBottom: '1.5rem', color: '#6c757d', fontSize: '1rem' }}
      >
        {filteredProblems.length} problemas ao total
      </div>

      <GridView>
        {filteredProblems.map((problem) => (
          <ProblemCard key={problem.id} {...problem} />
        ))}
      </GridView>
    </PlatformLayout>
  )
}
