export const USER_ROLES = {
  ADMIN: 'ADMIN',
  DIRECTOR: 'DIRECTOR',
  MANAGER: 'MANAGER',
  REPORTER: 'REPORTER',
} as const

export function mapRoleToDisplayName(role: string): string {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'Administrador'
    case USER_ROLES.DIRECTOR:
      return 'Diretor'
    case USER_ROLES.MANAGER:
      return 'Gestor'
    case USER_ROLES.REPORTER:
      return 'Usuário'
    default:
      return 'Relator'
  }
}

export function getRoleLevel(role: string): number {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 4
    case USER_ROLES.DIRECTOR:
      return 3
    case USER_ROLES.MANAGER:
      return 2
    case USER_ROLES.REPORTER:
      return 1
    default:
      return 0
  }
}

export function hasRequiredRole(
  userRole: string,
  requiredRole: string,
): boolean {
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole)
}

export function getRoleDescription(role: string): string {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'Acesso completo ao sistema'
    case USER_ROLES.DIRECTOR:
      return 'Gerenciamento de usuários e problemas'
    case USER_ROLES.MANAGER:
      return 'Gerenciamento de problemas'
    case USER_ROLES.REPORTER:
      return 'Relatar e visualizar problemas'
    default:
      return 'Usuário básico'
  }
}
