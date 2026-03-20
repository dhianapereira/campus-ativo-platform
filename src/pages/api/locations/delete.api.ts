import type { NextApiRequest, NextApiResponse } from 'next'
import { trashLocationControllerHandle } from '../../../server/client/locations/locations'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  const authToken = req.cookies['auth-token']

  if (!authToken) {
    return res.status(401).json({ message: 'Não autenticado' })
  }

  try {
    const { ids } = req.body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: 'IDs das localizações são obrigatórios' })
    }

    const trashPromises = ids.map((id: string) =>
      trashLocationControllerHandle(id, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
    )

    await Promise.all(trashPromises)

    return res.status(200).json({
      message:
        ids.length === 1
          ? 'Localização movida para a lixeira'
          : `${ids.length} localizações movidas para a lixeira`,
    })
  } catch (error: any) {
    console.error('Erro ao mover localizações para lixeira:', error)
    return res.status(error.status || 500).json({
      message: error.message || 'Erro ao mover localizações para a lixeira',
    })
  }
}
