import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AuthenticateRequest, UserResponse } from '../../server/client/models'
import { getRoleLevel, hasRequiredRole } from '@/utils/role-mapping'

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
  canManageUserRole: (targetUserRole: string) => boolean
}

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

// Fetch function for user profile
async function fetchUserProfile(): Promise<User | null> {
  const response = await fetch('/api/auth/me')
  const data = await response.json()

  if (response.ok && data.success) {
    return data.user
  }

  return null
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const router = useRouter()
  const queryClient = useQueryClient()

  // Use TanStack Query to manage user profile with automatic revalidation
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: fetchUserProfile,
    staleTime: 10 * 1000, // Consider data stale after 10 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchIntervalInBackground: true, // Keep refetching even when tab is not focused
    refetchOnWindowFocus: true, // Also refetch when user returns to window
    refetchOnMount: true, // Refetch when component mounts
    retry: false,
    enabled: true, // Always enabled
  })

  const isAuthenticated = !!user
  const isProfileLoading = isLoading
  const profileError = error ? 'Failed to load user profile' : null

  useEffect(() => {
    if (!isLoading && isInitialLoad) {
      setIsInitialLoad(false)
    }
  }, [isLoading, isInitialLoad])

  async function retryProfileLoad() {
    await refetch()
  }

  async function signIn({ email, password }: AuthenticateRequest) {
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

    // Invalidate and refetch user profile to get fresh data
    await queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
    await refetch()

    await router.push('/problems')
  }

  async function signOut() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}

    // Clear all queries from cache
    queryClient.clear()

    await router.replace('/login')

    if (typeof window !== 'undefined') {
      // Prevent going back into protected pages
      window.history.replaceState(null, '', '/login')
    }
  }

  function hasRole(requiredRole: string): boolean {
    if (!user?.role) return false
    return hasRequiredRole(user.role, requiredRole)
  }

  function hasRoleLevel(requiredLevel: number): boolean {
    if (!user?.role) return false
    return getRoleLevel(user.role) >= requiredLevel
  }

  function canAccessUserManagement(): boolean {
    return hasRoleLevel(3)
  }

  function canAccessSettings(): boolean {
    return hasRoleLevel(2)
  }

  function canManageUserRole(targetUserRole: string): boolean {
    if (!user?.role) return false

    const currentLevel = getRoleLevel(user.role)
    const targetLevel = getRoleLevel(targetUserRole)

    if (currentLevel === 4) return true

    if (currentLevel === 3) {
      return targetLevel <= 2
    }

    return false
  }

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated,
        isLoading: isInitialLoad && isLoading,
        isProfileLoading,
        profileError,
        signIn,
        signOut,
        retryProfileLoad,
        hasRole,
        hasRoleLevel,
        canAccessUserManagement,
        canAccessSettings,
        canManageUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
