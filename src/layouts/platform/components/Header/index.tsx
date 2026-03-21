import React, { useState } from 'react'
import { DrawerIcon, HeaderContainer, Info, UserInfoContainer } from './styles'
import { IProps } from './index.d'
import { List } from 'phosphor-react'
import Drawer from '../navigation/Drawer'
import { truncateUserName } from '@/utils/truncate-name'
import { useAuth } from '@/contexts/auth-context'
import { Text, Avatar, Heading } from '@/styles'
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

  const openDrawer = () => {
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  const handleLogout = async () => {
    await signOut()
  }

  const handleRetryProfile = async () => {
    await retryProfileLoad()
  }

  const handleProfileClick = () => {
    if (!showError) {
      router.push('/profile')
    }
  }

  const displayName = showLoadingState
    ? 'Carregando...'
    : truncateUserName(name)
  const displayPosition = showLoadingState
    ? 'Carregando...'
    : truncateUserName(position)

  const showError = profileError && !showLoadingState

  return (
    <HeaderContainer>
      <Heading>Campus Ativo</Heading>
      <UserInfoContainer
        onClick={handleProfileClick}
        style={{ cursor: showError ? 'default' : 'pointer' }}
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
            title={
              showError ? 'Clique no menu para tentar novamente' : position
            }
            onClick={showError ? handleRetryProfile : undefined}
            style={{ cursor: showError ? 'pointer' : 'default' }}
          >
            {showError ? 'Tentar novamente' : displayPosition}
          </Text>
        </Info>
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
    </HeaderContainer>
  )
}
