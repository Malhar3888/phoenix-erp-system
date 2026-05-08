import { CalendarCheck, Clock, ScanLine, UserX } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { DailyAttendance } from "@/components/admin/daily-attendance"
import { QrScanner } from "@/components/admin/qr-scanner"
import { BatchPerformanceChart } from "@/components/admin/charts/batch-performance"
import { attendance } from "@/lib/mock-data"

export default function AttendancePage() {
  const today = new Date().toISOString().slice(0, 10)
  const todayRecords = attendance.filter((a) => a.date === today)
  const presentToday = todayRecords.filter((r) => r.status === "present" || r.status === "late").length
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
        <StatCard label="Last 30 Days" value="86%" icon={ScanLine} delta={3} hint="institute avg" accent="primary" />
      </div>

      <Tabs defaultValue="qr" className="space-y-4">
        <TabsList>
          <TabsTrigger value="qr">QR Scanner</TabsTrigger>
          <TabsTrigger value="manual">Manual Marking</TabsTrigger>
          <TabsTrigger value="batches">Batch Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="qr">
          <QrScanner />
        </TabsContent>

        <TabsContent value="manual">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Daily Attendance — {today}</CardTitle>
              <CardDescription>
                Click present, late or absent for each active student, then save.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DailyAttendance />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batches">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Batch Attendance</CardTitle>
              <CardDescription>Average attendance % per batch</CardDescription>
            </CardHeader>
            <CardContent>
              <BatchPerformanceChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
