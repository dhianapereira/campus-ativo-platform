import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import FormData from 'form-data'
import axios from 'axios'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' })
  }

  const authToken = req.cookies['auth-token']

  if (!authToken) {
    return res.status(401).json({ message: 'Não autenticado.' })
  }

  try {
    const form = new IncomingForm()

    const [, files] = await form.parse(req)

    const file = files.file?.[0]

    if (!file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.mimetype || '')) {
      return res.status(400).json({
        message: 'Tipo de arquivo não suportado. Use JPEG, PNG, GIF ou WebP.',
      })
    }

    const maxSizeBytes = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSizeBytes) {
      return res.status(400).json({
        message: 'Arquivo muito grande. Tamanho máximo: 5MB.',
      })
    }

    const formData = new FormData()
    formData.append('file', fs.createReadStream(file.filepath), {
      filename: file.originalFilename || 'image',
      contentType: file.mimetype || 'image/jpeg',
    })

    const backendUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3333'

    const response = await axios.post(`${backendUrl}/attachments`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${authToken}`,
      },
    })

    fs.unlinkSync(file.filepath)

    return res.status(201).json(response.data)
  } catch (error) {
    console.error('Erro ao fazer upload:', error)

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500
      const message =
        error.response?.data?.message || 'Erro ao fazer upload da imagem.'
      return res.status(status).json({ message })
    }

    return res.status(500).json({ message: 'Erro ao fazer upload da imagem.' })
  }
}
