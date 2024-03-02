import { loginFormSchema } from '@/validators/login-form'
import { z } from 'zod'

type LoginFormData = z.infer<typeof loginFormSchema>
