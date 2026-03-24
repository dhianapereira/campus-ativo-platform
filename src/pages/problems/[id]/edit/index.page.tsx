import { useEffect, useState } from 'react'
import { Container, Body, Header, Input, Title } from './styles'
import { ArrowLeft, X } from 'phosphor-react'
import { Button, Text, TextArea, TextInput } from '@/styles'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  editProblemFormSchema,
  EditProblemFormData,
} from '@/validators/edit-problem-form'
import { useRouter } from 'next/router'
import { ProtectedRoute } from '@/styles/components/routes/ProtectedRoute'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import ImageUpload from '../../components/ImageUpload'

interface AttachmentInfo {
  id: string
  title: string
  url: string
}

interface ProblemData {
  id: string
  title: string
  description: string
  slug: string
  categoryId: string
  locationId?: string | null
  reporterId?: string | null
  status: string
  createdAt: string
  attachments?: AttachmentInfo[]
}

export default function EditProblem() {
  const router = useRouter()
  const { id } = router.query
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const problemDetailsPath =
    typeof id === 'string' ? `/problems/${id}` : '/problems'

  const [problemData, setProblemData] = useState<ProblemData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [permissionError, setPermissionError] = useState<string | null>(null)

  const [currentAttachment, setCurrentAttachment] =
    useState<AttachmentInfo | null>(null)
  const [newAttachmentId, setNewAttachmentId] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [attachmentChanged, setAttachmentChanged] = useState(false)

  useEffect(() => {
    async function fetchProblemData() {
      if (!id || typeof id !== 'string') return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/problems/${id}`, {
          credentials: 'include',
        })

        if (!response.ok) {
          if (response.status === 404) {
            setPermissionError('Problema não encontrado.')
            setHasPermission(false)
          } else {
            setPermissionError('Erro ao carregar o problema.')
            setHasPermission(false)
          }
          setIsLoading(false)
          return
        }

        const data = await response.json()
        const problem = data.problem || data

        setProblemData(problem)

        const isAuthor = user?.id === problem.reporterId
        const canEdit = problem.status === 'TO_ANALYSIS'

        if (!isAuthor) {
          setPermissionError(
            'Você não tem permissão para editar este problema.',
          )
          setHasPermission(false)
        } else if (!canEdit) {
          setPermissionError(
            'Este problema não pode ser editado pois não está mais em análise.',
          )
          setHasPermission(false)
        } else {
          setHasPermission(true)
        }
      } catch (error) {
        console.error('Erro ao carregar problema:', error)
        setPermissionError('Erro ao carregar o problema.')
        setHasPermission(false)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchProblemData()
    }
  }, [id, user])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditProblemFormData>({
    resolver: zodResolver(editProblemFormSchema),
  })

  const title = watch('title')
  const description = watch('description')

  const isFormValid =
    title && description && title.trim() !== '' && description.trim() !== ''

  useEffect(() => {
    if (problemData && hasPermission) {
      reset({
        title: problemData.title,
        description: problemData.description,
      })
      if (problemData.attachments && problemData.attachments.length > 0) {
        setCurrentAttachment(problemData.attachments[0])
      }
    }
  }, [problemData, hasPermission, reset])

  const handleImageSelect = async (file: File | null) => {
    setUploadError(null)

    if (!file) {
      setNewAttachmentId(null)
      setAttachmentChanged(true)
      return
    }

    setIsUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/attachments', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao fazer upload da imagem')
      }

      const data = await response.json()
      setNewAttachmentId(data.attachmentId)
      setAttachmentChanged(true)
      toast.success('Imagem enviada com sucesso!')
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Falha ao fazer upload da imagem'
      setUploadError(errorMessage)
      toast.error(errorMessage)
      setNewAttachmentId(null)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleRemoveCurrentImage = () => {
    setCurrentAttachment(null)
    setNewAttachmentId(null)
    setAttachmentChanged(true)
  }

  const editProblemMutation = useMutation({
    mutationFn: async (data: EditProblemFormData) => {
      if (!problemData?.id) throw new Error('ID do problema não encontrado')

      const requestBody: {
        title: string
        description: string
        attachmentIds?: string[]
      } = {
        title: data.title.trim(),
        description: data.description.trim(),
      }

      if (attachmentChanged) {
        if (newAttachmentId) {
          requestBody.attachmentIds = [newAttachmentId]
        } else if (!currentAttachment) {
          requestBody.attachmentIds = []
        }
      }

      const response = await fetch(`/api/problems/${problemData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        if (response.status === 403) {
          throw new Error('Você não tem permissão para editar este problema.')
        }
        if (response.status === 400) {
          throw new Error(
            errorData.message ||
              'Não foi possível editar o problema. Verifique se ele ainda está em análise.',
          )
        }

        throw new Error(errorData.message || 'Falha ao editar problema')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] })
      toast.success('Problema editado com sucesso!')
      router.push('/problems')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao editar problema')
    },
  })

  async function handleEditProblem(data: EditProblemFormData) {
    editProblemMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Container>
          <Header>
            <ArrowLeft
              className="back-icon"
              onClick={() => router.push(problemDetailsPath)}
              weight="bold"
              size={24}
              aria-label="Voltar para a página anterior"
              tabIndex={0}
              role="button"
            />
            <Title as="h2" size="md">
              Editar problema
            </Title>
          </Header>
          <Body as="div">
            <Text size="md" css={{ textAlign: 'center', padding: '2rem' }}>
              Carregando...
            </Text>
          </Body>
        </Container>
      </ProtectedRoute>
    )
  }

  if (hasPermission === false) {
    return (
      <ProtectedRoute>
        <Container>
          <Header>
            <ArrowLeft
              className="back-icon"
              onClick={() => router.push(problemDetailsPath)}
              weight="bold"
              size={24}
              aria-label="Voltar para a página anterior"
              tabIndex={0}
              role="button"
            />
            <Title as="h2" size="md">
              Acesso negado
            </Title>
          </Header>
          <Body as="div">
            <Text
              size="md"
              css={{
                textAlign: 'center',
                padding: '2rem',
                color: '#dc2626',
              }}
            >
              {permissionError}
            </Text>
            <Button
              variant="primary"
              onClick={() => router.push('/problems')}
              css={{ marginTop: '1rem' }}
            >
              Voltar para problemas
            </Button>
          </Body>
        </Container>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Container>
        <Header>
          <ArrowLeft
            className="back-icon"
            onClick={() => router.push(problemDetailsPath)}
            weight="bold"
            size={24}
            aria-label="Voltar para a página anterior"
            tabIndex={0}
            role="button"
          />
          <Title as="h2" size="md">
            Editar problema
          </Title>
        </Header>
        <Body onSubmit={handleSubmit(handleEditProblem)}>
          <Input>
            <Text size="md">Título</Text>
            <TextInput
              placeholder="Descreva brevemente o problema"
              {...register('title')}
              aria-label="Título do problema"
              tabIndex={0}
            />
            {errors.title && (
              <Text className="error-message" size="sm">
                {errors.title.message}
              </Text>
            )}
          </Input>
          <Input>
            <Text size="md">Descrição</Text>
            <TextArea
              placeholder="Detalhe o problema com o máximo de informações possível"
              {...register('description')}
              aria-label="Descrição do problema"
              css={{
                width: '100%',
                minHeight: '120px',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
              tabIndex={0}
            />
            {errors.description && (
              <Text className="error-message" size="sm">
                {errors.description.message}
              </Text>
            )}
          </Input>

          <Input>
            <Text size="md">Imagem (opcional)</Text>
            {currentAttachment && !newAttachmentId ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                <Text size="sm" css={{ color: '#6B7280' }}>
                  Imagem atual:
                </Text>
                <div
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    maxWidth: '200px',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentAttachment.url}
                    alt={currentAttachment.title}
                    style={{
                      maxWidth: '200px',
                      maxHeight: '150px',
                      borderRadius: '5px',
                      border: '1px solid rgba(0, 0, 0, 0.07)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveCurrentImage}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                    }}
                    aria-label="Remover imagem"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
                <Text size="sm" css={{ color: '#6B7280', fontStyle: 'italic' }}>
                  Para substituir a imagem, escolha uma nova abaixo.
                </Text>
              </div>
            ) : null}
            <ImageUpload
              onImageSelect={handleImageSelect}
              maxSizeKB={5120}
              placeholder="Faça o upload de uma imagem com tamanho inferior a 5MB."
              buttonText={isUploadingImage ? 'Enviando...' : 'Escolher Imagem'}
              errorMessage={uploadError || undefined}
              disabled={isUploadingImage || editProblemMutation.isPending}
            />
          </Input>

          <Button
            variant="primary"
            type="submit"
            disabled={
              isSubmitting ||
              !isFormValid ||
              editProblemMutation.isPending ||
              isUploadingImage
            }
            aria-label="Salvar edição do problema"
            tabIndex={0}
          >
            {editProblemMutation.isPending
              ? 'Salvando...'
              : 'Salvar alterações'}
          </Button>
        </Body>
      </Container>
    </ProtectedRoute>
  )
}
