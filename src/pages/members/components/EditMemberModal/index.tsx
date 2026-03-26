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
import { useAuthPermissions, useAuthSession } from '@/contexts/auth-context'
import { useInvalidateUser } from '@/hooks/use-invalidate-user'
import type {
  FetchUsersControllerHandle200UsersItem,
  ChangeUserRoleControllerHandleBodyRole,
} from '../../../../lib/api/generated/models'
import { ConfirmationModal } from '@/components/ConfirmationModal'

const memberSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório.')
    .max(100, 'Nome deve ter no máximo 100 caracteres.'),
  email: z
    .string()
    .min(1, 'Email é obrigatório.')
    .email('Email deve ser válido.'),
  position: z
    .string()
    .min(1, 'Cargo é obrigatório.')
    .max(100, 'Cargo deve ter no máximo 100 caracteres.'),
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
  { value: 'REPORTER', label: 'Relator' },
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
  const { user } = useAuthSession()
  const { canManageUserRole } = useAuthPermissions()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [initialPermission, setInitialPermission] = useState<string>('')
  const [initialStatus, setInitialStatus] = useState<boolean>(true)
  const queryClient = useQueryClient()
  const { invalidateUser } = useInvalidateUser()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  })

  const watchedFields = watch()

  useEffect(() => {
    if (isOpen && member) {
      const memberRole = (member.role as string) || 'REPORTER'
      const memberStatus = member.isActive ?? true

      reset({
        name: member.name || '',
        email: member.email || '',
        position: member.position || '',
        permissions: memberRole,
      })

      setInitialPermission(memberRole)
      setInitialStatus(memberStatus)
      setIsActive(memberStatus)
    }
  }, [isOpen, member, reset])

  useEffect(() => {
    if (!member) {
      setHasUnsavedChanges(false)
      return
    }

    const permissionChanged = watchedFields.permissions !== initialPermission
    const statusChanged = isActive !== initialStatus

    setHasUnsavedChanges(permissionChanged || statusChanged)
  }, [
    watchedFields.permissions,
    isActive,
    initialPermission,
    initialStatus,
    member,
  ])

  const onSubmit = async (data: MemberFormData) => {
    if (!member?.id) return

    setIsSubmitting(true)

    try {
      const roleChanged = data.permissions !== initialPermission
      const statusChanged = isActive !== initialStatus

      const updates: Promise<Response>[] = []

      if (roleChanged) {
        updates.push(
          fetch(`/api/users/${member.id}/role`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              role: data.permissions as ChangeUserRoleControllerHandleBodyRole,
            }),
          }),
        )
      }

      if (statusChanged) {
        updates.push(
          fetch(`/api/users/${member.id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              isActive,
            }),
          }),
        )
      }

      if (updates.length === 0) {
        setIsSubmitting(false)
        toast.info('Nenhuma alteração foi realizada.')
        return
      }

      const responses = await Promise.all(updates)

      const allSuccessful = responses.every((response) => response.ok)

      if (!allSuccessful) {
        const firstError = responses.find((response) => !response.ok)
        if (firstError) {
          const errorData = await firstError.json().catch(() => ({}))
          throw new Error(errorData.message || 'Falha ao atualizar usuário.')
        }
      }

      await queryClient.invalidateQueries({ queryKey: ['users'] })

      if (roleChanged && member?.id === user?.id) {
        await invalidateUser()
      }

      setIsSubmitting(false)
      setHasUnsavedChanges(false)
      reset()
      onSuccess()

      if (roleChanged && statusChanged) {
        toast.success('Permissão e status atualizados com sucesso.')
      } else if (roleChanged) {
        toast.success('Permissão atualizada com sucesso.')
      } else {
        toast.success('Status atualizado com sucesso.')
      }
    } catch (error) {
      setIsSubmitting(false)
      const errorMessage =
        error instanceof Error ? error.message : 'Falha ao atualizar usuário.'
      toast.error(errorMessage)
    }
  }

  const handleClose = () => {
    if (isSubmitting) return

    if (hasUnsavedChanges) {
      setShowConfirmationModal(true)
    } else {
      reset()
      setHasUnsavedChanges(false)
      onClose()
    }
  }

  const handleConfirmClose = () => {
    reset()
    setHasUnsavedChanges(false)
    setShowConfirmationModal(false)
    onClose()
  }

  if (!isOpen || !member) return null

  const isSelf = user?.id && member?.id && user.id === member.id
  const visiblePermissionOptions = permissionOptions.filter((opt) =>
    canManageUserRole(opt.value as ChangeUserRoleControllerHandleBodyRole),
  )

  // Keep the saved role visible even when the acting user can no longer assign
  // it, so the form can display the current state without mutating it first.
  const finalPermissionOptions = (() => {
    if (!member?.role) return visiblePermissionOptions

    const hasCurrentRole = visiblePermissionOptions.some(
      (opt) => opt.value === member.role,
    )

    if (hasCurrentRole) {
      return visiblePermissionOptions
    }

    const currentRoleOption = permissionOptions.find(
      (opt) => opt.value === member.role,
    )
    if (currentRoleOption) {
      return [...visiblePermissionOptions, currentRoleOption]
    }

    return visiblePermissionOptions
  })()

  return (
    <>
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
                  <Input id="name" {...register('name')} disabled={true} />
                  {errors.name && (
                    <ErrorMessage>{errors.name.message}</ErrorMessage>
                  )}
                </FormField>
              </div>

              <FormField>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={true}
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
                  disabled={true}
                />
                {errors.position && (
                  <ErrorMessage>{errors.position.message}</ErrorMessage>
                )}
              </FormField>

              <BottomFieldsContainer>
                <FormField>
                  <Label htmlFor="permissions">Permissão</Label>
                  <SelectContainer>
                    <Select
                      id="permissions"
                      {...register('permissions')}
                      disabled={isSubmitting || !!isSelf}
                    >
                      {finalPermissionOptions.map((option) => (
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

                <StatusContainer>
                  <StatusLabel>Status</StatusLabel>
                  <StatusToggle
                    type="button"
                    isActive={isActive}
                    onClick={() => setIsActive(!isActive)}
                    disabled={isSubmitting || !!isSelf}
                  >
                    <StatusIndicator isActive={isActive} />
                  </StatusToggle>
                </StatusContainer>
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

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleConfirmClose}
        onConfirm={() => setShowConfirmationModal(false)}
        title="Descartar alterações?"
        message="Se você sair agora, todas as suas alterações não salvas serão perdidas."
        confirmText="Continuar editando"
        cancelText="Descartar"
      />
    </>
  )
}
