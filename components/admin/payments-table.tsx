"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { MessageCircle, Receipt as ReceiptIcon, Search } from "lucide-react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ReceiptDialog } from "@/components/admin/receipt-dialog"
import { formatDate, formatINR, initialsFrom } from "@/lib/format"
import type { Payment, Student } from "@/lib/types"
import { whatsappShareUrl } from "@/lib/receipt-pdf"

const MODES = ["all", "Cash", "UPI", "Card", "Bank Transfer"] as const

const modeColor: Record<string, string> = {
  Cash: "bg-chart-2/15 text-[oklch(0.85_0.14_85)]",
  UPI: "bg-primary/15 text-primary",
  Card: "bg-chart-3/15 text-[oklch(0.78_0.18_35)]",
  "Bank Transfer": "bg-chart-5/15 text-[oklch(0.85_0.1_90)]",
}

export function PaymentsTable({
  payments,
  students,
}: {
  payments: Payment[]
  students: Student[]
}) {
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState<string>("all")
  const [active, setActive] = useState<{ payment: Payment; student: Student } | null>(null)
  const [open, setOpen] = useState(false)

  const studentMap = useMemo(() => new Map(students.map((s) => [s.id, s])), [students])

  const rows = useMemo(() => {
    return payments.filter((p) => {
      if (mode !== "all" && p.mode !== mode) return false
      if (!query.trim()) return true
      const s = studentMap.get(p.studentId)
      const haystack = `${s?.name ?? ""} ${p.receiptNo} ${p.studentId}`.toLowerCase()
      return haystack.includes(query.toLowerCase())
    })
  }, [payments, query, mode, studentMap])

  function viewReceipt(p: Payment) {
    const s = studentMap.get(p.studentId)
    if (!s) return
    setActive({ payment: p, student: s })
    setOpen(true)
  }

  function shareWhatsApp(p: Payment) {
    const s = studentMap.get(p.studentId)
    if (!s) return
    window.open(whatsappShareUrl(p, s), "_blank", "noopener,noreferrer")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by student, receipt no..."
            className="h-10 pl-9"
          />
        </div>
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger className="h-10 w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODES.map((m) => (
              <SelectItem key={m} value={m}>
                {m === "all" ? "All Modes" : m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Receipt</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead aria-label="Actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => {
              const s = studentMap.get(p.studentId)
              if (!s) return null
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.receiptNo}</TableCell>
                  <TableCell>
                    <Link
                      href={`/students/${s.id}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <div className="grid size-7 place-items-center rounded-full bg-muted text-[10px] font-semibold">
                        {initialsFrom(s.name)}
                      </div>
                      <div className="leading-tight">
                        <div className="text-sm">{s.name}</div>
                        <div className="text-[11px] text-muted-foreground">{s.course}</div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(p.date)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-transparent ${modeColor[p.mode] ?? ""}`}>
                      {p.mode}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatINR(p.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => viewReceipt(p)}>
                        <ReceiptIcon />
                        View
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-[oklch(0.78_0.15_145)]"
                        onClick={() => shareWhatsApp(p)}
                        aria-label="Share on WhatsApp"
                      >
                        <MessageCircle className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                  {payments.length === 0
                    ? "No payments recorded yet. Click 'Record Payment' to add the first one."
                    : "No payments match your filters."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ReceiptDialog
        open={open}
        onOpenChange={setOpen}
        payment={active?.payment ?? null}
        student={active?.student ?? null}
      />
    </div>
  )
}
