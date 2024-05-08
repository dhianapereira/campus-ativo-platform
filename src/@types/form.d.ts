import { loginFormSchema } from '@/validators/login-form'
import { problemFormSchema } from '@/validators/problem-form'
import { z } from 'zod'

type LoginFormData = z.infer<typeof loginFormSchema>

type ProblemFormData = z.infer<typeof problemFormSchema>
