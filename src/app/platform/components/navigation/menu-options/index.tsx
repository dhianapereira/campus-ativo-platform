import { Warning, SignOut, ArrowClockwise, Users, Gear } from 'phosphor-react'
import { NextRouter } from 'next/router'
import { IOption } from './index.d'

interface MenuOptionsConfig {
  router: NextRouter
  onLogoutClick: () => Promise<void>
  onClose?: () => void
  openLogoutModal?: () => void
  onRetryProfile?: () => void
  canAccessUserManagement?: boolean
  canAccessSettings?: boolean
}

export const createMenuOptions = ({
  router,
  onLogoutClick,
  onClose,
  openLogoutModal,
  onRetryProfile,
  canAccessUserManagement = false,
  canAccessSettings = false,
}: MenuOptionsConfig): IOption[] => {
  const options: IOption[] = [
    {
      id: 'problems',
      name: 'Problemas',
      icon: <Warning weight="bold" />,
      onClick: () => {
        router.push('/problems')
        onClose?.()
      },
    },
  ]

  if (canAccessUserManagement) {
    options.push({
      id: 'members',
      name: 'Membros',
      icon: <Users weight="bold" />,
      onClick: () => {
        router.push('/members')
        onClose?.()
      },
    })
  }

  if (canAccessSettings) {
    options.push({
      id: 'settings',
      name: 'Configurações',
      icon: <Gear weight="bold" />,
      onClick: () => {
        router.push('/settings')
        onClose?.()
      },
    })
  }

  if (onRetryProfile) {
    options.push({
      id: 'retry-profile',
      name: 'Recarregar perfil',
      icon: <ArrowClockwise weight="bold" />,
      onClick: () => {
        onRetryProfile()
        onClose?.()
      },
    })
  }

  options.push({
    id: 'logout',
    name: 'Sair da plataforma',
    icon: <SignOut weight="bold" />,
    onClick: () => {
      if (openLogoutModal) {
        openLogoutModal()
      } else {
        onLogoutClick()
        onClose?.()
      }
    },
  })

  return options
}
