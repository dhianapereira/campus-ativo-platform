export type DashboardMetrics = {
  toAnalysisCount: number
  inAnalysisCount: number
  inProgressCount: number
  totalProblems: number
  recentProblems: number
  top3Locations: { name: string; count: number }[]
  top3Categories: { name: string; count: number }[]
  maintenanceByMonth: {
    month: string
    label: string
    preventive: number
    corrective: number
  }[]
}

export type DashboardReportData = {
  period: { startDate: string; endDate: string }
  totalProblems: number
  byStatus: { status: string; label: string; count: number }[]
  byCategory: { categoryId: string; name: string; count: number }[]
  byLocation: { locationId: string | null; name: string; count: number }[]
  byMaintenanceType: { type: string | null; label: string; count: number }[]
  problems: {
    title: string
    description: string
    location: string
    createdAt: string
    status: string
    category: string
    maintenanceType: string
  }[]
}
