import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getCourseSummary, getAllCourses } from "@/lib/queries"

export async function CoursesSummary() {
  const [summary, courses] = await Promise.all([getCourseSummary(), getAllCourses()])
  const activeCourses = courses.filter((c) => c.status === "Active").slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Courses
          </CardTitle>
          <CardDescription>{summary.total} total courses</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/courses">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active</span>
            <Badge variant="default">{summary.active}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Inactive</span>
            <Badge variant="secondary">{summary.inactive}</Badge>
          </div>
          {activeCourses.length > 0 && (
            <div className="mt-4 space-y-2 border-t pt-3">
              <p className="text-xs font-medium text-muted-foreground">Recent Courses</p>
              {activeCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between rounded-sm bg-muted p-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{course.name}</span>
                    <span className="text-xs text-muted-foreground">{course.code}</span>
                  </div>
                  <span className="text-xs font-medium">{course.duration}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
