import type { NextApiRequest, NextApiResponse } from 'next'
import {
  getUserProfileControllerHandle,
  editUserProfileControllerHandle,
} from '../../../../server/client/user-profile/user-profile'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authToken = req.cookies['auth-token']

  if (!authToken) {
    return res.status(401).json({ message: 'Não autenticado' })
  }

  try {
    if (req.method === 'GET') {
      // Get user profile
      const result = await getUserProfileControllerHandle({
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      return res.status(200).json(result)
    }

    if (req.method === 'PATCH') {
      // Update user profile
      const { userId, name, position } = req.body

      if (!userId) {
        return res.status(400).json({ message: 'ID do usuário é obrigatório' })
      }

      if (!name || !position) {
        return res
          .status(400)
          .json({ message: 'Nome e cargo são obrigatórios' })
      }

      const result = await editUserProfileControllerHandle(
        userId,
        { name, position },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

      return res.status(200).json(result)
    }

    return res.status(405).json({ message: 'Método não permitido' })
  } catch (error: any) {
    console.error('Erro na API de perfil:', error)
    return res.status(error.status || 500).json({
      message: error.message || 'Erro ao processar requisição',
    })
  }
}
