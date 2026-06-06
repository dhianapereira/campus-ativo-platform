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
  TopCard,
  CardTitle,
  TopList,
  TopListItem,
  TopItemRank,
  TopItemContent,
  TopItemHeader,
  TopItemName,
  TopItemCount,
  TopItemMetaRow,
  TopItemTag,
  TopItemDescription,
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
} from './styles'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type {
  DashboardMetrics,
  DashboardTopCategory,
  DashboardTopLocation,
} from './types'
import { DashboardShimmer } from '@/layouts/platform/components/DashboardShimmer'
import { Button, LoadErrorState } from '@/components'
import { colors } from '@/styles/tokens'
import { FileText, MagnifyingGlass, Gear } from 'phosphor-react'
import { ReportModal } from '@/layouts/platform/components/ReportModal'
import { RoleProtectedRoute } from '@/guards/RoleProtectedRoute'
import { useAuthPermissions } from '@/contexts/auth-context'

const EMPTY_TOP_MESSAGE =
  'Não há dados suficientes ainda para exibir esta lista.'

function formatTopCount(count: number) {
  return `${count} ${count === 1 ? 'registro' : 'registros'}`
}

function renderTopLocationItem(item: DashboardTopLocation, index: number) {
  const name = item.name?.trim() || 'Localização sem nome'
  const description = item.description?.trim()
  const code = item.code?.trim()

  return (
    <TopListItem key={item.locationId ?? `${item.name}-${index}`}>
      <TopItemRank>{index + 1}</TopItemRank>
      <TopItemContent>
        <TopItemHeader>
          <TopItemName>{name}</TopItemName>
          <TopItemCount>{formatTopCount(item.count)}</TopItemCount>
        </TopItemHeader>
        {code ? (
          <TopItemMetaRow>
            <TopItemTag>Código: {code}</TopItemTag>
          </TopItemMetaRow>
        ) : null}
        {description ? (
          <TopItemDescription>{description}</TopItemDescription>
        ) : null}
      </TopItemContent>
    </TopListItem>
  )
}

function renderTopCategoryItem(item: DashboardTopCategory, index: number) {
  const name = item.name?.trim() || 'Categoria sem nome'
  const description = item.description?.trim()

  return (
    <TopListItem key={item.categoryId ?? `${item.name}-${index}`}>
      <TopItemRank>{index + 1}</TopItemRank>
      <TopItemContent>
        <TopItemHeader>
          <TopItemName>{name}</TopItemName>
          <TopItemCount>{formatTopCount(item.count)}</TopItemCount>
        </TopItemHeader>
        {description ? (
          <TopItemDescription>{description}</TopItemDescription>
        ) : null}
      </TopItemContent>
    </TopListItem>
  )
}

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
        <TopCard>
          <CardTitle>Top 3 setores mais afetados</CardTitle>
          {data.top3Locations.length > 0 ? (
            <TopList>{data.top3Locations.map(renderTopLocationItem)}</TopList>
          ) : (
            <EmptyTopMessage>{EMPTY_TOP_MESSAGE}</EmptyTopMessage>
          )}
        </TopCard>
        <TopCard>
          <CardTitle>Top 3 categorias mais reportadas</CardTitle>
          {data.top3Categories.length > 0 ? (
            <TopList>{data.top3Categories.map(renderTopCategoryItem)}</TopList>
          ) : (
            <EmptyTopMessage>{EMPTY_TOP_MESSAGE}</EmptyTopMessage>
          )}
        </TopCard>
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

function DashboardPage() {
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
            'Falha ao carregar o dashboard.',
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
          <LoadErrorState
            badge="Dashboard indisponível"
            title="Não conseguimos carregar o dashboard agora"
            description="Os indicadores não puderam ser atualizados neste momento. Isso costuma acontecer quando o servidor está reiniciando ou a conexão caiu por alguns instantes."
            onRetry={() => refetch()}
            isRetrying={isRefetching}
            tips={[
              'Se você acabou de religar o servidor, aguarde alguns segundos antes de tentar de novo.',
              'Quando a conexão voltar, os dados do painel serão carregados normalmente.',
            ]}
          />
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

export default function Dashboard() {
  const { canAccessDashboard } = useAuthPermissions()

  return (
    <RoleProtectedRoute canAccess={canAccessDashboard()}>
      <DashboardPage />
    </RoleProtectedRoute>
  )
}
