import { useState, useCallback } from 'react'
import {
  Overlay,
  Content,
  Title,
  Form,
  Field,
  Label,
  Input,
  Presets,
  PresetButton,
  ErrorMessage,
  Footer,
  CloseButton,
  SubmitButton,
} from './styles'
import { X } from 'phosphor-react'
import type { DashboardReportData } from '@/@types/dashboard'
import { generateReportPdf } from '@/utils/generate-report-pdf'

function getPeriodDates(days: number): { start: string; end: string } {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  }
}

function toInputDate(iso: string): string {
  try {
    return iso.slice(0, 10)
  } catch {
    return ''
  }
}

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const defaultRange = getPeriodDates(30)
  const [startDate, setStartDate] = useState(toInputDate(defaultRange.start))
  const [endDate, setEndDate] = useState(toInputDate(defaultRange.end))
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePreset = useCallback((days: number) => {
    const { start, end } = getPeriodDates(days)
    setStartDate(toInputDate(start))
    setEndDate(toInputDate(end))
    setError(null)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)
      if (!startDate || !endDate) {
        setError('Selecione a data inicial e a data final.')
        return
      }
      const start = new Date(startDate + 'T00:00:00.000Z')
      const end = new Date(endDate + 'T23:59:59.999Z')
      if (start > end) {
        setError('A data inicial não pode ser maior que a data final.')
        return
      }
      setLoading(true)
      try {
        const params = new URLSearchParams({
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        })
        const res = await fetch(`/api/dashboard/report?${params}`, {
          credentials: 'include',
        })
        const data = await res.json()
        if (!res.ok) {
          setError(
            (data as { message?: string }).message ||
              'Erro ao gerar relatório. Tente novamente.',
          )
          return
        }
        generateReportPdf(data as DashboardReportData)
        onClose()
      } catch (err) {
        console.error(err)
        setError(
          'Não foi possível gerar o relatório. Verifique sua conexão e tente novamente.',
        )
      } finally {
        setLoading(false)
      }
    },
    [startDate, endDate, onClose],
  )

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && !loading) onClose()
    },
    [onClose, loading],
  )

  if (!isOpen) return null

  return (
    <Overlay
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <Content onClick={(e) => e.stopPropagation()}>
        <CloseButton
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          disabled={loading}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={24} weight="bold" />
        </CloseButton>

        <Title id="report-modal-title">Gerar relatório em PDF</Title>

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="report-start">Período do relatório</Label>
            <Presets>
              <PresetButton type="button" onClick={() => handlePreset(7)}>
                Últimos 7 dias
              </PresetButton>
              <PresetButton type="button" onClick={() => handlePreset(30)}>
                Últimos 30 dias
              </PresetButton>
              <PresetButton type="button" onClick={() => handlePreset(90)}>
                Últimos 90 dias
              </PresetButton>
            </Presets>
          </Field>

          <Field>
            <Label htmlFor="report-start">Data inicial</Label>
            <Input
              id="report-start"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                setError(null)
              }}
              required
            />
          </Field>

          <Field>
            <Label htmlFor="report-end">Data final</Label>
            <Input
              id="report-end"
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                setError(null)
              }}
              required
            />
          </Field>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Footer>
            <CloseButton type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </CloseButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar PDF'}
            </SubmitButton>
          </Footer>
        </Form>
      </Content>
    </Overlay>
  )
}
