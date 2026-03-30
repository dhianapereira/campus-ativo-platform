import type { NextApiRequest, NextApiResponse } from 'next'
import { changeUserStatusControllerHandle } from '../../../../lib/api/generated/user-management/user-management'
import { sendSafeError } from '../../_helpers/error-response'

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
      return sendSafeError(res, error, {
        route: 'API /users/[id]/status',
        fallbackMessage: 'Erro ao alterar status do usuário.',
      })
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}
