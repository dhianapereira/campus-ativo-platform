import type { NextApiRequest, NextApiResponse } from 'next'
import { UserResponse } from '../../../lib/api/generated/models'
import { getUserProfileControllerHandle } from '../../../lib/api/generated/user-profile/user-profile'

interface MeResponse {
  success: boolean
  user?: {
    id: string
    name: string
    email: string
    role: string
    position: string
  }
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MeResponse>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const token = req.cookies['auth-token']

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token found',
      })
    }

    const userProfile = await getUserProfileControllerHandle({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const profileData: UserResponse =
      (userProfile as { profile?: UserResponse })?.profile ||
      (userProfile as UserResponse)

    let roleFromToken = null
    try {
      const tokenPayload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString(),
      )
      roleFromToken = tokenPayload.role
    } catch (_e) {}

    const userData = {
      id: profileData.id,
      name: profileData.name,
      email: profileData.email,
      // The profile endpoint reflects current permissions, while the token may
      // still contain an outdated role until the next login.
      role: profileData.role || roleFromToken,
      position: profileData.position || 'Não informado',
    }

    return res.status(200).json({
      success: true,
      user: userData,
    })
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: { message?: string } }
    }
    if (axiosError?.response?.status === 401) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      })
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
}
