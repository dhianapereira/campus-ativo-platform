import React, { useState } from 'react'
import { DrawerIcon, HeaderContainer, Info, UserInfoContainer } from './styles'
import { Avatar, Heading, Text } from '@campusativo-ui/react'
import { IProps } from './index.d'
import { List } from 'phosphor-react'
import Drawer from '../navigation/Drawer'
import { truncateUserName } from '../../../../utils/truncate-name'

export default function Header({ src, alt, name, position }: IProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const openDrawer = () => {
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  const displayName = truncateUserName(name)
  const displayPosition = truncateUserName(position)

  return (
    <HeaderContainer>
      <Heading>Campus Ativo</Heading>
      <UserInfoContainer>
        <Avatar src={src} alt={alt} />
        <Info>
          <Text className="name" size="md" title={name}>
            {displayName}
          </Text>
          <Text className="position" size="sm" title={position}>
            {displayPosition}
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
        {isDrawerOpen && <Drawer onClose={closeDrawer} />}
      </DrawerIcon>
    </HeaderContainer>
  )
}
