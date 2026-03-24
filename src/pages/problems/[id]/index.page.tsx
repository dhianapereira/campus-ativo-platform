import React, { useMemo, useState } from 'react'
import {
  Container,
  Body,
  Header,
  Title,
  ImageContainer,
  InfoContainer,
  EditButton,
  HistorySection,
  HistoryList,
  HistoryCard,
} from './styles'
import { ArrowLeft, NotePencil, Trash } from 'phosphor-react'
import { useRouter } from 'next/router'
import type { ProblemDetailsProps } from './types'
import { Button, Text } from '@/styles'
import { Actions } from './components/Actions'
import { ImageError } from '@/layouts/platform/components/ImageError'
import { NoImage } from '@/layouts/platform/components/NoImage'
import { ProtectedRoute } from '@/styles/components/routes/ProtectedRoute'
import { useAuth } from '@/contexts/auth-context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getHistoryActionLabel,
  getMaintenanceTypeLabel,
  getStatusLabel,
  toFrontendStatus,
} from '@/utils/problem-mapping'

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

function formatHistoryDescription(
  entry: ProblemDetailsProps['history'][number],
) {
  if (entry.action === 'STATUS_CHANGED') {
    return `De ${getStatusLabel(entry.oldValue)} para ${getStatusLabel(entry.newValue)}`
  }

  if (entry.action === 'MAINTENANCE_TYPE_CHANGED') {
    return `De ${getMaintenanceTypeLabel(entry.oldValue)} para ${getMaintenanceTypeLabel(entry.newValue)}`
  }

  if (entry.action === 'CATEGORY_CHANGED') {
    return 'Categoria atualizada.'
  }

  return null
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
  const problemQueryKey =
    typeof id === 'string' ? id : (problem?.slug ?? problem?.id)

  const problemData = useMemo<ProblemDetailsProps | null>(() => {
    if (!problem) return null

    const firstAttachment = problem.attachments?.[0]
    const latestNote =
      problem.history?.find(
        (entry: { note?: string | null }) =>
          typeof entry.note === 'string' && entry.note.trim().length > 0,
      )?.note ?? ''

    return {
      id: problem.id,
      title: problem.title,
      location: problem.location?.name ?? problem.locationId ?? '—',
      description: problem.description,
      status: toFrontendStatus(problem.status),
      category: problem.categoryId ?? null,
      maintenanceType: problem.maintenanceType ?? null,
      imageUrl: firstAttachment?.url ?? null,
      reporter: problem.reporterName ?? problem.reporterId ?? '—',
      createdAt: formatDateTime(problem.createdAt),
      updatedAt: problem.updatedAt ? formatDateTime(problem.updatedAt) : null,
      history: problem.history ?? [],
      latestNote,
    }
  }, [problem])

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
                  css={{
                    color: '#b91c1c',
                    borderColor: '#b91c1c',
                    '&:not(:disabled):hover': {
                      backgroundColor: '#b91c1c',
                      borderColor: '#b91c1c',
                      color: '#fff',
                    },
                  }}
                >
                  <Trash weight="bold" size={24} />
                  Mover para lixeira
                </Button>
                <EditButton
                  className="mobile"
                  tone="danger"
                  onClick={handleMoveToTrash}
                  disabled={moveToTrashMutation.isPending}
                  aria-label="Mover para a lixeira"
                  tabIndex={0}
                  role="button"
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
          <HistorySection>
            <Text className="label" size="md">
              Histórico:
            </Text>
            <HistoryList>
              {problemData.history.length > 0 ? (
                problemData.history.map((entry) => {
                  const description = formatHistoryDescription(entry)

                  return (
                    <HistoryCard key={entry.id}>
                      <Text size="md">
                        {getHistoryActionLabel(entry.action)}
                      </Text>
                      <Text size="sm">
                        {entry.userName} em {formatDateTime(entry.createdAt)}
                      </Text>
                      {description && <Text size="sm">{description}</Text>}
                      {entry.note && <Text size="md">{entry.note}</Text>}
                    </HistoryCard>
                  )
                })
              ) : (
                <Text size="md">
                  Nenhuma atualização registrada até o momento.
                </Text>
              )}
            </HistoryList>
          </HistorySection>
          <Actions
            problemId={problemData.id}
            problemQueryKey={problemQueryKey}
            initialStatus={problemData.status}
            initialCategory={problemData.category}
            initialMaintenanceType={problemData.maintenanceType}
            initialNote={problemData.latestNote}
          />
        </Body>
      </Container>
    </ProtectedRoute>
  )
}
