interface NamedOption {
  name: string
  description?: string | null
}

interface LocationOption extends NamedOption {
  code?: string | null
}

function normalizeText(value?: string | null) {
  return value?.trim() || ''
}

export function getCategoryOptionLabel(option: NamedOption) {
  return normalizeText(option.name)
}

export function getLocationOptionLabel(option: LocationOption) {
  const name = normalizeText(option.name)
  const code = normalizeText(option.code)

  return code ? `[${code}] ${name}` : name
}
