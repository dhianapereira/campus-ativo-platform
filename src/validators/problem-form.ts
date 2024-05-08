import { z } from 'zod'

export const problemFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'O campo título é obrigatório.')
    .max(50, 'O título não pode passar de 50 caracteres.'),
  location: z
    .string()
    .trim()
    .min(1, 'O campo local é obrigatório.')
    .max(25, 'O local não pode passar de 25 caracteres.'),
  description: z
    .string()
    .trim()
    .min(1, 'O campo descrição é obrigatório.')
    .max(200, 'A descrição não pode passar de 200 caracteres.'),
})
