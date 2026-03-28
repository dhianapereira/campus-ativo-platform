import { MainContainer, HeaderContainer, PageTitle } from './styles'
import { useAuthPermissions } from '@/contexts/auth-context'
import PlatformLayout from '@/layouts/platform/layout'
import { RoleProtectedRoute } from '@/guards/RoleProtectedRoute'
import { Text } from '@/components'

export default function SettingsPage() {
  const { canAccessSettings } = useAuthPermissions()

  return (
    <RoleProtectedRoute canAccess={canAccessSettings()}>
      <PlatformLayout>
        <MainContainer>
          <HeaderContainer>
            <PageTitle>Configurações</PageTitle>
          </HeaderContainer>

          <Text css={{ color: '$textSecondary' }}>
            A importação via CSV foi movida para Problemas / Importar CSV.
          </Text>
        </MainContainer>
      </PlatformLayout>
    </RoleProtectedRoute>
  )
}
