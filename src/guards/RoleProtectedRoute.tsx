import { ReactNode, useEffect } from 'react'
import { useAuthPermissions, useAuthSession } from '@/contexts/auth-context'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { useRouter } from 'next/router'
import { AuthGuardFeedback } from './AuthGuardFeedback'

interface RoleProtectedRouteProps {
  children: ReactNode
  requiredRole?: string
  requiredLevel?: number
  canAccess?: boolean
  fallbackPath?: string
}

export function RoleProtectedRoute({
  children,
  requiredRole,
  requiredLevel,
  canAccess = true,
  fallbackPath = '/problems',
}: RoleProtectedRouteProps) {
  const {
    isAuthenticated,
    isLoading,
    profileError,
    retryProfileLoad,
    isProfileLoading,
  } = useAuthSession()
  const { hasRole, hasRoleLevel } = useAuthPermissions()
  const router = useRouter()
  const hasProfileError = !!profileError

  useAuthRedirect({
    isAuthenticated,
    isLoading,
    canRedirect: !hasProfileError,
    redirectTo: '/login',
    clearHistory: true,
  })

  const hasPermission =
    canAccess &&
    (!requiredRole || hasRole(requiredRole)) &&
    (!requiredLevel || hasRoleLevel(requiredLevel))

  useEffect(() => {
    if (isLoading || !isAuthenticated || hasPermission) {
      return
    }

    const backTo =
      typeof window !== 'undefined' ? window.location.pathname : fallbackPath
    void router.replace({ pathname: '/unauthorized', query: { back: backTo } })
  }, [fallbackPath, hasPermission, isAuthenticated, isLoading, router])

  if (isLoading || (isProfileLoading && hasProfileError)) {
    return (
      <AuthGuardFeedback
        badge="Validando sessão"
        title="Carregando..."
        message="Estamos verificando suas permissões antes de exibir esta área."
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

  if (!hasPermission) {
    return null
  }

  return <>{children}</>
}
