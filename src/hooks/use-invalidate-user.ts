import { useQueryClient } from '@tanstack/react-query'
import { USER_PROFILE_QUERY_KEY } from '@/contexts/auth-context'

export function useInvalidateUser() {
  const queryClient = useQueryClient()

  const invalidateUser = async () => {
    await queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })
  }

  return { invalidateUser }
}
