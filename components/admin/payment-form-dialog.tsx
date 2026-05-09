"use client"

import { useMemo, useState, useTransition } from "react"
import { Loader2, Plus, Receipt as ReceiptIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ReceiptDialog } from "@/components/admin/receipt-dialog"
import { formatINR } from "@/lib/format"
import type { Payment, PaymentMode, Student } from "@/lib/types"
import { toast } from "sonner"
import { createPayment } from "@/lib/actions"

const MODES: PaymentMode[] = ["Cash", "UPI", "Card", "Bank Transfer"]

export function PaymentFormDialog({ students }: { students: Student[] }) {
  const [open, setOpen] = useState(false)
  const [studentId, setStudentId] = useState<string>(students[0]?.id ?? "")
  const [amount, setAmount] = useState<number>(5000)
  const [mode, setMode] = useState<PaymentMode>("UPI")
  const [note, setNote] = useState("")
  const [pending, startTransition] = useTransition()

  const [receiptOpen, setReceiptOpen] = useState(false)
  const [last, setLast] = useState<{ payment: Payment; student: Student } | null>(null)

  const student = useMemo(
    () => students.find((s) => s.id === studentId) ?? students[0],
    [students, studentId],
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!student) {
      toast.error("Add a student first to record a payment.")
      return
    }
    startTransition(async () => {
      try {
        const res = await createPayment({
          studentId: student.id,
          amount,
          mode,
          date: new Date().toISOString().slice(0, 10),
          note: note || undefined,
        })
        const payment: Payment = {
          id: res.id,
          studentId: student.id,
          studentName: student.name,
          amount,
          mode,
          receiptNo: res.receiptNo,
          date: new Date().toISOString().slice(0, 10),
          note: note || undefined,
        }
        const updatedStudent: Student = {
          ...student,
          paidFees: student.paidFees + amount,
          remainingFees: Math.max(0, student.remainingFees - amount),
        }
        setOpen(false)
        setLast({ payment, student: updatedStudent })
        setReceiptOpen(true)
        setNote("")
        toast.success("Payment recorded — receipt generated")
      } catch (err) {
        console.log("[v0] createPayment failed:", err)
        toast.error("Could not record payment. Please try again.")
      }
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button disabled={students.length === 0}>
            <Plus />
            Record Payment
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Record New Payment</DialogTitle>
            <DialogDescription>
              The receipt is generated automatically and can be shared on WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Student</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} • {s.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {student && (
                <p className="text-xs text-muted-foreground">
                  Remaining fees:{" "}
                  <span className="font-semibold text-primary">
                    {formatINR(student.remainingFees)}
                  </span>{" "}
                  of {formatINR(student.totalFees)}
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (INR)</Label>
                <Input
                  id="amount"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Mode</Label>
                <Select value={mode} onValueChange={(v) => setMode(v as PaymentMode)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Installment 2 of 3"
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? <Loader2 className="animate-spin" /> : <ReceiptIcon />}
                Record &amp; Generate Receipt
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ReceiptDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        payment={last?.payment ?? null}
        student={last?.student ?? null}
      />
    </>
  )
}
