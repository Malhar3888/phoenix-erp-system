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
import { kpis, monthlyRevenue } from "@/lib/mock-data"
import { formatINR, formatNumber } from "@/lib/format"

export default function DashboardPage() {
  const months = monthlyRevenue()
  const last = months[months.length - 1]
  const monthlyProfit = last.profit
  const attendancePct = 86

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

      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Students"
          value={formatNumber(kpis.totalStudents)}
          icon={Users}
          delta={12}
          hint="vs last month"
          accent="primary"
        />
        <StatCard
          label="Total Revenue"
          value={formatINR(kpis.totalRevenue)}
          icon={IndianRupee}
          delta={18}
          hint="all-time"
        />
        <StatCard
          label="Pending Fees"
          value={formatINR(kpis.pendingFees)}
          icon={Receipt}
          delta={-4}
          hint="reducing"
        />
        <StatCard
          label="Monthly Profit"
          value={formatINR(monthlyProfit)}
          icon={TrendingUp}
          delta={9}
          hint="May 2026"
          accent="primary"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Expenses"
          value={formatINR(kpis.totalExpenses)}
          icon={Wallet}
          delta={6}
          hint="this quarter"
        />
        <StatCard
          label="Today's Collection"
          value={formatINR(kpis.todayCollection)}
          icon={CalendarDays}
          hint="2 receipts"
        />
        <StatCard
          label="Attendance"
          value={`${attendancePct}%`}
          icon={Activity}
          delta={3}
          hint="last 30 days"
          accent="primary"
        />
        <StatCard
          label="Active Batches"
          value="6"
          icon={GraduationCap}
          hint="across 10 courses"
        />
      </div>

      {/* Main charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="glass lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Last 6 months — INR</CardDescription>
            </div>
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              ↑ 18% growth
            </Badge>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest 7 receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentPayments />
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
            <ProfitChart />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Student Growth</CardTitle>
            <CardDescription>Active students over time</CardDescription>
          </CardHeader>
          <CardContent>
            <StudentGrowthChart />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>By category — last quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseChart />
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Batch Performance</CardTitle>
          <CardDescription>Average attendance % per batch</CardDescription>
        </CardHeader>
        <CardContent>
          <BatchPerformanceChart />
        </CardContent>
      </Card>
    </div>
  )
}
