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

const locationSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  code: z
    .string()
    .max(20, 'Número deve ter no máximo 20 caracteres')
    .optional(),
  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
})

type LocationFormData = z.infer<typeof locationSchema>

interface LocationItem {
  id: string
  name: string
  code: string
  description: string
  isActive?: boolean
}

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActive, setIsActive] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
  })

  useEffect(() => {
    if (location) {
      setValue('name', location.name)
      setValue('code', location.code)
      setValue('description', location.description)
      setIsActive(location.isActive ?? true)
    }
  }, [location, setValue])

  const updateLocationMutation = useMutation({
    mutationFn: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true })
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

  const onSubmit = async () => {
    setIsSubmitting(true)
    updateLocationMutation.mutate()
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

  if (!isOpen || !location) return null

  return (
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
              <Input id="name" {...register('name')} disabled={isSubmitting} />
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
                  disabled={isSubmitting}
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
