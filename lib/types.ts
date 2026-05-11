export type StudentStatus = "active" | "completed" | "dropped"

export type Student = {
  id: string
  name: string
  photo?: string
  mobile: string
  email: string
  address: string
  parentMobile?: string
  gender?: "Male" | "Female" | "Other"
  dateOfBirth?: string
  course: string
  batch: string
  joiningDate: string
  completionDate?: string
  totalFees: number
  paidFees: number
  remainingFees: number
  installmentPlan?: string
  notes?: string
  status: StudentStatus
}

export type BatchMode = "Online" | "Offline" | "Hybrid"
export type BatchStatus = "Active" | "Completed" | "Paused"

export type Batch = {
  id: string
  name: string
  course: string
  trainer?: string
  startDate: string
  endDate?: string
  batchTime?: string
  maxStudents: number
  mode: BatchMode
  status: BatchStatus
  studentCount?: number
  createdAt: string
}

export type BatchStudent = {
  batchId: string
  studentId: string
  studentName: string
  assignedDate: string
}

export type PaymentMode = "Cash" | "UPI" | "Card" | "Bank Transfer"

export type Payment = {
  id: string
  studentId: string
  studentName?: string
  amount: number
  mode: PaymentMode
  receiptNo: string
  date: string
  note?: string
}

export type AttendanceStatus = "present" | "absent" | "late"

export type AttendanceRecord = {
  id: string
  studentId: string
  date: string
  status: AttendanceStatus
}

export type ExpenseCategory =
  | "Rent"
  | "Electricity"
  | "Salary"
  | "Marketing"
  | "Equipment"
  | "Internet"
  | "Other"

export type Expense = {
  id: string
  title: string
  amount: number
  category: ExpenseCategory
  date: string
  note?: string
  paidTo?: string
}

export type InquirySource = "Walk-in" | "Phone" | "Website" | "Referral" | "Social Media" | "Other"
export type InquiryStatus = "new" | "contacted" | "converted" | "lost"

export type Inquiry = {
  id: string
  name: string
  mobile: string
  email?: string
  course: string
  source: InquirySource
  followUpDate: string
  status: InquiryStatus
  notes?: string
  date: string
}

export type DocumentType =
  | "Aadhaar"
  | "Certificate"
  | "Receipt"
  | "Agreement"
  | "Marksheet"
  | "Resume"

export type StudentDocument = {
  id: string
  studentId: string
  type: DocumentType
  name: string
  uploadedAt: string
  size: string
}
