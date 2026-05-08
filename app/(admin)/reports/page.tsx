"use client"

import { useMemo } from "react"
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Users,
  Wallet,
  GraduationCap,
  FileDown,
} from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { RevenueChart } from "@/components/admin/charts/revenue-chart"
import { ProfitChart } from "@/components/admin/charts/profit-chart"
import { ExpenseChart } from "@/components/admin/charts/expense-chart"
import { StudentGrowthChart } from "@/components/admin/charts/student-growth-chart"
import { BatchPerformanceChart } from "@/components/admin/charts/batch-performance"
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
import {
  payments,
  expenses,
  students,
  monthlyRevenue,
} from "@/lib/mock-data"
import { formatINR } from "@/lib/format"

export default function ReportsPage() {
  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const netProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue
    ? Math.round((netProfit / totalRevenue) * 100)
    : 0
  const activeStudents = students.filter((s) => s.status === "active").length
  const completedStudents = students.filter((s) => s.status === "completed").length
  const pendingFees = students.reduce((s, st) => s + st.remainingFees, 0)

  const monthly = useMemo(() => monthlyRevenue(), [])

  function exportCsv() {
    const headers = ["Month", "Revenue", "Expense", "Profit"]
    const rows = monthly.map((m) => [m.month, m.revenue, m.expense, m.profit])
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `phoenix-monthly-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports & Analytics"
        description="Financial performance, student growth and operational insights."
        actions={
          <Button variant="outline" onClick={exportCsv}>
            <FileDown />
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatINR(totalRevenue)}
          icon={IndianRupee}
          trend={{ value: "+18.2%", positive: true }}
          subtitle="Across all batches"
        />
        <StatCard
          title="Total Expenses"
          value={formatINR(totalExpenses)}
          icon={Wallet}
          trend={{ value: "+9.4%", positive: false }}
          subtitle="Operating costs"
        />
        <StatCard
          title="Net Profit"
          value={formatINR(netProfit)}
          icon={netProfit >= 0 ? TrendingUp : TrendingDown}
          trend={{ value: `${profitMargin}% margin`, positive: netProfit >= 0 }}
          subtitle="Revenue minus expenses"
        />
        <StatCard
          title="Pending Fees"
          value={formatINR(pendingFees)}
          icon={Users}
          subtitle={`${activeStudents} active learners`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <ProfitChart />
      </div>

      <ExpenseChart />

      <div className="grid gap-6 lg:grid-cols-2">
        <StudentGrowthChart />
        <BatchPerformanceChart />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Monthly Performance Snapshot</CardTitle>
              <CardDescription>
                Revenue, expense and profit for the last 6 months
              </CardDescription>
            </div>
            <div className="hidden h-9 w-9 place-items-center rounded-md border border-border/60 bg-muted/30 sm:grid">
              <GraduationCap className="size-4 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Expense</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthly.map((m) => {
                  const margin = m.revenue
                    ? Math.round((m.profit / m.revenue) * 100)
                    : 0
                  return (
                    <TableRow key={m.month}>
                      <TableCell className="font-semibold">{m.month}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatINR(m.revenue)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatINR(m.expense)}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums text-primary">
                        {formatINR(m.profit)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {margin}%
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Lifecycle</CardTitle>
          <CardDescription>Status distribution across the institute</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Active", value: activeStudents, tone: "primary" },
              { label: "Completed", value: completedStudents, tone: "emerald" },
              {
                label: "Total Enrolled",
                value: students.length,
                tone: "muted",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border/60 bg-card/50 p-5"
              >
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
                <div className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
