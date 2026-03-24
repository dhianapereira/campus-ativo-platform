import { ProblemResponseStatus } from '@/lib/api/generated/models'

export enum ProblemStatus {
  ToAnalysis = 'toAnalysis',
  InAnalysis = 'inAnalysis',
  Accepted = 'accepted',
  Rejected = 'rejected',
  InProgress = 'inProgress',
  Finished = 'finished',
}

export interface ProblemStatusOption {
  name: string
  value: ProblemStatus
}

export const backendStatusToProblemStatus: Record<
  ProblemResponseStatus,
  ProblemStatus
> = {
  TO_ANALYSIS: ProblemStatus.ToAnalysis,
  IN_ANALYSIS: ProblemStatus.InAnalysis,
  ACCEPTED: ProblemStatus.Accepted,
  REJECTED: ProblemStatus.Rejected,
  IN_PROGRESS: ProblemStatus.InProgress,
  FINISHED: ProblemStatus.Finished,
}

export const problemStatusOptions: ProblemStatusOption[] = [
  { name: 'Para análise', value: ProblemStatus.ToAnalysis },
  { name: 'Em Análise', value: ProblemStatus.InAnalysis },
  { name: 'Aceito', value: ProblemStatus.Accepted },
  { name: 'Recusado', value: ProblemStatus.Rejected },
  { name: 'Em Andamento', value: ProblemStatus.InProgress },
  { name: 'Concluído', value: ProblemStatus.Finished },
]
