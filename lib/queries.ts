import "server-only"
import { getSql } from "@/lib/db"
import type {
  Student,
  Payment,
  Expense,
  Inquiry,
  AttendanceRecord,
  StudentDocument,
} from "@/lib/types"

/* ---------- Mappers ---------- */

function toDateStr(v: unknown): string {
  if (!v) return ""
  if (typeof v === "string") return v.length > 10 ? v.slice(0, 10) : v
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return String(v)
}

function mapStudent(r: any): Student {
  const totalFees = Number(r.total_fees ?? 0)
  const paidFees = Number(r.paid_fees ?? 0)
  return {
    id: r.id,
    name: r.name,
    photo: r.photo ?? undefined,
    mobile: r.mobile,
    email: r.email,
    address: r.address ?? "",
    course: r.course,
    batch: r.batch,
    joiningDate: toDateStr(r.joining_date),
    completionDate: r.completion_date ? toDateStr(r.completion_date) : undefined,
    totalFees,
    paidFees,
    remainingFees: Math.max(totalFees - paidFees, 0),
    status: r.status,
  }
}

function mapPayment(r: any): Payment {
  return {
    id: r.id,
    studentId: r.student_id,
    studentName: r.student_name ?? undefined,
    amount: Number(r.amount),
    mode: r.mode,
    receiptNo: r.receipt_no,
    date: toDateStr(r.date),
    note: r.note ?? undefined,
  }
}

function mapExpense(r: any): Expense {
  return {
    id: r.id,
    title: r.title ?? "",
    category: r.category,
    amount: Number(r.amount),
    date: toDateStr(r.date),
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
    notes: r.notes ?? r.note ?? undefined,
    date: toDateStr(r.date),
    followUpDate: r.follow_up_date ? toDateStr(r.follow_up_date) : "",
  }
}

function mapAttendance(r: any): AttendanceRecord {
  return {
    id: r.id,
    studentId: r.student_id,
    date: toDateStr(r.date),
    status: r.status,
  }
}

function mapDoc(r: any): StudentDocument {
  return {
    id: r.id,
    studentId: r.student_id,
    name: r.name,
    type: "Certificate",
    uploadedAt: r.uploaded_at instanceof Date ? r.uploaded_at.toISOString() : String(r.uploaded_at),
    size: "—",
  }
}

/* ---------- Students ---------- */

export async function getAllStudents(): Promise<Student[]> {
  const sql = getSql()
  const rows = await sql`
    SELECT s.*, COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.student_id = s.id), 0)::float AS paid_fees
    FROM students s
    ORDER BY s.created_at DESC
  `
  return rows.map(mapStudent)
}

export async function getStudentById(id: string): Promise<Student | null> {
  const sql = getSql()
  const rows = await sql`
    SELECT s.*, COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.student_id = s.id), 0)::float AS paid_fees
    FROM students s
    WHERE s.id = ${id}
    LIMIT 1
  `
  return rows[0] ? mapStudent(rows[0]) : null
}

/* ---------- Payments ---------- */

export async function getAllPayments(): Promise<Payment[]> {
  const sql = getSql()
  const rows = await sql`
    SELECT p.*, s.name AS student_name
    FROM payments p
    LEFT JOIN students s ON p.student_id = s.id
    ORDER BY p.date DESC, p.created_at DESC
  `
  return rows.map(mapPayment)
}

export async function getPaymentsByStudent(studentId: string): Promise<Payment[]> {
  const sql = getSql()
  const rows = await sql`
    SELECT p.*, s.name AS student_name
    FROM payments p
    LEFT JOIN students s ON p.student_id = s.id
    WHERE p.student_id = ${studentId}
    ORDER BY p.date DESC
  `
  return rows.map(mapPayment)
}

export async function getRecentPayments(limit = 10): Promise<Payment[]> {
  const sql = getSql()
  const rows = await sql`
    SELECT p.*, s.name AS student_name
    FROM payments p
    LEFT JOIN students s ON p.student_id = s.id
    ORDER BY p.date DESC, p.created_at DESC
    LIMIT ${limit}
  `
  return rows.map(mapPayment)
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  const sql = getSql()
  const rows = await sql`
    SELECT p.*, s.name AS student_name
    FROM payments p
    LEFT JOIN students s ON p.student_id = s.id
    WHERE p.id = ${id}
    LIMIT 1
  `
  return rows[0] ? mapPayment(rows[0]) : null
}

/* ---------- Expenses ---------- */

export async function getAllExpenses(): Promise<Expense[]> {
  const sql = getSql()
  const rows = await sql`SELECT * FROM expenses ORDER BY date DESC, created_at DESC`
  return rows.map(mapExpense)
}

/* ---------- Inquiries ---------- */

export async function getAllInquiries(): Promise<Inquiry[]> {
  const sql = getSql()
  const rows = await sql`SELECT * FROM inquiries ORDER BY date DESC, created_at DESC`
  return rows.map(mapInquiry)
}

/* ---------- Attendance ---------- */

export async function getAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
  const sql = getSql()
  const rows = await sql`SELECT * FROM attendance WHERE date = ${date}`
  return rows.map(mapAttendance)
}

export async function getAttendanceByStudent(studentId: string): Promise<AttendanceRecord[]> {
  const sql = getSql()
  const rows =
    await sql`SELECT * FROM attendance WHERE student_id = ${studentId} ORDER BY date DESC`
  return rows.map(mapAttendance)
}

/* ---------- Documents ---------- */

export async function getDocumentsByStudent(studentId: string): Promise<StudentDocument[]> {
  const sql = getSql()
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
  todayCollection: number
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const sql = getSql()
  const [students, revenue, expenses, monthRev, today, inq, billed] = await Promise.all([
    sql`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'active')::int AS active FROM students`,
    sql`SELECT COALESCE(SUM(amount),0)::float AS sum FROM payments`,
    sql`SELECT COALESCE(SUM(amount),0)::float AS sum FROM expenses`,
    sql`SELECT COALESCE(SUM(amount),0)::float AS sum FROM payments WHERE date >= date_trunc('month', CURRENT_DATE)`,
    sql`SELECT COALESCE(SUM(amount),0)::float AS sum FROM payments WHERE date = CURRENT_DATE`,
    sql`SELECT COUNT(*)::int AS c FROM inquiries WHERE status = 'new'`,
    sql`SELECT COALESCE(SUM(total_fees),0)::float AS billed FROM students WHERE status <> 'dropped'`,
  ])

  const totalRevenue = Number(revenue[0]?.sum ?? 0)
  const totalExpenses = Number(expenses[0]?.sum ?? 0)
  const billedAmt = Number(billed[0]?.billed ?? 0)

  return {
    totalStudents: students[0]?.total ?? 0,
    activeStudents: students[0]?.active ?? 0,
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    pendingFees: Math.max(billedAmt - totalRevenue, 0),
    newInquiries: inq[0]?.c ?? 0,
    monthRevenue: Number(monthRev[0]?.sum ?? 0),
    todayCollection: Number(today[0]?.sum ?? 0),
  }
}

export type MonthlySnapshot = {
  month: string
  label: string
  revenue: number
  expenses: number
  profit: number
  newStudents: number
}

export async function getMonthlySnapshots(months = 12): Promise<MonthlySnapshot[]> {
  const sql = getSql()
  const [rev, exp, stu] = await Promise.all([
    sql`SELECT to_char(date_trunc('month', date), 'YYYY-MM') AS month,
                COALESCE(SUM(amount),0)::float AS revenue
         FROM payments
         WHERE date >= (CURRENT_DATE - (${months}::int || ' months')::interval)
         GROUP BY 1`,
    sql`SELECT to_char(date_trunc('month', date), 'YYYY-MM') AS month,
                COALESCE(SUM(amount),0)::float AS expenses
         FROM expenses
         WHERE date >= (CURRENT_DATE - (${months}::int || ' months')::interval)
         GROUP BY 1`,
    sql`SELECT to_char(date_trunc('month', joining_date), 'YYYY-MM') AS month,
                COUNT(*)::int AS new_students
         FROM students
         WHERE joining_date >= (CURRENT_DATE - (${months}::int || ' months')::interval)
         GROUP BY 1`,
  ])

  const map = new Map<string, { revenue: number; expenses: number; newStudents: number }>()
  const ensure = (k: string) => {
    if (!map.has(k)) map.set(k, { revenue: 0, expenses: 0, newStudents: 0 })
    return map.get(k)!
  }
  rev.forEach((r: any) => (ensure(r.month).revenue = Number(r.revenue)))
  exp.forEach((r: any) => (ensure(r.month).expenses = Number(r.expenses)))
  stu.forEach((r: any) => (ensure(r.month).newStudents = Number(r.new_students)))

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
  const sql = getSql()
  const rows = await sql`
    SELECT category, COALESCE(SUM(amount),0)::float AS amount
    FROM expenses
    GROUP BY category
    ORDER BY amount DESC
  `
  return rows.map((r: any) => ({ category: r.category, amount: Number(r.amount) }))
}

export async function getBatchPerformance(): Promise<
  { batch: string; students: number; revenue: number }[]
> {
  const sql = getSql()
  const rows = await sql`
    SELECT s.batch,
           COUNT(*)::int AS students,
           COALESCE((
             SELECT SUM(p.amount) FROM payments p
             JOIN students s2 ON s2.id = p.student_id
             WHERE s2.batch = s.batch
           ), 0)::float AS revenue
    FROM students s
    GROUP BY s.batch
    ORDER BY s.batch DESC
    LIMIT 8
  `
  return rows.map((r: any) => ({
    batch: r.batch,
    students: Number(r.students),
    revenue: Number(r.revenue),
  }))
}

/* ---------- ID generators ---------- */

export async function nextReceiptNumber(): Promise<string> {
  const sql = getSql()
  const rows = await sql`SELECT COUNT(*)::int AS c FROM payments`
  const n = (rows[0]?.c ?? 0) + 1
  const yr = new Date().getFullYear()
  return `PCC-${yr}-${String(n).padStart(4, "0")}`
}

export async function nextStudentId(): Promise<string> {
  const sql = getSql()
  const rows = await sql`SELECT COUNT(*)::int AS c FROM students`
  const n = (rows[0]?.c ?? 0) + 1
  return `STU${String(n).padStart(4, "0")}`
}

export async function nextPaymentId(): Promise<string> {
  const sql = getSql()
  const rows = await sql`SELECT COUNT(*)::int AS c FROM payments`
  const n = (rows[0]?.c ?? 0) + 1
  return `PAY${String(n).padStart(4, "0")}`
}

export async function nextExpenseId(): Promise<string> {
  const sql = getSql()
  const rows = await sql`SELECT COUNT(*)::int AS c FROM expenses`
  const n = (rows[0]?.c ?? 0) + 1
  return `EXP${String(n).padStart(4, "0")}`
}

export async function nextInquiryId(): Promise<string> {
  const sql = getSql()
  const rows = await sql`SELECT COUNT(*)::int AS c FROM inquiries`
  const n = (rows[0]?.c ?? 0) + 1
  return `INQ${String(n).padStart(4, "0")}`
}

export function nextAttendanceId(): string {
  return `ATT${Date.now()}${Math.floor(Math.random() * 1000)}`
}

export async function nextBatchId(): Promise<string> {
  const sql = getSql()
  const rows = await sql`SELECT COUNT(*)::int AS c FROM batches`
  const n = (rows[0]?.c ?? 0) + 1
  return `BAT${String(n).padStart(4, "0")}`
}

/* ---------- BATCH QUERIES ---------- */

export async function getAllBatches(): Promise<import("@/lib/types").Batch[]> {
  const sql = getSql()
  const rows = await sql`
    SELECT b.*, COUNT(bs.student_id)::int AS student_count
    FROM batches b
    LEFT JOIN batch_students bs ON b.id = bs.batch_id
    GROUP BY b.id
    ORDER BY b.start_date DESC
  `
  return rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    course: r.course,
    trainer: r.trainer ?? undefined,
    startDate: toDateStr(r.start_date),
    endDate: r.end_date ? toDateStr(r.end_date) : undefined,
    batchTime: r.batch_time ?? undefined,
    maxStudents: r.max_students ?? 30,
    mode: r.mode,
    status: r.status,
    studentCount: r.student_count ?? 0,
    createdAt: new Date(r.created_at).toISOString(),
  }))
}

export async function getBatchById(id: string): Promise<import("@/lib/types").Batch | null> {
  const sql = getSql()
  const rows = await sql`
    SELECT b.*, COUNT(bs.student_id)::int AS student_count
    FROM batches b
    LEFT JOIN batch_students bs ON b.id = bs.batch_id
    WHERE b.id = ${id}
    GROUP BY b.id
  `
  if (!rows[0]) return null
  const r = rows[0]
  return {
    id: r.id,
    name: r.name,
    course: r.course,
    trainer: r.trainer ?? undefined,
    startDate: toDateStr(r.start_date),
    endDate: r.end_date ? toDateStr(r.end_date) : undefined,
    batchTime: r.batch_time ?? undefined,
    maxStudents: r.max_students ?? 30,
    mode: r.mode,
    status: r.status,
    studentCount: r.student_count ?? 0,
    createdAt: new Date(r.created_at).toISOString(),
  }
}

export async function getBatchStudents(batchId: string): Promise<import("@/lib/types").BatchStudent[]> {
  const sql = getSql()
  const rows = await sql`
    SELECT bs.batch_id, bs.student_id, s.name AS student_name, bs.assigned_date
    FROM batch_students bs
    JOIN students s ON bs.student_id = s.id
    WHERE bs.batch_id = ${batchId}
    ORDER BY s.name ASC
  `
  return rows.map((r: any) => ({
    batchId: r.batch_id,
    studentId: r.student_id,
    studentName: r.student_name,
    assignedDate: toDateStr(r.assigned_date),
  }))
}
