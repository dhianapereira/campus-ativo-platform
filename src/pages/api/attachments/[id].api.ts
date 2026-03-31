import type { NextApiRequest, NextApiResponse } from 'next'
import { sendSafeError } from '../_helpers/error-response'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Método não permitido.' })
  }

  const authToken = req.cookies['auth-token']

  if (!authToken) {
    return res.status(401).json({ message: 'Não autenticado.' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID do attachment é obrigatório.' })
  }

  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3333'

    const response = await fetch(`${backendUrl}/attachments/${id}/orphan`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    if (!response.ok) {
      const responseBody = await response.json().catch(() => null)
      return res.status(response.status).json({
        message: responseBody?.message || 'Erro ao excluir attachment.',
      })
    }

    return res.status(204).end()
  } catch (error) {
    return sendSafeError(res, error, {
      route: 'API /attachments/[id] DELETE',
      fallbackMessage: 'Erro ao excluir attachment.',
    })
  }
}
