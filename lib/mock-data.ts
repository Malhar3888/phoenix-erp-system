// Constants used by client forms (courses, batches, etc.)
// Data access lives in lib/queries.ts (server-only) + lib/actions.ts.

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

export const EXPENSE_CATEGORIES = [
  "Rent",
  "Electricity",
  "Salary",
  "Marketing",
  "Equipment",
  "Internet",
  "Other",
] as const

export const INQUIRY_SOURCES = [
  "Walk-in",
  "Phone",
  "Website",
  "Referral",
  "Social Media",
  "Other",
] as const

export const PAYMENT_MODES = ["Cash", "UPI", "Card", "Bank Transfer"] as const
