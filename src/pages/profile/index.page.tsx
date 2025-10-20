import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { User, LockKey, Trash, FloppyDisk } from 'phosphor-react'
import {
  MainContainer,
  HeaderContainer,
  PageTitle,
  PageSubtitle,
  SectionsContainer,
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  Form,
  FormGroup,
  FormRow,
  Label,
  Input,
  ButtonsContainer,
  Button,
  ErrorMessage,
  DangerZone,
  DangerText,
  InfoBox,
  InfoText,
} from './styles'
import PlatformLayout from '@/app/platform/layout'
import { ConfirmationModal } from '@/components/confirmation-modal'
import { useAuth } from '@/contexts/auth-context'

export default function ProfilePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, isProfileLoading: isLoading, retryProfileLoad, signOut } = useAuth()

  // Profile form state
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [hasProfileChanges, setHasProfileChanges] = useState(false)

  // Password form state
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Modals state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showProfileDiscardConfirmation, setShowProfileDiscardConfirmation] =
    useState(false)

  // Set initial form values when profile loads
  useEffect(() => {
    if (user) {
      setName(user.name)
      setPosition(user.position)
    }
  }, [user])

  // Check for profile changes
  useEffect(() => {
    if (user) {
      const changed =
        name !== user.name || position !== user.position
      setHasProfileChanges(changed)
    }
  }, [name, position, user])

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; position: string }) => {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.id,
          name: data.name,
          position: data.position,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao atualizar perfil')
      }

      return response.json()
    },
    onSuccess: async () => {
      await retryProfileLoad()
      setHasProfileChanges(false)
      toast.success('Perfil atualizado com sucesso')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao atualizar perfil')
    },
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      const response = await fetch('/api/profile/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.id,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao alterar senha')
      }

      return response.json()
    },
    onSuccess: () => {
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordError('')
      toast.success('Senha alterada com sucesso')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao alterar senha')
    },
  })

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao excluir conta')
      }

      return response.json()
    },
    onSuccess: async () => {
      toast.success('Conta excluída com sucesso')
      // Wait a bit for the toast to be visible, then sign out
      setTimeout(async () => {
        await signOut()
      }, 1500)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao excluir conta')
    },
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !position.trim()) {
      toast.error('Nome e cargo são obrigatórios')
      return
    }

    updateProfileMutation.mutate({ name: name.trim(), position: position.trim() })
  }

  const handleProfileReset = () => {
    if (hasProfileChanges) {
      setShowProfileDiscardConfirmation(true)
    }
  }

  const confirmProfileDiscard = () => {
    if (user) {
      setName(user.name)
      setPosition(user.position)
      setHasProfileChanges(false)
      setShowProfileDiscardConfirmation(false)
      toast.info('Alterações descartadas')
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('Todos os campos são obrigatórios')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter no mínimo 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem')
      return
    }

    if (oldPassword === newPassword) {
      setPasswordError('A nova senha deve ser diferente da senha atual')
      return
    }

    changePasswordMutation.mutate({ oldPassword, newPassword })
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true)
  }

  const confirmDeleteAccount = () => {
    deleteAccountMutation.mutate()
  }

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      ADMIN: 'Administrador',
      DIRECTOR: 'Diretor',
      MANAGER: 'Gerente',
      REPORTER: 'Relator',
    }
    return roleMap[role] || role
  }

  if (isLoading || !user) {
    return (
      <PlatformLayout>
        <MainContainer>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Carregando perfil...
          </div>
        </MainContainer>
      </PlatformLayout>
    )
  }

  return (
    <PlatformLayout>
      <MainContainer>
        <HeaderContainer>
          <PageTitle>Meu Perfil</PageTitle>
          <PageSubtitle>
            Gerencie suas informações pessoais e configurações de conta
          </PageSubtitle>
        </HeaderContainer>

        <SectionsContainer>
          {/* Profile Information Section */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <User size={20} weight="bold" style={{ display: 'inline', marginRight: '0.5rem' }} />
                Informações do Perfil
              </SectionTitle>
              <SectionDescription>
                Atualize suas informações pessoais e profissionais
              </SectionDescription>
            </SectionHeader>

            <Form onSubmit={handleProfileSubmit}>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu nome completo"
                    disabled={updateProfileMutation.isPending}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Digite seu cargo"
                    disabled={updateProfileMutation.isPending}
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  title="O e-mail não pode ser alterado"
                />
              </FormGroup>

              <ButtonsContainer>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleProfileReset}
                  disabled={!hasProfileChanges || updateProfileMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!hasProfileChanges || updateProfileMutation.isPending}
                >
                  <FloppyDisk size={18} weight="bold" />
                  {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </ButtonsContainer>
            </Form>
          </Section>

          {/* Change Password Section */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <LockKey size={20} weight="bold" style={{ display: 'inline', marginRight: '0.5rem' }} />
                Alterar Senha
              </SectionTitle>
              <SectionDescription>
                Atualize sua senha para manter sua conta segura
              </SectionDescription>
            </SectionHeader>

            <InfoBox>
              <InfoText>
                Sua senha deve ter no mínimo 6 caracteres. Recomendamos usar uma combinação de letras, números e caracteres especiais.
              </InfoText>
            </InfoBox>

            <Form onSubmit={handlePasswordSubmit}>
              <FormGroup>
                <Label htmlFor="oldPassword">Senha atual</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  disabled={changePasswordMutation.isPending}
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite sua nova senha"
                    disabled={changePasswordMutation.isPending}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua nova senha"
                    disabled={changePasswordMutation.isPending}
                  />
                </FormGroup>
              </FormRow>

              {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}

              <ButtonsContainer>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setOldPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setPasswordError('')
                  }}
                  disabled={changePasswordMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={changePasswordMutation.isPending}
                >
                  <LockKey size={18} weight="bold" />
                  {changePasswordMutation.isPending ? 'Alterando...' : 'Alterar senha'}
                </Button>
              </ButtonsContainer>
            </Form>
          </Section>

          {/* Delete Account Section */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <Trash size={20} weight="bold" style={{ display: 'inline', marginRight: '0.5rem' }} />
                Zona de Perigo
              </SectionTitle>
              <SectionDescription>
                Ações irreversíveis relacionadas à sua conta
              </SectionDescription>
            </SectionHeader>

            <DangerZone>
              <DangerText>
                <strong>Atenção:</strong> Ao excluir sua conta, todos os seus dados serão permanentemente removidos do sistema. Esta ação não pode ser desfeita. Você perderá acesso a todos os problemas reportados e histórico de atividades.
              </DangerText>
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                disabled={deleteAccountMutation.isPending}
              >
                <Trash size={18} weight="bold" />
                {deleteAccountMutation.isPending ? 'Excluindo...' : 'Excluir minha conta'}
              </Button>
            </DangerZone>
          </Section>
        </SectionsContainer>
      </MainContainer>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showProfileDiscardConfirmation}
        onClose={() => setShowProfileDiscardConfirmation(false)}
        onConfirm={confirmProfileDiscard}
        title="Descartar alterações?"
        message="Se você cancelar agora, todas as suas alterações não salvas serão perdidas."
        confirmText="Continuar editando"
        cancelText="Descartar"
      />

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDeleteAccount}
        title="Excluir conta permanentemente?"
        message="Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos do sistema e você não poderá mais acessar sua conta."
        confirmText="Cancelar"
        cancelText="Excluir permanentemente"
      />
    </PlatformLayout>
  )
}
