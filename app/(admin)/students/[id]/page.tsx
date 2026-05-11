import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CalendarDays,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  TrendingUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/admin/page-header"
import { StudentQrCard } from "@/components/admin/student-qr-card"
import { StudentPaymentsTable } from "@/components/admin/student-payments-table"
import { StudentAttendance } from "@/components/admin/student-attendance"
import { StudentDocuments } from "@/components/admin/student-documents"
import { StudentFormDialog } from "@/components/admin/student-form-dialog"
import { StudentDeleteDialog } from "@/components/admin/student-delete-dialog"
import {
  getAttendanceByStudent,
  getDocumentsByStudent,
  getPaymentsByStudent,
  getStudentById,
} from "@/lib/queries"
import { formatDate, formatINR, initialsFrom } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const student = await getStudentById(id)
  if (!student) notFound()

  const [payments, attendance, documents] = await Promise.all([
    getPaymentsByStudent(student.id),
    getAttendanceByStudent(student.id),
    getDocumentsByStudent(student.id),
  ])

  const paidPct =
    student.totalFees > 0 ? Math.round((student.paidFees / student.totalFees) * 100) : 0
  const presentDays = attendance.filter(
    (a) => a.status === "present" || a.status === "late",
  ).length
  const absentDays = attendance.filter((a) => a.status === "absent").length
  const attPct = attendance.length > 0 ? Math.round((presentDays / attendance.length) * 100) : 0

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href="/students">
          <ArrowLeft />
          Back to students
        </Link>
      </Button>

      <PageHeader
        title={student.name}
        description={`${student.id}  •  ${student.course}  •  ${student.batch}`}
        actions={
          <>
            <StudentFormDialog
              student={student}
              trigger={
                <Button variant="outline">
                  <Pencil />
                  Edit
                </Button>
              }
            />
            <StudentDeleteDialog
              studentId={student.id}
              studentName={student.name}
              redirectAfter
              trigger={
                <Button
                  variant="outline"
                  className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 />
                  Delete
                </Button>
              }
            />
            <Button asChild>
              <Link href="/fees">Add Payment</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="glass lg:col-span-2">
          <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="grid size-20 shrink-0 place-items-center rounded-full bg-primary/15 text-2xl font-bold text-primary ring-2 ring-primary/30">
                {initialsFrom(student.name)}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold">{student.name}</h2>
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/10 capitalize text-primary"
                  >
                    {student.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Joined {formatDate(student.joiningDate)}
                  {student.completionDate
                    ? ` • Expected completion ${formatDate(student.completionDate)}`
                    : ""}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="size-3.5" /> {student.mobile}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-3.5" /> {student.email}
                  </span>
                  {student.address && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5" /> {student.address}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden h-24 sm:block" />

            <div className="grid w-full grid-cols-2 gap-4 sm:max-w-sm">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Course
                </div>
                <div className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold">
                  <GraduationCap className="size-4 text-primary" />
                  {student.course}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Batch
                </div>
                <div className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold">
                  <CalendarDays className="size-4 text-primary" />
                  {student.batch}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Attendance
                </div>
                <div className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold">
                  <TrendingUp className="size-4 text-primary" />
                  {attPct}%
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Documents
                </div>
                <div className="mt-0.5 text-sm font-semibold">
                  {documents.length} files
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <StudentQrCard student={student} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Total Fees</CardDescription>
            <CardTitle className="text-2xl">{formatINR(student.totalFees)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Paid</span>
              <span className="font-semibold text-foreground">
                {formatINR(student.paidFees)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Remaining</span>
              <span className="font-semibold text-primary">
                {formatINR(student.remainingFees)}
              </span>
            </div>
            <Progress value={paidPct} className="mt-3 h-2" />
            <div className="text-right text-xs text-muted-foreground">
              {paidPct}% collected
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Attendance Summary</CardDescription>
            <CardTitle className="text-2xl">{attPct}%</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Present</span>
              <span className="font-semibold text-[oklch(0.78_0.15_145)]">
                {presentDays} days
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Absent</span>
              <span className="font-semibold text-[oklch(0.78_0.18_25)]">
                {absentDays} days
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Total tracked</span>
              <span className="font-semibold text-foreground">
                {attendance.length} days
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Performance</CardDescription>
            <CardTitle className="text-2xl">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 text-sm">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Course Progress</span>
                <span className="font-semibold text-foreground">{paidPct}%</span>
              </div>
              <Progress value={paidPct} className="h-1.5" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Attendance</span>
                <span className="font-semibold text-foreground">{attPct}%</span>
              </div>
              <Progress value={attPct} className="h-1.5" />
            </div>
            <p className="text-xs text-muted-foreground">
              Performance scoring coming soon — based on attendance and assessments.
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-3">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>All installments and receipts for this student</CardDescription>
            </CardHeader>
            <CardContent>
              <StudentPaymentsTable payments={payments} student={student} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Attendance Calendar</CardTitle>
              <CardDescription>Last 30 days of attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <StudentAttendance records={attendance} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Aadhaar, certificates, agreements, marksheets and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudentDocuments documents={documents} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
