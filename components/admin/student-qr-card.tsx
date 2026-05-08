"use client"

import { Download, Share2 } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Student } from "@/lib/types"
import { toast } from "sonner"

export function StudentQrCard({ student }: { student: Student }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  const payload = JSON.stringify({ studentId: student.id, name: student.name })

  function handleDownload() {
    const canvas = ref.current
    if (!canvas) return
    const url = canvas.toDataURL("image/png")
    const a = document.createElement("a")
    a.href = url
    a.download = `${student.id}-qr.png`
    a.click()
    toast.success("QR downloaded")
  }

  return (
    <Card className="glass">
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Attendance QR
        </div>
        <div className="rounded-xl bg-background p-3 ring-1 ring-border">
          <QRCodeCanvas
            ref={ref}
            value={payload}
            size={140}
            bgColor="transparent"
            fgColor="oklch(0.7 0.15 55)"
            level="M"
            marginSize={1}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {student.id} • Show this QR at the entrance
        </div>
        <div className="flex w-full gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleDownload}>
            <Download />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              navigator.clipboard?.writeText(payload)
              toast.success("QR payload copied")
            }}
          >
            <Share2 />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
