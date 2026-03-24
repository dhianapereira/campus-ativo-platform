export interface ProblemHistoryEntry {
  id: string
  action: string
  userName: string
  oldValue?: string | null
  newValue?: string | null
  note?: string | null
  createdAt: string
}

export interface ProblemDetailsProps {
  id: string
  title: string
  location: string
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
