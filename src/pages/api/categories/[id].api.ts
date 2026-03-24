import type { NextApiRequest, NextApiResponse } from 'next'
import {
  editCategoryControllerHandle,
  fetchCategoriesControllerHandle,
} from '../../../lib/api/generated/categories/categories'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authToken = req.cookies['auth-token']

  if (!authToken) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID inválido' })
  }

  if (req.method === 'GET') {
    try {
      const { includeDeleted } = req.query

      const result = await fetchCategoriesControllerHandle(
        {
          includeDeleted: includeDeleted === 'true',
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

      const category = result.categories?.find((cat) => cat.id === id)

      if (!category) {
        return res.status(404).json({ message: 'Categoria não encontrada' })
      }

      return res.status(200).json(category)
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
  } else if (req.method === 'PATCH') {
    try {
      const { name, description, isActive } = req.body

      if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Nome é obrigatório' })
      }

      const categoryData = {
        name,
        description: description ?? undefined,
        isActive: isActive ?? true,
      }

      const result = await editCategoryControllerHandle(id, categoryData, {
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
        const errorData = axiosError.response?.data || {}

        return res.status(status).json(errorData)
      }

      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}
