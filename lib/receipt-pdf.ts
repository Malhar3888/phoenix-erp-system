import { jsPDF } from "jspdf"
import type { Payment, Student } from "./types"
import { formatINR, formatDate } from "./format"

export type ReceiptData = {
  payment: Payment
  student: Student
  qrDataUrl?: string
  logoDataUrl?: string
}

/**
 * Loads an image from /public as a data URL so jsPDF can embed it
 * without CORS or async issues.
 */
export async function loadImageAsDataUrl(src: string): Promise<string> {
  const res = await fetch(src)
  const blob = await res.blob()
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export function buildReceiptPdf({ payment, student, qrDataUrl, logoDataUrl }: ReceiptData): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a5" })
  const w = doc.internal.pageSize.getWidth()
  const margin = 28

  // Background band
  doc.setFillColor(26, 20, 16) // matte black
  doc.rect(0, 0, w, 96, "F")

  // Logo
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", margin, 18, 56, 56)
    } catch {
      // ignore
    }
  }

  // Brand text
  doc.setTextColor(212, 148, 47) // burnt orange
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("PHOENIX COMPUTERS", margin + 70, 42)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(220, 200, 180)
  doc.text("Premier Computer Training Institute", margin + 70, 58)
  doc.text("info@phoenixcomputers.in  •  +91 98765 43210", margin + 70, 72)

  // Receipt label
  doc.setFillColor(212, 148, 47)
  doc.rect(0, 96, w, 24, "F")
  doc.setTextColor(26, 20, 16)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.text("PAYMENT RECEIPT", margin, 113)
  doc.text(`Receipt No: ${payment.receiptNo}`, w - margin - 130, 113)

  // Body
  let y = 150
  doc.setTextColor(40, 40, 40)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("Student Details", margin, y)
  doc.setDrawColor(212, 148, 47)
  doc.setLineWidth(0.6)
  doc.line(margin, y + 4, margin + 80, y + 4)

  y += 22
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  const rows: [string, string][] = [
    ["Name", student.name],
    ["Student ID", student.id],
    ["Mobile", student.mobile],
    ["Course", student.course],
    ["Batch", student.batch],
    ["Date", formatDate(payment.date)],
  ]
  for (const [k, v] of rows) {
    doc.setTextColor(120, 120, 120)
    doc.text(k, margin, y)
    doc.setTextColor(20, 20, 20)
    doc.text(String(v), margin + 80, y)
    y += 16
  }

  // Amount block
  y += 8
  doc.setFillColor(245, 235, 220)
  doc.roundedRect(margin, y, w - margin * 2, 70, 6, 6, "F")
  doc.setFont("helvetica", "bold")
  doc.setTextColor(80, 60, 30)
  doc.setFontSize(10)
  doc.text("Amount Paid", margin + 14, y + 22)
  doc.setFontSize(20)
  doc.setTextColor(180, 90, 20)
  doc.text(formatINR(payment.amount), margin + 14, y + 50)

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 60, 30)
  doc.text("Payment Mode", w - margin - 110, y + 22)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(40, 40, 40)
  doc.text(payment.mode, w - margin - 110, y + 38)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 60, 30)
  doc.text("Remaining Fees", w - margin - 110, y + 54)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(40, 40, 40)
  doc.text(formatINR(student.remainingFees), w - margin - 110 + 80, y + 54)

  y += 86

  // QR code
  if (qrDataUrl) {
    try {
      doc.addImage(qrDataUrl, "PNG", w - margin - 70, y, 70, 70)
      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      doc.text("Scan to verify", w - margin - 70, y + 82)
    } catch {
      // ignore
    }
  }

  // Signature
  doc.setDrawColor(180, 180, 180)
  doc.line(margin, y + 60, margin + 120, y + 60)
  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  doc.text("Authorized Signature", margin, y + 74)

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 24
  doc.setFontSize(8)
  doc.setTextColor(140, 140, 140)
  doc.text(
    "Thank you for choosing Phoenix Computers — your future, our priority.",
    w / 2,
    footerY,
    { align: "center" },
  )

  return doc
}

export async function downloadReceipt(data: ReceiptData) {
  const doc = buildReceiptPdf(data)
  doc.save(`${data.payment.receiptNo}.pdf`)
}

export function whatsappShareUrl(payment: Payment, student: Student): string {
  const text =
    `Hello ${student.name},\n\n` +
    `Your payment of ${formatINR(payment.amount)} has been received successfully.\n\n` +
    `Course: ${student.course}\n` +
    `Receipt No: ${payment.receiptNo}\n` +
    `Remaining Fees: ${formatINR(student.remainingFees)}\n\n` +
    `Thank you,\n— PHOENIX COMPUTERS`
  const phone = student.mobile.replace(/\D/g, "")
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}
