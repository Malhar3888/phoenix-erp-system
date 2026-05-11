import {
  Activity,
  CalendarDays,
  GraduationCap,
  IndianRupee,
  Receipt,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { RevenueChart } from "@/components/admin/charts/revenue-chart"
import { ProfitChart } from "@/components/admin/charts/profit-chart"
import { StudentGrowthChart } from "@/components/admin/charts/student-growth-chart"
import { ExpenseChart } from "@/components/admin/charts/expense-chart"
import { BatchPerformanceChart } from "@/components/admin/charts/batch-performance"
import { RecentPayments } from "@/components/admin/recent-payments"
import {
  getAllStudents,
  getBatchPerformance,
  getDashboardKpis,
  getExpenseBreakdown,
  getMonthlySnapshots,
  getRecentPayments,
} from "@/lib/queries"
import { formatINR, formatNumber } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const [kpis, monthly, expenseBreakdown, batchPerf, recent, students] = await Promise.all([
    getDashboardKpis(),
    getMonthlySnapshots(6),
    getExpenseBreakdown(),
    getBatchPerformance(),
    getRecentPayments(7),
    getAllStudents(),
  ])

  const last = monthly[monthly.length - 1]
  const monthlyProfit = last?.profit ?? 0
  const revenueChartData = monthly.map((m) => ({
    month: m.label,
    revenue: m.revenue,
    expense: m.expenses,
  }))
  const profitChartData = monthly.map((m) => ({ month: m.label, profit: m.profit }))
  const growthChartData = monthly.map((m) => ({ month: m.label, students: m.newStudents }))
  const activeBatches = batchPerf.length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back, Admin — here's how Phoenix Computers is doing today."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/reports">
                <TrendingUp />
                Reports
              </Link>
            </Button>
            <Button asChild>
              <Link href="/fees">
                <IndianRupee />
                New Payment
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Students"
          value={formatNumber(kpis.totalStudents)}
          icon={Users}
          hint={`${kpis.activeStudents} active`}
          accent="primary"
        />
        <StatCard
          label="Total Revenue"
          value={formatINR(kpis.totalRevenue)}
          icon={IndianRupee}
          hint="all-time"
        />
        <StatCard
          label="Pending Fees"
          value={formatINR(kpis.pendingFees)}
          icon={Receipt}
          hint="outstanding"
        />
        <StatCard
          label="Monthly Profit"
          value={formatINR(monthlyProfit)}
          icon={TrendingUp}
          hint={last?.label ?? "—"}
          accent="primary"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Expenses"
          value={formatINR(kpis.totalExpenses)}
          icon={Wallet}
          hint="all-time"
        />
        <StatCard
          label="Today's Collection"
          value={formatINR(kpis.todayCollection)}
          icon={CalendarDays}
          hint="cash + digital"
        />
        <StatCard
          label="New Inquiries"
          value={String(kpis.newInquiries)}
          icon={Activity}
          hint="awaiting follow-up"
          accent="primary"
        />
        <StatCard
          label="Active Batches"
          value={String(activeBatches)}
          icon={GraduationCap}
          hint="in progress"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="glass lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Last 6 months — INR</CardDescription>
            </div>
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              {formatINR(kpis.monthRevenue)} this month
            </Badge>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueChartData} />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest 7 receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentPayments payments={recent} students={students} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Monthly Profit</CardTitle>
            <CardDescription>Net of revenue minus expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfitChart data={profitChartData} />
          </CardContent>
        </Card>

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
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>By category — all time</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseChart data={expenseBreakdown} />
          </CardContent>
        </Card>
      </div>

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
  )
}
