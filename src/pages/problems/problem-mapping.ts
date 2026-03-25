import { maintenanceTypeOptions } from '@/constants/problems/maintenance-types'
import {
  ProblemStatus,
  problemStatusOptions,
} from '@/constants/problems/status'

const FRONTEND_STATUS_TO_BACKEND: Record<string, string> = {
  [ProblemStatus.ToAnalysis]: 'TO_ANALYSIS',
  [ProblemStatus.InAnalysis]: 'IN_ANALYSIS',
  [ProblemStatus.Accepted]: 'ACCEPTED',
  [ProblemStatus.Rejected]: 'REJECTED',
  [ProblemStatus.InProgress]: 'IN_PROGRESS',
  [ProblemStatus.Finished]: 'FINISHED',
}

const BACKEND_STATUS_TO_FRONTEND: Record<string, string> = Object.fromEntries(
  Object.entries(FRONTEND_STATUS_TO_BACKEND).map(([frontend, backend]) => [
    backend,
    frontend,
  ]),
)

const FRONTEND_MAINTENANCE_TO_BACKEND: Record<string, string> = {
  preventive: 'PREVENTIVE',
  corrective: 'CORRECTIVE',
}

const BACKEND_MAINTENANCE_TO_FRONTEND: Record<string, string> =
  Object.fromEntries(
    Object.entries(FRONTEND_MAINTENANCE_TO_BACKEND).map(
      ([frontend, backend]) => [backend, frontend],
    ),
  )

export function toBackendStatus(status?: string | null) {
  if (!status) return undefined
  return FRONTEND_STATUS_TO_BACKEND[status] ?? status
}

export function toFrontendStatus(status?: string | null) {
  if (!status) return ''
  return BACKEND_STATUS_TO_FRONTEND[status] ?? status
}

export function getStatusLabel(status?: string | null) {
  if (!status) return '—'

  const frontendStatus = toFrontendStatus(status)
  return (
    problemStatusOptions.find((item) => item.value === frontendStatus)?.name ??
    frontendStatus
  )
}

export function toBackendMaintenanceType(maintenanceType?: string | null) {
  if (!maintenanceType) return undefined
  return FRONTEND_MAINTENANCE_TO_BACKEND[maintenanceType] ?? maintenanceType
}

export function toFrontendMaintenanceType(maintenanceType?: string | null) {
  if (!maintenanceType) return ''
  return BACKEND_MAINTENANCE_TO_FRONTEND[maintenanceType] ?? maintenanceType
}

export function getMaintenanceTypeLabel(maintenanceType?: string | null) {
  if (!maintenanceType) return '—'

  const frontendMaintenanceType = toFrontendMaintenanceType(maintenanceType)
  return (
    maintenanceTypeOptions.find((item) => item.id === frontendMaintenanceType)
      ?.label ?? frontendMaintenanceType
  )
}

export function getHistoryActionLabel(action?: string | null) {
  switch (action) {
    case 'STATUS_CHANGED':
      return 'Status alterado'
    case 'MAINTENANCE_TYPE_CHANGED':
      return 'Tipo de manutenção alterado'
    case 'NOTE_ADDED':
      return 'Observação adicionada'
    case 'UPDATED':
      return 'Alterações registradas'
    default:
      return 'Atualização registrada'
  }
}
