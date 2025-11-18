import { useQueryClient } from '@tanstack/react-query'

/**
 * Hook para invalidar o cache do usuário
 * Útil quando dados do usuário são modificados (ex: role, perfil)
 */
export function useInvalidateUser() {
  const queryClient = useQueryClient()

  const invalidateUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
  }

  return { invalidateUser }
}
