import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AuthenticateRequest, UserResponse } from '../../server/client/models'
import { useGetUserProfileControllerHandle } from '../../server/client/user-profile/user-profile'
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

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const router = useRouter()

  const { refetch: refetchProfile } = useGetUserProfileControllerHandle({
    query: {
      enabled: false,
      retry: false,
      refetchOnWindowFocus: false,
    },
  })

  const isAuthenticated = !!user

  useEffect(() => {
    loadUserFromStorage()
  }, [])

  async function loadUserFromStorage() {
    setIsProfileLoading(true)
    setProfileError(null)

    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()

      if (response.ok && data.success) {
        setUser(data.user)
        setProfileError(null)
      } else {
        setUser(null)
        setProfileError(null)
      }
    } catch (error: unknown) {
      setUser(null)
      setProfileError('Failed to load user profile')
    } finally {
      setIsLoading(false)
      setIsProfileLoading(false)
    }
  }

  async function retryProfileLoad() {
    try {
      await loadUserFromStorage()
    } catch (error) {
      await refetchProfile()
    }
  }

  async function signIn({ email, password }: AuthenticateRequest) {
    try {
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

      setUser(data.user)

      await router.push('/problems')
    } finally {
      setIsLoading(false)
    }
  }

  async function signOut() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}

    setUser(null)

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
        user,
        isAuthenticated,
        isLoading,
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
