"use client"

import { useState } from "react"
import { Receipt } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ReceiptDialog } from "@/components/admin/receipt-dialog"
import { formatDate, formatINR } from "@/lib/format"
import type { Payment, Student } from "@/lib/types"

const modeColor: Record<string, string> = {
  Cash: "bg-chart-2/15 text-[oklch(0.85_0.14_85)]",
  UPI: "bg-primary/15 text-primary",
  Card: "bg-chart-3/15 text-[oklch(0.78_0.18_35)]",
  "Bank Transfer": "bg-chart-5/15 text-[oklch(0.85_0.1_90)]",
}

export function StudentPaymentsTable({
  payments,
  student,
}: {
  payments: Payment[]
  student: Student
}) {
  const [active, setActive] = useState<Payment | null>(null)
  const [open, setOpen] = useState(false)

  if (payments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
        No payments yet for this student.
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Receipt</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead aria-label="Actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.receiptNo}</TableCell>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setActive(p)
                      setOpen(true)
                    }}
                  >
                    <Receipt />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ReceiptDialog open={open} onOpenChange={setOpen} payment={active} student={student} />
    </>
  )
}
