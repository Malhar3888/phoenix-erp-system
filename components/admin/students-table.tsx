"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ChevronRight, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { BATCHES, COURSES } from "@/lib/mock-data"
import { formatINR, initialsFrom } from "@/lib/format"
import type { Student } from "@/lib/types"

const STATUS_STYLES: Record<string, string> = {
  active: "bg-primary/15 text-primary border-primary/30",
  completed: "bg-success/15 text-[oklch(0.78_0.15_145)] border-[oklch(0.5_0.13_145)]/40",
  dropped: "bg-destructive/15 text-[oklch(0.78_0.18_25)] border-destructive/40",
}

export function StudentsTable({ students }: { students: Student[] }) {
  const [query, setQuery] = useState("")
  const [course, setCourse] = useState<string>("all")
  const [batch, setBatch] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return students.filter((s) => {
      if (course !== "all" && s.course !== course) return false
      if (batch !== "all" && s.batch !== batch) return false
      if (status !== "all" && s.status !== status) return false
      if (q && !`${s.name} ${s.mobile} ${s.email} ${s.id}`.toLowerCase().includes(q))
        return false
      return true
    })
  }, [students, query, course, batch, status])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, mobile, email, ID..."
            className="h-10 pl-9"
          />
        </div>
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger className="h-10 w-[160px]">
            <SelectValue placeholder="Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {COURSES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={batch} onValueChange={setBatch}>
          <SelectTrigger className="h-10 w-[140px]">
            <SelectValue placeholder="Batch" />
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
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-10 w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="dropped">Dropped</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Fees</TableHead>
              <TableHead>Status</TableHead>
              <TableHead aria-label="Actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => {
              const paidPct =
                s.totalFees > 0 ? Math.round((s.paidFees / s.totalFees) * 100) : 0
              return (
                <TableRow key={s.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-full bg-muted text-xs font-semibold">
                        {initialsFrom(s.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-foreground">
                          {s.name}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {s.id} • {s.mobile}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{s.course}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {s.batch}
                    </Badge>
                  </TableCell>
                  <TableCell className="min-w-[180px]">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-foreground">
                        {formatINR(s.paidFees)}
                      </span>
                      <span className="text-muted-foreground">
                        of {formatINR(s.totalFees)}
                      </span>
                    </div>
                    <Progress value={paidPct} className="mt-1.5 h-1.5" />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${STATUS_STYLES[s.status] ?? ""}`}
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="opacity-60 transition group-hover:opacity-100"
                    >
                      <Link href={`/students/${s.id}`}>
                        View <ChevronRight />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                  {students.length === 0
                    ? "No students yet. Click 'Add Student' to enroll your first one."
                    : "No students match your filters."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{filtered.length}</strong> of{" "}
          <strong className="text-foreground">{students.length}</strong> students
        </span>
      </div>
    </div>
  )
}
