import type { NextApiRequest, NextApiResponse } from 'next'
import { changeUserPasswordControllerHandle } from '../../../../server/client/user-profile/user-profile'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  const authToken = req.cookies['auth-token']

  if (!authToken) {
    return res.status(401).json({ message: 'Não autenticado' })
  }

  try {
    const { userId, oldPassword, newPassword } = req.body

    if (!userId) {
      return res.status(400).json({ message: 'ID do usuário é obrigatório' })
    }

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Senha atual e nova senha são obrigatórias' })
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: 'A nova senha deve ter no mínimo 6 caracteres' })
    }

    const result = await changeUserPasswordControllerHandle(
      userId,
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )

    return res.status(200).json(result)
  } catch (error: any) {
    console.error('Erro ao alterar senha:', error)
    return res.status(error.status || 500).json({
      message: error.message || 'Erro ao alterar senha',
    })
  }
}
