import { useState } from 'react'
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form'
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
import { X, Trash } from 'phosphor-react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { LocationResponse } from '../../../../lib/api/generated/models/locationResponse'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { invalidateTrashQueries } from '@/pages/trash/trash-cache'

const locationSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório.')
    .max(100, 'Nome deve ter no máximo 100 caracteres.'),
  code: z
    .string()
    .max(20, 'Número deve ter no máximo 20 caracteres.')
    .optional(),
  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres.')
    .optional(),
})

type LocationFormData = z.infer<typeof locationSchema>

type LocationItem = LocationResponse

interface EditLocationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  location: LocationItem | null
}

export function EditLocationModal({
  isOpen,
  onClose,
  onSuccess,
  location,
}: EditLocationModalProps) {
  if (!isOpen || !location) return null

  return (
    <EditLocationModalContent
      key={`${location.id}:${location.updatedAt ?? ''}:${location.deletedAt ?? ''}`}
      location={location}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  )
}

function EditLocationModalContent({
  location,
  onClose,
  onSuccess,
}: {
  location: LocationItem
  onClose: () => void
  onSuccess: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActive, setIsActive] = useState(location.isActive ?? true)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showTrashConfirmationModal, setShowTrashConfirmationModal] =
    useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: location.name,
      code: location.code ?? '',
      description: location.description ?? '',
    },
  })

  const watchedFields = useWatch({ control })
  const hasUnsavedChanges =
    watchedFields.name !== location.name ||
    watchedFields.code !== (location.code ?? '') ||
    watchedFields.description !== (location.description ?? '') ||
    isActive !== (location.isActive ?? true)

  const updateLocationMutation = useMutation({
    mutationFn: async (data: LocationFormData) => {
      if (!location?.id) throw new Error('ID da localização não encontrado')

      const response = await fetch(`/api/locations/${location.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: data.name,
          code: data.code === undefined ? undefined : data.code.trim(),
          description:
            data.description === undefined
              ? undefined
              : data.description.trim(),
          isActive,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao atualizar localização.')
      }

      return response.json()
    },
    onSuccess: () => {
      setIsSubmitting(false)
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      onSuccess()
      toast.success('Localização atualizada com sucesso.')
    },
    onError: () => {
      setIsSubmitting(false)
      toast.error('Falha ao atualizar localização.')
    },
  })

  const onSubmit: SubmitHandler<LocationFormData> = async (data) => {
    if (!location?.id) return

    setIsSubmitting(true)
    updateLocationMutation.mutate(data)
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

  const trashLocationMutation = useMutation({
    mutationFn: async () => {
      if (!location?.id) throw new Error('ID da localização não encontrado')

      const response = await fetch(`/api/locations/${location.id}/trash`, {
        method: 'PATCH',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || 'Falha ao mover localização para a lixeira.',
        )
      }

      return response.json()
    },
    onSuccess: async () => {
      await invalidateTrashQueries(queryClient)
      await queryClient.invalidateQueries({
        queryKey: ['locations'],
        refetchType: 'all',
      })
      toast.success('Localização movida para a lixeira.')
      onSuccess()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao mover para a lixeira.')
    },
  })

  const handleDelete = () => {
    setShowTrashConfirmationModal(true)
  }

  const confirmTrash = () => {
    trashLocationMutation.mutate()
    setShowTrashConfirmationModal(false)
  }
  const isDisabled = isSubmitting

  return (
    <>
      <ModalOverlay onClick={handleClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Localização</ModalTitle>
            <ModalCloseButton onClick={handleClose} disabled={isSubmitting}>
              <X size={24} />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormField>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" {...register('name')} disabled={isDisabled} />
                {errors.name && (
                  <ErrorMessage>{errors.name.message}</ErrorMessage>
                )}
              </FormField>

              <div className="form-row">
                <FormField className="code-field">
                  <Label htmlFor="code">Número</Label>
                  <Input
                    id="code"
                    {...register('code')}
                    disabled={isDisabled}
                  />
                  {errors.code && (
                    <ErrorMessage>{errors.code.message}</ErrorMessage>
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
              <DeleteButton onClick={handleDelete} disabled={isSubmitting}>
                <Trash size={20} weight="bold" />
                <span className="label">Mover para lixeira</span>
              </DeleteButton>
              <div className="action-buttons">
                <CancelButton onClick={handleClose} disabled={isSubmitting}>
                  Cancelar
                </CancelButton>
                <SaveButton
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </SaveButton>
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
        message="Esta localização será movida para a lixeira. Você poderá restaurá-la depois se necessário."
        confirmText="Mover para lixeira"
        cancelText="Cancelar"
      />
    </>
  )
}
