import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
import {
  AuthenticateRequest,
  UserResponse,
} from '../../../../server/client/models'
import { authenticateControllerHandle } from '../../../../server/client/authentication/authentication'
import { getUserProfileControllerHandle } from '../../../../server/client/user-profile/user-profile'

interface LoginResponse {
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
  res: NextApiResponse<LoginResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { email, password }: AuthenticateRequest = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      })
    }
    const authResult = await authenticateControllerHandle({ email, password })
    const { access_token } = authResult

    const userProfile = await getUserProfileControllerHandle({
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    // Extract profile data from nested structure
    const profileData: UserResponse =
      (userProfile as { profile?: UserResponse })?.profile ||
      (userProfile as UserResponse)

    // Set secure httpOnly cookie
    const cookie = serialize('auth-token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // More permissive for dev
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost', // Explicit domain for dev
    })
    res.setHeader('Set-Cookie', cookie)

    // Extract role from JWT token payload (visible in logs: "role":"ADMIN")
    let roleFromToken = null
    try {
      const tokenPayload = JSON.parse(
        Buffer.from(access_token.split('.')[1], 'base64').toString(),
      )
      roleFromToken = tokenPayload.role
    } catch (e) {}
    return res.status(200).json({
      success: true,
      user: {
        id: profileData.id,
        name: profileData.name,
        email, // Use the email from login request
        role: roleFromToken || profileData.role, // Keep role for authorization
        position: profileData.position || 'Sem cargo definido', // Position for display
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
}
