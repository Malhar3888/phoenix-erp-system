import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Users,
  Wallet,
  GraduationCap,
} from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { RevenueChart } from "@/components/admin/charts/revenue-chart"
import { ProfitChart } from "@/components/admin/charts/profit-chart"
import { ExpenseChart } from "@/components/admin/charts/expense-chart"
import { StudentGrowthChart } from "@/components/admin/charts/student-growth-chart"
import { BatchPerformanceChart } from "@/components/admin/charts/batch-performance"
import { ReportsExportButton } from "@/components/admin/reports-export-button"
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
import {
  getAllStudents,
  getBatchPerformance,
  getDashboardKpis,
  getExpenseBreakdown,
  getMonthlySnapshots,
} from "@/lib/queries"
import { formatINR } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function ReportsPage() {
  const [kpis, monthly, breakdown, batchPerf, students] = await Promise.all([
    getDashboardKpis(),
    getMonthlySnapshots(6),
    getExpenseBreakdown(),
    getBatchPerformance(),
    getAllStudents(),
  ])

  const profitMargin = kpis.totalRevenue
    ? Math.round((kpis.netProfit / kpis.totalRevenue) * 100)
    : 0
  const completedStudents = students.filter((s) => s.status === "completed").length

  const revenueChartData = monthly.map((m) => ({
    month: m.label,
    revenue: m.revenue,
    expense: m.expenses,
  }))
  const profitChartData = monthly.map((m) => ({ month: m.label, profit: m.profit }))
  const growthChartData = monthly.map((m) => ({ month: m.label, students: m.newStudents }))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports & Analytics"
        description="Financial performance, student growth and operational insights."
        actions={<ReportsExportButton rows={monthly} />}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatINR(kpis.totalRevenue)}
          icon={IndianRupee}
          accent="primary"
          hint="across all batches"
        />
        <StatCard
          label="Total Expenses"
          value={formatINR(kpis.totalExpenses)}
          icon={Wallet}
          hint="operating costs"
        />
        <StatCard
          label="Net Profit"
          value={formatINR(kpis.netProfit)}
          icon={kpis.netProfit >= 0 ? TrendingUp : TrendingDown}
          hint={`${profitMargin}% margin`}
          accent={kpis.netProfit >= 0 ? "primary" : "muted"}
        />
        <StatCard
          label="Pending Fees"
          value={formatINR(kpis.pendingFees)}
          icon={Users}
          hint={`${kpis.activeStudents} active learners`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueChartData} />
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle>Monthly Profit</CardTitle>
            <CardDescription>Net of revenue minus expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfitChart data={profitChartData} />
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>By category — all time</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseChart data={breakdown} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Student Growth</CardTitle>
            <CardDescription>New enrollments per month</CardDescription>
          </CardHeader>
          <CardContent>
            <StudentGrowthChart data={growthChartData} />
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle>Batch Performance</CardTitle>
            <CardDescription>Students per batch</CardDescription>
          </CardHeader>
          <CardContent>
            <BatchPerformanceChart data={batchPerf} />
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
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
                  const margin = m.revenue ? Math.round((m.profit / m.revenue) * 100) : 0
                  return (
                    <TableRow key={m.month}>
                      <TableCell className="font-semibold">{m.label}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatINR(m.revenue)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatINR(m.expenses)}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums text-primary">
                        {formatINR(m.profit)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{margin}%</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Student Lifecycle</CardTitle>
          <CardDescription>Status distribution across the institute</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Active", value: kpis.activeStudents },
              { label: "Completed", value: completedStudents },
              { label: "Total Enrolled", value: students.length },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border/60 bg-card/50 p-5">
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
