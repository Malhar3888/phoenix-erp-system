import "server-only"
import { sql } from "@/lib/db"
import type {
  Student,
  Payment,
  Expense,
  Inquiry,
  Attendance,
  StudentDocument,
} from "@/lib/types"

/* ---------- Row mappers (snake_case -> camelCase) ---------- */

function mapStudent(r: any): Student {
  return {
    id: r.id,
    name: r.name,
    photo: r.photo ?? undefined,
    mobile: r.mobile,
    email: r.email,
    address: r.address ?? "",
    course: r.course,
    batch: r.batch,
    joiningDate: r.joining_date instanceof Date ? r.joining_date.toISOString().slice(0, 10) : r.joining_date,
    completionDate: r.completion_date
      ? r.completion_date instanceof Date
        ? r.completion_date.toISOString().slice(0, 10)
        : r.completion_date
      : undefined,
    totalFees: Number(r.total_fees),
    status: r.status,
  }
}

function mapPayment(r: any): Payment {
  return {
    id: r.id,
    studentId: r.student_id,
    amount: Number(r.amount),
    mode: r.mode,
    receiptNo: r.receipt_no,
    date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : r.date,
    note: r.note ?? undefined,
  }
}

function mapExpense(r: any): Expense {
  return {
    id: r.id,
    category: r.category,
    amount: Number(r.amount),
    date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : r.date,
    note: r.note ?? undefined,
    paidTo: r.paid_to ?? undefined,
  }
}

function mapInquiry(r: any): Inquiry {
  return {
    id: r.id,
    name: r.name,
    mobile: r.mobile,
    email: r.email ?? undefined,
    course: r.course,
    source: r.source,
    status: r.status,
    note: r.note ?? undefined,
    date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : r.date,
  }
}

function mapAttendance(r: any): Attendance {
  return {
    id: r.id,
    studentId: r.student_id,
    date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : r.date,
    status: r.status,
  }
}

function mapDoc(r: any): StudentDocument {
  return {
    id: r.id,
    studentId: r.student_id,
    name: r.name,
    url: r.url,
    uploadedAt: r.uploaded_at instanceof Date ? r.uploaded_at.toISOString() : r.uploaded_at,
  }
}

/* ---------- Students ---------- */

export async function getAllStudents(): Promise<Student[]> {
  const rows = await sql`SELECT * FROM students ORDER BY created_at DESC`
  return rows.map(mapStudent)
}

export async function getStudentById(id: string): Promise<Student | null> {
  const rows = await sql`SELECT * FROM students WHERE id = ${id} LIMIT 1`
  return rows[0] ? mapStudent(rows[0]) : null
}

/* ---------- Payments ---------- */

export async function getAllPayments(): Promise<Payment[]> {
  const rows = await sql`SELECT * FROM payments ORDER BY date DESC, created_at DESC`
  return rows.map(mapPayment)
}

export async function getPaymentsByStudent(studentId: string): Promise<Payment[]> {
  const rows = await sql`SELECT * FROM payments WHERE student_id = ${studentId} ORDER BY date DESC`
  return rows.map(mapPayment)
}

export async function getRecentPayments(limit = 10): Promise<Payment[]> {
  const rows = await sql`SELECT * FROM payments ORDER BY date DESC, created_at DESC LIMIT ${limit}`
  return rows.map(mapPayment)
}

/* ---------- Expenses ---------- */

export async function getAllExpenses(): Promise<Expense[]> {
  const rows = await sql`SELECT * FROM expenses ORDER BY date DESC, created_at DESC`
  return rows.map(mapExpense)
}

/* ---------- Inquiries ---------- */

export async function getAllInquiries(): Promise<Inquiry[]> {
  const rows = await sql`SELECT * FROM inquiries ORDER BY date DESC, created_at DESC`
  return rows.map(mapInquiry)
}

/* ---------- Attendance ---------- */

export async function getAttendanceByDate(date: string): Promise<Attendance[]> {
  const rows = await sql`SELECT * FROM attendance WHERE date = ${date}`
  return rows.map(mapAttendance)
}

export async function getAttendanceByStudent(studentId: string): Promise<Attendance[]> {
  const rows =
    await sql`SELECT * FROM attendance WHERE student_id = ${studentId} ORDER BY date DESC`
  return rows.map(mapAttendance)
}

/* ---------- Documents ---------- */

export async function getDocumentsByStudent(studentId: string): Promise<StudentDocument[]> {
  const rows =
    await sql`SELECT * FROM student_documents WHERE student_id = ${studentId} ORDER BY uploaded_at DESC`
  return rows.map(mapDoc)
}

/* ---------- Aggregates / KPIs ---------- */

export type DashboardKpis = {
  totalStudents: number
  activeStudents: number
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  pendingFees: number
  newInquiries: number
  monthRevenue: number
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const [students, revenue, expenses, monthRev, pending, inq] = await Promise.all([
    sql`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'active')::int AS active FROM students`,
    sql`SELECT COALESCE(SUM(amount),0)::float AS sum FROM payments`,
    sql`SELECT COALESCE(SUM(amount),0)::float AS sum FROM expenses`,
    sql`SELECT COALESCE(SUM(amount),0)::float AS sum FROM payments WHERE date >= date_trunc('month', CURRENT_DATE)`,
    sql`SELECT COALESCE(SUM(s.total_fees) - COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.student_id = s.id), 0), 0)::float AS pending
        FROM students s WHERE s.status <> 'dropped'`,
    sql`SELECT COUNT(*)::int AS c FROM inquiries WHERE status = 'new'`,
  ])

  const totalStudents = students[0]?.total ?? 0
  const activeStudents = students[0]?.active ?? 0
  const totalRevenue = Number(revenue[0]?.sum ?? 0)
  const totalExpenses = Number(expenses[0]?.sum ?? 0)
  const monthRevenue = Number(monthRev[0]?.sum ?? 0)

  // pending uses a per-row computation; fallback simple
  const pendingRows =
    await sql`SELECT COALESCE(SUM(s.total_fees),0)::float AS billed,
                     COALESCE((SELECT SUM(amount) FROM payments),0)::float AS paid
              FROM students s WHERE s.status <> 'dropped'`
  const billed = Number(pendingRows[0]?.billed ?? 0)
  const paid = Number(pendingRows[0]?.paid ?? 0)
  const pendingFees = Math.max(billed - paid, 0)

  return {
    totalStudents,
    activeStudents,
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    pendingFees,
    newInquiries: inq[0]?.c ?? 0,
    monthRevenue,
  }
}

export type MonthlySnapshot = {
  month: string // 'YYYY-MM'
  label: string // 'Jan 26'
  revenue: number
  expenses: number
  profit: number
  newStudents: number
}

export async function getMonthlySnapshots(months = 12): Promise<MonthlySnapshot[]> {
  const rev = await sql`
    SELECT to_char(date_trunc('month', date), 'YYYY-MM') AS month,
           COALESCE(SUM(amount),0)::float AS revenue
    FROM payments
    WHERE date >= (CURRENT_DATE - (${months}::int || ' months')::interval)
    GROUP BY 1`
  const exp = await sql`
    SELECT to_char(date_trunc('month', date), 'YYYY-MM') AS month,
           COALESCE(SUM(amount),0)::float AS expenses
    FROM expenses
    WHERE date >= (CURRENT_DATE - (${months}::int || ' months')::interval)
    GROUP BY 1`
  const stu = await sql`
    SELECT to_char(date_trunc('month', joining_date), 'YYYY-MM') AS month,
           COUNT(*)::int AS new_students
    FROM students
    WHERE joining_date >= (CURRENT_DATE - (${months}::int || ' months')::interval)
    GROUP BY 1`

  const map = new Map<string, { revenue: number; expenses: number; newStudents: number }>()
  const ensure = (k: string) => {
    if (!map.has(k)) map.set(k, { revenue: 0, expenses: 0, newStudents: 0 })
    return map.get(k)!
  }
  rev.forEach((r: any) => (ensure(r.month).revenue = Number(r.revenue)))
  exp.forEach((r: any) => (ensure(r.month).expenses = Number(r.expenses)))
  stu.forEach((r: any) => (ensure(r.month).newStudents = Number(r.new_students)))

  // Build last N months in order
  const out: MonthlySnapshot[] = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
    const v = map.get(key) ?? { revenue: 0, expenses: 0, newStudents: 0 }
    out.push({
      month: key,
      label,
      revenue: v.revenue,
      expenses: v.expenses,
      profit: v.revenue - v.expenses,
      newStudents: v.newStudents,
    })
  }
  return out
}

export async function getExpenseBreakdown(): Promise<{ category: string; amount: number }[]> {
  const rows = await sql`
    SELECT category, COALESCE(SUM(amount),0)::float AS amount
    FROM expenses
    GROUP BY category
    ORDER BY amount DESC`
  return rows.map((r: any) => ({ category: r.category, amount: Number(r.amount) }))
}

export async function getBatchPerformance(): Promise<
  { batch: string; students: number; revenue: number }[]
> {
  const rows = await sql`
    SELECT s.batch,
           COUNT(*)::int AS students,
           COALESCE((SELECT SUM(p.amount) FROM payments p
                     JOIN students s2 ON s2.id = p.student_id
                     WHERE s2.batch = s.batch), 0)::float AS revenue
    FROM students s
    GROUP BY s.batch
    ORDER BY s.batch DESC
    LIMIT 8`
  return rows.map((r: any) => ({
    batch: r.batch,
    students: Number(r.students),
    revenue: Number(r.revenue),
  }))
}

/* ---------- Helpers ---------- */

export async function nextReceiptNumber(): Promise<string> {
  const rows = await sql`SELECT COUNT(*)::int AS c FROM payments`
  const n = (rows[0]?.c ?? 0) + 1
  const yr = new Date().getFullYear()
  return `PCC-${yr}-${String(n).padStart(4, "0")}`
}

export async function nextStudentId(): Promise<string> {
  const rows = await sql`SELECT COUNT(*)::int AS c FROM students`
  const n = (rows[0]?.c ?? 0) + 1
  return `STU${String(n).padStart(4, "0")}`
}

export async function nextPaymentId(): Promise<string> {
  const rows = await sql`SELECT COUNT(*)::int AS c FROM payments`
  const n = (rows[0]?.c ?? 0) + 1
  return `PAY${String(n).padStart(4, "0")}`
}

export async function nextExpenseId(): Promise<string> {
  const rows = await sql`SELECT COUNT(*)::int AS c FROM expenses`
  const n = (rows[0]?.c ?? 0) + 1
  return `EXP${String(n).padStart(4, "0")}`
}

export async function nextInquiryId(): Promise<string> {
  const rows = await sql`SELECT COUNT(*)::int AS c FROM inquiries`
  const n = (rows[0]?.c ?? 0) + 1
  return `INQ${String(n).padStart(4, "0")}`
}

export async function nextAttendanceId(): Promise<string> {
  return `ATT${Date.now()}${Math.floor(Math.random() * 1000)}`
}
