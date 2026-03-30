import type { NextApiRequest, NextApiResponse } from 'next'
import { changeUserRoleControllerHandle } from '../../../../lib/api/generated/user-management/user-management'
import type { ChangeUserRoleControllerHandleBodyRole } from '../../../../lib/api/generated/models'
import { sendSafeError } from '../../_helpers/error-response'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { id },
    method,
  } = req

  if (method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid user id' })
  }

  const authToken = req.cookies['auth-token']

  if (!authToken) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const body = req.body as { role: ChangeUserRoleControllerHandleBodyRole }

    const result = await changeUserRoleControllerHandle(id, body, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    })

    return res.status(200).json(result)
  } catch (error) {
    return sendSafeError(res, error, {
      route: 'API /users/[id]/role',
      fallbackMessage: 'Erro ao alterar papel do usuário.',
    })
  }
}
