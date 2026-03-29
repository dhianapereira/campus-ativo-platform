export interface ParsedProblemCsvRow {
  rowNumber: number
  title: string
  description: string
  category: string
  locationName: string
  locationCode: string
}

const HEADER_ALIASES = {
  title: ['title', 'titulo'],
  description: ['description', 'descricao'],
  category: ['category', 'categoria'],
  locationName: [
    'location_name',
    'localizacao_nome',
    'nome_localizacao',
    'locationname',
  ],
  locationCode: [
    'location_code',
    'localizacao_codigo',
    'codigo_localizacao',
    'locationcode',
  ],
} as const

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function detectDelimiter(content: string) {
  const firstLine = content.split(/\r?\n/, 1)[0] ?? ''
  const commaCount = (firstLine.match(/,/g) || []).length
  const semicolonCount = (firstLine.match(/;/g) || []).length

  return semicolonCount > commaCount ? ';' : ','
}

function parseDelimitedText(content: string, delimiter: string) {
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentCell = ''
  let inQuotes = false

  for (let index = 0; index < content.length; index++) {
    const char = content[index]
    const nextChar = content[index + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"'
        index++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (!inQuotes && char === delimiter) {
      currentRow.push(currentCell)
      currentCell = ''
      continue
    }

    if (!inQuotes && char === '\n') {
      currentRow.push(currentCell)
      rows.push(currentRow)
      currentRow = []
      currentCell = ''
      continue
    }

    if (!inQuotes && char === '\r') {
      continue
    }

    currentCell += char
  }

  if (inQuotes) {
    throw new Error('O arquivo CSV contém aspas não fechadas.')
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell)
    rows.push(currentRow)
  }

  return rows
}

function findHeaderIndex(headers: string[], aliases: readonly string[]) {
  return headers.findIndex((header) => aliases.includes(header))
}

export function parseProblemsCsv(content: string): ParsedProblemCsvRow[] {
  const sanitizedContent = content.replace(/^\uFEFF/, '').trim()

  if (!sanitizedContent) {
    throw new Error('O arquivo CSV está vazio.')
  }

  const delimiter = detectDelimiter(sanitizedContent)
  const matrix = parseDelimitedText(sanitizedContent, delimiter).filter((row) =>
    row.some((cell) => cell.trim() !== ''),
  )

  if (matrix.length < 2) {
    throw new Error(
      'O CSV precisa ter cabeçalho e pelo menos uma linha de dados.',
    )
  }

  const headers = matrix[0].map(normalizeHeader)
  const titleIndex = findHeaderIndex(headers, HEADER_ALIASES.title)
  const descriptionIndex = findHeaderIndex(headers, HEADER_ALIASES.description)
  const categoryIndex = findHeaderIndex(headers, HEADER_ALIASES.category)
  const locationNameIndex = findHeaderIndex(
    headers,
    HEADER_ALIASES.locationName,
  )
  const locationCodeIndex = findHeaderIndex(
    headers,
    HEADER_ALIASES.locationCode,
  )
  if (
    titleIndex === -1 ||
    descriptionIndex === -1 ||
    categoryIndex === -1 ||
    locationNameIndex === -1
  ) {
    throw new Error(
      'Cabeçalho inválido. Use titulo, descricao, categoria, localizacao_nome e localizacao_codigo.',
    )
  }

  return matrix.slice(1).map((row, index) => ({
    rowNumber: index + 2,
    title: row[titleIndex]?.trim() ?? '',
    description: row[descriptionIndex]?.trim() ?? '',
    category: row[categoryIndex]?.trim() ?? '',
    locationName: row[locationNameIndex]?.trim() ?? '',
    locationCode:
      locationCodeIndex !== -1 ? (row[locationCodeIndex]?.trim() ?? '') : '',
  }))
}
