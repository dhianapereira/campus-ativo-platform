import React, { useEffect, useRef, useState } from 'react'
import {
  DrawerIcon,
  HeaderContainer,
  Info,
  UserInfoContainer,
  UserMenuTrigger,
  UserMenu,
  UserMenuItem,
} from './styles'
import { IProps } from './index.d'
import {
  ArrowClockwise,
  CaretDown,
  List,
  SignOut,
  UserCircle,
} from 'phosphor-react'
import Drawer from '../navigation/Drawer'
import { LogoutConfirmationModal } from '../LogoutModal'
import { truncateUserName } from '@/utils/truncate-name'
import { useAuth } from '@/contexts/auth-context'
import { Text, Avatar, Heading } from '@/components'
import { useRouter } from 'next/router'

export default function Header({
  src,
  alt,
  name,
  position,
  showLoadingState = false,
}: IProps) {
  const { signOut, profileError, retryProfileLoad } = useAuth()
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  const openDrawer = () => {
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  const handleLogout = async () => {
    await signOut()
  }

  const handleLogoutMenuClick = () => {
    setIsUserMenuOpen(false)
    setIsLogoutModalOpen(true)
  }

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false)
  }

  const handleLogoutConfirm = async () => {
    await handleLogout()
    setIsLogoutModalOpen(false)
  }

  const handleRetryProfile = async () => {
    await retryProfileLoad()
    setIsUserMenuOpen(false)
  }

  const handleProfileClick = async () => {
    setIsUserMenuOpen(false)
    if (!showError) {
      await router.push('/profile')
    }
  }

  const displayName = showLoadingState
    ? 'Carregando...'
    : truncateUserName(name)
  const displayPosition = showLoadingState
    ? 'Carregando...'
    : truncateUserName(position)

  const showError = profileError && !showLoadingState

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <HeaderContainer>
      <Heading>Campus Ativo</Heading>
      <UserInfoContainer ref={userMenuRef}>
        <UserMenuTrigger
          type="button"
          onClick={() => setIsUserMenuOpen((prev) => !prev)}
          aria-label="Abrir menu do usuário"
          aria-haspopup="menu"
          aria-expanded={isUserMenuOpen}
        >
          <Avatar src={src} alt={alt} />
          <Info>
            <Text
              className="name"
              size="md"
              title={showError ? profileError : name}
            >
              {showError ? 'Erro ao carregar' : displayName}
            </Text>
            <Text
              className="position"
              size="sm"
              title={showError ? 'Abra o menu para tentar novamente' : position}
            >
              {showError ? 'Ver opções' : displayPosition}
            </Text>
          </Info>
          <CaretDown size={16} weight="bold" />
        </UserMenuTrigger>

        {isUserMenuOpen && (
          <UserMenu role="menu" aria-label="Menu do usuário">
            {!showError && (
              <UserMenuItem
                type="button"
                role="menuitem"
                onClick={handleProfileClick}
              >
                <UserCircle size={18} weight="regular" />
                Meu perfil
              </UserMenuItem>
            )}

            {showError && (
              <UserMenuItem
                type="button"
                role="menuitem"
                onClick={handleRetryProfile}
              >
                <ArrowClockwise size={18} weight="regular" />
                Tentar carregar perfil novamente
              </UserMenuItem>
            )}

            <UserMenuItem
              type="button"
              role="menuitem"
              data-variant="danger"
              onClick={handleLogoutMenuClick}
            >
              <SignOut size={18} weight="regular" />
              Sair
            </UserMenuItem>
          </UserMenu>
        )}
      </UserInfoContainer>
      <DrawerIcon>
        <List
          weight="bold"
          size={24}
          onClick={openDrawer}
          aria-label="Abrir menu de navegação"
          tabIndex={0}
          role="button"
        />
        {isDrawerOpen && (
          <Drawer
            onClose={closeDrawer}
            onLogoutClick={handleLogout}
            onRetryProfile={showError ? handleRetryProfile : undefined}
          />
        )}
      </DrawerIcon>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Sair da Plataforma"
        description="Tem certeza que deseja sair da plataforma? Você precisará fazer login novamente para acessar o sistema."
      />
    </HeaderContainer>
  )
}
