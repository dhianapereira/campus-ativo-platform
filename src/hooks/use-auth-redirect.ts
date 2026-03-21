import { useEffect } from 'react'
import { useRouter } from 'next/router'

interface UseAuthRedirectOptions {
  isAuthenticated: boolean
  isLoading: boolean
  canRedirect?: boolean
  redirectTo?: string
  clearHistory?: boolean
}

export function useAuthRedirect({
  isAuthenticated,
  isLoading,
  canRedirect = true,
  redirectTo = '/login',
  clearHistory = true,
}: UseAuthRedirectOptions) {
  const router = useRouter()

  useEffect(() => {
    if (canRedirect && !isLoading && !isAuthenticated) {
      router.replace(redirectTo)

      if (clearHistory && typeof window !== 'undefined') {
        window.history.replaceState(null, '', redirectTo)
      }
    }
  }, [
    canRedirect,
    isAuthenticated,
    isLoading,
    router,
    redirectTo,
    clearHistory,
  ])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (canRedirect && !isAuthenticated && typeof window !== 'undefined') {
        window.history.replaceState(null, '', redirectTo)
      }
    }

    const handlePopState = () => {
      if (canRedirect && !isLoading && !isAuthenticated) {
        router.replace(redirectTo)
      }
    }

    const handleFocus = () => {
      if (canRedirect && !isLoading && !isAuthenticated) {
        router.replace(redirectTo)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload)
      window.addEventListener('popstate', handlePopState)
      window.addEventListener('focus', handleFocus)

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        window.removeEventListener('popstate', handlePopState)
        window.removeEventListener('focus', handleFocus)
      }
    }
  }, [canRedirect, isAuthenticated, isLoading, router, redirectTo])
}
