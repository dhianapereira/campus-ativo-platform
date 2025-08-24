import type { NextApiRequest, NextApiResponse } from 'next'
import { changeUserRoleControllerHandle } from '../../../../../server/client/user-management/user-management'
import type { ChangeUserRoleControllerHandleBodyRole } from '../../../../../server/client/models'

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
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as unknown as {
        response?: { status?: number; data?: { message?: string } }
      }
      const status = axiosError.response?.status || 500
      const message =
        axiosError.response?.data?.message || 'Internal server error'

      return res.status(status).json({ message })
    }

    return res.status(500).json({ message: 'Internal server error' })
  }
}
