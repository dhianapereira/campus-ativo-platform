import React from 'react'
import {
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  CloseButton,
  ButtonGroup,
  ConfirmButton,
  CancelButton,
} from './styles'
import { X, SignOut } from 'phosphor-react'

export interface LogoutConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
}

export const LogoutConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Sair da Plataforma',
  description = 'Tem certeza que deseja sair da plataforma? Você precisará fazer login novamente para acessar o sistema.',
}: LogoutConfirmationModalProps) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <DialogOverlay onClick={onClose}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '400px' }}
      >
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <SignOut size={24} weight="bold" color="#ef4444" />
          <DialogTitle>{title}</DialogTitle>
        </div>

        <DialogDescription>{description}</DialogDescription>

        <ButtonGroup style={{ marginTop: '24px' }}>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <ConfirmButton
            onClick={handleConfirm}
            style={{
              backgroundColor: '#ef4444',
              borderColor: '#ef4444',
            }}
          >
            Sair da Plataforma
          </ConfirmButton>
        </ButtonGroup>
      </DialogContent>
    </DialogOverlay>
  )
}

LogoutConfirmationModal.displayName = 'LogoutConfirmationModal'
