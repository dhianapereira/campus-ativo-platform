export interface ProblemHistoryChange {
  field: 'status' | 'category' | 'maintenanceType' | 'note'
  oldValue?: string | null
  newValue?: string | null
}

export interface ProblemHistoryEntry {
  id: string
  action: string
  userName: string
  note?: string | null
  changes?: ProblemHistoryChange[] | null
  createdAt: string
}

export interface ProblemDetailsProps {
  id: string
  title: string
  location: {
    name: string
    code: string | null
    description: string | null
  }
  description: string
  status: string
  category: string | null
  maintenanceType: string | null
  imageUrl: string | null
  reporter: string
  createdAt: string
  updatedAt: string | null
  history: ProblemHistoryEntry[]
  latestNote: string
}
