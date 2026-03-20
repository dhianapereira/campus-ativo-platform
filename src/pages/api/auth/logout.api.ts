import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

interface LogoutResponse {
  success: boolean
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogoutResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const cookie = serialize('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 0,
      expires: new Date(0),
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
    })

    res.setHeader('Set-Cookie', cookie)

    return res.status(200).json({ success: true })
  } catch (_error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
}
