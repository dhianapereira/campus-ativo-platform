import type { NextApiRequest, NextApiResponse } from 'next'
import { UserResponse } from '../../../../server/client/models'
import { getUserProfileControllerHandle } from '../../../../server/client/user-profile/user-profile'

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

    // Extract profile data from nested structure (same as login)
    const profileData: UserResponse =
      (userProfile as { profile?: UserResponse })?.profile ||
      (userProfile as UserResponse)

    // Extract role from JWT token payload
    let roleFromToken = null
    try {
      const tokenPayload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString(),
      )
      roleFromToken = tokenPayload.role
    } catch (e) {}

    // Get email from token payload as well
    let emailFromToken = null
    try {
      const tokenPayload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString(),
      )
      emailFromToken = tokenPayload.email || tokenPayload.sub // sub might be email or ID
    } catch (e) {}

    const userData = {
      id: profileData.id,
      name: profileData.name,
      email: emailFromToken || 'user@ifal.edu.br',
      role: roleFromToken || profileData.role,
      position: profileData.position || 'Não informado',
    }

    return res.status(200).json({
      success: true,
      user: userData,
    })
  } catch (error: unknown) {
    // Check if it's an authentication error
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
