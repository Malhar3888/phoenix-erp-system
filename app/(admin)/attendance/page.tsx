import { CalendarCheck, Clock, ScanLine, UserX } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { DailyAttendance } from "@/components/admin/daily-attendance"
import { QrScanner } from "@/components/admin/qr-scanner"
import { BatchPerformanceChart } from "@/components/admin/charts/batch-performance"
import {
  getAllStudents,
  getAttendanceByDate,
  getBatchPerformance,
} from "@/lib/queries"

export const dynamic = "force-dynamic"

export default async function AttendancePage() {
  const today = new Date().toISOString().slice(0, 10)
  const [students, todayRecords, batchPerf] = await Promise.all([
    getAllStudents(),
    getAttendanceByDate(today),
    getBatchPerformance(),
  ])

  const presentToday = todayRecords.filter(
    (r) => r.status === "present" || r.status === "late",
  ).length
  const absentToday = todayRecords.filter((r) => r.status === "absent").length
  const lateToday = todayRecords.filter((r) => r.status === "late").length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Mark daily attendance manually or scan student QR codes for instant check-in."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Present Today" value={String(presentToday)} icon={CalendarCheck} accent="primary" />
        <StatCard label="Absent Today" value={String(absentToday)} icon={UserX} />
        <StatCard label="Late Today" value={String(lateToday)} icon={Clock} />
        <StatCard
          label="Marked Today"
          value={String(todayRecords.length)}
          icon={ScanLine}
          hint={`of ${students.filter((s) => s.status === "active").length} active`}
          accent="primary"
        />
      </div>

      <Tabs defaultValue="qr" className="space-y-4">
        <TabsList>
          <TabsTrigger value="qr">QR Scanner</TabsTrigger>
          <TabsTrigger value="manual">Manual Marking</TabsTrigger>
          <TabsTrigger value="batches">Batch Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="qr">
          <QrScanner students={students} />
        </TabsContent>

        <TabsContent value="manual">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Daily Attendance — {today}</CardTitle>
              <CardDescription>
                Click present, late or absent for each active student. Each click is saved instantly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DailyAttendance students={students} todayRecords={todayRecords} date={today} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batches">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Batch Attendance</CardTitle>
              <CardDescription>Students per batch</CardDescription>
            </CardHeader>
            <CardContent>
              <BatchPerformanceChart data={batchPerf} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
