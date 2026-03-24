import { useState } from 'react'
import { Container, Body, Header, Input, Title } from './styles'
import { ArrowLeft } from 'phosphor-react'
import { Button, Text, TextArea, TextInput } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { problemFormSchema, ProblemFormData } from '@/validators/problem-form'
import { ProtectedRoute } from '@/guards/ProtectedRoute'
import { useRouter } from 'next/router'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ImageUpload from '../components/ImageUpload'
import { colors } from '@/styles/tokens'

interface Category {
  id: string
  name: string
  isActive?: boolean
}

interface Location {
  id: string
  name: string
  code?: string
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

  const handleImageSelect = async (file: File | null) => {
    setUploadError(null)

    if (!file) {
      setAttachmentId(null)
      return
    }

    setIsUploadingImage(true)

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
        throw new Error(errorData.message || 'Falha ao fazer upload da imagem')
      }

      const data = await response.json()
      setAttachmentId(data.attachmentId)
      toast.success('Imagem enviada com sucesso!')
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.name === 'AbortError'
            ? 'Upload demorou muito. Tente novamente.'
            : error.message
          : 'Falha ao fazer upload da imagem'
      setUploadError(errorMessage)
      toast.error(errorMessage)
      setAttachmentId(null)
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
      toast.error(error.message || 'Falha ao cadastrar problema')
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

  const selectStyles = {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '6px',
    border: `1px solid ${colors.gray300}`,
    fontSize: '1rem',
    color: colors.gray,
    backgroundColor: colors.white,
    cursor: 'pointer',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
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
            <select
              {...register('categoryId')}
              aria-label="Categoria do problema"
              tabIndex={0}
              style={selectStyles}
              disabled={isLoadingCategories}
            >
              <option value="">
                {isLoadingCategories
                  ? 'Carregando categorias...'
                  : 'Selecione uma categoria'}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <Text className="error-message" size="sm">
                {errors.categoryId.message}
              </Text>
            )}
          </Input>

          <Input>
            <Text size="md">Localização</Text>
            <select
              {...register('locationId')}
              aria-label="Localização do problema"
              tabIndex={0}
              style={selectStyles}
              disabled={isLoadingLocations}
            >
              <option value="">
                {isLoadingLocations
                  ? 'Carregando localizações...'
                  : 'Selecione uma localização'}
              </option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                  {location.code ? ` (${location.code})` : ''}
                </option>
              ))}
            </select>
            {errors.locationId && (
              <Text className="error-message" size="sm">
                {errors.locationId.message}
              </Text>
            )}
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
