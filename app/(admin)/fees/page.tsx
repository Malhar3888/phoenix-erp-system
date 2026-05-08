import { AlertCircle, Banknote, Receipt as ReceiptIcon, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/admin/page-header"
import { PaymentFormDialog } from "@/components/admin/payment-form-dialog"
import { StatCard } from "@/components/admin/stat-card"
import { PaymentsTable } from "@/components/admin/payments-table"
import { kpis, payments, students } from "@/lib/mock-data"
import { formatINR } from "@/lib/format"

export default function FeesPage() {
  const collectedThisMonth = payments
    .filter((p) => new Date(p.date).getMonth() === new Date().getMonth())
    .reduce((s, p) => s + p.amount, 0)

  const studentsWithDues = students.filter((s) => s.remainingFees > 0).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fees & Payments"
        description="Record payments, generate PDF receipts and share them on WhatsApp instantly."
        actions={<PaymentFormDialog />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Collected"
          value={formatINR(kpis.totalRevenue)}
          icon={Banknote}
          accent="primary"
          delta={18}
          hint="all-time"
        />
        <StatCard
          label="This Month"
          value={formatINR(collectedThisMonth)}
          icon={TrendingUp}
          delta={9}
        />
        <StatCard
          label="Pending Fees"
          value={formatINR(kpis.pendingFees)}
          icon={AlertCircle}
          delta={-4}
          hint="reducing"
        />
        <StatCard
          label="Students with Dues"
          value={String(studentsWithDues)}
          icon={ReceiptIcon}
          hint={`of ${students.length} total`}
        />
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
          <CardDescription>
            Click any row to view, download or WhatsApp the receipt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentsTable />
        </CardContent>
      </Card>
    </div>
  )
}
