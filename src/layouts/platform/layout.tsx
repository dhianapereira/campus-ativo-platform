import { ReactNode } from 'react'
import Header from './components/Header'
import Menu from './components/navigation/Menu'
import { Container, Body, Content } from './styles'
import { ProtectedRoute } from '@/guards/ProtectedRoute'
import { useAuth } from '@/contexts/auth-context'

export default function PlatformLayout({ children }: { children: ReactNode }) {
  const { user, signOut, isLoading, isProfileLoading, profileError } = useAuth()

  const handleLogout = async () => {
    await signOut()
  }

  const showLoadingState =
    isLoading || isProfileLoading || (!user && !profileError)

  const userName = user?.name || 'Usuário'
  const userPosition = user?.position || 'Não informado'

  return (
    <ProtectedRoute>
      <Container>
        <Menu onLogoutClick={handleLogout} />
        <Body>
          <Header
            name={userName}
            alt={userName}
            position={userPosition}
            showLoadingState={showLoadingState}
          />
          <Content>{children}</Content>
        </Body>
      </Container>
    </ProtectedRoute>
  )
}
