import { getAllCourses } from "@/lib/queries"
import { PageHeader } from "@/components/admin/page-header"
import { CourseFormDialog } from "@/components/admin/course-form-dialog"
import { CoursesTable } from "@/components/admin/courses-table"

export const dynamic = "force-dynamic"

export default async function CoursesPage() {
  const courses = await getAllCourses()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Manage training courses and curriculum"
        actions={<CourseFormDialog />}
      />
      <CoursesTable courses={courses} />
    </div>
  )
}
