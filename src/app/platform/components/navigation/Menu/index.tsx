import React, { useState } from 'react'
import { MenuContainer, MenuOptions } from './styles'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { LinkButton } from '@/styles'
import { createMenuOptions } from '../menu-options'
import { LogoutConfirmationModal } from '../../LogoutModal'
import { useAuth } from '@/contexts/auth-context'
import whiteIfalLogo from '@/assets/white-ifal-logo.png'

interface MenuProps {
  onLogoutClick: () => Promise<void>
}

export default function Menu({ onLogoutClick }: MenuProps) {
  const router = useRouter()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const { canAccessUserManagement, canAccessSettings } = useAuth()

  const menuOptions = createMenuOptions({
    router,
    onLogoutClick,
    openLogoutModal: () => setIsLogoutModalOpen(true),
    canAccessUserManagement: canAccessUserManagement(),
    canAccessSettings: canAccessSettings(),
  })

  const handleLogoutConfirm = async () => {
    try {
      await onLogoutClick()
      setIsLogoutModalOpen(false)
    } catch (error) {}
  }

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false)
  }

  return (
    <>
      <MenuContainer role="navigation" aria-label="Menu principal">
        <Image
          src={whiteIfalLogo}
          height={68}
          width={193}
          quality={100}
          alt="Logo do Instituto Federal de Alagoas."
        />
        <MenuOptions>
          {menuOptions.map((option) => (
            <LinkButton
              key={option.id}
              variant="white"
              onClick={option.onClick}
              aria-label={`Ir para ${option.name}`}
              tabIndex={0}
            >
              {option.icon}
              {option.name}
            </LinkButton>
          ))}
        </MenuOptions>
      </MenuContainer>

      {/* Modal de confirmação de logout */}
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
