import type { NextApiRequest, NextApiResponse } from 'next'
import type { DashboardMetrics } from '@/@types/dashboard'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3333'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardMetrics | { message: string }>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const authToken = req.cookies['auth-token']
  if (!authToken) {
    return res.status(401).json({ message: 'Não autenticado' })
  }

  try {
    const response = await fetch(`${BACKEND_URL}/dashboard/metrics`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        message:
          (err as { message?: string }).message || 'Erro ao carregar dashboard',
      })
    }

    const data = (await response.json()) as DashboardMetrics
    return res.status(200).json(data)
  } catch (error) {
    console.error('[API /dashboard]', error)
    return res
      .status(500)
      .json({ message: 'Erro ao carregar dados do dashboard' })
  }
}
