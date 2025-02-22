import React from 'react'
import { CloseButton, DrawerContainer, DrawerOptions, Overlay } from './styles'
import Image from 'next/image'
import { LinkButton } from '@campusativo-ui/react'
import { menuOptions } from '../menu-options'
import { IProps } from './index.d'

import whiteIfalLogo from '@/assets/white-ifal-logo.png'
import { X } from 'phosphor-react'

export default function Drawer({ onClose }: IProps) {
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
    </>
  )
}
