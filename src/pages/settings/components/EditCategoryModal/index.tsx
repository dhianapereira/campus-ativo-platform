import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
import { useMutation } from '@tanstack/react-query'

const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryItem {
  id: string
  name: string
  description: string
  isActive?: boolean
}

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActive, setIsActive] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  })

  useEffect(() => {
    if (category) {
      setValue('name', category.name)
      setValue('description', category.description)
      setIsActive(category.isActive ?? true)
    }
  }, [category, setValue])

  const updateCategoryMutation = useMutation({
    mutationFn: async (payload: CategoryFormData & { isActive: boolean }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, received: !!payload })
        }, 1000)
      })
    },
    onSuccess: () => {
      setIsSubmitting(false)
      reset()
      onSuccess()
    },
    onError: () => {
      setIsSubmitting(false)
    },
  })

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)
    updateCategoryMutation.mutate({ ...data, isActive })
  }

  const handleClose = () => {
    if (!isSubmitting) {
      reset()
      onClose()
    }
  }

  const handleDelete = () => {
    alert(
      'Funcionalidade de exclusão será implementada quando a API estiver pronta!',
    )
  }

  if (!isOpen || !category) return null

  return (
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
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
              <Trash size={20} />
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
  )
}
