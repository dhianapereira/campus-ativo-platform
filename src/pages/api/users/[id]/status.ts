import type { NextApiRequest, NextApiResponse } from 'next'
import { changeUserStatusControllerHandle } from '../../../../../server/client/user-management/user-management'

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
      const { isActive } = req.body

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ message: 'isActive deve ser um boolean' })
      }

      const result = await changeUserStatusControllerHandle(
        id,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      )

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
