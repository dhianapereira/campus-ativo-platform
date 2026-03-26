import { createContext, useCallback, useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AuthenticateRequest, UserResponse } from '../lib/api/generated/models'
import { getRoleLevel, hasRequiredRole } from '@/contexts/auth/role-mapping'

type User = UserResponse & { position: string }

interface AuthContextData {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isProfileLoading: boolean
  profileError: string | null
  signIn: (credentials: AuthenticateRequest) => Promise<void>
  signOut: () => Promise<void>
  retryProfileLoad: () => Promise<void>
  hasRole: (requiredRole: string) => boolean
  hasRoleLevel: (requiredLevel: number) => boolean
  canAccessUserManagement: () => boolean
  canAccessSettings: () => boolean
  canAccessTrash: () => boolean
  canManageUserRole: (targetUserRole: string) => boolean
}

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)
export const USER_PROFILE_QUERY_KEY = ['user', 'profile'] as const

async function fetchUserProfile(): Promise<User | null> {
  const response = await fetch('/api/auth/me')
  const data = await response.json().catch(() => null)

  if (response.status === 401) {
    return null
  }

  if (response.ok && data.success) {
    return data.user
  }

  throw new Error(
    data?.error || 'Nao foi possivel carregar o perfil do usuario.',
  )
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const {
    data: user,
    isLoading,
    isFetched,
    error,
    refetch,
  } = useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  })

  const isAuthenticated = !!user
  const isProfileLoading = isLoading
  const profileError =
    error instanceof Error
      ? error.message
      : error
        ? 'Nao foi possivel carregar o perfil do usuario.'
        : null

  const retryProfileLoad = useCallback(async () => {
    await refetch()
  }, [refetch])

  const signIn = useCallback(
    async ({ email, password }: AuthenticateRequest) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        type ErrorWithStatus = Error & { status?: number }
        const err: ErrorWithStatus = new Error(
          data.error || 'Authentication failed',
        )
        err.status = response.status
        throw err
      }

      queryClient.setQueryData(USER_PROFILE_QUERY_KEY, data.user ?? null)

      await router.push('/')
    },
    [queryClient, router],
  )

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}

    queryClient.clear()

    await router.replace('/login')

    if (typeof window !== 'undefined') {
      // Prevent going back into protected pages
      window.history.replaceState(null, '', '/login')
    }
  }, [queryClient, router])

  const contextValue = useMemo(() => {
    const hasRole = (requiredRole: string): boolean => {
      if (!user?.role) return false
      return hasRequiredRole(user.role, requiredRole)
    }

    const hasRoleLevel = (requiredLevel: number): boolean => {
      if (!user?.role) return false
      return getRoleLevel(user.role) >= requiredLevel
    }

    const canManageUserRole = (targetUserRole: string): boolean => {
      if (!user?.role) return false

      const currentLevel = getRoleLevel(user.role)
      const targetLevel = getRoleLevel(targetUserRole)

      if (currentLevel === 4) return true

      if (currentLevel === 3) {
        return targetLevel <= 2
      }

      return false
    }

    return {
      user: user ?? null,
      isAuthenticated,
      isLoading: !isFetched && isLoading,
      isProfileLoading,
      profileError,
      signIn,
      signOut,
      retryProfileLoad,
      hasRole,
      hasRoleLevel,
      canAccessUserManagement: () => hasRoleLevel(3),
      canAccessSettings: () => hasRoleLevel(2),
      canAccessTrash: () => !!user,
      canManageUserRole,
    }
  }, [
    isAuthenticated,
    isFetched,
    isLoading,
    isProfileLoading,
    profileError,
    retryProfileLoad,
    signIn,
    signOut,
    user,
  ])

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
