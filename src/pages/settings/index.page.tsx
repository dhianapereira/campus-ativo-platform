import { MainContainer, HeaderContainer, PageTitle } from './styles'
import { useAuthPermissions } from '@/contexts/auth-context'
import PlatformLayout from '@/layouts/platform/layout'
import { RoleProtectedRoute } from '@/guards/RoleProtectedRoute'
import { ImportCsvPanel } from '@/pages/problems/components/ImportCsvModal'

export default function SettingsPage() {
  const { canAccessSettings } = useAuthPermissions()

  return (
    <RoleProtectedRoute canAccess={canAccessSettings()}>
      <PlatformLayout>
        <MainContainer>
          <HeaderContainer>
            <PageTitle>Importação</PageTitle>
          </HeaderContainer>

          <ImportCsvPanel />
        </MainContainer>
      </PlatformLayout>
    </RoleProtectedRoute>
  )
}
