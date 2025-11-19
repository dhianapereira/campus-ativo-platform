import type { NextApiRequest, NextApiResponse } from 'next'
import { CreateAccountRequest } from '../../../server/client/models'
import { createAccountControllerHandle } from '../../../server/client/authentication/authentication'

interface RegisterResponse {
  success: boolean
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { name, position, email, password }: CreateAccountRequest = req.body

    if (!name || !position || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Todos os campos são obrigatórios',
      })
    }

    await createAccountControllerHandle({
      name,
      position,
      email,
      password,
    })

    return res.status(201).json({
      success: true,
    })
  } catch (error: unknown) {
    const err = error as {
      response?: {
        status?: number
        data?: { error?: string; message?: string }
      }
      message?: string
    }
    const status = err?.response?.status ?? 500
    const backendError =
      err?.response?.data?.error || err?.response?.data?.message || err?.message

    let message = backendError || 'Erro interno do servidor'

    if (status === 400) {
      message = 'Dados inválidos ou domínio de email não permitido'
    } else if (status === 409) {
      message = 'Este e-mail já está cadastrado no sistema'
    }

    return res.status(status).json({
      success: false,
      error: message,
    })
  }
}
