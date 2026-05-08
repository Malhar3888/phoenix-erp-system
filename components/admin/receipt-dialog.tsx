"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Download, MessageCircle, Printer } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { formatDate, formatINR } from "@/lib/format"
import { downloadReceipt, loadImageAsDataUrl, whatsappShareUrl } from "@/lib/receipt-pdf"
import type { Payment, Student } from "@/lib/types"
import { toast } from "sonner"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  payment: Payment | null
  student: Student | null
}

export function ReceiptDialog({ open, onOpenChange, payment, student }: Props) {
  const qrRef = useRef<HTMLCanvasElement | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (!open) setDownloading(false)
  }, [open])

  if (!payment || !student) return null

  const qrPayload = JSON.stringify({
    receipt: payment.receiptNo,
    student: student.id,
    amount: payment.amount,
    date: payment.date,
  })

  async function handleDownload() {
    if (!payment || !student) return
    setDownloading(true)
    try {
      const canvas = qrRef.current
      const qrDataUrl = canvas?.toDataURL("image/png")
      const logoDataUrl = await loadImageAsDataUrl("/phoenix-logo.png").catch(() => undefined)
      await downloadReceipt({ payment, student, qrDataUrl, logoDataUrl })
      toast.success("Receipt downloaded")
    } catch {
      toast.error("Couldn't generate PDF")
    } finally {
      setDownloading(false)
    }
  }

  function handleWhatsApp() {
    if (!payment || !student) return
    const url = whatsappShareUrl(payment, student)
    window.open(url, "_blank", "noopener,noreferrer")
    toast.success("Opening WhatsApp...")
  }

  function handlePrint() {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Receipt {payment.receiptNo}</DialogTitle>
          <DialogDescription>
            Preview, download, print or share this receipt on WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <div
          id="receipt-preview"
          className="overflow-hidden rounded-xl border border-border bg-gradient-to-b from-card to-background"
        >
          <div className="flex items-center justify-between gap-3 bg-background px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative size-10 overflow-hidden rounded-lg bg-background ring-1 ring-primary/30">
                <Image
                  src="/phoenix-logo.png"
                  alt="Phoenix"
                  fill
                  sizes="40px"
                  className="object-contain p-0.5"
                />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold tracking-wide">PHOENIX COMPUTERS</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary">
                  Payment Receipt
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div className="font-mono text-[11px] text-foreground">{payment.receiptNo}</div>
              <div>{formatDate(payment.date)}</div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 p-5 sm:grid-cols-[1fr,auto]">
            <dl className="space-y-2 text-sm">
              {[
                ["Student", student.name],
                ["Student ID", student.id],
                ["Mobile", student.mobile],
                ["Course", student.course],
                ["Batch", student.batch],
                ["Mode", payment.mode],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium text-foreground">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border/60 bg-background p-3">
              <QRCodeCanvas
                ref={qrRef}
                value={qrPayload}
                size={88}
                bgColor="transparent"
                fgColor="oklch(0.7 0.15 55)"
                level="M"
                marginSize={1}
              />
              <span className="text-[10px] text-muted-foreground">Scan to verify</span>
            </div>
          </div>

          <div className="mx-5 mb-5 rounded-xl border border-primary/30 bg-primary/10 p-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-primary/80">
                  Amount Paid
                </div>
                <div className="mt-0.5 text-3xl font-bold text-primary">
                  {formatINR(payment.amount)}
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="text-muted-foreground">Remaining</div>
                <div className="text-base font-semibold text-foreground">
                  {formatINR(student.remainingFees)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button variant="outline" onClick={handlePrint}>
            <Printer />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload} disabled={downloading}>
            <Download />
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
          <Button onClick={handleWhatsApp}>
            <MessageCircle />
            Share on WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
