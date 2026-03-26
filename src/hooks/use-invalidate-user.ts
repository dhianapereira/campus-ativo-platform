import { useQueryClient } from '@tanstack/react-query'
import { USER_PROFILE_QUERY_KEY } from '@/contexts/auth-context'

/**
 * Hook to invalidate user cache.
 * Useful when user data is modified (e.g., role, profile)
 */
export function useInvalidateUser() {
  const queryClient = useQueryClient()

  const invalidateUser = async () => {
    await queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })
  }

  return { invalidateUser }
}
