import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteUserAccountControllerHandle } from '../../../lib/api/generated/user-profile/user-profile'
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

  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ message: 'ID do usuário é obrigatório.' })
    }

    const result = await deleteUserAccountControllerHandle(userId, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    res.setHeader(
      'Set-Cookie',
      'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict',
    )

    return res.status(200).json(result)
  } catch (error) {
    return sendSafeError(res, error, {
      route: 'API /profile/delete',
      fallbackMessage: 'Erro ao excluir conta.',
    })
  }
}
