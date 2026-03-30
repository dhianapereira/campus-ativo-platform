import type { NextApiRequest, NextApiResponse } from 'next'
import { AXIOS_INSTANCE } from '../../../lib/api/axios'
import { sendSafeError } from '../_helpers/error-response'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido.' })
  }

  const authToken = req.cookies['auth-token']

  if (!authToken) {
    return res.status(401).json({ message: 'Não autenticado.' })
  }

  try {
    const { page, pageSize, query, statuses, includeDeleted } = req.query

    const params = {
      page: page ? parseInt(page as string, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string, 10) : undefined,
      query: query as string | undefined,
      statuses: statuses as string | undefined,
      includeDeleted:
        includeDeleted === 'true'
          ? true
          : includeDeleted === 'false'
            ? false
            : undefined,
    }

    const result = await AXIOS_INSTANCE.get('/problems', {
      params,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    return res.status(200).json(result.data)
  } catch (error) {
    return sendSafeError(res, error, {
      route: 'API /problems',
      fallbackMessage: 'Erro ao buscar problemas.',
    })
  }
}
