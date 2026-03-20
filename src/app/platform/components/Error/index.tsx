import React from 'react'
import { Image } from 'phosphor-react'
import {
  ErrorContainer,
  ErrorIcon,
  ErrorTitle,
  ErrorDescription,
} from './styles'

export interface ImageErrorProps {
  title?: string
  description?: string
}

export const ImageError = ({
  title = 'Erro ao carregar imagem',
  description = 'Não foi possível carregar a imagem. Verifique a conexão ou tente novamente mais tarde.',
}: ImageErrorProps) => {
  return (
    <ErrorContainer>
      <ErrorIcon>
        <Image size={32} weight="bold" alt="" />
      </ErrorIcon>
      <div>
        <ErrorTitle>{title}</ErrorTitle>
        <ErrorDescription>{description}</ErrorDescription>
      </div>
    </ErrorContainer>
  )
}

ImageError.displayName = 'ImageError'
