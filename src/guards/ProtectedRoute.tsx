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

const ErrorCard = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$4',
  maxWidth: '420px',
  padding: '$6',
  textAlign: 'center',
})

const ErrorTitle = styled('p', {
  color: '$gray',
  fontSize: '$lg',
  fontWeight: '$bold',
  margin: 0,
})

const ErrorDescription = styled('p', {
  color: '$lightGray',
  fontSize: '$sm',
  lineHeight: 1.5,
  margin: 0,
})

const RetryButton = styled('button', {
  border: 0,
  borderRadius: '$sm',
  backgroundColor: '$green',
  color: '$white',
  cursor: 'pointer',
  fontSize: '$sm',
  fontWeight: '$medium',
  padding: '$3 $4',

  '&:hover': {
    filter: 'brightness(0.95)',
  },
})

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
  } = useAuth()
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
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Carregando...</LoadingText>
      </LoadingContainer>
    )
  }

  if (hasProfileError) {
    return (
      <LoadingContainer>
        <ErrorCard>
          <ErrorTitle>Erro ao validar sua sessao</ErrorTitle>
          <ErrorDescription>{profileError}</ErrorDescription>
          <RetryButton type="button" onClick={() => void retryProfileLoad()}>
            Tentar novamente
          </RetryButton>
        </ErrorCard>
      </LoadingContainer>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
