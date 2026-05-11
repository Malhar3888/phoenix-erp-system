import { MessageSquareText, Phone, CheckCircle2, XCircle } from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { InquiryFormDialog } from "@/components/admin/inquiry-form-dialog"
import { InquiriesTable } from "@/components/admin/inquiries-table"
import { getAllInquiries } from "@/lib/queries"

export const dynamic = "force-dynamic"

export default async function InquiriesPage() {
  const inquiries = await getAllInquiries()

  const counts = {
    total: inquiries.length,
    newCount: inquiries.filter((i) => i.status === "new").length,
    converted: inquiries.filter((i) => i.status === "converted").length,
    lost: inquiries.filter((i) => i.status === "lost").length,
  }
  const conversionRate = counts.total
    ? `${Math.round((counts.converted / counts.total) * 100)}% rate`
    : "0%"

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inquiries"
        description="Track leads, follow-ups and conversion pipeline."
        actions={<InquiryFormDialog />}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Inquiries"
          value={counts.total.toString()}
          icon={MessageSquareText}
          hint="all-time leads"
        />
        <StatCard
          label="New"
          value={counts.newCount.toString()}
          icon={Phone}
          hint="awaiting first contact"
        />
        <StatCard
          label="Converted"
          value={counts.converted.toString()}
          icon={CheckCircle2}
          hint={conversionRate}
          accent="primary"
        />
        <StatCard
          label="Lost"
          value={counts.lost.toString()}
          icon={XCircle}
          hint="did not convert"
        />
      </div>

      <InquiriesTable inquiries={inquiries} />
    </div>
  )
}
