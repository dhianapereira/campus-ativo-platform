import { IMaintenance } from './maintenance-types.d'

export const maintenanceTypes: IMaintenance[] = [
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
