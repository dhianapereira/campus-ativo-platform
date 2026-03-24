import type { NextApiRequest, NextApiResponse } from 'next'
import {
  getProblemBySlugControllerHandle,
  editProblemControllerHandle,
} from '../../../lib/api/generated/problems/problems'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authToken = req.cookies['auth-token']

  if (!authToken) {
    return res.status(401).json({ message: 'Não autenticado' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID do problema é obrigatório' })
  }

  if (req.method === 'GET') {
    try {
      const result = await getProblemBySlugControllerHandle(id, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      return res.status(200).json(result)
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } }
        }
        const status = axiosError.response?.status || 500
        const message =
          axiosError.response?.data?.message || 'Erro ao buscar problema'

        return res.status(status).json({ message })
      }

      return res.status(500).json({ message: 'Erro ao buscar problema' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { title, description, attachmentIds } = req.body

      if (!title || !description) {
        return res
          .status(400)
          .json({ message: 'Título e descrição são obrigatórios' })
      }

      await editProblemControllerHandle(
        id,
        {
          title,
          description,
          attachmentIds:
            attachmentIds !== undefined ? attachmentIds : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

      return res.status(200).json({ message: 'Problema editado com sucesso' })
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } }
        }
        const status = axiosError.response?.status || 500
        const message =
          axiosError.response?.data?.message || 'Erro ao editar problema'

        return res.status(status).json({ message })
      }

      return res.status(500).json({ message: 'Erro ao editar problema' })
    }
  }

  if (req.method === 'PATCH') {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/problems/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(req.body),
        },
      )

      const responseBody = await response.json().catch(() => null)

      if (!response.ok) {
        return res.status(response.status).json({
          message: responseBody?.message || 'Erro ao atualizar histórico',
        })
      }

      return res.status(204).end()
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message })
      }

      return res
        .status(500)
        .json({ message: 'Erro ao atualizar histórico do problema' })
    }
  }

  return res.status(405).json({ message: 'Método não permitido' })
}
