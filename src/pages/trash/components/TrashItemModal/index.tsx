import type { ReactNode } from 'react'
import { X } from 'phosphor-react'
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  CancelButton,
} from './styles'

interface TrashItemModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  actions?: ReactNode
}

export function TrashItemModal({
  isOpen,
  onClose,
  title,
  children,
  actions,
}: TrashItemModalProps) {
  if (!isOpen) return null

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalCloseButton onClick={onClose}>
            <X size={24} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>{children}</ModalBody>

        <ModalFooter>
          <ButtonGroup>
            {actions || <div />}
            <CancelButton onClick={onClose}>Fechar</CancelButton>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  )
}
