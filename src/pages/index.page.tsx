import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuthPermissions, useAuthSession } from '@/contexts/auth-context'
import { AuthGuardFeedback } from '@/guards/AuthGuardFeedback'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'

export default function RootPage() {
  const router = useRouter()
  const {
    isAuthenticated,
    isLoading,
    profileError,
    retryProfileLoad,
    isProfileLoading,
  } = useAuthSession()
  const { canAccessDashboard } = useAuthPermissions()
  const hasProfileError = !!profileError

  useAuthRedirect({
    isAuthenticated,
    isLoading,
    canRedirect: !hasProfileError,
    redirectTo: '/login',
    clearHistory: true,
  })

  useEffect(() => {
    if (isLoading || !isAuthenticated || hasProfileError) {
      return
    }

    void router.replace(canAccessDashboard() ? '/dashboard' : '/problems')
  }, [canAccessDashboard, hasProfileError, isAuthenticated, isLoading, router])

  if (isLoading || (isProfileLoading && hasProfileError)) {
    return (
      <AuthGuardFeedback
        badge="Validando sessão"
        title="Carregando..."
        message="Estamos verificando suas permissões antes de abrir a plataforma."
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

  return null
}
