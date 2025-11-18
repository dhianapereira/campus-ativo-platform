import type { NextApiRequest, NextApiResponse } from 'next'
import { createProblemControllerHandle } from '../../../../server/client/problems/problems'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  const authToken = req.cookies['auth-token']

  if (!authToken) {
    return res.status(401).json({ message: 'Não autenticado' })
  }

  try {
    const { title, description, categoryId, locationId } = req.body

    if (!title || !description || !categoryId || !locationId) {
      return res
        .status(400)
        .json({ message: 'Todos os campos são obrigatórios' })
    }

    const result = await createProblemControllerHandle(
      {
        title: title.trim(),
        description: description.trim(),
        categoryId,
        locationId,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )

    return res
      .status(201)
      .json({ message: 'Problema cadastrado com sucesso', data: result })
  } catch (error: any) {
    console.error('Erro ao cadastrar problema:', error)
    return res.status(error.status || 500).json({
      message: error.message || 'Erro ao cadastrar problema',
    })
  }
}
