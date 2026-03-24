import type { NextApiRequest, NextApiResponse } from 'next'
import { trashProblemControllerHandle } from '../../../../lib/api/generated/problems/problems'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  const authToken = req.cookies['auth-token']
  if (!authToken) {
    return res.status(401).json({ message: 'Não autenticado' })
  }

  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID do problema é obrigatório' })
  }

  try {
    await trashProblemControllerHandle(id, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    return res.status(204).end()
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: { message?: string } }
      message?: string
    }
    const status = axiosError.response?.status ?? 500
    const message =
      axiosError.response?.data?.message ??
      axiosError.message ??
      'Não foi possível mover o problema para a lixeira.'
    return res.status(status).json({ message })
  }
}
