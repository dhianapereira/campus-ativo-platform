import PlatformLayout from '@/app/platform/layout'
import { GridView } from './styles'
import ProblemCard from './components/ProblemCard'
import { problems } from './mocks/problems'

export default function Home() {
  return (
    <PlatformLayout>
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
