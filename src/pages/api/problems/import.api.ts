import type { NextApiRequest, NextApiResponse } from 'next'
import { AXIOS_INSTANCE } from '../../../lib/api/axios'
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
    const { rows } = req.body ?? {}

    if (!Array.isArray(rows) || rows.length === 0) {
      return res
        .status(400)
        .json({ message: 'Envie pelo menos uma linha para importar.' })
    }

    if (rows.length > 500) {
      return res
        .status(400)
        .json({ message: 'Envie no máximo 500 linhas por importação.' })
    }

    const result = await AXIOS_INSTANCE.post(
      '/problems/import',
      {
        rows,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      },
    )

    return res.status(200).json(result.data)
  } catch (error) {
    return sendSafeError(res, error, {
      route: 'API /problems/import',
      fallbackMessage: 'Erro ao importar problemas.',
    })
  }
}
