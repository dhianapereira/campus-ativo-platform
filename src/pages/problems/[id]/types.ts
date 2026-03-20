export interface ProblemDetailsProps {
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
}
