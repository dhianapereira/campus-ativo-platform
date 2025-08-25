/**
 * Maps backend user roles to user-friendly display names in Portuguese
 */
export function mapRoleToDisplayName(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'Administrador'
    case 'DIRECTOR':
      return 'Diretor'
    case 'MANAGER':
      return 'Gerente'
    case 'REPORTER':
      return 'Usuário'
    default:
      return 'Relator'
  }
}

/**
 * Gets role hierarchy level for permission checking
 * Higher numbers indicate higher permissions
 */
export function getRoleLevel(role: string): number {
  switch (role) {
    case 'ADMIN':
      return 4
    case 'DIRECTOR':
      return 3
    case 'MANAGER':
      return 2
    case 'REPORTER':
      return 1
    default:
      return 0
  }
}

/**
 * Checks if a user has sufficient role level for a required operation
 */
export function hasRequiredRole(
  userRole: string,
  requiredRole: string,
): boolean {
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole)
}

/**
 * Gets a short description of role permissions
 */
export function getRoleDescription(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'Acesso completo ao sistema'
    case 'DIRECTOR':
      return 'Gerenciamento de usuários e problemas'
    case 'MANAGER':
      return 'Gerenciamento de problemas'
    case 'REPORTER':
      return 'Relatar e visualizar problemas'
    default:
      return 'Usuário básico'
  }
}
