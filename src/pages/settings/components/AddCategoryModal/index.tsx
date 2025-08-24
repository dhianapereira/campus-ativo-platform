import { useState } from 'react'
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
  CancelButton,
  SubmitButton,
} from './styles'
import { X } from 'phosphor-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: AddCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  })

  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(
          `Falha ao criar categoria: ${response.status} ${response.statusText} ${text}`,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      setIsSubmitting(false)
      reset()
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onSuccess()
      toast.success('Categoria criada com sucesso.')
    },
    onError: (error) => {
      console.error('Failed to create category:', error)
      setIsSubmitting(false)
      toast.error('Falha ao criar categoria.')
    },
  })

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)
    createCategoryMutation.mutate(data)
  }

  const handleClose = () => {
    if (!isSubmitting) {
      reset()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Adicionar categoria</ModalTitle>
          <ModalCloseButton onClick={handleClose} disabled={isSubmitting}>
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormField>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Insira o nome do local..."
                disabled={isSubmitting}
              />
              {errors.name && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </FormField>

            <FormField>
              <Label htmlFor="description">Descrição</Label>
              <TextArea
                id="description"
                {...register('description')}
                placeholder="Detalhe o local brevemente..."
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
            <CancelButton onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </CancelButton>
            <SubmitButton
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adicionando...' : 'Adicionar'}
            </SubmitButton>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  )
}
