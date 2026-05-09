import { Receipt, IndianRupee, FileDown, Send } from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { ReceiptsTable } from "@/components/admin/receipts-table"
import { getAllPayments, getAllStudents } from "@/lib/queries"
import { formatINR } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function ReceiptsPage() {
  const [payments, students] = await Promise.all([getAllPayments(), getAllStudents()])

  const total = payments.reduce((s, p) => s + p.amount, 0)
  const count = payments.length
  const ym = new Date().toISOString().slice(0, 7)
  const thisMonth = payments
    .filter((p) => p.date.slice(0, 7) === ym)
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
          label="Total Receipts"
          value={count.toString()}
          icon={Receipt}
          hint="issued to date"
        />
        <StatCard
          label="Total Collected"
          value={formatINR(total)}
          icon={IndianRupee}
          hint="all time"
          accent="primary"
        />
        <StatCard
          label="This Month"
          value={formatINR(thisMonth)}
          icon={FileDown}
          hint="receipts issued"
        />
        <StatCard
          label="Average Receipt"
          value={formatINR(avg)}
          icon={Send}
          hint="per transaction"
        />
      </div>

      <ReceiptsTable payments={payments} students={students} />
    </div>
  )
}
