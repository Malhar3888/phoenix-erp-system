"use client"

import { FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"

type Row = { label: string; revenue: number; expenses: number; profit: number }

export function ReportsExportButton({ rows }: { rows: Row[] }) {
  function exportCsv() {
    const headers = ["Month", "Revenue", "Expense", "Profit"]
    const csvRows = rows.map((m) => [m.label, m.revenue, m.expenses, m.profit])
    const csv = [headers, ...csvRows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `phoenix-monthly-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" onClick={exportCsv}>
      <FileDown />
      Export CSV
    </Button>
  )
}
