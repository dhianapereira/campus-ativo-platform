import type { NextApiResponse } from 'next'

type ErrorPayload = {
  error?: unknown
  message?: unknown
}

type ErrorWithResponse = {
  code?: unknown
  message?: unknown
  status?: unknown
  response?: {
    status?: unknown
    data?: ErrorPayload
  }
}

type SendSafeErrorOptions = {
  fallbackMessage: string
  route: string
  exposeUpstreamMessage?: boolean
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function normalizeError(error: unknown): ErrorWithResponse {
  if (!error || typeof error !== 'object') {
    return {}
  }

  return error as ErrorWithResponse
}

function getErrorStatus(error: unknown) {
  const normalized = normalizeError(error)
  const status = normalized.response?.status ?? normalized.status

  return typeof status === 'number' && Number.isFinite(status) ? status : 500
}

function getUpstreamMessage(error: unknown) {
  const normalized = normalizeError(error)
  const data = normalized.response?.data

  if (isNonEmptyString(data?.message)) {
    return data.message
  }

  if (isNonEmptyString(data?.error)) {
    return data.error
  }

  if (isNonEmptyString(normalized.message)) {
    return normalized.message
  }

  return null
}

export function logApiError(route: string, error: unknown) {
  const normalized = normalizeError(error)

  console.error(`[${route}] request failed`, {
    status: getErrorStatus(error),
    code:
      typeof normalized.code === 'string' || typeof normalized.code === 'number'
        ? normalized.code
        : undefined,
    name:
      'name' in normalized && typeof normalized.name === 'string'
        ? normalized.name
        : undefined,
  })
}

export function getSafeErrorMessage(
  error: unknown,
  fallbackMessage: string,
  exposeUpstreamMessage = true,
) {
  const status = getErrorStatus(error)
  const upstreamMessage = getUpstreamMessage(error)

  if (status >= 500) {
    return fallbackMessage
  }

  if (exposeUpstreamMessage && upstreamMessage) {
    return upstreamMessage
  }

  return fallbackMessage
}

export function sendSafeError(
  res: NextApiResponse,
  error: unknown,
  {
    fallbackMessage,
    route,
    exposeUpstreamMessage = true,
  }: SendSafeErrorOptions,
) {
  logApiError(route, error)

  const status = getErrorStatus(error)
  const message = getSafeErrorMessage(
    error,
    fallbackMessage,
    exposeUpstreamMessage,
  )

  return res.status(status).json({ message })
}
