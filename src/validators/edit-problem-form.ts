import { z } from 'zod'

export const editProblemFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'O campo título é obrigatório.')
    .max(100, 'O título não pode passar de 100 caracteres.'),
  categoryId: z.string().min(1, 'Selecione uma categoria.'),
  locationId: z.string().min(1, 'Selecione uma localização.'),
  description: z
    .string()
    .trim()
    .min(1, 'O campo descrição é obrigatório.')
    .max(500, 'A descrição não pode passar de 500 caracteres.'),
})

export type EditProblemFormData = z.infer<typeof editProblemFormSchema>
