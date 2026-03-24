import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { DashboardReportData } from '@/pages/home/types'

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function generateReportPdf(data: DashboardReportData): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 15

  doc.setFontSize(16)
  doc.text('Relatório de Problemas - Campus Ativo', pageWidth / 2, y, {
    align: 'center',
  })
  y += 8

  doc.setFontSize(10)
  doc.text(
    `Período: ${formatDate(data.period.startDate)} a ${formatDate(data.period.endDate)}`,
    pageWidth / 2,
    y,
    { align: 'center' },
  )
  y += 12

  doc.setFontSize(12)
  doc.text('1. Problemas por status', 14, y)
  y += 6

  const statusRows = [
    ['Total de problemas', String(data.totalProblems)],
    ...data.byStatus.map((s) => [s.label, String(s.count)]),
  ]
  autoTable(doc, {
    startY: y,
    head: [['Status', 'Quantidade']],
    body: statusRows,
    theme: 'grid',
    headStyles: { fillColor: [0, 135, 95] },
    margin: { left: 14 },
  })
  y =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10

  if (y > 250) {
    doc.addPage()
    y = 15
  }
  doc.setFontSize(12)
  doc.text('2. Problemas por categoria', 14, y)
  y += 6
  autoTable(doc, {
    startY: y,
    head: [['Categoria', 'Quantidade']],
    body: data.byCategory.map((c) => [c.name, String(c.count)]),
    theme: 'grid',
    headStyles: { fillColor: [0, 135, 95] },
    margin: { left: 14 },
  })
  y =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10

  if (y > 250) {
    doc.addPage()
    y = 15
  }
  doc.setFontSize(12)
  doc.text('3. Problemas por localização', 14, y)
  y += 6
  autoTable(doc, {
    startY: y,
    head: [['Localização', 'Quantidade']],
    body: data.byLocation.map((l) => [l.name, String(l.count)]),
    theme: 'grid',
    headStyles: { fillColor: [0, 135, 95] },
    margin: { left: 14 },
  })
  y =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10

  if (y > 250) {
    doc.addPage()
    y = 15
  }
  doc.setFontSize(12)
  doc.text('4. Problemas por tipo de manutenção', 14, y)
  y += 6
  autoTable(doc, {
    startY: y,
    head: [['Tipo', 'Quantidade']],
    body: data.byMaintenanceType.map((m) => [m.label, String(m.count)]),
    theme: 'grid',
    headStyles: { fillColor: [0, 135, 95] },
    margin: { left: 14 },
  })
  y =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 12

  doc.setFontSize(12)
  doc.text('5. Lista de problemas do período', 14, y)
  y += 6

  const problemRows = data.problems.map((p) => [
    p.title,
    (p.description || '-').slice(0, 40) +
      (p.description && p.description.length > 40 ? '...' : ''),
    p.location || '-',
    formatDate(p.createdAt),
    p.status,
    p.category || '-',
    p.maintenanceType || '-',
  ])

  autoTable(doc, {
    startY: y,
    head: [
      ['Título', 'Descrição', 'Local', 'Data', 'Status', 'Categoria', 'Tipo'],
    ],
    body: problemRows,
    theme: 'grid',
    headStyles: { fillColor: [0, 135, 95], fontSize: 7 },
    bodyStyles: { fontSize: 6 },
    margin: { left: 14 },
    tableWidth: 'auto',
  })

  doc.save(
    `relatorio-campus-ativo-${formatDate(data.period.startDate)}-${formatDate(data.period.endDate)}.pdf`,
  )
}
