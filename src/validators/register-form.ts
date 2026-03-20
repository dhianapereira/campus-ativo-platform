import { z } from 'zod'

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'O campo nome é obrigatório.')
      .min(3, 'O nome precisa ter no mínimo 3 caracteres.')
      .max(100, 'O nome não pode passar de 100 caracteres.'),
    position: z
      .string()
      .trim()
      .min(1, 'O campo cargo é obrigatório.')
      .min(3, 'O cargo precisa ter no mínimo 3 caracteres.')
      .max(100, 'O cargo não pode passar de 100 caracteres.'),
    email: z
      .string()
      .trim()
      .min(1, 'O campo e-mail é obrigatório.')
      .regex(
        /^[a-z0-9.]+@+(ifal\.edu\.br|aluno\.ifal\.edu\.br)$/i,
        'O e-mail deve ser do domínio @ifal.edu.br ou @aluno.ifal.edu.br',
      ),
    password: z
      .string()
      .trim()
      .min(1, 'O campo senha é obrigatório.')
      .min(6, 'A senha precisa ter no mínimo 6 caracteres.')
      .regex(
        /^(?=.*[A-Z])(?=.*\d).{6,}$/,
        'A senha precisa ter letras maiúsculas e números.',
      ),
    confirmPassword: z
      .string()
      .trim()
      .min(1, 'O campo confirmação de senha é obrigatório.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })
