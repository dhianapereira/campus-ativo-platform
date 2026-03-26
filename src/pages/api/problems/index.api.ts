import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchProblemsControllerHandle } from '../../../lib/api/generated/problems/problems'

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
    const { page, query } = req.query

    const params = {
      page: page ? parseInt(page as string, 10) : undefined,
      query: query as string | undefined,
    }

    const result = await fetchProblemsControllerHandle(params, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    return res.status(200).json(result)
  } catch (error: any) {
    console.error('Erro ao buscar problemas:', error)
    return res.status(error.status || 500).json({
      message: error.message || 'Erro ao buscar problemas',
    })
  }
}
