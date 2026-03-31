import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalIcon,
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
import warningIcon from '@/assets/warning-icon.svg'
import dangerIcon from '@/assets/danger-icon.svg'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  closeOnConfirm?: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'warning' | 'danger'
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  closeOnConfirm = false,
  title = 'Descartar alterações?',
  message = 'Se você sair agora, todas as suas alterações não salvas serão perdidas.',
  confirmText = 'Continuar editando',
  cancelText = 'Descartar',
  variant = 'warning',
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    if (closeOnConfirm) {
      onClose()
    }

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
          <ModalIcon>
            <Image
              src={variant === 'warning' ? warningIcon : dangerIcon}
              alt="Alerta"
              width={32}
              height={32}
              priority
            />
          </ModalIcon>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <ModalMessage>{message}</ModalMessage>
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={handleCancel}>{cancelText}</CancelButton>
          <ConfirmButton onClick={handleConfirm} variant={variant}>
            {confirmText}
          </ConfirmButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  )
}
