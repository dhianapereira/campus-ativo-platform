import { ReactNode } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { styled } from '@/styles/stitches'

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

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

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

  return <>{children}</>
}
