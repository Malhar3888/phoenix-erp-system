import type {
  AttendanceRecord,
  Expense,
  Inquiry,
  Payment,
  Student,
  StudentDocument,
} from "./types"

export const COURSES = [
  "MERN Stack",
  "Python Full Stack",
  "Java Full Stack",
  "Data Science",
  "Digital Marketing",
  "Graphic Design",
  "Cyber Security",
  "MS Office Advanced",
  "Tally Prime",
  "AutoCAD",
] as const

export const BATCHES = [
  "Morning A",
  "Morning B",
  "Afternoon A",
  "Evening A",
  "Evening B",
  "Weekend",
] as const

export const students: Student[] = []

export const payments: Payment[] = []

export const expenses: Expense[] = []

export const attendance: AttendanceRecord[] = []

export const inquiries: Inquiry[] = []

export const documents: StudentDocument[] = []

// Helper queries (Supabase-ready: replace these with DB queries later)
export function getStudentById(id: string): Student | undefined {
  return students.find((s) => s.id === id)
}

export function getPaymentsByStudent(id: string): Payment[] {
  return payments
    .filter((p) => p.studentId === id)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getAttendanceByStudent(id: string): AttendanceRecord[] {
  return attendance.filter((a) => a.studentId === id)
}

export function getDocumentsByStudent(id: string): StudentDocument[] {
  return documents.filter((d) => d.studentId === id)
}

export function getRecentPayments(limit = 8): Payment[] {
  return [...payments].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, limit)
}

export function attendancePercentage(studentId: string): number {
  const records = getAttendanceByStudent(studentId)
  if (records.length === 0) return 0
  const present = records.filter((r) => r.status === "present" || r.status === "late").length
  return Math.round((present / records.length) * 100)
}

// Aggregate KPIs
export const kpis = {
  totalStudents: students.length,
  activeStudents: students.filter((s) => s.status === "active").length,
  totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
  totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
  pendingFees: students.reduce((sum, s) => sum + s.remainingFees, 0),
  todayCollection: 0,
}

// Monthly data for charts — empty until real data is recorded
export function monthlyRevenue() {
  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"]
  return months.map((m) => ({
    month: m,
    revenue: 0,
    expense: 0,
    profit: 0,
  }))
}

export function studentGrowth() {
  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"]
  return months.map((m) => ({ month: m, students: 0 }))
}

export function expenseBreakdown() {
  const map = new Map<string, number>()
  for (const e of expenses) {
    map.set(e.category, (map.get(e.category) ?? 0) + e.amount)
  }
  return Array.from(map.entries()).map(([category, amount]) => ({ category, amount }))
}

export function batchPerformance() {
  return BATCHES.map((batch) => ({ batch, attendance: 0, students: 0 }))
}
