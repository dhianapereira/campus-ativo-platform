import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
import {
  AuthenticateRequest,
  UserProfileResponse,
} from '../../../lib/api/generated/models'
import { authenticateControllerHandle } from '../../../lib/api/generated/authentication/authentication'
import { getUserProfileControllerHandle } from '../../../lib/api/generated/user-profile/user-profile'

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

    const profileData: UserProfileResponse =
      (userProfile as { profile?: UserProfileResponse })?.profile ||
      (userProfile as UserProfileResponse)

    const cookie = serialize('auth-token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
    })
    res.setHeader('Set-Cookie', cookie)

    let roleFromToken = null
    try {
      const tokenPayload = JSON.parse(
        Buffer.from(access_token.split('.')[1], 'base64').toString(),
      )
      roleFromToken = tokenPayload.role
    } catch (_e) {}
    return res.status(200).json({
      success: true,
      user: {
        id: profileData.id,
        name: profileData.name,
        email,
        role: roleFromToken || 'REPORTER',
        position: profileData.position || 'Não informado',
      },
    })
  } catch (error: unknown) {
    const err = error as {
      response?: {
        status?: number
        data?: { error?: string; message?: string }
      }
      message?: string
    }
    const status = err?.response?.status ?? 500
    const backendError =
      err?.response?.data?.error || err?.response?.data?.message || err?.message

    const isAuthError = status === 400 || status === 401
    const message = isAuthError
      ? 'E-mail ou senha incorretos.'
      : backendError || 'Internal server error'

    return res.status(status).json({
      success: false,
      error: message,
    })
  }
}
