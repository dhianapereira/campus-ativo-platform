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
import type { CategoryResponse } from '@/lib/api/generated/models/categoryResponse'
import {
  invalidateTrashQueries,
  removeTrashDetailsFromCache,
} from '../../trash-cache'

interface ViewCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  category: CategoryResponse | null
}

export function ViewCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  category,
}: ViewCategoryModalProps) {
  const queryClient = useQueryClient()
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false)

  const restoreCategoryMutation = useMutation({
    mutationFn: async () => {
      if (!category?.id) throw new Error('ID da categoria não encontrado')

      const response = await fetch('/api/trash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'restore',
          ids: [category.id],
          type: 'category',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao restaurar categoria.')
      }

      return response.json()
    },
    onSuccess: async () => {
      if (!category?.id) return

      await queryClient.invalidateQueries({
        queryKey: ['categories'],
        refetchType: 'all',
      })
      removeTrashDetailsFromCache(queryClient, [
        { id: category.id, itemType: 'category' },
      ])
      await invalidateTrashQueries(queryClient)
      toast.success('Categoria restaurada com sucesso.')
      onSuccess()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao restaurar categoria.')
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: async () => {
      if (!category?.id) throw new Error('ID da categoria não encontrado')

      const response = await fetch('/api/trash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'delete',
          ids: [category.id],
          type: 'category',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao excluir categoria.')
      }

      return response.json()
    },
    onSuccess: async () => {
      if (!category?.id) return

      await queryClient.invalidateQueries({
        queryKey: ['categories'],
        refetchType: 'all',
      })
      removeTrashDetailsFromCache(queryClient, [
        { id: category.id, itemType: 'category' },
      ])
      await invalidateTrashQueries(queryClient)
      toast.success('Categoria excluída permanentemente.')
      onSuccess()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao excluir categoria.')
    },
  })

  const formatDate = (dateValue?: unknown) => {
    const dateString =
      typeof dateValue === 'string'
        ? dateValue
        : dateValue && typeof dateValue === 'object'
          ? Object.values(dateValue as Record<string, unknown>).find(
              (value): value is string =>
                typeof value === 'string' && value.trim() !== '',
            )
          : undefined

    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  if (!category) return null

  return (
    <>
      <TrashItemModal
        isOpen={isOpen}
        onClose={onClose}
        title="Categoria"
        actions={
          <div className="action-buttons">
            <DeleteButton
              onClick={() => setShowDeleteConfirmationModal(true)}
              disabled={deleteCategoryMutation.isPending}
            >
              <Trash size={20} weight="bold" />
              {deleteCategoryMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </DeleteButton>
            <RestoreButton
              onClick={() => restoreCategoryMutation.mutate()}
              disabled={restoreCategoryMutation.isPending}
            >
              <ArrowCounterClockwise size={20} weight="bold" />
              {restoreCategoryMutation.isPending
                ? 'Restaurando...'
                : 'Restaurar'}
            </RestoreButton>
          </div>
        }
      >
        <InfoGroup>
          <InfoItem>
            <Label>Nome</Label>
            <Value>{category.name}</Value>
          </InfoItem>

          <InfoItem>
            <Label>Status</Label>
            <Value>{category.isActive ? 'Ativa' : 'Inativa'}</Value>
          </InfoItem>

          <InfoItem>
            <Label>Descrição</Label>
            <DescriptionValue>{category.description || '-'}</DescriptionValue>
          </InfoItem>

          <InfoItem>
            <Label>Cadastrada em</Label>
            <Value>{formatDate(category.createdAt)}</Value>
          </InfoItem>

          <InfoItem>
            <Label>Movida para lixeira em</Label>
            <Value>{formatDate(category.deletedAt)}</Value>
          </InfoItem>
        </InfoGroup>
      </TrashItemModal>

      <ConfirmationModal
        isOpen={showDeleteConfirmationModal}
        onClose={() => setShowDeleteConfirmationModal(false)}
        onConfirm={() => deleteCategoryMutation.mutate()}
        title="Excluir categoria permanentemente?"
        message="Esta categoria será removida de forma definitiva e não poderá ser recuperada depois."
        confirmText="Excluir permanentemente"
        cancelText="Cancelar"
        closeOnConfirm
        variant="danger"
      />
    </>
  )
}
