import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import FormData from 'form-data'
import axios from 'axios'
import { sendSafeError } from './_helpers/error-response'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

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

  let uploadedFilePath: string | null = null

  try {
    const form = new IncomingForm({
      multiples: false,
      allowEmptyFiles: false,
      maxFiles: 1,
      maxFileSize: MAX_FILE_SIZE_BYTES,
      maxTotalFileSize: MAX_FILE_SIZE_BYTES,
    })

    const [, files] = await form.parse(req)

    const file = Array.isArray(files.file) ? files.file[0] : files.file

    if (!file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' })
    }

    uploadedFilePath = file.filepath

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.mimetype || '')) {
      return res.status(400).json({
        message: 'Tipo de arquivo não suportado. Use JPEG, PNG, GIF ou WebP.',
      })
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
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
    return res.status(201).json(response.data)
  } catch (error) {
    if (
      error instanceof Error &&
      /maxFileSize|maxTotalFileSize|too large|bigger than/i.test(error.message)
    ) {
      return res.status(400).json({
        message: 'Arquivo muito grande. Tamanho máximo: 5MB.',
      })
    }

    if (axios.isAxiosError(error)) {
      return sendSafeError(res, error, {
        route: 'API /attachments',
        fallbackMessage: 'Erro ao fazer upload da imagem.',
      })
    }

    return sendSafeError(res, error, {
      route: 'API /attachments',
      fallbackMessage: 'Erro ao fazer upload da imagem.',
      exposeUpstreamMessage: false,
    })
  } finally {
    if (uploadedFilePath) {
      await fs.promises.rm(uploadedFilePath, { force: true }).catch(() => {})
    }
  }
}
