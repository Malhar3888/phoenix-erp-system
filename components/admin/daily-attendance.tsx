"use client"

import { useMemo, useState } from "react"
import { Check, Clock, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BATCHES, students } from "@/lib/mock-data"
import { initialsFrom } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { AttendanceStatus } from "@/lib/types"
import { toast } from "sonner"

export function DailyAttendance() {
  const [batch, setBatch] = useState<string>("all")
  const [query, setQuery] = useState("")
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({})

  const list = useMemo(() => {
    return students.filter((s) => {
      if (s.status !== "active") return false
      if (batch !== "all" && s.batch !== batch) return false
      if (query && !`${s.name} ${s.id}`.toLowerCase().includes(query.toLowerCase()))
        return false
      return true
    })
  }, [batch, query])

  function setMark(id: string, status: AttendanceStatus) {
    setMarks((m) => ({ ...m, [id]: status }))
  }

  function bulkPresent() {
    const next = { ...marks }
    for (const s of list) next[s.id] = "present"
    setMarks(next)
    toast.success(`Marked ${list.length} students present`)
  }

  function save() {
    toast.success("Attendance saved (demo)")
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
        <Button variant="outline" onClick={bulkPresent}>
          <Check />
          All Present
        </Button>
        <Button onClick={save}>Save</Button>
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
