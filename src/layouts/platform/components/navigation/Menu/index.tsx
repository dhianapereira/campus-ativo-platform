import React, { useState } from 'react'
import {
  MenuContainer,
  LogoWrapper,
  MenuNav,
  MenuItem,
  MenuFooter,
  LogoutButton,
} from './styles'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { createMenuOptions, MENU_OPTION_PATHS } from '../menu-options'
import { LogoutConfirmationModal } from '../../LogoutModal'
import { useAuthPermissions } from '@/contexts/auth-context'
import whiteIfalLogo from '@/assets/white-ifal-logo.png'

interface MenuProps {
  onLogoutClick: () => Promise<void>
}

export default function Menu({ onLogoutClick }: MenuProps) {
  const router = useRouter()
  const pathname = router.pathname
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const { canAccessUserManagement, canAccessSettings, canAccessTrash } =
    useAuthPermissions()

  const menuOptions = createMenuOptions({
    router,
    onLogoutClick,
    openLogoutModal: () => setIsLogoutModalOpen(true),
    canAccessUserManagement: canAccessUserManagement(),
    canAccessSettings: canAccessSettings(),
    canAccessTrash: canAccessTrash(),
  })

  const logoutOption = menuOptions.find((o) => o.id === 'logout')
  const navOptions = menuOptions.filter((o) => o.id !== 'logout')

  const handleLogoutConfirm = async () => {
    try {
      await onLogoutClick()
      setIsLogoutModalOpen(false)
    } catch (_error) {}
  }

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false)
  }

  return (
    <>
      <MenuContainer role="navigation" aria-label="Menu principal">
        <LogoWrapper>
          <Image
            src={whiteIfalLogo}
            height={68}
            width={193}
            quality={100}
            alt="Logo do Instituto Federal de Alagoas."
          />
        </LogoWrapper>

        <MenuNav>
          {navOptions.map((option) => {
            const path = MENU_OPTION_PATHS[option.id]
            const isActive = path ? pathname === path : false
            return (
              <MenuItem
                key={option.id}
                type="button"
                active={isActive}
                onClick={option.onClick}
                aria-label={`Ir para ${option.name}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {option.icon}
                {option.name}
              </MenuItem>
            )
          })}
        </MenuNav>

        <MenuFooter>
          {logoutOption && (
            <LogoutButton
              type="button"
              onClick={logoutOption.onClick}
              aria-label="Sair do sistema"
            >
              {logoutOption.icon}
              {logoutOption.name}
            </LogoutButton>
          )}
        </MenuFooter>
      </MenuContainer>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Sair da Plataforma"
        description="Tem certeza que deseja sair da plataforma? Você precisará fazer login novamente para acessar o sistema."
      />
    </>
  )
}
