import { useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { DownloadSimple, UploadSimple } from 'phosphor-react'
import { Text } from '@/components'
import { parseProblemsCsv, ParsedProblemCsvRow } from './csv-utils'
import {
  CardTitle,
  ColumnChip,
  ColumnExample,
  ErrorBanner,
  FileActions,
  FileCard,
  FileName,
  FooterActions,
  HiddenInput,
  InfoCard,
  InfoPanel,
  PanelBody,
  PanelContent,
  ModalFooter,
  PrimaryButton,
  ResultRow,
  ResultsHeader,
  ResultsList,
  ResultsMeta,
  ResultsPanel,
  RowContent,
  RowMessage,
  RowNumber,
  RowTitle,
  SecondaryButton,
  StatusBadge,
  SummaryCard,
  SummaryGrid,
  SummaryLabel,
  SummaryValue,
} from './styles'

interface CategoryOption {
  id: string
  name: string
}

interface LocationOption {
  id: string
  name: string
  code?: string | null
}

interface PreviewRow extends ParsedProblemCsvRow {
  status: 'ready' | 'duplicate' | 'invalid'
  message: string
}

interface ImportResultItem {
  rowNumber: number
  title: string
  status: 'IMPORTED' | 'DUPLICATE' | 'INVALID'
  message: string
}

interface ImportResponse {
  imported: number
  duplicates: number
  invalid: number
  results: ImportResultItem[]
}

const TITLE_MAX_LENGTH = 100
const DESCRIPTION_MAX_LENGTH = 500

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

function buildFingerprint({
  title,
  description,
  categoryId,
  locationId,
}: {
  title: string
  description: string
  categoryId: string
  locationId: string
}) {
  return [
    normalizeText(title),
    normalizeText(description),
    categoryId,
    locationId,
  ].join('::')
}

function resolvePreviewRows(
  rows: ParsedProblemCsvRow[],
  categories: CategoryOption[],
  locations: LocationOption[],
) {
  const categoryMap = new Map(
    categories.map((category) => [normalizeText(category.name), category]),
  )
  const locationMap = new Map<string, LocationOption>()

  locations.forEach((location) => {
    locationMap.set(normalizeText(location.name), location)
    if (location.code) {
      locationMap.set(normalizeText(location.code), location)
    }
  })

  const seenFingerprints = new Set<string>()

  return rows.map<PreviewRow>((row) => {
    const title = row.title.trim()
    const description = row.description.trim()
    const categoryValue = row.category.trim()
    const locationValue = row.location.trim()

    if (!title) {
      return { ...row, status: 'invalid', message: 'Título é obrigatório.' }
    }

    if (title.length > TITLE_MAX_LENGTH) {
      return {
        ...row,
        status: 'invalid',
        message: `Título deve ter no máximo ${TITLE_MAX_LENGTH} caracteres.`,
      }
    }

    if (!description) {
      return {
        ...row,
        status: 'invalid',
        message: 'Descrição é obrigatória.',
      }
    }

    if (description.length > DESCRIPTION_MAX_LENGTH) {
      return {
        ...row,
        status: 'invalid',
        message: `Descrição deve ter no máximo ${DESCRIPTION_MAX_LENGTH} caracteres.`,
      }
    }

    if (!categoryValue) {
      return {
        ...row,
        status: 'invalid',
        message: 'Categoria é obrigatória.',
      }
    }

    if (!locationValue) {
      return {
        ...row,
        status: 'invalid',
        message: 'Localização é obrigatória.',
      }
    }

    const category = categoryMap.get(normalizeText(categoryValue))

    if (!category) {
      return {
        ...row,
        status: 'invalid',
        message: `Categoria "${categoryValue}" não foi encontrada.`,
      }
    }

    const location = locationMap.get(normalizeText(locationValue))

    if (!location) {
      return {
        ...row,
        status: 'invalid',
        message: `Localização "${locationValue}" não foi encontrada.`,
      }
    }

    const fingerprint = buildFingerprint({
      title,
      description,
      categoryId: category.id,
      locationId: location.id,
    })

    if (seenFingerprints.has(fingerprint)) {
      return {
        ...row,
        status: 'duplicate',
        message: 'Linha duplicada no próprio arquivo.',
      }
    }

    seenFingerprints.add(fingerprint)

    return {
      ...row,
      status: 'ready',
      message: 'Pronta para importação.',
    }
  })
}

export function ImportCsvPanel() {
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFileName, setSelectedFileName] = useState('')
  const [parsedRows, setParsedRows] = useState<ParsedProblemCsvRow[]>([])
  const [localError, setLocalError] = useState<string | null>(null)
  const [importResult, setImportResult] = useState<ImportResponse | null>(null)

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories', 'csv-import'],
    queryFn: async () => {
      const response = await fetch(
        '/api/categories?isActive=true&pageSize=500',
        {
          credentials: 'include',
        },
      )

      if (!response.ok) {
        throw new Error('Falha ao carregar categorias ativas.')
      }

      return response.json() as Promise<{ categories: CategoryOption[] }>
    },
    enabled: true,
    staleTime: 60000,
  })

  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations', 'csv-import'],
    queryFn: async () => {
      const response = await fetch(
        '/api/locations?isActive=true&pageSize=500',
        {
          credentials: 'include',
        },
      )

      if (!response.ok) {
        throw new Error('Falha ao carregar localizações ativas.')
      }

      return response.json() as Promise<{ locations: LocationOption[] }>
    },
    enabled: true,
    staleTime: 60000,
  })

  const categories = categoriesData?.categories ?? []
  const locations = locationsData?.locations ?? []
  const isReferenceDataLoading = isLoadingCategories || isLoadingLocations

  const previewRows = useMemo(
    () =>
      parsedRows.length === 0 || isReferenceDataLoading
        ? []
        : resolvePreviewRows(parsedRows, categories, locations),
    [parsedRows, isReferenceDataLoading, categories, locations],
  )

  const previewCounts = useMemo(
    () => ({
      total: previewRows.length,
      ready: previewRows.filter((row) => row.status === 'ready').length,
      duplicate: previewRows.filter((row) => row.status === 'duplicate').length,
      invalid: previewRows.filter((row) => row.status === 'invalid').length,
    }),
    [previewRows],
  )

  const importMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/problems/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          rows: parsedRows,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao importar o arquivo CSV.')
      }

      return data as ImportResponse
    },
    onSuccess: (data) => {
      setImportResult(data)
      queryClient.invalidateQueries({ queryKey: ['problems'] })

      if (data.imported > 0) {
        toast.success(
          `${data.imported} ${data.imported === 1 ? 'problema importado' : 'problemas importados'} com sucesso.`,
        )
      } else {
        toast.message('Nenhum problema novo foi importado.')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Falha ao importar o arquivo CSV.')
    },
  })

  const visibleRows = importResult?.results ?? previewRows

  const summary = importResult
    ? {
        total: importResult.results.length,
        ready: importResult.imported,
        duplicate: importResult.duplicates,
        invalid: importResult.invalid,
      }
    : previewCounts

  const handleSelectFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setLocalError(null)
    setImportResult(null)

    try {
      const text = await file.text()
      const rows = parseProblemsCsv(text)

      if (rows.length > 500) {
        throw new Error('Use um arquivo com no máximo 500 linhas de dados.')
      }

      setSelectedFileName(file.name)
      setParsedRows(rows)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível ler o arquivo CSV.'
      setSelectedFileName(file.name)
      setParsedRows([])
      setLocalError(message)
    } finally {
      event.target.value = ''
    }
  }

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  const resetState = () => {
    if (importMutation.isPending) {
      return
    }

    setSelectedFileName('')
    setParsedRows([])
    setLocalError(null)
    setImportResult(null)
  }

  return (
    <PanelContent>
      <PanelBody>
        <InfoPanel>
          <InfoCard>
            <CardTitle>Formato esperado</CardTitle>
            <Text size="sm" css={{ color: '$textSecondary' }}>
              O arquivo precisa ter cabeçalho com estas colunas:
            </Text>
            <ColumnExample>
              <ColumnChip>titulo</ColumnChip>
              <ColumnChip>descricao</ColumnChip>
              <ColumnChip>categoria</ColumnChip>
              <ColumnChip>localizacao</ColumnChip>
            </ColumnExample>
            <Text size="sm" css={{ color: '$textSecondary' }}>
              A categoria deve usar o nome cadastrado no sistema. A localização
              pode usar o nome ou o código.
            </Text>
          </InfoCard>

          <FileCard>
            <CardTitle>Arquivo</CardTitle>
            <Text size="sm" css={{ color: '$textSecondary' }}>
              Aceitamos .csv com até 500 linhas por importação.
            </Text>
            <FileActions>
              <HiddenInput
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleSelectFile}
              />
              <SecondaryButton
                type="button"
                variant="secondary"
                onClick={openFilePicker}
              >
                <UploadSimple size={18} weight="bold" />
                {selectedFileName ? 'Escolher outro arquivo' : 'Selecionar CSV'}
              </SecondaryButton>
              {selectedFileName ? (
                <FileName size="sm">{selectedFileName}</FileName>
              ) : null}
            </FileActions>
          </FileCard>
        </InfoPanel>

        {localError ? <ErrorBanner>{localError}</ErrorBanner> : null}

        {selectedFileName && isReferenceDataLoading ? (
          <Text size="sm" css={{ color: '$textSecondary' }}>
            Validando categorias e localizações disponíveis...
          </Text>
        ) : null}

        {summary.total > 0 ? (
          <SummaryGrid>
            <SummaryCard>
              <SummaryLabel size="sm">Linhas lidas</SummaryLabel>
              <SummaryValue>{summary.total}</SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel size="sm">
                {importResult ? 'Importadas' : 'Prontas'}
              </SummaryLabel>
              <SummaryValue>{summary.ready}</SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel size="sm">Duplicadas</SummaryLabel>
              <SummaryValue>{summary.duplicate}</SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel size="sm">Inválidas</SummaryLabel>
              <SummaryValue>{summary.invalid}</SummaryValue>
            </SummaryCard>
          </SummaryGrid>
        ) : null}

        {visibleRows.length > 0 ? (
          <ResultsPanel>
            <ResultsHeader>
              <CardTitle>
                {importResult
                  ? 'Resultado da importação'
                  : 'Prévia da validação'}
              </CardTitle>
              <ResultsMeta size="sm">
                {importResult
                  ? 'As linhas válidas foram processadas; duplicadas e inválidas foram ignoradas.'
                  : 'As linhas sem erro serão importadas quando você confirmar.'}
              </ResultsMeta>
            </ResultsHeader>

            <ResultsList>
              {visibleRows.map((row) => {
                const status =
                  'status' in row ? row.status : ('INVALID' as const)

                const badgeStatus =
                  status === 'IMPORTED'
                    ? 'imported'
                    : status === 'DUPLICATE' || status === 'duplicate'
                      ? 'duplicate'
                      : status === 'ready'
                        ? 'ready'
                        : 'invalid'

                return (
                  <ResultRow key={`${row.rowNumber}-${row.title}`}>
                    <RowNumber size="sm">Linha {row.rowNumber}</RowNumber>
                    <RowContent>
                      <RowTitle size="sm">
                        {row.title || '(sem titulo)'}
                      </RowTitle>
                      <RowMessage size="xs">{row.message}</RowMessage>
                    </RowContent>
                    <StatusBadge status={badgeStatus}>
                      {status === 'IMPORTED'
                        ? 'Importada'
                        : status === 'DUPLICATE' || status === 'duplicate'
                          ? 'Duplicada'
                          : status === 'ready'
                            ? 'Pronta'
                            : 'Inválida'}
                    </StatusBadge>
                  </ResultRow>
                )
              })}
            </ResultsList>
          </ResultsPanel>
        ) : null}

        {visibleRows.length > 0 ? (
          <ModalFooter>
            <FooterActions>
              <SecondaryButton
                type="button"
                variant="secondary"
                onClick={resetState}
                disabled={importMutation.isPending}
              >
                {importResult ? 'Nova importação' : 'Limpar'}
              </SecondaryButton>
              {!importResult ? (
                <PrimaryButton
                  type="button"
                  variant="primary"
                  onClick={() => importMutation.mutate()}
                  disabled={
                    importMutation.isPending ||
                    isReferenceDataLoading ||
                    parsedRows.length === 0 ||
                    summary.ready === 0
                  }
                >
                  <DownloadSimple size={18} weight="bold" />
                  {importMutation.isPending
                    ? 'Importando...'
                    : `Importar ${summary.ready} ${
                        summary.ready === 1 ? 'item' : 'itens'
                      }`}
                </PrimaryButton>
              ) : null}
            </FooterActions>
          </ModalFooter>
        ) : null}
      </PanelBody>
    </PanelContent>
  )
}
