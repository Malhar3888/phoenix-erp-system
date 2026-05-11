"use client"

import { useMemo, useState, useTransition } from "react"
import { Check, Clock, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BATCHES } from "@/lib/mock-data"
import { initialsFrom } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { AttendanceRecord, AttendanceStatus, Student } from "@/lib/types"
import { markAttendance } from "@/lib/actions"
import { toast } from "sonner"

export function DailyAttendance({
  students,
  todayRecords,
  date,
}: {
  students: Student[]
  todayRecords: AttendanceRecord[]
  date: string
}) {
  const [batch, setBatch] = useState<string>("all")
  const [query, setQuery] = useState("")
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>(() => {
    const m: Record<string, AttendanceStatus> = {}
    for (const r of todayRecords) m[r.studentId] = r.status
    return m
  })
  const [pending, startTransition] = useTransition()

  const list = useMemo(() => {
    return students.filter((s) => {
      if (s.status !== "active") return false
      if (batch !== "all" && s.batch !== batch) return false
      if (query && !`${s.name} ${s.id}`.toLowerCase().includes(query.toLowerCase()))
        return false
      return true
    })
  }, [students, batch, query])

  function setMark(studentId: string, status: AttendanceStatus) {
    setMarks((m) => ({ ...m, [studentId]: status }))
    startTransition(async () => {
      try {
        await markAttendance({ studentId, date, status })
      } catch (err) {
        console.log("[v0] markAttendance failed:", err)
        toast.error("Could not save attendance")
      }
    })
  }

  const counts = {
    present: Object.values(marks).filter((s) => s === "present").length,
    late: Object.values(marks).filter((s) => s === "late").length,
    absent: Object.values(marks).filter((s) => s === "absent").length,
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students..."
            className="h-10 pl-9"
          />
        </div>
        <Select value={batch} onValueChange={setBatch}>
          <SelectTrigger className="h-10 w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {BATCHES.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {pending && <span className="text-xs text-muted-foreground">Saving…</span>}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <Badge variant="outline" className="border-[oklch(0.55_0.15_145)]/40 bg-[oklch(0.55_0.15_145)]/10 text-[oklch(0.78_0.15_145)]">
          Present: {counts.present}
        </Badge>
        <Badge variant="outline" className="border-[oklch(0.78_0.15_85)]/40 bg-[oklch(0.78_0.15_85)]/10 text-[oklch(0.85_0.14_85)]">
          Late: {counts.late}
        </Badge>
        <Badge variant="outline" className="border-destructive/40 bg-destructive/10 text-[oklch(0.78_0.18_25)]">
          Absent: {counts.absent}
        </Badge>
        <span className="text-muted-foreground">{list.length} active students</span>
      </div>

      {list.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-dashed border-border/60 px-4 py-12 text-center text-sm text-muted-foreground">
          {students.length === 0
            ? "No students yet. Add a student to start tracking attendance."
            : "No students match your filters."}
        </div>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {list.map((s) => {
            const mark = marks[s.id]
            return (
              <li
                key={s.id}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3"
              >
                <div className="grid size-9 place-items-center rounded-full bg-muted text-xs font-semibold">
                  {initialsFrom(s.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.batch} • {s.course}</div>
                </div>
                <div className="flex items-center gap-1">
                  <MarkButton
                    active={mark === "present"}
                    onClick={() => setMark(s.id, "present")}
                    variant="present"
                    label="Present"
                    Icon={Check}
                  />
                  <MarkButton
                    active={mark === "late"}
                    onClick={() => setMark(s.id, "late")}
                    variant="late"
                    label="Late"
                    Icon={Clock}
                  />
                  <MarkButton
                    active={mark === "absent"}
                    onClick={() => setMark(s.id, "absent")}
                    variant="absent"
                    label="Absent"
                    Icon={X}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function MarkButton({
  active,
  onClick,
  variant,
  label,
  Icon,
}: {
  active: boolean
  onClick: () => void
  variant: "present" | "late" | "absent"
  label: string
  Icon: React.ComponentType<{ className?: string }>
}) {
  const styles =
    variant === "present"
      ? "border-[oklch(0.55_0.15_145)]/40 text-[oklch(0.78_0.15_145)] data-[active=true]:bg-[oklch(0.55_0.15_145)]/20"
      : variant === "late"
        ? "border-[oklch(0.78_0.15_85)]/40 text-[oklch(0.85_0.14_85)] data-[active=true]:bg-[oklch(0.78_0.15_85)]/20"
        : "border-destructive/40 text-[oklch(0.78_0.18_25)] data-[active=true]:bg-destructive/20"

  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      aria-label={label}
      className={cn(
        "grid size-8 place-items-center rounded-md border bg-transparent transition hover:bg-muted",
        styles,
      )}
    >
      <Icon className="size-4" />
    </button>
  )
}
