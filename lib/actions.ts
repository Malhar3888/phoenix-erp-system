"use server"

import { revalidatePath } from "next/cache"
import { getSql } from "@/lib/db"
import {
  nextStudentId,
  nextPaymentId,
  nextExpenseId,
  nextInquiryId,
  nextAttendanceId,
  nextReceiptNumber,
} from "@/lib/queries"

/* ---------------- STUDENTS ---------------- */

export async function createStudent(input: {
  name: string
  mobile: string
  email: string
  address?: string
  course: string
  batch: string
  joiningDate: string
  totalFees: number
  status?: "active" | "completed" | "dropped"
  photo?: string
}) {
  const sql = getSql()
  const id = await nextStudentId()
  await sql`
    INSERT INTO students (id, name, photo, mobile, email, address, course, batch, joining_date, total_fees, status)
    VALUES (${id}, ${input.name}, ${input.photo ?? null}, ${input.mobile}, ${input.email},
            ${input.address ?? ""}, ${input.course}, ${input.batch}, ${input.joiningDate},
            ${input.totalFees}, ${input.status ?? "active"})`
  revalidatePath("/students")
  revalidatePath("/dashboard")
  return { id }
}

export async function updateStudent(
  id: string,
  input: {
    name: string
    mobile: string
    email: string
    address?: string
    course: string
    batch: string
    joiningDate: string
    totalFees: number
    status: "active" | "completed" | "dropped"
    photo?: string
  },
) {
  const sql = getSql()
  await sql`
    UPDATE students SET
      name = ${input.name},
      photo = ${input.photo ?? null},
      mobile = ${input.mobile},
      email = ${input.email},
      address = ${input.address ?? ""},
      course = ${input.course},
      batch = ${input.batch},
      joining_date = ${input.joiningDate},
      total_fees = ${input.totalFees},
      status = ${input.status}
    WHERE id = ${id}`
  revalidatePath("/students")
  revalidatePath(`/students/${id}`)
  revalidatePath("/dashboard")
}

export async function deleteStudent(id: string) {
  const sql = getSql()
  await sql`DELETE FROM students WHERE id = ${id}`
  revalidatePath("/students")
  revalidatePath("/dashboard")
}

/* ---------------- PAYMENTS ---------------- */

export async function createPayment(input: {
  studentId: string
  amount: number
  mode: "Cash" | "UPI" | "Card" | "Bank Transfer"
  date: string
  note?: string
}) {
  const sql = getSql()
  const id = await nextPaymentId()
  const receiptNo = await nextReceiptNumber()
  await sql`
    INSERT INTO payments (id, student_id, amount, mode, receipt_no, date, note)
    VALUES (${id}, ${input.studentId}, ${input.amount}, ${input.mode}, ${receiptNo}, ${input.date}, ${input.note ?? null})`
  revalidatePath("/fees")
  revalidatePath("/receipts")
  revalidatePath("/dashboard")
  revalidatePath(`/students/${input.studentId}`)
  return { id, receiptNo }
}

export async function deletePayment(id: string) {
  const sql = getSql()
  const rows = await sql`SELECT student_id FROM payments WHERE id = ${id}`
  await sql`DELETE FROM payments WHERE id = ${id}`
  revalidatePath("/fees")
  revalidatePath("/receipts")
  revalidatePath("/dashboard")
  if (rows[0]) revalidatePath(`/students/${rows[0].student_id}`)
}

/* ---------------- EXPENSES ---------------- */

export async function createExpense(input: {
  title: string
  category: string
  amount: number
  date: string
  paidTo?: string
  note?: string
}) {
  const sql = getSql()
  const id = await nextExpenseId()
  await sql`
    INSERT INTO expenses (id, title, category, amount, date, note, paid_to)
    VALUES (${id}, ${input.title}, ${input.category}, ${input.amount}, ${input.date},
            ${input.note ?? null}, ${input.paidTo ?? null})`
  revalidatePath("/expenses")
  revalidatePath("/dashboard")
  revalidatePath("/reports")
  return { id }
}

export async function deleteExpense(id: string) {
  const sql = getSql()
  await sql`DELETE FROM expenses WHERE id = ${id}`
  revalidatePath("/expenses")
  revalidatePath("/dashboard")
}

/* ---------------- INQUIRIES ---------------- */

export async function createInquiry(input: {
  name: string
  mobile: string
  email?: string
  course: string
  source: string
  status?: "new" | "contacted" | "converted" | "lost"
  date: string
  followUpDate?: string
  notes?: string
}) {
  const sql = getSql()
  const id = await nextInquiryId()
  await sql`
    INSERT INTO inquiries (id, name, mobile, email, course, source, status, notes, date, follow_up_date)
    VALUES (${id}, ${input.name}, ${input.mobile}, ${input.email ?? null}, ${input.course},
            ${input.source}, ${input.status ?? "new"}, ${input.notes ?? null}, ${input.date},
            ${input.followUpDate ?? null})`
  revalidatePath("/inquiries")
  revalidatePath("/dashboard")
  return { id }
}

export async function updateInquiryStatus(
  id: string,
  status: "new" | "contacted" | "converted" | "lost",
) {
  const sql = getSql()
  await sql`UPDATE inquiries SET status = ${status} WHERE id = ${id}`
  revalidatePath("/inquiries")
  revalidatePath("/dashboard")
}

export async function deleteInquiry(id: string) {
  const sql = getSql()
  await sql`DELETE FROM inquiries WHERE id = ${id}`
  revalidatePath("/inquiries")
  revalidatePath("/dashboard")
}

/* ---------------- ATTENDANCE ---------------- */

export async function markAttendance(input: {
  studentId: string
  date: string
  status: "present" | "absent" | "late"
}) {
  const sql = getSql()
  const id = nextAttendanceId()
  await sql`
    INSERT INTO attendance (id, student_id, date, status)
    VALUES (${id}, ${input.studentId}, ${input.date}, ${input.status})
    ON CONFLICT (student_id, date) DO UPDATE SET status = EXCLUDED.status, marked_at = NOW()`
  revalidatePath("/attendance")
  revalidatePath(`/students/${input.studentId}`)
}

/* ---------------- BATCHES ---------------- */

async function nextBatchId(): Promise<string> {
  const sql = getSql()
  const rows = await sql`SELECT COUNT(*)::int AS c FROM batches`
  const n = (rows[0]?.c ?? 0) + 1
  return `BAT${String(n).padStart(4, "0")}`
}

export async function createBatch(input: {
  name: string
  course: string
  trainer?: string
  startDate: string
  endDate?: string
  batchTime?: string
  maxStudents?: number
  mode: "Online" | "Offline" | "Hybrid"
  status?: "Active" | "Completed" | "Paused"
}) {
  const sql = getSql()
  const id = await nextBatchId()
  await sql`
    INSERT INTO batches (id, name, course, trainer, start_date, end_date, batch_time, max_students, mode, status)
    VALUES (${id}, ${input.name}, ${input.course}, ${input.trainer ?? null}, ${input.startDate},
            ${input.endDate ?? null}, ${input.batchTime ?? null}, ${input.maxStudents ?? 30},
            ${input.mode}, ${input.status ?? "Active"})`
  revalidatePath("/batches")
  return { id }
}

export async function updateBatch(
  id: string,
  input: {
    name: string
    course: string
    trainer?: string
    startDate: string
    endDate?: string
    batchTime?: string
    maxStudents?: number
    mode: "Online" | "Offline" | "Hybrid"
    status: "Active" | "Completed" | "Paused"
  },
) {
  const sql = getSql()
  await sql`
    UPDATE batches SET
      name = ${input.name},
      course = ${input.course},
      trainer = ${input.trainer ?? null},
      start_date = ${input.startDate},
      end_date = ${input.endDate ?? null},
      batch_time = ${input.batchTime ?? null},
      max_students = ${input.maxStudents ?? 30},
      mode = ${input.mode},
      status = ${input.status}
    WHERE id = ${id}`
  revalidatePath("/batches")
}

export async function deleteBatch(id: string) {
  const sql = getSql()
  await sql`DELETE FROM batches WHERE id = ${id}`
  revalidatePath("/batches")
}

export async function assignStudentToBatch(studentId: string, batchId: string) {
  const sql = getSql()
  const id = `BS${Date.now()}${Math.floor(Math.random() * 1000)}`
  await sql`
    INSERT INTO batch_students (id, batch_id, student_id, assigned_date)
    VALUES (${id}, ${batchId}, ${studentId}, CURRENT_DATE)
    ON CONFLICT (batch_id, student_id) DO NOTHING`
  revalidatePath("/batches")
  revalidatePath(`/students/${studentId}`)
}

export async function removeStudentFromBatch(studentId: string, batchId: string) {
  const sql = getSql()
  await sql`DELETE FROM batch_students WHERE batch_id = ${batchId} AND student_id = ${studentId}`
  revalidatePath("/batches")
  revalidatePath(`/students/${studentId}`)
}
