import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  WarningIcon,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalMessage,
  ModalFooter,
  CancelButton,
  ConfirmButton,
} from './styles'
import { X } from 'phosphor-react'
import Image from 'next/image'
import alertIcon from '@/assets/alert-icon.svg'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Descartar alterações?',
  message = 'Se você sair agora, todas as suas alterações não salvas serão perdidas.',
  confirmText = 'Continuar editando',
  cancelText = 'Descartar',
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <ModalOverlay onClick={handleCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleCancel} aria-label="Fechar">
          <X size={28} weight="bold" />
        </CloseButton>

        <ModalHeader>
          <WarningIcon>
            <Image
              src={alertIcon}
              alt="Alerta"
              width={24}
              height={24}
              priority
            />
          </WarningIcon>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <ModalMessage>{message}</ModalMessage>
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={handleCancel}>{cancelText}</CancelButton>
          <ConfirmButton onClick={handleConfirm}>{confirmText}</ConfirmButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  )
}
