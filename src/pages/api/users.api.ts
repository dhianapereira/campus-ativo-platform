import type { NextApiRequest, NextApiResponse } from 'next'
import { AXIOS_INSTANCE } from '../../lib/api/axios'
import { sendSafeError } from './_helpers/error-response'

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
    return sendSafeError(res, error, {
      route: 'API /users',
      fallbackMessage: 'Erro ao buscar usuários.',
    })
  }
}
