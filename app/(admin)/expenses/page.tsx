import { Wallet, TrendingDown, Receipt, Calendar } from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { ExpenseFormDialog } from "@/components/admin/expense-form-dialog"
import { ExpenseChart } from "@/components/admin/charts/expense-chart"
import { ExpensesTable } from "@/components/admin/expenses-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllExpenses, getExpenseBreakdown } from "@/lib/queries"
import { formatINR } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function ExpensesPage() {
  const [expenses, breakdown] = await Promise.all([getAllExpenses(), getExpenseBreakdown()])

  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const ym = new Date().toISOString().slice(0, 7)
  const thisMonth = expenses
    .filter((e) => e.date.slice(0, 7) === ym)
    .reduce((s, e) => s + e.amount, 0)
  const lastEntry = expenses[0]?.amount ?? 0
  const count = expenses.length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Expenses"
        description="Track operating costs — rent, salaries, utilities, marketing & more."
        actions={<ExpenseFormDialog />}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Expenses"
          value={formatINR(total)}
          icon={Wallet}
          hint="all-time"
        />
        <StatCard
          label="This Month"
          value={formatINR(thisMonth)}
          icon={Calendar}
          hint={ym}
        />
        <StatCard
          label="Latest Entry"
          value={formatINR(lastEntry)}
          icon={Receipt}
          hint={expenses[0]?.title ?? "—"}
        />
        <StatCard
          label="Total Records"
          value={count.toString()}
          icon={TrendingDown}
          hint="logged expenses"
        />
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Breakdown by Category</CardTitle>
          <CardDescription>Where the money goes</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseChart data={breakdown} />
        </CardContent>
      </Card>

      <ExpensesTable expenses={expenses} />
    </div>
  )
}
