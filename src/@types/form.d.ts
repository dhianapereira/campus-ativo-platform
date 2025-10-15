import { loginFormSchema } from '@/validators/login-form'
import { registerFormSchema } from '@/validators/register-form'
import { problemFormSchema } from '@/validators/problem-form'
import { actionsFormSchema } from '@/validators/actions-form'
import { z } from 'zod'

type LoginFormData = z.infer<typeof loginFormSchema>

type RegisterFormData = z.infer<typeof registerFormSchema>

type ProblemFormData = z.infer<typeof problemFormSchema>

type ActionsFormData = z.infer<typeof actionsFormSchema>
