import { ArrowLeft } from 'phosphor-react'
import { useAuthPermissions } from '@/contexts/auth-context'
import { RoleProtectedRoute } from '@/guards/RoleProtectedRoute'
import { useRouter } from 'next/router'
import { Body, Container, Header, Title } from '../add/styles'
import { ProblemCsvImportPanel } from './ProblemCsvImportPanel'

export default function ProblemsCsvImportPage() {
  const router = useRouter()
  const { hasRoleLevel } = useAuthPermissions()

  return (
    <RoleProtectedRoute canAccess={hasRoleLevel(2)}>
      <Container>
        <Header>
          <ArrowLeft
            className="back-icon"
            onClick={() => router.push('/problems')}
            weight="bold"
            size={24}
            aria-label="Voltar para a página anterior"
            tabIndex={0}
            role="button"
          />
          <Title as="h2" size="md">
            Importar problemas por CSV
          </Title>
        </Header>

        <Body
          as="div"
          css={{
            maxWidth: '980px',
            alignItems: 'stretch',
          }}
        >
          <ProblemCsvImportPanel />
        </Body>
      </Container>
    </RoleProtectedRoute>
  )
}
