import React from 'react'
import { MenuContainer, MenuOptions } from './styles'
import Image from 'next/image'
import { LinkButton } from '@campusativo-ui/react'
import { menuOptions } from '../menu-options'

import whiteIfalLogo from '@/assets/white-ifal-logo.png'

export default function Menu() {
  return (
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
  )
}
