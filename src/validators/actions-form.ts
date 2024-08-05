import { Status } from '@/data/static/status-data'
import { z } from 'zod'

export const actionsFormSchema = z
  .object({
    status: z.string().trim().min(1, 'Este campo é obrigatório.'),
    note: z
      .string()
      .trim()
      .max(200, 'A descrição não pode passar de 200 caracteres.')
      .optional(),
    category: z.string().trim().optional(),
    maintenance: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    // Verifica se o status é 'Rejected' e se a nota está ausente
    if (data.status === Status.Rejected && !data.note) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Este campo é obrigatório.',
        path: ['note'],
      })
    }
    // Verifica se o status é 'Accepted', 'InProgress' ou 'Finished' e se a categoria está ausente
    if (
      [Status.Accepted, Status.InProgress, Status.Finished].includes(
        data.status as Status,
      ) &&
      !data.category
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Este campo é obrigatório.',
        path: ['category'],
      })
    }
    // Verifica se o status é 'Accepted', 'InProgress' ou 'Finished' e se a manutenção está ausente
    if (
      [Status.Accepted, Status.InProgress, Status.Finished].includes(
        data.status as Status,
      )
      && !data.maintenance
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Este campo é obrigatório.',
        path: ['maintenance'],
      })
    }
  })
