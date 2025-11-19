import type { NextApiRequest, NextApiResponse } from 'next'
import {
  fetchLocationsControllerHandle,
  createLocationControllerHandle,
} from '../../server/client/locations/locations'

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
      const { query, isActive, page, includeDeleted } = req.query

      const params: {
        query?: string
        isActive?: boolean
        page?: number
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

      if (includeDeleted !== undefined) {
        params.includeDeleted = includeDeleted === 'true'
      }

      const result = await fetchLocationsControllerHandle(params, {
        headers: {
          Authorization: `Bearer ${authToken}`,
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
  } else if (req.method === 'POST') {
    try {
      const { name, number, description } = req.body

      if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Nome é obrigatório' })
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
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as unknown as {
          response?: { status?: number; data?: { message?: string } }
        }
        const status = axiosError.response?.status || 500
        const errorData = axiosError.response?.data || {}

        return res.status(status).json(errorData)
      }

      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}
