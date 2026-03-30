import type { NextApiRequest, NextApiResponse } from 'next'
import { trashCategoryControllerHandle } from '../../../../lib/api/generated/categories/categories'
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
      await trashCategoryControllerHandle(id, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      return res
        .status(200)
        .json({ message: 'Categoria movida para a lixeira com sucesso.' })
    } catch (error) {
      return sendSafeError(res, error, {
        route: 'API /categories/[id]/trash',
        fallbackMessage: 'Erro ao mover categoria para a lixeira.',
      })
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}
