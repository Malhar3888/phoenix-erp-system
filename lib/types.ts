export type StudentStatus = "active" | "completed" | "dropped"

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
}

export type InquiryStatus = "new" | "contacted" | "converted" | "lost"

export type Inquiry = {
  id: string
  name: string
  mobile: string
  course: string
  followUpDate: string
  status: InquiryStatus
  notes?: string
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
