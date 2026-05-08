import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/admin/page-header"
import { StudentFormDialog } from "@/components/admin/student-form-dialog"
import { StudentsTable } from "@/components/admin/students-table"

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="All enrolled students. Search, filter and open profiles."
        actions={
          <>
            <Button variant="outline">
              <Download />
              Export CSV
            </Button>
            <StudentFormDialog />
          </>
        }
      />
      <StudentsTable />
    </div>
  )
}
