"use client"

import type { AttendanceRecord } from "@/lib/types"
import { cn } from "@/lib/utils"

const STATUS = {
  present: { color: "bg-[oklch(0.55_0.15_145)]", label: "Present" },
  late: { color: "bg-[oklch(0.78_0.15_85)]", label: "Late" },
  absent: { color: "bg-[oklch(0.55_0.18_25)]", label: "Absent" },
  none: { color: "bg-muted/60", label: "—" },
} as const

export function StudentAttendance({ records }: { records: AttendanceRecord[] }) {
  // Build a 30-day map
  const map = new Map<string, AttendanceRecord["status"]>()
  for (const r of records) map.set(r.date, r.status)

  const days: { date: string; status: keyof typeof STATUS }[] = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const s = map.get(key)
    days.push({ date: key, status: (s ?? "none") as keyof typeof STATUS })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-10 gap-1.5 sm:grid-cols-[repeat(15,minmax(0,1fr))] md:grid-cols-[repeat(30,minmax(0,1fr))]">
        {days.map((d) => (
          <div
            key={d.date}
            title={`${d.date} — ${STATUS[d.status].label}`}
            className={cn(
              "aspect-square rounded-md transition hover:scale-110",
              STATUS[d.status].color,
            )}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {(["present", "late", "absent", "none"] as const).map((k) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className={cn("size-3 rounded-sm", STATUS[k].color)} />
            <span>{STATUS[k].label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
