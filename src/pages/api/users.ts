import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchUsersControllerHandle } from '../../../server/client/user-management/user-management'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const authToken = req.cookies['auth-token']

    if (!authToken) {
      console.error('[API /users] No auth token found in cookies')
      return res.status(401).json({ message: 'Unauthorized - No token' })
    }
    const result = await fetchUsersControllerHandle(undefined, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    return res.status(200).json(result)
  } catch (error) {
    console.error('[API /users] Error:', error)

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as unknown as {
        response?: { status?: number; data?: { message?: string } }
      }
      const status = axiosError.response?.status || 500
      const message =
        axiosError.response?.data?.message || 'Internal server error'

      console.error('[API /users] Axios error:', { status, message })
      return res.status(status).json({ message })
    }

    return res.status(500).json({ message: 'Internal server error' })
  }
}
