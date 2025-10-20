import type { NextApiRequest, NextApiResponse } from 'next'
import { editLocationControllerHandle } from '../../../../server/client/locations/locations'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authToken = req.cookies['auth-token']

  if (!authToken) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID inválido' })
  }

  if (req.method === 'PATCH') {
    try {
      const { name, code, description, isActive } = req.body

      if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Nome é obrigatório' })
      }

      const locationData = {
        name,
        code: code ?? undefined,
        description: description ?? undefined,
        isActive: isActive ?? true,
      }

      const result = await editLocationControllerHandle(id, locationData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      return res.status(200).json(result)
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as unknown as {
          response?: { status?: number; data?: { message?: string } }
        }
        const status = axiosError.response?.status || 500
        const errorData = axiosError.response?.data || {}

        return res.status(status).json(errorData)
      }

      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}
