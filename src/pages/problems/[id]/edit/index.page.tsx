import { useEffect, useState } from 'react'
import { Container, Body, Header, Input, Title } from './styles'
import { ArrowLeft, X } from 'phosphor-react'
import Head from 'next/head'
import { Button, Dropdown, Text, TextArea, TextInput } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import {
  editProblemFormSchema,
  EditProblemFormData,
} from '@/validators/edit-problem-form'
import { useRouter } from 'next/router'
import { ProtectedRoute } from '@/guards/ProtectedRoute'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ImageUpload from '../../components/ImageUpload'
import { colors } from '@/styles/tokens'
import PlatformLayout from '@/layouts/platform/layout'
import { ForbiddenState } from '@/components/ForbiddenState'
import { PageContainer } from '@/pages/error-page.styles'
import {
  getCategoryOptionLabel,
  getLocationOptionLabel,
} from '../../form-option-labels'

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
  category: {
    id: string
    name: string
    description?: string | null
  }
  location: {
    id: string
    name: string
    code?: string
    description?: string
  }
  reporter: {
    id: string
    email: string
  }
  status: string
  createdAt: string
  attachments?: AttachmentInfo[]
}

interface Category {
  id: string
  name: string
  description?: string
  isActive?: boolean
}

interface Location {
  id: string
  name: string
  code?: string | null
  description?: string | null
  isActive?: boolean
}

function buildUnavailableLabel(label: string) {
  return `${label} (indisponível)`
}

export default function EditProblem() {
  const router = useRouter()
  const { id, from } = router.query
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const problemDetailsPath =
    typeof id === 'string' ? `/problems/${id}` : '/problems'
  const cameFromDetails = from === 'details'

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

        const isAuthor = user?.id === problem.reporter.id
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
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditProblemFormData>({
    resolver: zodResolver(editProblemFormSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      locationId: '',
    },
  })

  const title = watch('title')
  const description = watch('description')
  const categoryId = watch('categoryId')
  const locationId = watch('locationId')

  const isFormValid =
    title?.trim() !== '' &&
    description?.trim() !== '' &&
    categoryId !== '' &&
    locationId !== ''

  const originalTitle = problemData?.title.trim() ?? ''
  const originalDescription = problemData?.description.trim() ?? ''
  const originalCategoryId = problemData?.category.id ?? ''
  const originalLocationId = problemData?.location.id ?? ''
  const originalAttachmentId = problemData?.attachments?.[0]?.id ?? null

  const hasAttachmentChanges =
    newAttachmentId !== null ||
    (originalAttachmentId !== null && currentAttachment === null)

  const hasFormChanges =
    title?.trim() !== originalTitle ||
    description?.trim() !== originalDescription ||
    categoryId !== originalCategoryId ||
    locationId !== originalLocationId ||
    hasAttachmentChanges

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories', 'active'],
    queryFn: async () => {
      const response = await fetch('/api/categories?isActive=true', {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Falha ao buscar categorias')
      return response.json()
    },
  })

  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations', 'active'],
    queryFn: async () => {
      const response = await fetch('/api/locations?isActive=true', {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Falha ao buscar localizações')
      return response.json()
    },
  })

  const categories: Category[] = categoriesData?.categories || []
  const locations: Location[] = locationsData?.locations || []
  const categoryItems = categories.map((category) => ({
    value: category.id,
    name: category.name,
    description: category.description ?? undefined,
    label: getCategoryOptionLabel(category),
  }))
  const locationItems = locations.map((location) => ({
    value: location.id,
    name: location.name,
    code: location.code ?? undefined,
    description: location.description ?? undefined,
    label: getLocationOptionLabel(location),
  }))

  if (
    problemData?.category?.id &&
    !categoryItems.some((item) => item.value === problemData.category.id)
  ) {
    categoryItems.unshift({
      value: problemData.category.id,
      name: problemData.category.name,
      description: problemData.category.description ?? undefined,
      label: buildUnavailableLabel(
        getCategoryOptionLabel(problemData.category),
      ),
    })
  }

  if (
    problemData?.location?.id &&
    !locationItems.some((item) => item.value === problemData.location.id)
  ) {
    locationItems.unshift({
      value: problemData.location.id,
      name: problemData.location.name,
      code: problemData.location.code ?? undefined,
      description: problemData.location.description ?? undefined,
      label: buildUnavailableLabel(
        getLocationOptionLabel(problemData.location),
      ),
    })
  }

  useEffect(() => {
    if (problemData && hasPermission) {
      reset({
        title: problemData.title,
        description: problemData.description,
        categoryId: problemData.category.id,
        locationId: problemData.location.id,
      })
      setAttachmentChanged(false)
      setNewAttachmentId(null)
      setUploadError(null)
      if (problemData.attachments && problemData.attachments.length > 0) {
        setCurrentAttachment(problemData.attachments[0])
      } else {
        setCurrentAttachment(null)
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
        categoryId: string
        locationId: string
        attachmentIds?: string[]
      } = {
        title: data.title.trim(),
        description: data.description.trim(),
        categoryId: data.categoryId,
        locationId: data.locationId,
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

  function handleBackNavigation() {
    if (
      cameFromDetails &&
      typeof window !== 'undefined' &&
      window.history.length > 1
    ) {
      router.back()
      return
    }

    router.replace(problemDetailsPath)
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Container>
          <Header>
            <ArrowLeft
              className="back-icon"
              onClick={handleBackNavigation}
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
        <PlatformLayout>
          <Head>
            <title>Acesso negado • Campus Ativo</title>
          </Head>
          <PageContainer withLayout>
            <ForbiddenState
              message={
                permissionError ??
                'Você não possui as permissões necessárias para acessar esta página.'
              }
              onBack={handleBackNavigation}
              onGoToProblems={() => void router.push('/problems')}
            />
          </PageContainer>
        </PlatformLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Container>
        <Header>
          <ArrowLeft
            className="back-icon"
            onClick={handleBackNavigation}
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
            <Text size="md">Categoria</Text>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="categoryId"
                  hint={
                    isLoadingCategories
                      ? 'Carregando categorias...'
                      : 'Selecione uma categoria'
                  }
                  items={categoryItems}
                  itemSelected={field.value}
                  onChange={(value) => field.onChange(value)}
                  hasError={!!errors.categoryId}
                  errorMessage={errors.categoryId?.message}
                  disabled={isLoadingCategories}
                  required
                />
              )}
            />
          </Input>

          <Input>
            <Text size="md">Localização</Text>
            <Controller
              name="locationId"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="locationId"
                  hint={
                    isLoadingLocations
                      ? 'Carregando localizações...'
                      : 'Selecione uma localização'
                  }
                  items={locationItems}
                  itemSelected={field.value}
                  onChange={(value) => field.onChange(value)}
                  hasError={!!errors.locationId}
                  errorMessage={errors.locationId?.message}
                  disabled={isLoadingLocations}
                  required
                />
              )}
            />
          </Input>

          <Input>
            <Text size="md">Descrição</Text>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea
                  placeholder="Detalhe o problema com o máximo de informações possível"
                  {...field}
                  aria-label="Descrição do problema"
                  css={{
                    width: '100%',
                    minHeight: '120px',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                  tabIndex={0}
                />
              )}
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
                <Text size="sm" css={{ color: colors.gray500 }}>
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
                      backgroundColor: colors.red,
                      color: colors.white,
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
                <Text
                  size="sm"
                  css={{ color: colors.gray500, fontStyle: 'italic' }}
                >
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
              !hasFormChanges ||
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
