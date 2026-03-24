export interface MaintenanceTypeOption {
  id: string
  label: string
  isActive: boolean
}

export const maintenanceTypeOptions: MaintenanceTypeOption[] = [
  {
    id: 'preventive',
    label: 'Preventiva',
    isActive: false,
  },
  {
    id: 'corrective',
    label: 'Corretiva',
    isActive: false,
  },
]
