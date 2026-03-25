import React, { useMemo, useState } from 'react'
import {
  Container,
  Body,
  Header,
  Title,
  ImageContainer,
  InfoContainer,
  CategoryInfo,
  LocationInfo,
  EditButton,
  HistorySection,
  HistoryToggle,
  HistoryPanel,
  HistoryTimeline,
  HistoryEntry,
  HistoryEntryMarker,
  HistoryEntryBody,
  HistoryEntryHeader,
  HistoryChangeList,
} from './styles'
import {
  ArrowLeft,
  CaretDown,
  MapPin,
  NotePencil,
  Tag,
  Trash,
} from 'phosphor-react'
import { useRouter } from 'next/router'
import type { ProblemDetailsProps, ProblemHistoryChange } from './types'
import { Button, Text } from '@/components'
import { TrashActionButton } from './components/TrashActionButton'
import { Actions } from './components/Actions'
import { ImageError } from '@/layouts/platform/components/ImageError'
import { NoImage } from '@/layouts/platform/components/NoImage'
import { ProtectedRoute } from '@/guards/ProtectedRoute'
import { useAuth } from '@/contexts/auth-context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getHistoryActionLabel,
  getMaintenanceTypeLabel,
  getStatusLabel,
  toFrontendStatus,
} from '../problem-mapping'

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

function formatHistoryChange(
  change: NonNullable<
    ProblemDetailsProps['history'][number]['changes']
  >[number],
) {
  switch (change.field) {
    case 'status':
      return `Status: de ${getStatusLabel(change.oldValue)} para ${getStatusLabel(change.newValue)}`
    case 'maintenanceType':
      return `Manutenção: de ${getMaintenanceTypeLabel(change.oldValue)} para ${getMaintenanceTypeLabel(change.newValue)}`
    case 'note':
      return null
    default:
      return 'Atualização registrada.'
  }
}

export default function ProblemDetails() {
  const router = useRouter()
  const { id } = router.query
  const queryClient = useQueryClient()
  const { user, hasRole } = useAuth()

  const [imageError, setImageError] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

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
    const latestNote = (() => {
      for (const entry of problem.history ?? []) {
        const noteChange = (entry.changes ?? []).find(
          (change: ProblemHistoryChange) => change.field === 'note',
        )

        if (noteChange) {
          return typeof noteChange.newValue === 'string'
            ? noteChange.newValue.trim()
            : ''
        }

        if (typeof entry.note === 'string') {
          return entry.note.trim()
        }
      }

      return ''
    })()

    return {
      id: problem.id,
      title: problem.title,
      category: {
        name: problem.category.name,
        description: problem.category.description ?? null,
      },
      location: {
        name: problem.location.name,
        code: problem.location.code ?? null,
        description: problem.location.description ?? null,
      },
      description: problem.description,
      status: toFrontendStatus(problem.status),
      maintenanceType: problem.maintenanceType ?? null,
      imageUrl: firstAttachment?.url ?? null,
      reporter: problem.reporter.email,
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

  const isReporter = user?.id && problem?.reporter.id === user.id
  const isStatusToAnalysis = problem?.status === STATUS_TO_ANALYSIS_BACKEND
  const canMoveToTrash = isReporter && isStatusToAnalysis
  const canEdit = canMoveToTrash
  const canAccessActions = hasRole('MANAGER')

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

  function handleBackNavigation() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }

    router.push('/problems')
  }

  async function goToEditPage() {
    if (typeof id !== 'string') {
      await router.push('/problems')
      return
    }

    await router.push({
      pathname: `/problems/${id}/edit`,
      query: { from: 'details' },
    })
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
              onClick={handleBackNavigation}
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
                <TrashActionButton
                  className="desktop"
                  variant="danger"
                  onClick={handleMoveToTrash}
                  disabled={moveToTrashMutation.isPending}
                  aria-label="Mover para a lixeira"
                  tabIndex={0}
                >
                  <Trash weight="bold" size={24} />
                  <span className="label">Mover para lixeira</span>
                </TrashActionButton>
                <TrashActionButton
                  className="mobile"
                  variant="danger"
                  mobileBehavior="iconOnly"
                  onClick={handleMoveToTrash}
                  disabled={moveToTrashMutation.isPending}
                  aria-label="Mover para a lixeira"
                  tabIndex={0}
                  role="button"
                >
                  <Trash weight="bold" size={24} />
                  <span className="label">Mover para lixeira</span>
                </TrashActionButton>
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
              Categoria:
            </Text>
            <CategoryInfo>
              <div className="category-header">
                <Tag
                  className="category-icon"
                  size={18}
                  weight="fill"
                  aria-hidden="true"
                />
                <Text className="category-name" size="md">
                  {problemData.category.name}
                </Text>
              </div>
              {problemData.category.description && (
                <div className="category-description">
                  <Text className="category-description-label" size="xs">
                    Descrição
                  </Text>
                  <Text className="category-description-text" size="sm">
                    {problemData.category.description}
                  </Text>
                </div>
              )}
            </CategoryInfo>
          </InfoContainer>
          <InfoContainer>
            <Text className="label" size="md">
              Local:
            </Text>
            <LocationInfo>
              <div className="location-header">
                <div className="location-title">
                  <MapPin
                    className="location-icon"
                    size={18}
                    weight="fill"
                    aria-hidden="true"
                  />
                  <Text className="location-name" size="md">
                    {problemData.location.name}
                  </Text>
                </div>
                {problemData.location.code && (
                  <span className="location-code">
                    Código {problemData.location.code}
                  </span>
                )}
              </div>
              {problemData.location.description && (
                <div className="location-description">
                  <Text className="location-description-label" size="xs">
                    Descrição
                  </Text>
                  <Text className="location-description-text" size="sm">
                    {problemData.location.description}
                  </Text>
                </div>
              )}
            </LocationInfo>
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
            <HistoryToggle
              type="button"
              onClick={() => setIsHistoryOpen((current) => !current)}
              aria-expanded={isHistoryOpen}
              aria-controls="problem-history-panel"
            >
              <div>
                <Text className="label" size="md">
                  Histórico
                </Text>
                <Text size="sm">
                  {problemData.history.length} registro
                  {problemData.history.length === 1 ? '' : 's'}
                </Text>
              </div>
              <CaretDown
                size={18}
                weight="bold"
                style={{
                  transform: isHistoryOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </HistoryToggle>
            {isHistoryOpen && (
              <HistoryPanel id="problem-history-panel">
                {problemData.history.length > 0 ? (
                  <HistoryTimeline>
                    {problemData.history.map((entry) => {
                      const changes = entry.changes ?? []
                      const noteChange = changes.find(
                        (change) => change.field === 'note',
                      )
                      const noteText =
                        typeof noteChange?.newValue === 'string'
                          ? noteChange.newValue
                          : typeof entry.note === 'string'
                            ? entry.note
                            : null
                      const noteWasRemoved =
                        !!noteChange &&
                        !(
                          typeof noteChange.newValue === 'string' &&
                          noteChange.newValue.trim()
                        )
                      const visibleChanges = changes.filter(
                        (change) => change.field !== 'note',
                      )

                      return (
                        <HistoryEntry key={entry.id}>
                          <HistoryEntryMarker aria-hidden="true" />
                          <HistoryEntryBody>
                            <HistoryEntryHeader>
                              <Text size="md">
                                {getHistoryActionLabel(entry.action)}
                              </Text>
                              <Text size="sm">
                                {entry.userName} em{' '}
                                {formatDateTime(entry.createdAt)}
                              </Text>
                            </HistoryEntryHeader>
                            {(visibleChanges.length > 0 ||
                              noteText ||
                              noteWasRemoved) && (
                              <HistoryChangeList>
                                {visibleChanges.map((change, index) => {
                                  const description =
                                    formatHistoryChange(change)

                                  if (!description) return null

                                  return (
                                    <li
                                      key={`${entry.id}-${change.field}-${index}`}
                                    >
                                      <Text size="sm">{description}</Text>
                                    </li>
                                  )
                                })}
                                {noteText && (
                                  <li key={`${entry.id}-note`}>
                                    <Text size="sm">
                                      {`Observações: ${noteText}`}
                                    </Text>
                                  </li>
                                )}
                                {noteWasRemoved && (
                                  <li key={`${entry.id}-note-removed`}>
                                    <Text size="sm">
                                      Observações removidas.
                                    </Text>
                                  </li>
                                )}
                              </HistoryChangeList>
                            )}
                          </HistoryEntryBody>
                        </HistoryEntry>
                      )
                    })}
                  </HistoryTimeline>
                ) : (
                  <Text size="md">
                    Nenhuma atualização registrada até o momento.
                  </Text>
                )}
              </HistoryPanel>
            )}
          </HistorySection>
          {canAccessActions && (
            <Actions
              problemId={problemData.id}
              problemQueryKey={problemQueryKey}
              initialStatus={problemData.status}
              initialMaintenanceType={problemData.maintenanceType}
              initialNote={problemData.latestNote}
            />
          )}
        </Body>
      </Container>
    </ProtectedRoute>
  )
}
