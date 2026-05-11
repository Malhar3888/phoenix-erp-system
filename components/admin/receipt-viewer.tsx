"use client"

import { useRef } from "react"
import { Download, Eye, Printer, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PaymentReceipt } from "@/components/admin/payment-receipt"
import type { Payment, Student, Course } from "@/lib/types"

type Props = {
  payment: Payment
  student: Student
  course?: Course
  receiptNumber?: string
  trigger?: React.ReactNode
}

export function ReceiptViewer({
  payment,
  student,
  course,
  receiptNumber,
  trigger,
}: Props) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "", "width=900,height=800")
      if (printWindow) {
        printWindow.document.write(receiptRef.current.innerHTML)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleDownload = async () => {
    const html2pdf = (await import("html2pdf.js")).default
    if (receiptRef.current) {
      html2pdf()
        .set({
          margin: 0,
          filename: `receipt-${receiptNumber || payment.id}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
        })
        .save(receiptRef.current)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            View Receipt
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
          <DialogDescription>Receipt #: {receiptNumber || payment.id}</DialogDescription>
        </DialogHeader>

        {/* Receipt */}
        <div ref={receiptRef} className="bg-white p-4">
          <PaymentReceipt
            payment={payment}
            student={student}
            course={course}
            receiptNumber={receiptNumber}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 border-t pt-4">
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
