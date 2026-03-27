import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AuthenticateRequest, UserResponse } from '../lib/api/generated/models'
import { getRoleLevel, hasRequiredRole } from '@/contexts/auth/role-mapping'

type User = UserResponse & { position: string }

interface AuthSessionData {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isProfileLoading: boolean
  profileError: string | null
  signIn: (credentials: AuthenticateRequest) => Promise<void>
  signOut: () => Promise<void>
  retryProfileLoad: () => Promise<void>
}

interface AuthPermissionsData {
  hasRole: (requiredRole: string) => boolean
  hasRoleLevel: (requiredLevel: number) => boolean
  canAccessUserManagement: () => boolean
  canAccessSettings: () => boolean
  canAccessTrash: () => boolean
  canManageUserRole: (targetUserRole: string) => boolean
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthSessionContext = createContext<AuthSessionData | null>(null)
const AuthPermissionsContext = createContext<AuthPermissionsData | null>(null)

export const USER_PROFILE_QUERY_KEY = ['user', 'profile'] as const
const SESSION_REVALIDATION_INTERVAL = 60 * 1000

async function fetchUserProfile(): Promise<User | null> {
  const response = await fetch('/api/auth/me')
  const data = await response.json().catch(() => null)

  if (response.status === 401) {
    if (data?.error !== 'No authentication token found') {
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null)
    }

    return null
  }

  if (response.ok && data.success) {
    return data.user
  }

  throw new Error(
    data?.error || 'Não foi possível carregar o perfil do usuário.',
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
    refetchInterval: (query) =>
      query.state.data ? SESSION_REVALIDATION_INTERVAL : false,
    refetchOnWindowFocus: (query) => (query.state.data ? 'always' : false),
    refetchOnReconnect: (query) => (query.state.data ? 'always' : false),
    refetchOnMount: true,
    retry: false,
  })

  const isAuthenticated = !!user
  const isProfileLoading = isLoading
  const profileError =
    error instanceof Error
      ? error.message
      : error
        ? 'Não foi possível carregar o perfil do usuário.'
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
      window.history.replaceState(null, '', '/login')
    }
  }, [queryClient, router])

  const sessionValue = useMemo<AuthSessionData>(
    () => ({
      user: user ?? null,
      isAuthenticated,
      isLoading: !isFetched && isLoading,
      isProfileLoading,
      profileError,
      signIn,
      signOut,
      retryProfileLoad,
    }),
    [
      isAuthenticated,
      isFetched,
      isLoading,
      isProfileLoading,
      profileError,
      retryProfileLoad,
      signIn,
      signOut,
      user,
    ],
  )

  const permissionsValue = useMemo<AuthPermissionsData>(() => {
    const role = user?.role ?? null

    const hasRole = (requiredRole: string): boolean => {
      if (!role) return false
      return hasRequiredRole(role, requiredRole)
    }

    const hasRoleLevel = (requiredLevel: number): boolean => {
      if (!role) return false
      return getRoleLevel(role) >= requiredLevel
    }

    return {
      hasRole,
      hasRoleLevel,
      canAccessUserManagement: () => hasRoleLevel(3),
      canAccessSettings: () => hasRoleLevel(2),
      canAccessTrash: () => !!user,
      canManageUserRole: (targetUserRole: string): boolean => {
        if (!role) return false

        const currentLevel = getRoleLevel(role)
        const targetLevel = getRoleLevel(targetUserRole)

        if (currentLevel === 4) return true

        if (currentLevel === 3) {
          return targetLevel <= 2
        }

        return false
      },
    }
  }, [user])

  return (
    <AuthSessionContext.Provider value={sessionValue}>
      <AuthPermissionsContext.Provider value={permissionsValue}>
        {children}
      </AuthPermissionsContext.Provider>
    </AuthSessionContext.Provider>
  )
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext)

  if (!context) {
    throw new Error('useAuthSession must be used within an AuthProvider')
  }

  return context
}

export function useAuthPermissions() {
  const context = useContext(AuthPermissionsContext)

  if (!context) {
    throw new Error('useAuthPermissions must be used within an AuthProvider')
  }

  return context
}

export function useAuth() {
  return {
    ...useAuthSession(),
    ...useAuthPermissions(),
  }
}
