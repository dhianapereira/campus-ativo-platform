import { useState } from 'react'
import { Container, Body, Header, Input, Title } from './styles'
import { ArrowLeft } from 'phosphor-react'
import { Button, Dropdown, Text, TextArea, TextInput } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { problemFormSchema, ProblemFormData } from '@/validators/problem-form'
import { ProtectedRoute } from '@/guards/ProtectedRoute'
import { useRouter } from 'next/router'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ImageUpload from '../components/ImageUpload'
import { colors } from '@/styles/tokens'
import {
  getCategoryOptionLabel,
  getLocationOptionLabel,
} from '../form-option-labels'

interface Category {
  id: string
  name: string
  description?: string | null
  isActive?: boolean
}

interface Location {
  id: string
  name: string
  code?: string | null
  description?: string | null
  isActive?: boolean
}

export default function AddProblem() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [attachmentId, setAttachmentId] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ProblemFormData>({
    resolver: zodResolver(problemFormSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      locationId: '',
    },
  })

  const title = watch('title')
  const categoryId = watch('categoryId')
  const locationId = watch('locationId')
  const description = watch('description')

  const isFormValid =
    title?.trim() !== '' &&
    categoryId !== '' &&
    locationId !== '' &&
    description?.trim() !== ''

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories', 'active'],
    queryFn: async () => {
      const response = await fetch('/api/categories?isActive=true', {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Falha ao buscar categorias.')
      return response.json()
    },
  })

  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations', 'active'],
    queryFn: async () => {
      const response = await fetch('/api/locations?isActive=true', {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Falha ao buscar localizações.')
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

  async function deleteAttachment(attachmentIdToDelete: string) {
    const response = await fetch(`/api/attachments/${attachmentIdToDelete}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Falha ao excluir o anexo.')
    }
  }

  const handleImageSelect = async (file: File | null) => {
    setUploadError(null)

    if (!file) {
      const previousAttachmentId = attachmentId
      setAttachmentId(null)

      if (previousAttachmentId) {
        try {
          await deleteAttachment(previousAttachmentId)
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Falha ao excluir o anexo.'
          setUploadError(errorMessage)
          toast.error(errorMessage)
        }
      }

      return
    }

    setIsUploadingImage(true)
    const previousAttachmentId = attachmentId

    try {
      const formData = new FormData()
      formData.append('file', file)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)

      const response = await fetch('/api/attachments', {
        method: 'POST',
        credentials: 'include',
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao fazer upload da imagem.')
      }

      const data = await response.json()
      setAttachmentId(data.attachmentId)

      if (previousAttachmentId && previousAttachmentId !== data.attachmentId) {
        await deleteAttachment(previousAttachmentId)
      }

      toast.success('Imagem enviada com sucesso!')
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.name === 'AbortError'
            ? 'Upload demorou muito. Tente novamente.'
            : error.message
          : 'Falha ao fazer upload da imagem.'
      setUploadError(errorMessage)
      toast.error(errorMessage)
      setAttachmentId(previousAttachmentId)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const createProblemMutation = useMutation({
    mutationFn: async (data: ProblemFormData) => {
      const response = await fetch('/api/problems/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: data.title.trim(),
          description: data.description.trim(),
          categoryId: data.categoryId,
          locationId: data.locationId,
          attachmentIds: attachmentId ? [attachmentId] : undefined,
        }),
      })

      const responseData = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message =
          responseData.message ||
          'Falha ao cadastrar problema. Verifique os dados.'
        throw new Error(message)
      }

      return responseData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] })
      toast.success('Problema cadastrado com sucesso!')
      router.push('/problems')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao cadastrar problema.')
      setError('root', {
        type: 'manual',
        message: error.message,
      })
    },
  })

  async function handleRegisterProblem(data: ProblemFormData) {
    clearErrors('root')
    createProblemMutation.mutate(data)
  }

  return (
    <ProtectedRoute>
      <Container>
        <Header>
          <ArrowLeft
            className="back-icon"
            onClick={() => router.push('/problems')}
            weight="bold"
            size={24}
            aria-label="Voltar para a página anterior"
            tabIndex={0}
            role="button"
          />
          <Title as="h2" size="md">
            Cadastrar problema
          </Title>
        </Header>
        <Body onSubmit={handleSubmit(handleRegisterProblem)}>
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
                  tabIndex={0}
                  css={{
                    width: '100%',
                    minHeight: '120px',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
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
            <ImageUpload
              onImageSelect={handleImageSelect}
              maxSizeKB={5120}
              placeholder="Faça o upload de uma imagem com tamanho inferior a 5MB."
              buttonText={isUploadingImage ? 'Enviando...' : 'Escolher Imagem'}
              errorMessage={uploadError || undefined}
              disabled={isUploadingImage || createProblemMutation.isPending}
            />
          </Input>

          {errors.root?.message && (
            <Text
              className="error-message"
              size="sm"
              style={{ color: colors.red }}
            >
              {errors.root.message}
            </Text>
          )}

          <Button
            variant="primary"
            type="submit"
            css={{ width: '100%' }}
            disabled={
              isSubmitting ||
              !isFormValid ||
              createProblemMutation.isPending ||
              isUploadingImage
            }
            aria-label="Cadastrar problema"
            tabIndex={0}
          >
            {createProblemMutation.isPending ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </Body>
      </Container>
    </ProtectedRoute>
  )
}
