import { ReactNode } from 'react'
import { useAuthSession } from '@/contexts/auth-context'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { AuthGuardFeedback } from './AuthGuardFeedback'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const {
    isAuthenticated,
    isLoading,
    profileError,
    retryProfileLoad,
    isProfileLoading,
  } = useAuthSession()
  const hasProfileError = !!profileError

  useAuthRedirect({
    isAuthenticated,
    isLoading,
    canRedirect: !hasProfileError,
    redirectTo: '/login',
    clearHistory: true,
  })

  if (isLoading || (isProfileLoading && hasProfileError)) {
    return (
      <AuthGuardFeedback
        badge="Validando sessão"
        title="Carregando..."
        message="Estamos verificando sua autenticação para liberar o acesso a esta página."
      />
    )
  }

  if (hasProfileError) {
    return (
      <AuthGuardFeedback
        badge="Erro de sessão"
        title="Erro ao validar sua sessão"
        message={profileError}
        primaryActionLabel="Tentar novamente"
        onPrimaryAction={() => void retryProfileLoad()}
      />
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
