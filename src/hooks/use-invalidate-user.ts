import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook to invalidate user cache.
 * Useful when user data is modified (e.g., role, profile)
 */
export function useInvalidateUser() {
  const queryClient = useQueryClient();

  const invalidateUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
  };

  return { invalidateUser };
}
