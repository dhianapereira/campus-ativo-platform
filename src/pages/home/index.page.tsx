import PlatformLayout from '@/layouts/platform/layout'
import {
  MainContainer,
  DashboardHeader,
  DashboardTitle,
  FilterSelect,
  MetricsGrid,
  MetricCard,
  MetricIconWrapper,
  MetricValue,
  MetricLabel,
  TopGrid,
  Card,
  CardTitle,
  TopList,
  TopListItem,
  EmptyTopMessage,
  ChartCard,
  ChartTitleRow,
  ChartLegend,
  ChartLegendItem,
  ChartLegendColor,
  ChartWrapper,
  ChartYAxis,
  ChartBars,
  ChartBarGroup,
  ChartBarWrapper,
  ChartBar,
  ChartMonthLabel,
  ErrorState,
  ErrorTitle,
  ErrorMessage,
} from './styles'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { DashboardMetrics } from './types'
import { DashboardShimmer } from '@/layouts/platform/components/DashboardShimmer'
import { Button } from '@/components'
import { colors } from '@/styles/tokens'
import { FileText, MagnifyingGlass, Gear } from 'phosphor-react'
import { ReportModal } from '@/layouts/platform/components/ReportModal'

const EMPTY_TOP_MESSAGE =
  'Não há dados suficientes ainda para exibir esta lista.'

function DashboardContent({
  data,
  selectedPeriod,
  onPeriodChange,
  onOpenReportModal,
}: {
  data: DashboardMetrics
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  onOpenReportModal: () => void
}) {
  const maxBar =
    Math.max(
      ...data.maintenanceByMonth.flatMap((m) => [m.preventive, m.corrective]),
      1,
    ) || 1

  return (
    <>
      <DashboardHeader>
        <DashboardTitle>Dashboard</DashboardTitle>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <FilterSelect
            aria-label="Filtrar por período"
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </FilterSelect>
          <Button
            type="button"
            variant="primary"
            onClick={onOpenReportModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FileText size={18} weight="bold" />
            Gerar relatório
          </Button>
        </div>
      </DashboardHeader>

      <MetricsGrid>
        <MetricCard>
          <MetricIconWrapper variant="blue">
            <FileText size={24} weight="duotone" />
          </MetricIconWrapper>
          <div>
            <MetricValue>{data.toAnalysisCount}</MetricValue>
            <MetricLabel>Para análise</MetricLabel>
          </div>
        </MetricCard>
        <MetricCard>
          <MetricIconWrapper variant="indigo">
            <MagnifyingGlass size={24} weight="duotone" />
          </MetricIconWrapper>
          <div>
            <MetricValue>{data.inAnalysisCount}</MetricValue>
            <MetricLabel>Em análise</MetricLabel>
          </div>
        </MetricCard>
        <MetricCard>
          <MetricIconWrapper variant="orange">
            <Gear size={24} weight="duotone" />
          </MetricIconWrapper>
          <div>
            <MetricValue>{data.inProgressCount}</MetricValue>
            <MetricLabel>Em progresso</MetricLabel>
          </div>
        </MetricCard>
      </MetricsGrid>

      <TopGrid>
        <Card>
          <CardTitle>Top 3 setores mais afetados</CardTitle>
          {data.top3Locations.length > 0 ? (
            <TopList>
              {data.top3Locations.map((item, index) => (
                <TopListItem key={`${item.name}-${index}`}>
                  {item.name}
                </TopListItem>
              ))}
            </TopList>
          ) : (
            <EmptyTopMessage>{EMPTY_TOP_MESSAGE}</EmptyTopMessage>
          )}
        </Card>
        <Card>
          <CardTitle>Top 3 categorias mais reportadas</CardTitle>
          {data.top3Categories.length > 0 ? (
            <TopList>
              {data.top3Categories.map((item, index) => (
                <TopListItem key={`${item.name}-${index}`}>
                  {item.name}
                </TopListItem>
              ))}
            </TopList>
          ) : (
            <EmptyTopMessage>{EMPTY_TOP_MESSAGE}</EmptyTopMessage>
          )}
        </Card>
      </TopGrid>

      <ChartCard>
        <ChartTitleRow>
          <CardTitle>Manutenção Preventiva vs Corretiva</CardTitle>
          <ChartLegend>
            <ChartLegendItem>
              <ChartLegendColor
                style={{ backgroundColor: colors.orange }}
                aria-hidden
              />
              <span>Corretiva</span>
            </ChartLegendItem>
            <ChartLegendItem>
              <ChartLegendColor
                style={{ backgroundColor: colors.green }}
                aria-hidden
              />
              <span>Preventiva</span>
            </ChartLegendItem>
          </ChartLegend>
        </ChartTitleRow>
        <ChartWrapper>
          <ChartYAxis aria-hidden>
            <span>100</span>
            <span>80</span>
            <span>60</span>
            <span>40</span>
            <span>20</span>
            <span>0</span>
          </ChartYAxis>
          <ChartBars>
            {data.maintenanceByMonth.map((month) => (
              <ChartBarGroup key={month.month}>
                <ChartBarWrapper>
                  <ChartBar
                    style={{
                      height: `${(month.corrective / maxBar) * 100}%`,
                      backgroundColor: colors.orange,
                    }}
                    title={`Corretiva: ${month.corrective}`}
                  />
                  <ChartBar
                    style={{
                      height: `${(month.preventive / maxBar) * 100}%`,
                      backgroundColor: colors.green,
                    }}
                    title={`Preventiva: ${month.preventive}`}
                  />
                </ChartBarWrapper>
                <ChartMonthLabel>{month.label}</ChartMonthLabel>
              </ChartBarGroup>
            ))}
          </ChartBars>
        </ChartWrapper>
      </ChartCard>
    </>
  )
}

export default function Home() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('30')

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['dashboard', selectedPeriod],
    queryFn: async () => {
      const params = new URLSearchParams({ days: selectedPeriod })
      const res = await fetch(`/api/dashboard?${params.toString()}`, {
        credentials: 'include',
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(
          (err as { message?: string }).message ||
            'Falha ao carregar o dashboard',
        )
      }
      return res.json() as Promise<DashboardMetrics>
    },
    retry: 1,
  })

  if (error) {
    return (
      <PlatformLayout>
        <MainContainer>
          <DashboardHeader>
            <DashboardTitle>Dashboard</DashboardTitle>
          </DashboardHeader>
          <ErrorState>
            <ErrorTitle>Erro ao carregar o dashboard</ErrorTitle>
            <ErrorMessage>
              {error instanceof Error
                ? error.message
                : 'Não foi possível carregar os dados. Tente novamente mais tarde.'}
            </ErrorMessage>
            <Button
              variant="primary"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              {isRefetching ? 'Carregando...' : 'Tentar novamente'}
            </Button>
          </ErrorState>
        </MainContainer>
      </PlatformLayout>
    )
  }

  if (isLoading || !data) {
    return (
      <PlatformLayout>
        <MainContainer>
          <DashboardHeader>
            <DashboardTitle>Dashboard</DashboardTitle>
          </DashboardHeader>
          <DashboardShimmer />
        </MainContainer>
      </PlatformLayout>
    )
  }

  return (
    <PlatformLayout>
      <MainContainer>
        <DashboardContent
          data={data}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
      </MainContainer>
    </PlatformLayout>
  )
}
