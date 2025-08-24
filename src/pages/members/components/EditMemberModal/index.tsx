import { useEffect, useState } from 'react'
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
  ErrorMessage,
  ButtonGroup,
  CancelButton,
  SubmitButton,
  SelectContainer,
  Select,
  StatusContainer,
  StatusLabel,
  StatusToggle,
  StatusIndicator,
  BottomFieldsContainer,
} from './styles'
import { X } from 'phosphor-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  FetchUsersControllerHandle200UsersItem,
  ChangeUserRoleControllerHandleBodyRole,
} from '../../../../../server/client/models'

const memberSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ser válido'),
  position: z
    .string()
    .min(1, 'Cargo é obrigatório')
    .max(100, 'Cargo deve ter no máximo 100 caracteres'),
  permissions: z.string(),
})

type MemberFormData = z.infer<typeof memberSchema>

interface EditMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  member: FetchUsersControllerHandle200UsersItem | null
}

const permissionOptions = [
  { value: 'REPORTER', label: 'Usuário' },
  { value: 'MANAGER', label: 'Gerente' },
  { value: 'DIRECTOR', label: 'Diretor' },
  { value: 'ADMIN', label: 'Administrador' },
]

export function EditMemberModal({
  isOpen,
  onClose,
  onSuccess,
  member,
}: EditMemberModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  })

  // Sync form with the selected member whenever the modal opens or member changes
  useEffect(() => {
    if (isOpen && member) {
      reset({
        name: member.name || '',
        email: member.email || '',
        position: member.position || '',
        permissions: (member.role as string) || 'REPORTER',
      })
    }
  }, [isOpen, member, reset])

  const onSubmit = async (data: MemberFormData) => {
    setIsSubmitting(true)

    try {
      const roleChanged =
        (data.permissions as string) !== (member?.role as string)
      const otherChanged =
        (data.name || '') !== (member?.name || '') ||
        (data.email || '') !== (member?.email || '') ||
        (data.position || '') !== (member?.position || '')

      if (otherChanged && !roleChanged) {
        // Backend does not expose an endpoint to edit name/email/position in the current OpenAPI
        toast.info('Edição de nome, e-mail e cargo ainda não é suportada.')
        setIsSubmitting(false)
        return
      }

      if (member?.id && data.permissions && roleChanged) {
        const response = await fetch(`/api/users/${member.id}/role`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            role: data.permissions as ChangeUserRoleControllerHandleBodyRole,
          }),
        })

        if (!response.ok) {
          // Try to extract backend error message
          let message = 'Falha ao atualizar a permissão do usuário.'
          try {
            const payload = await response.json()
            if (payload?.message) message = payload.message
          } catch {}
          throw new Error(message)
        }

        await queryClient.invalidateQueries({ queryKey: ['users'] })
      }

      setIsSubmitting(false)
      reset()
      onSuccess()
      if (roleChanged) {
        toast.success('Permissão atualizada com sucesso.')
      }
      if (otherChanged) {
        toast.warning('Alterações de nome/e-mail/cargo não foram salvas.')
      }
    } catch (error) {
      setIsSubmitting(false)
      toast.error('Falha ao atualizar a permissão do usuário.')
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      reset()
      onClose()
    }
  }

  if (!isOpen || !member) return null

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Membro</ModalTitle>
          <ModalCloseButton onClick={handleClose} disabled={isSubmitting}>
            <X size={20} />
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
                  isActive={isActive}
                  onClick={() => setIsActive(!isActive)}
                  disabled={isSubmitting}
                >
                  <StatusIndicator isActive={isActive} />
                </StatusToggle>
              </StatusContainer>
            </div>

            <FormField>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                disabled={isSubmitting}
              />
              {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
            </FormField>

            <FormField>
              <Label htmlFor="position">Cargo</Label>
              <Input
                id="position"
                {...register('position')}
                disabled={isSubmitting}
              />
              {errors.position && (
                <ErrorMessage>{errors.position.message}</ErrorMessage>
              )}
            </FormField>

            <BottomFieldsContainer>
              <FormField>
                <Label htmlFor="permissions">Permissões</Label>
                <SelectContainer>
                  <Select
                    id="permissions"
                    {...register('permissions')}
                    disabled={isSubmitting}
                  >
                    {permissionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </SelectContainer>
                {errors.permissions && (
                  <ErrorMessage>{errors.permissions.message}</ErrorMessage>
                )}
              </FormField>
            </BottomFieldsContainer>
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
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </SubmitButton>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  )
}
