export type StudentStatus = "active" | "completed" | "dropped"

export type CourseStatus = "Active" | "Inactive" | "Archived"

export type Course = {
  id: string
  name: string
  code: string
  duration: string
  fees: number
  trainerName?: string
  description?: string
  status: CourseStatus
  createdAt?: string
  updatedAt?: string
}

export type Student = {
  id: string
  name: string
  photo?: string
  mobile: string
  email: string
  address: string
  course: string
  batch: string
  joiningDate: string
  completionDate?: string
  totalFees: number
  paidFees: number
  remainingFees: number
  status: StudentStatus
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
