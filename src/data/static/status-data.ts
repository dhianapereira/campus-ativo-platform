import { Item } from '@/@types/basic-types'
import { ProblemResponseStatus } from '@/server/client/models'

export enum Status {
  ToAnalysis = 'toAnalysis',
  InAnalysis = 'inAnalysis',
  Accepted = 'accepted',
  Rejected = 'rejected',
  InProgress = 'inProgress',
  Finished = 'finished',
}

export const BACKEND_STATUS_TO_FRONTEND: Record<ProblemResponseStatus, Status> =
  {
    TO_ANALYSIS: Status.ToAnalysis,
    IN_ANALYSIS: Status.InAnalysis,
    ACCEPTED: Status.Accepted,
    REJECTED: Status.Rejected,
    IN_PROGRESS: Status.InProgress,
    FINISHED: Status.Finished,
  }

export const StatusDataList: Item[] = [
  {
    name: 'Para análise',
    value: Status.ToAnalysis,
  },
  {
    name: 'Em análise',
    value: Status.InAnalysis,
  },
  {
    name: 'Aceito',
    value: Status.Accepted,
  },
  {
    name: 'Recusado',
    value: Status.Rejected,
  },
  {
    name: 'Em andamento',
    value: Status.InProgress,
  },
  {
    name: 'Concluído',
    value: Status.Finished,
  },
]
