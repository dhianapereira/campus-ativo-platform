import { Status } from '@/data/static/status-data'
import { z } from 'zod'

/**
 * This list contains the statuses required to carry out
 * certain actions, such as filling in the notes field
 * and the maintenance type field.
 */
const requiredStatus = [Status.Accepted, Status.InProgress, Status.Finished]

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
    if (data.status === Status.Rejected && !data.note) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Este campo é obrigatório.',
        path: ['note'],
      })
    }
    if (requiredStatus.includes(data.status as Status) && !data.category) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Este campo é obrigatório.',
        path: ['category'],
      })
    }
    if (requiredStatus.includes(data.status as Status) && !data.maintenance) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Este campo é obrigatório.',
        path: ['maintenance'],
      })
    }
  })
