import { Warning, SignOut } from 'phosphor-react'
import { NextRouter } from 'next/router'
import { IOption } from './index.d'

interface MenuOptionsConfig {
  router: NextRouter
  onLogoutClick: () => void
  onClose?: () => void
  openLogoutModal?: () => void // Nova prop para abrir o modal
}

export const createMenuOptions = ({
  router,
  onLogoutClick,
  onClose,
  openLogoutModal,
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
      if (openLogoutModal) {
        // Se o modal estiver disponível, abre o modal
        openLogoutModal()
      } else {
        // Fallback: comportamento original (para compatibilidade)
        onLogoutClick()
        onClose?.()
      }
    },
  },
]
