import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Form,
  FormField,
  Label,
  Input,
  TextArea,
  ErrorMessage,
  ButtonGroup,
  DeleteButton,
  CancelButton,
  SaveButton,
  StatusContainer,
  StatusLabel,
  StatusToggle,
} from './styles'
import { X, Trash, ArrowCounterClockwise } from 'phosphor-react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CategoryResponse } from '../../../../lib/api/generated/models/categoryResponse'
import { ConfirmationModal } from '@/components/ConfirmationModal'

const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

type CategoryItem = CategoryResponse

interface EditCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  category: CategoryItem | null
}

export function EditCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  category,
}: EditCategoryModalProps) {
  if (!isOpen || !category) return null

  return (
    <EditCategoryModalContent
      key={`${category.id}:${category.updatedAt ?? ''}:${category.deletedAt ?? ''}`}
      category={category}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  )
}

function EditCategoryModalContent({
  category,
  onClose,
  onSuccess,
}: {
  category: CategoryItem
  onClose: () => void
  onSuccess: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActive, setIsActive] = useState(category.isActive ?? true)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showTrashConfirmationModal, setShowTrashConfirmationModal] =
    useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      description: category.description ?? '',
    },
  })

  const watchedFields = useWatch({ control })
  const hasUnsavedChanges =
    watchedFields.name !== category.name ||
    watchedFields.description !== (category.description ?? '') ||
    isActive !== (category.isActive ?? true)

  const updateCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      if (!category?.id) throw new Error('ID da categoria não encontrado')

      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: data.name,
          description:
            data.description === undefined
              ? undefined
              : data.description.trim(),
          isActive,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao atualizar categoria')
      }

      return response.json()
    },
    onSuccess: () => {
      setIsSubmitting(false)
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onSuccess()
      toast.success('Categoria atualizada com sucesso.')
    },
    onError: () => {
      setIsSubmitting(false)
      toast.error('Falha ao atualizar categoria.')
    },
  })

  const onSubmit = async (data: CategoryFormData) => {
    if (!category?.id) return

    setIsSubmitting(true)
    updateCategoryMutation.mutate(data)
  }

  const handleClose = () => {
    if (isSubmitting) return

    if (hasUnsavedChanges) {
      setShowConfirmationModal(true)
    } else {
      onClose()
    }
  }

  const handleConfirmClose = () => {
    setShowConfirmationModal(false)
    onClose()
  }

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
        throw new Error(errorData.message || 'Falha ao restaurar categoria')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      toast.success('Categoria restaurada com sucesso')
      onSuccess()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao restaurar categoria')
    },
  })

  const trashCategoryMutation = useMutation({
    mutationFn: async () => {
      if (!category?.id) throw new Error('ID da categoria não encontrado')

      const response = await fetch(`/api/categories/${category.id}/trash`, {
        method: 'PATCH',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || 'Falha ao mover categoria para lixeira',
        )
      }

      return response.json()
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['categories'],
          refetchType: 'all',
        }),
        queryClient.invalidateQueries({
          queryKey: ['trash'],
          refetchType: 'all',
        }),
      ])
      toast.success('Categoria movida para lixeira')
      onSuccess()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao mover para lixeira')
    },
  })

  const handleDelete = () => {
    setShowTrashConfirmationModal(true)
  }

  const confirmTrash = () => {
    trashCategoryMutation.mutate()
    setShowTrashConfirmationModal(false)
  }

  const handleRestore = () => {
    restoreCategoryMutation.mutate()
  }

  const isDeleted = !!category?.deletedAt
  const isDisabled = isSubmitting || isDeleted

  return (
    <>
      <ModalOverlay onClick={handleClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Categoria</ModalTitle>
            <ModalCloseButton onClick={handleClose} disabled={isSubmitting}>
              <X size={24} />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-row">
                <FormField className="name-field">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    disabled={isDisabled}
                  />
                  {errors.name && (
                    <ErrorMessage>{errors.name.message}</ErrorMessage>
                  )}
                </FormField>
                <StatusContainer>
                  <StatusLabel>Status</StatusLabel>
                  <StatusToggle
                    type="button"
                    isActive={isActive}
                    onClick={() => setIsActive(!isActive)}
                    disabled={isDisabled}
                  >
                    <div />
                  </StatusToggle>
                </StatusContainer>
              </div>

              <FormField>
                <Label htmlFor="description">Descrição</Label>
                <TextArea
                  id="description"
                  {...register('description')}
                  rows={6}
                  disabled={isDisabled}
                />
                {errors.description && (
                  <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
              </FormField>
            </Form>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup>
              {isDeleted ? (
                <DeleteButton
                  variant="primary"
                  onClick={handleRestore}
                  disabled={isSubmitting || restoreCategoryMutation.isPending}
                >
                  <ArrowCounterClockwise size={20} weight="bold" />
                  <span className="label">
                    {restoreCategoryMutation.isPending
                      ? 'Restaurando...'
                      : 'Restaurar da lixeira'}
                  </span>
                </DeleteButton>
              ) : (
                <DeleteButton onClick={handleDelete} disabled={isSubmitting}>
                  <Trash size={20} weight="bold" />
                  <span className="label">Mover para lixeira</span>
                </DeleteButton>
              )}
              <div className="action-buttons">
                <CancelButton onClick={handleClose} disabled={isSubmitting}>
                  Cancelar
                </CancelButton>
                {!isDeleted && (
                  <SaveButton
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                  </SaveButton>
                )}
              </div>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleConfirmClose}
        onConfirm={() => setShowConfirmationModal(false)}
        title="Descartar alterações?"
        message="Se você sair agora, todas as suas alterações não salvas serão perdidas."
        confirmText="Continuar editando"
        cancelText="Descartar"
      />

      <ConfirmationModal
        isOpen={showTrashConfirmationModal}
        onClose={() => setShowTrashConfirmationModal(false)}
        onConfirm={confirmTrash}
        title="Mover para lixeira?"
        message="Esta categoria será movida para a lixeira. Você poderá restaurá-la depois se necessário."
        confirmText="Mover para lixeira"
        cancelText="Cancelar"
      />
    </>
  )
}
