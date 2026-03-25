import { TrashItemModal } from '../TrashItemModal'
import {
  RestoreButton,
  DeleteButton,
  InfoGroup,
  InfoItem,
  Label,
  Value,
  DescriptionValue,
  WarningMessage,
} from '../TrashItemModal/styles'
import { ArrowCounterClockwise, Warning, Trash } from 'phosphor-react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { useState } from 'react'

interface ProblemData {
  id: string
  title: string
  description?: string
  locationName?: string
  categoryName?: string
  authorId?: string
  authorName?: string
  createdAt?: string
  deletedAt?: string
}

interface ViewProblemModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  problem: ProblemData | null
}

export function ViewProblemModal({
  isOpen,
  onClose,
  onSuccess,
  problem,
}: ViewProblemModalProps) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false)

  const isAuthor = user?.id === problem?.authorId

  const restoreProblemMutation = useMutation({
    mutationFn: async () => {
      if (!problem?.id) throw new Error('ID do problema não encontrado')

      const response = await fetch('/api/trash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'restore',
          ids: [problem.id],
          type: 'problem',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao restaurar problema')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] })
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      toast.success('Problema restaurado com sucesso')
      onSuccess()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao restaurar problema')
    },
  })

  const handleRestore = () => {
    restoreProblemMutation.mutate()
  }

  const deleteProblemMutation = useMutation({
    mutationFn: async () => {
      if (!problem?.id) throw new Error('ID do problema não encontrado')

      const response = await fetch('/api/trash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'delete',
          ids: [problem.id],
          type: 'problem',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao excluir problema')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] })
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      toast.success('Problema excluído permanentemente')
      setShowDeleteConfirmationModal(false)
      onSuccess()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao excluir problema')
    },
  })

  const handlePermanentDelete = () => {
    deleteProblemMutation.mutate()
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  if (!problem) return null

  return (
    <>
      <TrashItemModal
        isOpen={isOpen}
        onClose={onClose}
        title="Problema"
        actions={
          isAuthor ? (
            <div className="action-buttons">
              <DeleteButton
                onClick={() => setShowDeleteConfirmationModal(true)}
                disabled={deleteProblemMutation.isPending}
              >
                <Trash size={20} weight="bold" />
                {deleteProblemMutation.isPending ? 'Excluindo...' : 'Excluir'}
              </DeleteButton>
              <RestoreButton
                onClick={handleRestore}
                disabled={restoreProblemMutation.isPending}
              >
                <ArrowCounterClockwise size={20} weight="bold" />
                {restoreProblemMutation.isPending
                  ? 'Restaurando...'
                  : 'Restaurar'}
              </RestoreButton>
            </div>
          ) : undefined
        }
      >
          {!isAuthor && problem.authorId && (
            <WarningMessage>
              <Warning size={20} weight="fill" />
              <span>Apenas quem cadastrou este problema pode restaurá-lo.</span>
            </WarningMessage>
          )}

          <InfoGroup>
            <InfoItem>
              <Label>Título</Label>
              <Value>{problem.title}</Value>
            </InfoItem>

            {problem.locationName && (
              <InfoItem>
                <Label>Local</Label>
                <Value>{problem.locationName}</Value>
              </InfoItem>
            )}

            {problem.categoryName && (
              <InfoItem>
                <Label>Categoria</Label>
                <Value>{problem.categoryName}</Value>
              </InfoItem>
            )}

            {problem.description && (
              <InfoItem>
                <Label>Descrição</Label>
                <DescriptionValue>{problem.description}</DescriptionValue>
              </InfoItem>
            )}

            {problem.createdAt && (
              <InfoItem>
                <Label>Cadastrado em</Label>
                <Value>{formatDate(problem.createdAt)}</Value>
              </InfoItem>
            )}

            {problem.deletedAt && (
              <InfoItem>
                <Label>Movido para lixeira em</Label>
                <Value>{formatDate(problem.deletedAt)}</Value>
              </InfoItem>
            )}
          </InfoGroup>
      </TrashItemModal>

      <ConfirmationModal
        isOpen={showDeleteConfirmationModal}
        onClose={() => setShowDeleteConfirmationModal(false)}
        onConfirm={handlePermanentDelete}
        title="Excluir problema permanentemente?"
        message="Este problema será removido de forma definitiva e não poderá ser recuperado depois."
        confirmText="Excluir permanentemente"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  )
}
