import { ReactNode } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { styled } from '@/styles/stitches'
import { useRouter } from 'next/router'

const LoadingContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  backgroundColor: '$gray-50',
  gap: '$4',
})

const LoadingSpinner = styled('div', {
  width: '40px',
  height: '40px',
  border: '4px solid $gray-200',
  borderTop: '4px solid $blue-500',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',

  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
})

const LoadingText = styled('p', {
  color: '$gray-600',
  fontSize: '$md',
  fontWeight: '$medium',
  margin: 0,
})

// dedicated unauthorized page is used instead of inline UI

interface RoleProtectedRouteProps {
  children: ReactNode
  requiredRole?: string
  requiredLevel?: number
  fallbackPath?: string
}

export function RoleProtectedRoute({
  children,
  requiredRole,
  requiredLevel,
  fallbackPath = '/problems',
}: RoleProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, hasRoleLevel } = useAuth()
  const router = useRouter()

  useAuthRedirect({
    isAuthenticated,
    isLoading,
    redirectTo: '/login',
    clearHistory: true,
  })

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Carregando...</LoadingText>
      </LoadingContainer>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const hasPermission =
    (!requiredRole || hasRole(requiredRole)) &&
    (!requiredLevel || hasRoleLevel(requiredLevel))

  if (!hasPermission) {
    const backTo =
      typeof window !== 'undefined' ? window.location.pathname : fallbackPath
    router.replace({ pathname: '/unauthorized', query: { back: backTo } })
    return null
  }

  return <>{children}</>
}
