import { TrashItemModal } from '../TrashItemModal'
import {
  RestoreButton,
  DeleteButton,
  InfoGroup,
  InfoItem,
  Label,
  Value,
  DescriptionValue,
} from '../TrashItemModal/styles'
import { ArrowCounterClockwise, Trash } from 'phosphor-react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { useState } from 'react'
import type { LocationResponse } from '@/lib/api/generated/models/locationResponse'

interface ViewLocationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  location: LocationResponse | null
}

export function ViewLocationModal({
  isOpen,
  onClose,
  onSuccess,
  location,
}: ViewLocationModalProps) {
  const queryClient = useQueryClient()
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false)

  const restoreLocationMutation = useMutation({
    mutationFn: async () => {
      if (!location?.id) throw new Error('ID da localização não encontrado')

      const response = await fetch('/api/trash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'restore',
          ids: [location.id],
          type: 'location',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao restaurar localização')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      toast.success('Localização restaurada com sucesso')
      onSuccess()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao restaurar localização')
    },
  })

  const deleteLocationMutation = useMutation({
    mutationFn: async () => {
      if (!location?.id) throw new Error('ID da localização não encontrado')

      const response = await fetch('/api/trash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'delete',
          ids: [location.id],
          type: 'location',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao excluir localização')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      toast.success('Localização excluída permanentemente')
      setShowDeleteConfirmationModal(false)
      onSuccess()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao excluir localização')
    },
  })

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  if (!location) return null

  return (
    <>
      <TrashItemModal
        isOpen={isOpen}
        onClose={onClose}
        title="Localização"
        actions={
          <div className="action-buttons">
            <DeleteButton
              onClick={() => setShowDeleteConfirmationModal(true)}
              disabled={deleteLocationMutation.isPending}
            >
              <Trash size={20} weight="bold" />
              {deleteLocationMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </DeleteButton>
            <RestoreButton
              onClick={() => restoreLocationMutation.mutate()}
              disabled={restoreLocationMutation.isPending}
            >
              <ArrowCounterClockwise size={20} weight="bold" />
              {restoreLocationMutation.isPending
                ? 'Restaurando...'
                : 'Restaurar'}
            </RestoreButton>
          </div>
        }
      >
        <InfoGroup>
          <InfoItem>
            <Label>Nome</Label>
            <Value>{location.name}</Value>
          </InfoItem>

          <InfoItem>
            <Label>Número</Label>
            <Value>{location.code || '-'}</Value>
          </InfoItem>

          <InfoItem>
            <Label>Status</Label>
            <Value>{location.isActive ? 'Ativa' : 'Inativa'}</Value>
          </InfoItem>

          <InfoItem>
            <Label>Descrição</Label>
            <DescriptionValue>{location.description || '-'}</DescriptionValue>
          </InfoItem>

          <InfoItem>
            <Label>Cadastrada em</Label>
            <Value>{formatDate(location.createdAt)}</Value>
          </InfoItem>

          <InfoItem>
            <Label>Movida para lixeira em</Label>
            <Value>{formatDate(location.deletedAt)}</Value>
          </InfoItem>
        </InfoGroup>
      </TrashItemModal>

      <ConfirmationModal
        isOpen={showDeleteConfirmationModal}
        onClose={() => setShowDeleteConfirmationModal(false)}
        onConfirm={() => deleteLocationMutation.mutate()}
        title="Excluir localização permanentemente?"
        message="Esta localização será removida de forma definitiva e não poderá ser recuperada depois."
        confirmText="Excluir permanentemente"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  )
}
