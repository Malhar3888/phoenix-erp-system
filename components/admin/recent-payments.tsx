"use client"

import { useState } from "react"
import { Receipt } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ReceiptDialog } from "@/components/admin/receipt-dialog"
import { getRecentPayments, getStudentById } from "@/lib/mock-data"
import { formatDate, formatINR, initialsFrom } from "@/lib/format"
import type { Payment, Student } from "@/lib/types"

const modeColor: Record<string, string> = {
  Cash: "bg-chart-2/15 text-[oklch(0.85_0.14_85)]",
  UPI: "bg-primary/15 text-primary",
  Card: "bg-chart-3/15 text-[oklch(0.78_0.18_35)]",
  "Bank Transfer": "bg-chart-5/15 text-[oklch(0.85_0.1_90)]",
}

export function RecentPayments() {
  const items = getRecentPayments(7)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<{ payment: Payment; student: Student } | null>(null)

  function viewReceipt(p: Payment) {
    const s = getStudentById(p.studentId)
    if (!s) return
    setActive({ payment: p, student: s })
    setOpen(true)
  }

  return (
    <>
      <ul className="divide-y divide-border/60">
        {items.map((p) => {
          const s = getStudentById(p.studentId)
          if (!s) return null
          return (
            <li
              key={p.id}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold text-foreground">
                {initialsFrom(s.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {s.name}
                  </p>
                  <Badge
                    variant="outline"
                    className={`border-transparent ${modeColor[p.mode] ?? ""}`}
                  >
                    {p.mode}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{p.receiptNo}</span>
                  <span aria-hidden>•</span>
                  <span>{formatDate(p.date)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {formatINR(p.amount)}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  onClick={() => viewReceipt(p)}
                  aria-label="View receipt"
                >
                  <Receipt className="size-4" />
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
      <ReceiptDialog
        open={open}
        onOpenChange={setOpen}
        payment={active?.payment ?? null}
        student={active?.student ?? null}
      />
    </>
  )
}
