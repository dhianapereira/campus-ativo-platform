import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { DashboardReportData } from '@/pages/home/types'

const BRAND = [0, 135, 95] as const
const BRAND_DARK = [0, 94, 67] as const
const SURFACE = [243, 248, 245] as const
const BORDER = [209, 226, 217] as const
const TEXT = [28, 43, 53] as const
const MUTED = [92, 108, 117] as const
const PAGE_MARGIN_X = 14
const PAGE_TOP = 36
const PAGE_BOTTOM = 192

type PdfWithTable = jsPDF & {
  lastAutoTable?: {
    finalY: number
  }
}

function formatDate(iso: string): string {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) {
    return iso
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatDateTime(iso: string): string {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) {
    return iso
  }

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getDisplayValue(
  value: string | null | undefined,
  fallback = '-',
): string {
  const normalized = value?.trim()

  return normalized ? normalized : fallback
}

function formatPercentage(count: number, total: number): string {
  if (total <= 0) {
    return '0%'
  }

  return `${((count / total) * 100).toFixed(1).replace('.', ',')}%`
}

function formatCompactLocation(
  name: string | null | undefined,
  code: string | null | undefined,
): string {
  const locationName = getDisplayValue(name)
  const locationCode = code?.trim()

  if (!locationCode) {
    return locationName
  }

  return `${locationName} (${locationCode})`
}

function drawPageHeader(
  doc: jsPDF,
  data: DashboardReportData,
  generatedAt: string,
): void {
  const pageWidth = doc.internal.pageSize.getWidth()

  doc.setFillColor(...BRAND)
  doc.rect(0, 0, pageWidth, 26, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.text('Relatório', PAGE_MARGIN_X, 12)

  doc.setFontSize(10)
  doc.text('Campus Ativo', PAGE_MARGIN_X, 18)
  doc.text(
    `Período: ${formatDate(data.period.startDate)} a ${formatDate(data.period.endDate)}`,
    pageWidth - PAGE_MARGIN_X,
    12,
    { align: 'right' },
  )
  doc.text(`Gerado em: ${generatedAt}`, pageWidth - PAGE_MARGIN_X, 18, {
    align: 'right',
  })

  doc.setDrawColor(...BORDER)
  doc.line(PAGE_MARGIN_X, 29, pageWidth - PAGE_MARGIN_X, 29)
  doc.setTextColor(...TEXT)
}

function drawPageFooter(
  doc: jsPDF,
  pageNumber: number,
  totalPages: number,
): void {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  doc.setDrawColor(...BORDER)
  doc.line(
    PAGE_MARGIN_X,
    pageHeight - 10,
    pageWidth - PAGE_MARGIN_X,
    pageHeight - 10,
  )

  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.text('Campus Ativo', PAGE_MARGIN_X, pageHeight - 4)
  doc.text(
    `Página ${pageNumber} de ${totalPages}`,
    pageWidth - PAGE_MARGIN_X,
    pageHeight - 4,
    {
      align: 'right',
    },
  )
  doc.setTextColor(...TEXT)
}

function ensureSpace(
  doc: jsPDF,
  currentY: number,
  requiredHeight: number,
  data: DashboardReportData,
  generatedAt: string,
): number {
  if (currentY + requiredHeight <= PAGE_BOTTOM) {
    return currentY
  }

  doc.addPage()
  drawPageHeader(doc, data, generatedAt)

  return PAGE_TOP
}

function addSectionTitle(
  doc: jsPDF,
  title: string,
  subtitle: string,
  currentY: number,
): number {
  const safeY = currentY

  doc.setFontSize(13)
  doc.setTextColor(...BRAND_DARK)
  doc.text(title, PAGE_MARGIN_X, safeY)

  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.text(subtitle, PAGE_MARGIN_X, safeY + 5)
  doc.setTextColor(...TEXT)

  return safeY + 9
}

function addSummaryCards(
  doc: jsPDF,
  data: DashboardReportData,
  currentY: number,
): number {
  const pageWidth = doc.internal.pageSize.getWidth()
  const gap = 4
  const cardWidth = (pageWidth - PAGE_MARGIN_X * 2 - gap * 3) / 4
  const cardHeight = 20

  const cards = [
    { label: 'Total no período', value: String(data.totalProblems) },
    { label: 'Status com registros', value: String(data.byStatus.length) },
    { label: 'Categorias citadas', value: String(data.byCategory.length) },
    { label: 'Locais citados', value: String(data.byLocation.length) },
  ]

  cards.forEach((card, index) => {
    const x = PAGE_MARGIN_X + index * (cardWidth + gap)

    doc.setFillColor(...SURFACE)
    doc.setDrawColor(...BORDER)
    doc.roundedRect(x, currentY, cardWidth, cardHeight, 2, 2, 'FD')

    doc.setFontSize(9)
    doc.setTextColor(...MUTED)
    doc.text(card.label, x + 4, currentY + 7)

    doc.setFontSize(16)
    doc.setTextColor(...BRAND_DARK)
    doc.text(card.value, x + 4, currentY + 15)
  })

  doc.setTextColor(...TEXT)

  return currentY + cardHeight + 8
}

function getFinalY(doc: jsPDF): number {
  return ((doc as PdfWithTable).lastAutoTable?.finalY ?? PAGE_TOP) + 8
}

export function generateReportPdf(data: DashboardReportData): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const generatedAt = formatDateTime(new Date().toISOString())
  let y = PAGE_TOP

  drawPageHeader(doc, data, generatedAt)
  y = addSummaryCards(doc, data, y)

  y = ensureSpace(doc, y, 36, data, generatedAt)
  y = addSectionTitle(
    doc,
    '1. Problemas por status',
    'Registros agrupados por status.',
    y,
  )

  autoTable(doc, {
    startY: y,
    margin: {
      top: PAGE_TOP,
      right: PAGE_MARGIN_X,
      bottom: 14,
      left: PAGE_MARGIN_X,
    },
    head: [['Status', 'Quantidade', 'Percentual']],
    body: data.byStatus.map((item) => [
      item.label,
      String(item.count),
      formatPercentage(item.count, data.totalProblems),
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [...BRAND],
      textColor: 255,
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [...TEXT],
    },
    alternateRowStyles: {
      fillColor: [...SURFACE],
    },
    columnStyles: {
      1: { halign: 'center', cellWidth: 35 },
      2: { halign: 'center', cellWidth: 35 },
    },
    didDrawPage: () => drawPageHeader(doc, data, generatedAt),
  })

  y = getFinalY(doc)
  y = ensureSpace(doc, y, 48, data, generatedAt)
  y = addSectionTitle(
    doc,
    '2. Problemas por categoria',
    'Registros agrupados por categoria.',
    y,
  )

  autoTable(doc, {
    startY: y,
    margin: {
      top: PAGE_TOP,
      right: PAGE_MARGIN_X,
      bottom: 14,
      left: PAGE_MARGIN_X,
    },
    head: [['Categoria', 'Descrição', 'Quantidade']],
    body: data.byCategory.map((item) => [
      getDisplayValue(item.name),
      getDisplayValue(item.description),
      String(item.count),
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [...BRAND],
      textColor: 255,
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [...TEXT],
      cellPadding: 2.5,
    },
    alternateRowStyles: {
      fillColor: [...SURFACE],
    },
    columnStyles: {
      0: { cellWidth: 58 },
      2: { halign: 'center', cellWidth: 30 },
    },
    didDrawPage: () => drawPageHeader(doc, data, generatedAt),
  })

  y = getFinalY(doc)
  y = ensureSpace(doc, y, 48, data, generatedAt)
  y = addSectionTitle(
    doc,
    '3. Problemas por localização',
    'Registros agrupados por localização.',
    y,
  )

  autoTable(doc, {
    startY: y,
    margin: {
      top: PAGE_TOP,
      right: PAGE_MARGIN_X,
      bottom: 14,
      left: PAGE_MARGIN_X,
    },
    head: [['Código', 'Localização', 'Descrição', 'Quantidade']],
    body: data.byLocation.map((item) => [
      getDisplayValue(item.code),
      getDisplayValue(item.name),
      getDisplayValue(item.description),
      String(item.count),
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [...BRAND],
      textColor: 255,
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [...TEXT],
      cellPadding: 2.5,
    },
    alternateRowStyles: {
      fillColor: [...SURFACE],
    },
    columnStyles: {
      0: { cellWidth: 32, halign: 'center' },
      1: { cellWidth: 52 },
      3: { cellWidth: 30, halign: 'center' },
    },
    didDrawPage: () => drawPageHeader(doc, data, generatedAt),
  })

  y = getFinalY(doc)
  y = ensureSpace(doc, y, 36, data, generatedAt)
  y = addSectionTitle(
    doc,
    '4. Problemas por tipo de manutenção',
    'Registros agrupados por tipo de manutenção.',
    y,
  )

  autoTable(doc, {
    startY: y,
    margin: {
      top: PAGE_TOP,
      right: PAGE_MARGIN_X,
      bottom: 14,
      left: PAGE_MARGIN_X,
    },
    head: [['Tipo', 'Quantidade', 'Percentual']],
    body: data.byMaintenanceType.map((item) => [
      item.label,
      String(item.count),
      formatPercentage(item.count, data.totalProblems),
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [...BRAND],
      textColor: 255,
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [...TEXT],
    },
    alternateRowStyles: {
      fillColor: [...SURFACE],
    },
    columnStyles: {
      1: { halign: 'center', cellWidth: 35 },
      2: { halign: 'center', cellWidth: 35 },
    },
    didDrawPage: () => drawPageHeader(doc, data, generatedAt),
  })

  doc.addPage()
  drawPageHeader(doc, data, generatedAt)
  y = addSectionTitle(
    doc,
    '5. Lista detalhada de problemas',
    'Lista completa dos problemas do período.',
    PAGE_TOP,
  )

  if (data.problems.length === 0) {
    doc.setFillColor(...SURFACE)
    doc.setDrawColor(...BORDER)
    doc.roundedRect(PAGE_MARGIN_X, y, 120, 18, 2, 2, 'FD')

    doc.setFontSize(10)
    doc.setTextColor(...MUTED)
    doc.text(
      'Nenhum problema foi encontrado no período selecionado.',
      PAGE_MARGIN_X + 4,
      y + 11,
    )
  } else {
    autoTable(doc, {
      startY: y,
      margin: {
        top: PAGE_TOP,
        right: PAGE_MARGIN_X,
        bottom: 14,
        left: PAGE_MARGIN_X,
      },
      head: [
        [
          'Data',
          'Status',
          'Tipo',
          'Título',
          'Descrição',
          'Localização',
          'Categoria',
        ],
      ],
      body: data.problems.map((problem) => [
        formatDate(problem.createdAt),
        getDisplayValue(problem.status),
        getDisplayValue(problem.maintenanceType),
        getDisplayValue(problem.title),
        getDisplayValue(problem.description),
        formatCompactLocation(problem.location, problem.locationCode),
        getDisplayValue(problem.category),
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [...BRAND],
        textColor: 255,
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [...TEXT],
        cellPadding: 2.5,
        valign: 'top',
        lineColor: [...BORDER],
        overflow: 'linebreak',
      },
      alternateRowStyles: {
        fillColor: [...SURFACE],
      },
      columnStyles: {
        0: { cellWidth: 18, halign: 'center' },
        1: { cellWidth: 24 },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 28 },
        4: { cellWidth: 94 },
        5: { cellWidth: 42 },
        6: { cellWidth: 35 },
      },
      didDrawPage: () => drawPageHeader(doc, data, generatedAt),
    })
  }

  const totalPages = doc.getNumberOfPages()

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page)
    drawPageFooter(doc, page, totalPages)
  }

  doc.save(
    `relatorio-campus-ativo-${formatDate(data.period.startDate)}-${formatDate(data.period.endDate)}.pdf`,
  )
}
