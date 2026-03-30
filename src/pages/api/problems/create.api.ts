import type { NextApiRequest, NextApiResponse } from 'next'
import { createProblemControllerHandle } from '../../../lib/api/generated/problems/problems'
import { sendSafeError } from '../_helpers/error-response'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' })
  }

  const authToken = req.cookies['auth-token']

  if (!authToken) {
    return res.status(401).json({ message: 'Não autenticado.' })
  }

  try {
    const { title, description, categoryId, locationId, attachmentIds } =
      req.body

    if (!title || !description || !categoryId || !locationId) {
      return res
        .status(400)
        .json({ message: 'Todos os campos são obrigatórios.' })
    }

    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (trimmedTitle.length > 100) {
      return res
        .status(400)
        .json({ message: 'O título não pode passar de 100 caracteres.' })
    }
    if (trimmedDescription.length > 500) {
      return res
        .status(400)
        .json({ message: 'A descrição não pode passar de 500 caracteres.' })
    }

    const result = await createProblemControllerHandle(
      {
        title: trimmedTitle,
        description: trimmedDescription,
        categoryId,
        locationId,
        attachmentIds: attachmentIds || undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )

    return res
      .status(201)
      .json({ message: 'Problema cadastrado com sucesso.', data: result })
  } catch (error) {
    return sendSafeError(res, error, {
      route: 'API /problems/create',
      fallbackMessage: 'Erro ao cadastrar problema.',
    })
  }
}
