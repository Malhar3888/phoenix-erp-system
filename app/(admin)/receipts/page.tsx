"use client"

import { useMemo, useState } from "react"
import { Receipt, IndianRupee, FileDown, Send } from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { ReceiptDialog } from "@/components/admin/receipt-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { payments, students } from "@/lib/mock-data"
import { formatINR, formatDate } from "@/lib/format"
import type { Payment, Student } from "@/lib/types"

export default function ReceiptsPage() {
  const [search, setSearch] = useState("")
  const [active, setActive] = useState<{
    payment: Payment
    student: Student
  } | null>(null)

  const studentMap = useMemo(() => {
    const m = new Map<string, Student>()
    for (const s of students) m.set(s.id, s)
    return m
  }, [])

  const rows = useMemo(() => {
    return [...payments]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .map((p) => ({ payment: p, student: studentMap.get(p.studentId)! }))
      .filter((r) => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
          r.payment.receiptNo.toLowerCase().includes(q) ||
          r.student?.name.toLowerCase().includes(q) ||
          r.student?.id.toLowerCase().includes(q) ||
          r.student?.mobile.toLowerCase().includes(q)
        )
      })
  }, [search, studentMap])

  const total = payments.reduce((s, p) => s + p.amount, 0)
  const count = payments.length
  const thisMonth = payments
    .filter((p) => p.date.slice(0, 7) === new Date().toISOString().slice(0, 7))
    .reduce((s, p) => s + p.amount, 0)
  const avg = count > 0 ? Math.round(total / count) : 0

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Receipts"
        description="Browse, download and share every payment receipt issued."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Receipts"
          value={count.toString()}
          icon={Receipt}
          subtitle="Issued to date"
        />
        <StatCard
          title="Total Collected"
          value={formatINR(total)}
          icon={IndianRupee}
          subtitle="All time"
        />
        <StatCard
          title="This Month"
          value={formatINR(thisMonth)}
          icon={FileDown}
          subtitle="Receipts issued"
        />
        <StatCard
          title="Average Receipt"
          value={formatINR(avg)}
          icon={Send}
          subtitle="Per transaction"
        />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>All Receipts</CardTitle>
            <CardDescription>
              Showing {rows.length} of {payments.length}
            </CardDescription>
          </div>
          <Input
            placeholder="Search receipt, student, mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72"
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-muted-foreground"
                    >
                      No receipts match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(({ payment, student }) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        {payment.receiptNo}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {student?.name ?? "—"}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {student?.id ?? payment.studentId}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student?.course ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border/60">
                          {payment.mode}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(payment.date)}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums text-primary">
                        {formatINR(payment.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!student}
                          onClick={() =>
                            student && setActive({ payment, student })
                          }
                        >
                          <Receipt />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {active && (
        <ReceiptDialog
          payment={active.payment}
          student={active.student}
          open={!!active}
          onOpenChange={(o) => !o && setActive(null)}
        />
      )}
    </div>
  )
}
