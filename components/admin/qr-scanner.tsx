"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Camera, CheckCircle2, ScanLine, StopCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { initialsFrom } from "@/lib/format"
import type { Student } from "@/lib/types"
import { markAttendance } from "@/lib/actions"
import { toast } from "sonner"

type Result = {
  studentId: string
  name: string
  time: string
}

export function QrScanner({ students }: { students: Student[] }) {
  const containerId = "qr-scanner-region"
  const scannerRef = useRef<unknown>(null)
  const [scanning, setScanning] = useState(false)
  const [recent, setRecent] = useState<Result[]>([])

  const studentMap = useMemo(() => new Map(students.map((s) => [s.id, s])), [students])

  async function start() {
    try {
      const mod = await import("html5-qrcode")
      const Html5Qrcode = mod.Html5Qrcode
      const scanner = new Html5Qrcode(containerId)
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => onDecoded(decodedText),
        () => {
          // ignore decode errors
        },
      )
      setScanning(true)
    } catch (err) {
      console.log("[v0] QR start error:", err)
      toast.error("Couldn't access camera. Allow permission or use manual entry.")
    }
  }

  async function stop() {
    const s = scannerRef.current as { stop?: () => Promise<void>; clear?: () => void } | null
    try {
      await s?.stop?.()
      s?.clear?.()
    } catch {
      // ignore
    }
    scannerRef.current = null
    setScanning(false)
  }

  async function onDecoded(text: string) {
    let studentId = text
    try {
      const parsed = JSON.parse(text)
      if (parsed?.studentId) studentId = parsed.studentId
    } catch {
      // raw id
    }
    const student = studentMap.get(studentId)
    if (!student) {
      toast.error(`Unknown QR: ${text.slice(0, 24)}`)
      return
    }
    if (
      recent.some(
        (r) => r.studentId === student.id && Date.now() - new Date(r.time).getTime() < 4000,
      )
    ) {
      return
    }
    try {
      await markAttendance({
        studentId: student.id,
        date: new Date().toISOString().slice(0, 10),
        status: "present",
      })
      setRecent((arr) =>
        [
          { studentId: student.id, name: student.name, time: new Date().toISOString() },
          ...arr,
        ].slice(0, 10),
      )
      toast.success(`Marked present: ${student.name}`)
    } catch (err) {
      console.log("[v0] markAttendance via QR failed:", err)
      toast.error(`Could not save attendance for ${student.name}`)
    }
  }

  useEffect(() => {
    return () => {
      const s = scannerRef.current as { stop?: () => Promise<void> } | null
      s?.stop?.().catch(() => {})
    }
  }, [])

  return (
    <Card className="glass">
      <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr,1fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ScanLine className="size-4 text-primary" />
            Live QR Scanner
          </div>

          <div
            id={containerId}
            className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/60 bg-background"
          >
            {!scanning && (
              <div className="absolute inset-0 grid place-items-center text-center">
                <div className="space-y-2 px-6">
                  <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                    <Camera className="size-5" />
                  </div>
                  <div className="text-sm font-medium">Camera off</div>
                  <p className="text-xs text-muted-foreground">
                    Click start to scan student QR codes for attendance.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {scanning ? (
              <Button variant="outline" onClick={stop} className="flex-1">
                <StopCircle />
                Stop scanner
              </Button>
            ) : (
              <Button onClick={start} className="flex-1" disabled={students.length === 0}>
                <Camera />
                Start scanner
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="size-4 text-[oklch(0.78_0.15_145)]" />
            Marked attendance
          </div>

          {recent.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
              {students.length === 0
                ? "Add students first — their QR codes appear on the profile page."
                : "Scans will appear here in real time."}
            </div>
          ) : (
            <ul className="space-y-2">
              {recent.map((r, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/50 p-3"
                >
                  <div className="grid size-9 place-items-center rounded-full bg-[oklch(0.55_0.15_145)]/15 text-[oklch(0.78_0.15_145)] text-xs font-semibold">
                    {initialsFrom(r.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.studentId} • {new Date(r.time).toLocaleTimeString("en-IN")}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[oklch(0.78_0.15_145)]">
                    Present
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
