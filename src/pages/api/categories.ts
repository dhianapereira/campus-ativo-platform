import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchCategoriesControllerHandle } from '../../../server/client/fetch-categories/fetch-categories'
import { AXIOS_INSTANCE } from '../../../server/axios'

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
      const result = await fetchCategoriesControllerHandle(
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

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
      const { name, description } = req.body

      if (!name || !description) {
        return res
          .status(400)
          .json({ message: 'Nome e descrição são obrigatórios' })
      }

      const result = await AXIOS_INSTANCE.post(
        '/categories',
        {
          name,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      )

      return res.status(201).json(result.data)
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
