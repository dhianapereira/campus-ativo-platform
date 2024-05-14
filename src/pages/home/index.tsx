import PlatformLayout from '@/app/platform/layout'
import { ActionsContainer, GridView } from './styles'
import ProblemCard from './components/ProblemCard'
import { problems } from './mocks/problems'
import { Button } from '@campusativo-ui/react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  async function goToAddProblem() {
    await router.push('/problems/add')
  }

  return (
    <PlatformLayout>
      <ActionsContainer>
        <Button onClick={() => goToAddProblem()} variant="primary">
          Adicionar Problema
        </Button>
      </ActionsContainer>
      <GridView>
        {problems.map((problem) => (
          <ProblemCard
            key={problem.id}
            id={problem.id}
            title={problem.title}
            location={problem.location}
            description={problem.description}
            badgeId={problem.badgeId}
          />
        ))}
      </GridView>
    </PlatformLayout>
  )
}
