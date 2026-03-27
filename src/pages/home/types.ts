export type DashboardTopLocation = {
  locationId: string | null
  name: string
  code: string | null
  description: string | null
  count: number
}

export type DashboardTopCategory = {
  categoryId: string | null
  name: string
  description: string | null
  count: number
}

export type DashboardMetrics = {
  toAnalysisCount: number
  inAnalysisCount: number
  inProgressCount: number
  totalProblems: number
  recentProblems: number
  top3Locations: DashboardTopLocation[]
  top3Categories: DashboardTopCategory[]
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
  byCategory: {
    categoryId: string | null
    name: string
    description: string | null
    count: number
  }[]
  byLocation: {
    locationId: string | null
    name: string
    code: string | null
    description: string | null
    count: number
  }[]
  byMaintenanceType: { type: string | null; label: string; count: number }[]
  problems: {
    title: string
    description: string
    location: string
    locationCode: string | null
    locationDescription: string | null
    createdAt: string
    status: string
    category: string
    categoryDescription: string | null
    maintenanceType: string
  }[]
}
