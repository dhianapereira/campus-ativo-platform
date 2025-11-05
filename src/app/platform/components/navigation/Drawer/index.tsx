import React, { useState } from 'react'
import { CloseButton, DrawerContainer, DrawerOptions, Overlay } from './styles'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { LinkButton } from '@/styles'
import { createMenuOptions } from '../menu-options'
import { LogoutConfirmationModal } from '../../LogoutModal'
import { IProps } from './index.d'
import whiteIfalLogo from '@/assets/white-ifal-logo.png'
import { X } from 'phosphor-react'
import { useAuth } from '@/contexts/auth-context'

interface DrawerProps extends IProps {
  onLogoutClick: () => Promise<void>
}

export default function Drawer({
  onClose,
  onLogoutClick,
  onRetryProfile,
}: DrawerProps) {
  const router = useRouter()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const { canAccessUserManagement, canAccessSettings } = useAuth()

  const menuOptions = createMenuOptions({
    router,
    onLogoutClick,
    onClose,
    openLogoutModal: () => setIsLogoutModalOpen(true),
    onRetryProfile,
    canAccessUserManagement: canAccessUserManagement(),
    canAccessSettings: canAccessSettings(),
  })

  const handleLogoutConfirm = async () => {
    await onLogoutClick()
    setIsLogoutModalOpen(false)
    onClose()
  }

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false)
  }

  return (
    <>
      <Overlay aria-hidden="true" />
      <DrawerContainer
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <CloseButton onClick={onClose} aria-label="Fechar menu" tabIndex={0}>
          <X className="close-icon" weight="bold" size={24} />
        </CloseButton>
        <Image
          src={whiteIfalLogo}
          height={68}
          width={193}
          quality={100}
          alt="Logo do Instituto Federal de Alagoas."
        />
        <DrawerOptions>
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
        </DrawerOptions>
      </DrawerContainer>

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
