import { Warning, SignOut } from 'phosphor-react'
import { NextRouter } from 'next/router'
import { IOption } from './index.d'

interface MenuOptionsConfig {
  router: NextRouter
  onLogoutClick: () => void
  onClose?: () => void
}

export const createMenuOptions = ({
  router,
  onLogoutClick,
  onClose,
}: MenuOptionsConfig): IOption[] => [
  {
    id: 'problems',
    name: 'Problemas',
    icon: <Warning weight="bold" />,
    onClick: () => {
      router.push('/problems')
      onClose?.()
    },
  },
  {
    id: 'logout',
    name: 'Sair da plataforma',
    icon: <SignOut weight="bold" />,
    onClick: () => {
      onLogoutClick()
      onClose?.()
    },
  },
]
