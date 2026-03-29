import React, { useEffect, useMemo, useState } from 'react'
import {
  Container,
  Body,
  Header,
  Title,
  ImageButton,
  ImageActionArea,
  ImageContainer,
  ImageHint,
  InfoContainer,
  CategoryInfo,
  LocationInfo,
  EditButton,
  HistorySection,
  HistoryHeader,
  HistoryPanel,
  HistorySummary,
  HistoryList,
  HistoryTimelineItem,
  HistoryMarker,
  HistoryCard,
  HistoryCardHeader,
  HistoryCardBody,
  HistoryMeta,
  HistoryBadge,
  HistoryNote,
  HistoryChangeList,
  ImageViewerOverlay,
  ImageViewerContent,
  ImageViewerHeader,
  ImageViewerTitle,
  ImageViewerCloseButton,
  ImageViewerFrame,
  ImageViewerImage,
} from './styles'
import {
  ArrowLeft,
  CaretDown,
  ClockCounterClockwise,
  MagnifyingGlassPlus,
  MapPin,
  NotePencil,
  Tag,
  Trash,
  X,
} from 'phosphor-react'
import { useRouter } from 'next/router'
import type { ProblemDetailsProps } from './types'
import { Button, ConfirmationModal, NotFoundState, Text } from '@/components'
import { TrashActionButton } from './components/TrashActionButton'
import { Actions } from './components/Actions'
import { ImageError } from '@/layouts/platform/components/ImageError'
import { NoImage } from '@/layouts/platform/components/NoImage'
import { ProtectedRoute } from '@/guards/ProtectedRoute'
import PlatformLayout from '@/layouts/platform/layout'
import Head from 'next/head'
import { useAuthPermissions, useAuthSession } from '@/contexts/auth-context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PageContainer } from '@/pages/error-page.styles'
import type { GetProblemBySlugControllerHandle200 } from '@/lib/api/generated/models/getProblemBySlugControllerHandle200'
import { invalidateTrashQueries } from '@/pages/trash/trash-cache'
import {
  getHistoryActionLabel,
  getMaintenanceTypeLabel,
  getStatusLabel,
  toFrontendStatus,
} from '../problem-mapping'

const STATUS_TO_ANALYSIS_BACKEND = 'TO_ANALYSIS'

type QueryError = Error & {
  status?: number
}

function normalizeNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

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

function getStatusVariant(status?: string | null) {
  switch (status) {
    case 'TO_ANALYSIS':
    case 'toAnalysis':
      return 'toAnalysis'
    case 'IN_ANALYSIS':
    case 'inAnalysis':
      return 'inAnalysis'
    case 'ACCEPTED':
    case 'accepted':
      return 'accepted'
    case 'REJECTED':
    case 'rejected':
      return 'rejected'
    case 'IN_PROGRESS':
    case 'inProgress':
      return 'inProgress'
    case 'FINISHED':
    case 'finished':
      return 'finished'
    default:
      return null
  }
}

function getMaintenanceTone(maintenanceType?: string | null) {
  switch (maintenanceType) {
    case 'PREVENTIVE':
    case 'preventive':
      return 'maintenance-preventive'
    case 'CORRECTIVE':
    case 'corrective':
      return 'maintenance-corrective'
    default:
      return 'maintenance-unset'
  }
}

function renderHistoryChanges(
  changes: NonNullable<ProblemDetailsProps['history'][number]['changes']>,
) {
  return changes.map((change, index) => {
    if (change.field === 'note') return null

    if (change.field === 'status') {
      return (
        <div key={`${change.field}-${index}`} className="history-change-item">
          <Text size="sm">
            <span className="history-change-prefix">Status:</span> de{' '}
            <span
              className="history-inline-chip"
              data-tone={getStatusVariant(change.oldValue) ?? undefined}
            >
              {getStatusLabel(change.oldValue)}
            </span>{' '}
            para{' '}
            <span
              className="history-inline-chip"
              data-tone={getStatusVariant(change.newValue) ?? undefined}
            >
              {getStatusLabel(change.newValue)}
            </span>
          </Text>
        </div>
      )
    }

    if (change.field === 'maintenanceType') {
      return (
        <div key={`${change.field}-${index}`} className="history-change-item">
          <Text size="sm">
            <span className="history-change-prefix">Manutenção:</span> de{' '}
            <span
              className="history-inline-chip"
              data-tone={getMaintenanceTone(change.oldValue)}
            >
              {getMaintenanceTypeLabel(change.oldValue)}
            </span>{' '}
            para{' '}
            <span
              className="history-inline-chip"
              data-tone={getMaintenanceTone(change.newValue)}
            >
              {getMaintenanceTypeLabel(change.newValue)}
            </span>
          </Text>
        </div>
      )
    }

    const description = formatHistoryChange(change)
    if (!description) return null

    return (
      <div key={`${change.field}-${index}`} className="history-change-item">
        <Text size="sm">{description}</Text>
      </div>
    )
  })
}

export default function ProblemDetails() {
  const router = useRouter()
  const { id } = router.query
  const queryClient = useQueryClient()
  const { user } = useAuthSession()
  const { hasRole } = useAuthPermissions()

  const [imageError, setImageError] = useState(false)
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [showTrashConfirmationModal, setShowTrashConfirmationModal] =
    useState(false)

  useEffect(() => {
    if (!isImageViewerOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsImageViewerOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isImageViewerOpen])

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery<GetProblemBySlugControllerHandle200, QueryError>({
    queryKey: ['problem', id],
    queryFn: async () => {
      const res = await fetch(`/api/problems/${id}`, {
        credentials: 'include',
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const queryError = new Error(
          err.message ||
            (res.status === 404
              ? 'Problema não encontrado.'
              : 'Falha ao carregar problema.'),
        ) as QueryError
        queryError.status = res.status
        throw queryError
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
    const history = (problem.history ?? []).map((entry) => ({
      id: entry.id,
      action: entry.action,
      userId: entry.userId,
      userName: entry.userName,
      note: normalizeNullableString(entry.note),
      createdAt: entry.createdAt,
      changes:
        entry.changes?.map((change) => ({
          field: change.field,
          oldValue: normalizeNullableString(change.oldValue),
          newValue: normalizeNullableString(change.newValue),
        })) ?? null,
    }))
    const latestNote = (() => {
      for (const entry of history) {
        const noteChange = (entry.changes ?? []).find(
          (change) => change.field === 'note',
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
        description: normalizeNullableString(problem.category.description),
      },
      location: {
        name: problem.location.name,
        code: normalizeNullableString(problem.location.code),
        description: normalizeNullableString(problem.location.description),
      },
      description: problem.description,
      status: toFrontendStatus(problem.status),
      maintenanceType: problem.maintenanceType ?? null,
      imageUrl: firstAttachment?.url ?? null,
      reporter: problem.reporter.email,
      createdAt: formatDateTime(problem.createdAt),
      updatedAt: problem.updatedAt ? formatDateTime(problem.updatedAt) : null,
      history,
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
        throw new Error(err.message || 'Falha ao mover para a lixeira.')
      }
    },
    onSuccess: async () => {
      await invalidateTrashQueries(queryClient)
      await queryClient.invalidateQueries({
        queryKey: ['problems'],
        refetchType: 'all',
      })
      toast.success('Problema movido para a lixeira.')
      await router.push('/problems')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Falha ao mover para a lixeira.')
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
    if (error?.status === 404) {
      return (
        <ProtectedRoute>
          <PlatformLayout>
            <Head>
              <title>Página não encontrada • Campus Ativo</title>
            </Head>
            <PageContainer withLayout>
              <NotFoundState
                message="O problema que você tentou acessar pode ter sido removido ou o endereço informado não existe mais."
                onBack={handleBackNavigation}
                onGoToProblems={() => void router.replace('/problems')}
              />
            </PageContainer>
          </PlatformLayout>
        </ProtectedRoute>
      )
    }

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
      pathname: '/problems/[id]/edit',
      query: { id, from: 'details' },
    })
  }

  function handleMoveToTrash() {
    if (!canMoveToTrash) return
    setShowTrashConfirmationModal(true)
  }

  function confirmMoveToTrash() {
    moveToTrashMutation.mutate()
    setShowTrashConfirmationModal(false)
  }

  const imageUrl = problemData?.imageUrl ?? null

  function handleOpenImageViewer() {
    if (!imageUrl || imageError) return
    setIsImageViewerOpen(true)
  }

  return (
    <ProtectedRoute>
      <>
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
                Detalhes do problema
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
            {!imageUrl ? (
              <NoImage />
            ) : !imageError ? (
              <ImageButton>
                <ImageContainer
                  src={imageUrl}
                  height={331}
                  width={839}
                  alt={problemData.title}
                  onError={() => setImageError(true)}
                />
                <ImageActionArea
                  type="button"
                  onClick={handleOpenImageViewer}
                  aria-label="Abrir imagem em tamanho completo"
                />
                <ImageHint className="image-hint">
                  <MagnifyingGlassPlus size={18} weight="bold" />
                  <Text as="span" size="sm">
                    Clique para ampliar
                  </Text>
                </ImageHint>
              </ImageButton>
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
              <HistoryHeader
                type="button"
                onClick={() => setIsHistoryOpen((current) => !current)}
                aria-expanded={isHistoryOpen}
                aria-controls="problem-history-panel"
              >
                <div className="history-title">
                  <ClockCounterClockwise
                    className="history-icon"
                    size={18}
                    weight="fill"
                    aria-hidden="true"
                  />
                  <HistorySummary>
                    <Text className="label" size="md">
                      Histórico
                    </Text>
                    <Text size="sm">
                      Acompanhamento das alterações e observações do problema.
                    </Text>
                  </HistorySummary>
                </div>
                <div className="history-header-actions">
                  <HistoryBadge>
                    {problemData.history.length} registro
                    {problemData.history.length === 1 ? '' : 's'}
                  </HistoryBadge>
                  <CaretDown
                    className="history-chevron"
                    size={18}
                    weight="bold"
                  />
                </div>
              </HistoryHeader>
              {isHistoryOpen && (
                <HistoryPanel id="problem-history-panel">
                  {problemData.history.length > 0 ? (
                    <HistoryList>
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
                        const renderedChanges = renderHistoryChanges(changes)
                        const absoluteDate = formatDateTime(entry.createdAt)
                        const hasDetails =
                          visibleChanges.length > 0 ||
                          noteText ||
                          noteWasRemoved

                        return (
                          <HistoryTimelineItem key={entry.id}>
                            <HistoryMarker aria-hidden="true" />
                            <HistoryCard>
                              <HistoryCardHeader>
                                <div className="history-card-title">
                                  <div className="history-card-heading">
                                    <span className="history-actor">
                                      {entry.userName}
                                    </span>
                                    <span className="history-action-text">
                                      {getHistoryActionLabel(entry.action)}
                                    </span>
                                    <span className="history-date-inline">
                                      em {absoluteDate}
                                    </span>
                                  </div>
                                  <HistoryMeta />
                                </div>
                              </HistoryCardHeader>
                              <HistoryCardBody>
                                {hasDetails ? (
                                  <>
                                    {visibleChanges.length > 0 && (
                                      <HistoryChangeList>
                                        {renderedChanges}
                                      </HistoryChangeList>
                                    )}
                                    {noteText && (
                                      <HistoryNote key={`${entry.id}-note`}>
                                        <Text size="sm">
                                          {`Observações: ${noteText}`}
                                        </Text>
                                      </HistoryNote>
                                    )}
                                    {noteWasRemoved && (
                                      <HistoryNote
                                        key={`${entry.id}-note-removed`}
                                      >
                                        <Text size="sm">
                                          Observações removidas.
                                        </Text>
                                      </HistoryNote>
                                    )}
                                  </>
                                ) : (
                                  <Text size="sm">
                                    Nenhum detalhe adicional foi informado neste
                                    registro.
                                  </Text>
                                )}
                              </HistoryCardBody>
                            </HistoryCard>
                          </HistoryTimelineItem>
                        )
                      })}
                    </HistoryList>
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
                problemQueryKey={problemQueryKey ?? problemData.id}
                initialStatus={problemData.status}
                initialMaintenanceType={problemData.maintenanceType}
                initialNote={problemData.latestNote}
              />
            )}
          </Body>
        </Container>

        <ConfirmationModal
          isOpen={showTrashConfirmationModal}
          onClose={() => setShowTrashConfirmationModal(false)}
          onConfirm={confirmMoveToTrash}
          title="Mover para lixeira?"
          message="Este problema será movido para a lixeira. Você poderá restaurá-lo depois se necessário."
          confirmText="Mover para lixeira"
          cancelText="Cancelar"
        />

        {isImageViewerOpen && imageUrl && (
          <ImageViewerOverlay
            onClick={() => setIsImageViewerOpen(false)}
            role="presentation"
          >
            <ImageViewerContent
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="problem-image-viewer-title"
            >
              <ImageViewerHeader>
                <ImageViewerTitle>
                  <Text
                    id="problem-image-viewer-title"
                    size="md"
                    style={{ fontWeight: 700 }}
                  >
                    {problemData.title}
                  </Text>
                </ImageViewerTitle>
                <ImageViewerCloseButton
                  type="button"
                  onClick={() => setIsImageViewerOpen(false)}
                  aria-label="Fechar visualização da imagem"
                >
                  <X size={22} weight="bold" />
                </ImageViewerCloseButton>
              </ImageViewerHeader>

              <ImageViewerFrame>
                <ImageViewerImage src={imageUrl} alt={problemData.title} />
              </ImageViewerFrame>
            </ImageViewerContent>
          </ImageViewerOverlay>
        )}
      </>
    </ProtectedRoute>
  )
}
