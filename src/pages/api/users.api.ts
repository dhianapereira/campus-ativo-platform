import type { NextApiRequest, NextApiResponse } from 'next'
import { AXIOS_INSTANCE } from '../../lib/api/axios'

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

    const query =
      typeof req.query.query === 'string' ? req.query.query : undefined
    const page =
      typeof req.query.page === 'string'
        ? parseInt(req.query.page, 10)
        : undefined
    const pageSize =
      typeof req.query.pageSize === 'string'
        ? parseInt(req.query.pageSize, 10)
        : undefined
    const isActiveParam = req.query.isActive
    const isActive =
      isActiveParam === 'true'
        ? true
        : isActiveParam === 'false'
          ? false
          : undefined

    const params =
      query !== undefined ||
      isActive !== undefined ||
      page !== undefined ||
      pageSize !== undefined
        ? { query, isActive, page, pageSize }
        : undefined

    const result = await AXIOS_INSTANCE.get('/users', {
      params,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    return res.status(200).json(result.data)
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
