import type { NextApiRequest, NextApiResponse } from 'next'
import { createLocationControllerHandle } from '../../lib/api/generated/locations/locations'
import { AXIOS_INSTANCE } from '../../lib/api/axios'
import { sendSafeError } from './_helpers/error-response'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authToken = req.cookies['auth-token']

  if (!authToken) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const { query, isActive, page, pageSize, includeDeleted } = req.query

      const params: {
        query?: string
        isActive?: boolean
        page?: number
        pageSize?: number
        includeDeleted?: boolean
      } = {}

      if (query && typeof query === 'string') {
        params.query = query
      }

      if (isActive !== undefined) {
        params.isActive = isActive === 'true'
      }

      if (page && typeof page === 'string') {
        params.page = parseInt(page, 10)
      }

      if (pageSize && typeof pageSize === 'string') {
        params.pageSize = parseInt(pageSize, 10)
      }

      if (includeDeleted !== undefined) {
        params.includeDeleted = includeDeleted === 'true'
      }

      const result = await AXIOS_INSTANCE.get('/locations', {
        params,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      return res.status(200).json(result.data)
    } catch (error) {
      return sendSafeError(res, error, {
        route: 'API /locations GET',
        fallbackMessage: 'Erro ao buscar localizações.',
      })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, number, description } = req.body

      if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Nome é obrigatório.' })
      }

      const locationData = {
        name,
        code: number ?? undefined,
        description: description ?? '',
      }

      const result = await createLocationControllerHandle(locationData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      return res.status(201).json(result)
    } catch (error) {
      return sendSafeError(res, error, {
        route: 'API /locations POST',
        fallbackMessage: 'Erro ao criar localização.',
      })
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}
