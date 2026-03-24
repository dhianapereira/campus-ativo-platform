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

export function hasRequiredRole(
  userRole: string,
  requiredRole: string,
): boolean {
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole)
}

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
