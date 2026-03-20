import React, { useMemo, useState } from 'react'
import {
  Container,
  Body,
  Header,
  Title,
  ImageContainer,
  InfoContainer,
  EditButton,
} from './styles'
import { ArrowLeft, NotePencil, Trash } from 'phosphor-react'
import { useRouter } from 'next/router'
import type { ProblemDetailsProps } from './types'
import { Button, Text } from '@/styles'
import { Actions } from './components/Actions'
import { BACKEND_STATUS_TO_FRONTEND } from '@/data/static/status-data'
import { ImageError } from '@/app/platform/components/ImageError'
import { NoImage } from '@/app/platform/components/NoImage'
import { ProtectedRoute } from '@/styles/components/routes/ProtectedRoute'
import { useAuth } from '@/contexts/auth-context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CategoryResponse } from '@/server/client/models/categoryResponse'

const STATUS_TO_ANALYSIS_BACKEND = 'TO_ANALYSIS'

function formatDateTime(isoString?: string | null): string {
  if (!isoString) return '—'
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      ...(d.getHours() || d.getMinutes()
        ? {
            hour: '2-digit',
            minute: '2-digit',
          }
        : {}),
    })
  } catch {
    return isoString
  }
}

export default function ProblemDetails() {
  const router = useRouter()
  const { id } = router.query
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const [imageError, setImageError] = useState(false)

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['problem', id],
    queryFn: async () => {
      const res = await fetch(`/api/problems/${id}`, {
        credentials: 'include',
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Falha ao carregar problema')
      }
      return res.json()
    },
    enabled: !!id && typeof id === 'string',
  })

  const problem = apiResponse?.problem

  const { data: category } = useQuery({
    queryKey: ['category', problem?.categoryId],
    queryFn: async () => {
      const res = await fetch(`/api/categories/${problem?.categoryId}`, {
        credentials: 'include',
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Falha ao carregar categoria')
      }

      return (await res.json()) as CategoryResponse
    },
    enabled: !!problem?.categoryId,
    retry: false,
  })

  const problemData = useMemo<ProblemDetailsProps | null>(() => {
    if (!problem) return null

    const firstAttachment = problem.attachments?.[0]

    return {
      title: problem.title,
      location: problem.location?.name ?? problem.locationId ?? '—',
      description: problem.description,
      status: BACKEND_STATUS_TO_FRONTEND[problem.status] ?? problem.status,
      category: category?.name ?? problem.categoryId ?? null,
      maintenanceType: problem.maintenanceType ?? null,
      imageUrl: firstAttachment?.url ?? null,
      reporter: problem.reporterName ?? problem.reporterId ?? '—',
      createdAt: formatDateTime(problem.createdAt),
      updatedAt: problem.updatedAt ? formatDateTime(problem.updatedAt) : null,
    }
  }, [category?.name, problem])

  const moveToTrashMutation = useMutation({
    mutationFn: async () => {
      if (!problem?.id) throw new Error('Problema não encontrado')
      const res = await fetch(`/api/problems/${problem.id}/trash`, {
        method: 'PATCH',
        credentials: 'include',
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Falha ao mover para a lixeira')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] })
      toast.success('Problema movido para a lixeira.')
      router.push('/problems')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Falha ao mover para a lixeira')
    },
  })

  const isReporter =
    user?.id && problem?.reporterId && user.id === problem.reporterId
  const isStatusToAnalysis = problem?.status === STATUS_TO_ANALYSIS_BACKEND
  const canMoveToTrash = isReporter && isStatusToAnalysis
  const canEdit = isStatusToAnalysis

  if (isLoading || (id && !problem && !error)) {
    return (
      <ProtectedRoute>
        <Container>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Carregando...
          </div>
        </Container>
      </ProtectedRoute>
    )
  }

  if (error || !problemData) {
    return (
      <ProtectedRoute>
        <Container>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>
              {error instanceof Error
                ? error.message
                : 'Problema não encontrado.'}
            </p>
            <Button
              variant="secondary"
              onClick={() => router.push('/problems')}
              style={{ marginTop: '1rem' }}
            >
              Voltar
            </Button>
          </div>
        </Container>
      </ProtectedRoute>
    )
  }

  async function goToEditPage() {
    await router.push(`/problems/${id}/edit`)
  }

  function handleMoveToTrash() {
    if (!canMoveToTrash) return
    moveToTrashMutation.mutate()
  }

  return (
    <ProtectedRoute>
      <Container>
        <Header>
          <div className="first-component">
            <ArrowLeft
              className="back-icon"
              onClick={() => window.history.back()}
              weight="bold"
              size={24}
              aria-label="Voltar para a página anterior"
              tabIndex={0}
              role="button"
            />
            <Title as="h2" size="md">
              {problemData.title}
            </Title>
          </div>
          <div
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
          >
            {canMoveToTrash && (
              <>
                <Button
                  className="desktop"
                  variant="secondary"
                  onClick={handleMoveToTrash}
                  disabled={moveToTrashMutation.isPending}
                  aria-label="Mover para a lixeira"
                  tabIndex={0}
                  css={{ color: '#b91c1c', borderColor: '#b91c1c' }}
                >
                  <Trash weight="bold" size={24} />
                  Mover para lixeira
                </Button>
                <EditButton
                  className="mobile"
                  onClick={handleMoveToTrash}
                  disabled={moveToTrashMutation.isPending}
                  aria-label="Mover para a lixeira"
                  tabIndex={0}
                  role="button"
                  style={{ color: '#b91c1c', borderColor: '#b91c1c' }}
                >
                  <Trash weight="bold" size={24} />
                </EditButton>
              </>
            )}
            {canEdit && (
              <>
                <Button
                  className="desktop"
                  variant="secondary"
                  onClick={goToEditPage}
                  aria-label="Editar problema"
                  tabIndex={0}
                >
                  <NotePencil weight="bold" size={24} />
                  Editar
                </Button>
                <EditButton
                  className="mobile"
                  onClick={goToEditPage}
                  aria-label="Editar problema"
                  tabIndex={0}
                  role="button"
                >
                  <NotePencil weight="bold" size={24} />
                </EditButton>
              </>
            )}
          </div>
        </Header>
        <Body>
          {!problemData.imageUrl ? (
            <NoImage />
          ) : !imageError ? (
            <ImageContainer
              src={problemData.imageUrl}
              height={331}
              width={839}
              alt={problemData.title}
              onError={() => setImageError(true)}
            />
          ) : (
            <ImageError />
          )}
          <InfoContainer>
            <Text className="label" size="md">
              Título:
            </Text>
            <Text size="md">{problemData.title}</Text>
          </InfoContainer>
          <InfoContainer>
            <Text className="label" size="md">
              Local:
            </Text>
            <Text size="md">{problemData.location}</Text>
          </InfoContainer>
          <InfoContainer>
            <Text className="label" size="md">
              Descrição:
            </Text>
            <Text size="md">{problemData.description}</Text>
          </InfoContainer>
          <InfoContainer>
            <Text className="label" size="md">
              Relator:
            </Text>
            <Text size="md">{problemData.reporter}</Text>
          </InfoContainer>
          <InfoContainer>
            <Text className="label" size="md">
              Cadastrado em:
            </Text>
            <Text size="md">{problemData.createdAt}</Text>
          </InfoContainer>
          {problemData.updatedAt && (
            <InfoContainer>
              <Text className="label" size="md">
                Última atualização:
              </Text>
              <Text size="md">{problemData.updatedAt}</Text>
            </InfoContainer>
          )}
          <Actions
            initialStatus={problemData.status}
            initialCategory={problemData.category}
            initialMaintenanceType={problemData.maintenanceType}
          />
        </Body>
      </Container>
    </ProtectedRoute>
  )
}
