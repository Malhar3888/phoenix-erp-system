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

export const students: Student[] = [
  {
    id: "STU-1001",
    name: "Rahul Sharma",
    mobile: "+91 98201 11122",
    email: "rahul.sharma@example.com",
    address: "B-21, Andheri East, Mumbai",
    course: "MERN Stack",
    batch: "Morning A",
    joiningDate: "2025-08-12",
    completionDate: "2026-04-12",
    totalFees: 45000,
    paidFees: 30000,
    remainingFees: 15000,
    status: "active",
  },
  {
    id: "STU-1002",
    name: "Priya Verma",
    mobile: "+91 99100 22455",
    email: "priya.verma@example.com",
    address: "Sector 14, Gurgaon",
    course: "Data Science",
    batch: "Evening A",
    joiningDate: "2025-09-01",
    completionDate: "2026-06-01",
    totalFees: 60000,
    paidFees: 45000,
    remainingFees: 15000,
    status: "active",
  },
  {
    id: "STU-1003",
    name: "Aman Gupta",
    mobile: "+91 97654 33890",
    email: "aman.gupta@example.com",
    address: "Civil Lines, Delhi",
    course: "Java Full Stack",
    batch: "Morning B",
    joiningDate: "2025-07-15",
    completionDate: "2026-03-15",
    totalFees: 50000,
    paidFees: 50000,
    remainingFees: 0,
    status: "completed",
  },
  {
    id: "STU-1004",
    name: "Sneha Iyer",
    mobile: "+91 95123 44781",
    email: "sneha.iyer@example.com",
    address: "T. Nagar, Chennai",
    course: "Digital Marketing",
    batch: "Weekend",
    joiningDate: "2025-10-05",
    totalFees: 25000,
    paidFees: 10000,
    remainingFees: 15000,
    status: "active",
  },
  {
    id: "STU-1005",
    name: "Karan Mehta",
    mobile: "+91 98989 99001",
    email: "karan.mehta@example.com",
    address: "Satellite, Ahmedabad",
    course: "Python Full Stack",
    batch: "Evening B",
    joiningDate: "2025-11-10",
    totalFees: 42000,
    paidFees: 12000,
    remainingFees: 30000,
    status: "active",
  },
  {
    id: "STU-1006",
    name: "Neha Kapoor",
    mobile: "+91 90909 12121",
    email: "neha.kapoor@example.com",
    address: "Koramangala, Bengaluru",
    course: "Graphic Design",
    batch: "Afternoon A",
    joiningDate: "2025-09-20",
    totalFees: 30000,
    paidFees: 20000,
    remainingFees: 10000,
    status: "active",
  },
  {
    id: "STU-1007",
    name: "Vikram Singh",
    mobile: "+91 99887 76655",
    email: "vikram.singh@example.com",
    address: "Hazratganj, Lucknow",
    course: "Cyber Security",
    batch: "Evening A",
    joiningDate: "2025-08-25",
    totalFees: 55000,
    paidFees: 22000,
    remainingFees: 33000,
    status: "active",
  },
  {
    id: "STU-1008",
    name: "Anita Desai",
    mobile: "+91 91234 56710",
    email: "anita.desai@example.com",
    address: "Salt Lake, Kolkata",
    course: "Tally Prime",
    batch: "Morning A",
    joiningDate: "2025-10-18",
    totalFees: 18000,
    paidFees: 18000,
    remainingFees: 0,
    status: "completed",
  },
  {
    id: "STU-1009",
    name: "Rohit Yadav",
    mobile: "+91 90011 22334",
    email: "rohit.yadav@example.com",
    address: "Indira Nagar, Patna",
    course: "MS Office Advanced",
    batch: "Weekend",
    joiningDate: "2025-11-22",
    totalFees: 12000,
    paidFees: 6000,
    remainingFees: 6000,
    status: "active",
  },
  {
    id: "STU-1010",
    name: "Megha Joshi",
    mobile: "+91 95551 32100",
    email: "megha.joshi@example.com",
    address: "Hadapsar, Pune",
    course: "AutoCAD",
    batch: "Afternoon A",
    joiningDate: "2025-09-12",
    totalFees: 35000,
    paidFees: 25000,
    remainingFees: 10000,
    status: "active",
  },
  {
    id: "STU-1011",
    name: "Sahil Khan",
    mobile: "+91 99999 88110",
    email: "sahil.khan@example.com",
    address: "Banjara Hills, Hyderabad",
    course: "MERN Stack",
    batch: "Evening B",
    joiningDate: "2025-12-01",
    totalFees: 45000,
    paidFees: 8000,
    remainingFees: 37000,
    status: "active",
  },
  {
    id: "STU-1012",
    name: "Divya Nair",
    mobile: "+91 90876 54321",
    email: "divya.nair@example.com",
    address: "Edappally, Kochi",
    course: "Data Science",
    batch: "Morning A",
    joiningDate: "2025-10-30",
    totalFees: 60000,
    paidFees: 35000,
    remainingFees: 25000,
    status: "active",
  },
]

export const payments: Payment[] = [
  { id: "PAY-2001", studentId: "STU-1001", amount: 15000, mode: "UPI", receiptNo: "PHX-0001", date: "2025-08-12", note: "Admission fee" },
  { id: "PAY-2002", studentId: "STU-1001", amount: 15000, mode: "UPI", receiptNo: "PHX-0014", date: "2025-11-12", note: "Installment 2" },
  { id: "PAY-2003", studentId: "STU-1002", amount: 30000, mode: "Bank Transfer", receiptNo: "PHX-0002", date: "2025-09-01" },
  { id: "PAY-2004", studentId: "STU-1002", amount: 15000, mode: "Card", receiptNo: "PHX-0019", date: "2025-12-01" },
  { id: "PAY-2005", studentId: "STU-1003", amount: 50000, mode: "Bank Transfer", receiptNo: "PHX-0003", date: "2025-07-15" },
  { id: "PAY-2006", studentId: "STU-1004", amount: 10000, mode: "Cash", receiptNo: "PHX-0004", date: "2025-10-05" },
  { id: "PAY-2007", studentId: "STU-1005", amount: 12000, mode: "UPI", receiptNo: "PHX-0005", date: "2025-11-10" },
  { id: "PAY-2008", studentId: "STU-1006", amount: 20000, mode: "UPI", receiptNo: "PHX-0006", date: "2025-09-20" },
  { id: "PAY-2009", studentId: "STU-1007", amount: 22000, mode: "Card", receiptNo: "PHX-0007", date: "2025-08-25" },
  { id: "PAY-2010", studentId: "STU-1008", amount: 18000, mode: "UPI", receiptNo: "PHX-0008", date: "2025-10-18" },
  { id: "PAY-2011", studentId: "STU-1009", amount: 6000, mode: "Cash", receiptNo: "PHX-0009", date: "2025-11-22" },
  { id: "PAY-2012", studentId: "STU-1010", amount: 25000, mode: "Bank Transfer", receiptNo: "PHX-0010", date: "2025-09-12" },
  { id: "PAY-2013", studentId: "STU-1011", amount: 8000, mode: "UPI", receiptNo: "PHX-0011", date: "2025-12-01" },
  { id: "PAY-2014", studentId: "STU-1012", amount: 35000, mode: "Bank Transfer", receiptNo: "PHX-0012", date: "2025-10-30" },
  { id: "PAY-2015", studentId: "STU-1001", amount: 5000, mode: "Cash", receiptNo: "PHX-0020", date: "2026-04-28", note: "Latest installment" },
  { id: "PAY-2016", studentId: "STU-1006", amount: 5000, mode: "UPI", receiptNo: "PHX-0021", date: "2026-05-02" },
  { id: "PAY-2017", studentId: "STU-1010", amount: 5000, mode: "UPI", receiptNo: "PHX-0022", date: "2026-05-05" },
]

export const expenses: Expense[] = [
  { id: "EXP-3001", title: "Office Rent — May", amount: 35000, category: "Rent", date: "2026-05-01" },
  { id: "EXP-3002", title: "Electricity Bill", amount: 6800, category: "Electricity", date: "2026-05-04" },
  { id: "EXP-3003", title: "Trainer Salary — Rakesh", amount: 38000, category: "Salary", date: "2026-05-01" },
  { id: "EXP-3004", title: "Trainer Salary — Megha", amount: 32000, category: "Salary", date: "2026-05-01" },
  { id: "EXP-3005", title: "Instagram Ads Campaign", amount: 15000, category: "Marketing", date: "2026-04-22" },
  { id: "EXP-3006", title: "Internet — Fiber", amount: 2200, category: "Internet", date: "2026-05-03" },
  { id: "EXP-3007", title: "Projector Replacement", amount: 28000, category: "Equipment", date: "2026-04-18" },
  { id: "EXP-3008", title: "Office Rent — April", amount: 35000, category: "Rent", date: "2026-04-01" },
  { id: "EXP-3009", title: "Electricity Bill — April", amount: 7100, category: "Electricity", date: "2026-04-04" },
  { id: "EXP-3010", title: "Google Ads", amount: 12000, category: "Marketing", date: "2026-03-25" },
  { id: "EXP-3011", title: "Office Rent — March", amount: 35000, category: "Rent", date: "2026-03-01" },
  { id: "EXP-3012", title: "Stationery & Printing", amount: 4500, category: "Other", date: "2026-04-10" },
]

const today = new Date()
function dateOffset(days: number) {
  const d = new Date(today)
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

// Generate ~30 days of attendance for active students
function generateAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  let id = 1
  const activeStudents = students.filter((s) => s.status === "active")
  for (let day = 0; day < 30; day++) {
    const date = dateOffset(day)
    // skip Sundays for non-weekend batches
    const dow = new Date(date).getDay()
    for (const s of activeStudents) {
      if (dow === 0 && s.batch !== "Weekend") continue
      const r = Math.random()
      const status: AttendanceRecord["status"] =
        r < 0.78 ? "present" : r < 0.9 ? "absent" : "late"
      records.push({
        id: `ATT-${String(id++).padStart(5, "0")}`,
        studentId: s.id,
        date,
        status,
      })
    }
  }
  return records
}

export const attendance: AttendanceRecord[] = generateAttendance()

export const inquiries: Inquiry[] = [
  { id: "INQ-4001", name: "Tarun Bhat", mobile: "+91 98112 33445", course: "MERN Stack", followUpDate: "2026-05-12", status: "new" },
  { id: "INQ-4002", name: "Pooja Rao", mobile: "+91 99220 11445", course: "Data Science", followUpDate: "2026-05-10", status: "contacted", notes: "Interested in evening batch" },
  { id: "INQ-4003", name: "Imran Sheikh", mobile: "+91 97700 22113", course: "Digital Marketing", followUpDate: "2026-05-09", status: "new" },
  { id: "INQ-4004", name: "Lavanya M.", mobile: "+91 98456 11200", course: "Graphic Design", followUpDate: "2026-05-15", status: "contacted" },
  { id: "INQ-4005", name: "Suraj Patil", mobile: "+91 90909 56789", course: "Python Full Stack", followUpDate: "2026-04-28", status: "converted", notes: "Joined as STU-1011" },
  { id: "INQ-4006", name: "Rekha Iyer", mobile: "+91 91234 87654", course: "Tally Prime", followUpDate: "2026-04-25", status: "lost" },
  { id: "INQ-4007", name: "Arjun Pillai", mobile: "+91 99001 23456", course: "Cyber Security", followUpDate: "2026-05-14", status: "new" },
]

export const documents: StudentDocument[] = [
  { id: "DOC-5001", studentId: "STU-1001", type: "Aadhaar", name: "Rahul_Aadhaar.pdf", uploadedAt: "2025-08-12", size: "1.2 MB" },
  { id: "DOC-5002", studentId: "STU-1001", type: "Agreement", name: "Rahul_Agreement.pdf", uploadedAt: "2025-08-12", size: "320 KB" },
  { id: "DOC-5003", studentId: "STU-1001", type: "Receipt", name: "PHX-0001.pdf", uploadedAt: "2025-08-12", size: "180 KB" },
  { id: "DOC-5004", studentId: "STU-1002", type: "Aadhaar", name: "Priya_Aadhaar.pdf", uploadedAt: "2025-09-01", size: "0.9 MB" },
  { id: "DOC-5005", studentId: "STU-1002", type: "Marksheet", name: "Priya_12th_Marksheet.pdf", uploadedAt: "2025-09-01", size: "1.4 MB" },
  { id: "DOC-5006", studentId: "STU-1003", type: "Certificate", name: "Aman_Java_Certificate.pdf", uploadedAt: "2026-03-16", size: "650 KB" },
  { id: "DOC-5007", studentId: "STU-1003", type: "Resume", name: "Aman_Resume.pdf", uploadedAt: "2026-03-20", size: "240 KB" },
]

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
  todayCollection: 8500, // demo
}

// Monthly data for charts
export function monthlyRevenue() {
  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"]
  const revenue = [62000, 78000, 85000, 96000, 110000, 145000]
  const expense = [52000, 60000, 64000, 71000, 78000, 95000]
  return months.map((m, i) => ({
    month: m,
    revenue: revenue[i],
    expense: expense[i],
    profit: revenue[i] - expense[i],
  }))
}

export function studentGrowth() {
  return [
    { month: "Dec", students: 42 },
    { month: "Jan", students: 51 },
    { month: "Feb", students: 63 },
    { month: "Mar", students: 78 },
    { month: "Apr", students: 92 },
    { month: "May", students: 108 },
  ]
}

export function expenseBreakdown() {
  const map = new Map<string, number>()
  for (const e of expenses) {
    map.set(e.category, (map.get(e.category) ?? 0) + e.amount)
  }
  return Array.from(map.entries()).map(([category, amount]) => ({ category, amount }))
}

export function batchPerformance() {
  return [
    { batch: "Morning A", attendance: 92, students: 18 },
    { batch: "Morning B", attendance: 88, students: 14 },
    { batch: "Afternoon A", attendance: 85, students: 12 },
    { batch: "Evening A", attendance: 79, students: 22 },
    { batch: "Evening B", attendance: 81, students: 16 },
    { batch: "Weekend", attendance: 76, students: 11 },
  ]
}
