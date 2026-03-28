import {
  ChartLineUp,
  Warning,
  SignOut,
  ArrowClockwise,
  Users,
  Gear,
  Trash,
  MapPin,
  Tag,
} from 'phosphor-react'
import { NextRouter } from 'next/router'
import { IOption } from './index.d'

interface MenuOptionsConfig {
  router: NextRouter
  onLogoutClick: () => Promise<void>
  onClose?: () => void
  openLogoutModal?: () => void
  onRetryProfile?: () => void
  canAccessUserManagement?: boolean
  canAccessLocations?: boolean
  canAccessCategories?: boolean
  canAccessSettings?: boolean
  canAccessTrash?: boolean
}

export const createMenuOptions = ({
  router,
  onLogoutClick,
  onClose,
  openLogoutModal,
  onRetryProfile,
  canAccessUserManagement = false,
  canAccessLocations = false,
  canAccessCategories = false,
  canAccessSettings = false,
  canAccessTrash = false,
}: MenuOptionsConfig): IOption[] => {
  const options: IOption[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <ChartLineUp weight="bold" />,
      onClick: () => {
        router.push('/')
        onClose?.()
      },
    },
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

  if (canAccessLocations) {
    options.push({
      id: 'locations',
      name: 'Localizações',
      icon: <MapPin weight="bold" />,
      onClick: () => {
        router.push('/locations')
        onClose?.()
      },
    })
  }

  if (canAccessCategories) {
    options.push({
      id: 'categories',
      name: 'Categorias',
      icon: <Tag weight="bold" />,
      onClick: () => {
        router.push('/categories')
        onClose?.()
      },
    })
  }

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

  if (canAccessTrash) {
    options.push({
      id: 'trash',
      name: 'Lixeira',
      icon: <Trash weight="bold" />,
      onClick: () => {
        router.push('/trash')
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

export const MENU_OPTION_PATHS: Record<string, string> = {
  dashboard: '/',
  problems: '/problems',
  locations: '/locations',
  categories: '/categories',
  members: '/members',
  settings: '/settings',
  trash: '/trash',
}
