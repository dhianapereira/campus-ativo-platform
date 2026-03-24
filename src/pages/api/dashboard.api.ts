import type { NextApiRequest, NextApiResponse } from 'next'
import type { DashboardMetrics } from '@/pages/home/types'

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
    const params = new URLSearchParams()
    const days = Array.isArray(req.query.days)
      ? req.query.days[0]
      : req.query.days

    if (typeof days === 'string' && days.trim() !== '') {
      params.set('days', days.trim())
    }

    const dashboardUrl = `${BACKEND_URL}/dashboard/metrics${
      params.toString() ? `?${params.toString()}` : ''
    }`

    const response = await fetch(dashboardUrl, {
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
