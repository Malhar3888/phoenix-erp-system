"use client"

import { useEffect, useState, useTransition } from "react"
import { Loader2, Plus } from "lucide-react"
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
import { BATCHES, COURSES } from "@/lib/mock-data"
import { toast } from "sonner"
import { createStudent, updateStudent } from "@/lib/actions"
import type { Student, StudentStatus } from "@/lib/types"

type Props = {
  /** If provided, the dialog is in edit mode. */
  student?: Student
  /** Custom trigger; defaults to "Add Student" primary button (create mode only). */
  trigger?: React.ReactNode
  /** Controlled open state (optional). */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function StudentFormDialog({
  student,
  trigger,
  open: openProp,
  onOpenChange,
}: Props) {
  const isEdit = !!student
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = openProp ?? uncontrolledOpen
  const setOpen = onOpenChange ?? setUncontrolledOpen

  const [course, setCourse] = useState<string>(student?.course ?? COURSES[0])
  const [batch, setBatch] = useState<string>(student?.batch ?? BATCHES[0])
  const [status, setStatus] = useState<StudentStatus>(student?.status ?? "active")
  const [pending, startTransition] = useTransition()

  // Reset internal selects whenever the dialog opens for a new student.
  useEffect(() => {
    if (open && student) {
      setCourse(student.course)
      setBatch(student.batch)
      setStatus(student.status)
    }
  }, [open, student])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload = {
      name: String(fd.get("name") ?? ""),
      mobile: String(fd.get("mobile") ?? ""),
      email: String(fd.get("email") ?? ""),
      address: String(fd.get("address") ?? ""),
      course,
      batch,
      joiningDate: String(fd.get("joining") ?? ""),
      totalFees: Number(fd.get("totalFees") ?? 0),
    }

    startTransition(async () => {
      try {
        if (isEdit && student) {
          await updateStudent(student.id, { ...payload, status })
          toast.success(`${payload.name} updated`)
        } else {
          const res = await createStudent(payload)
          toast.success(`Student ${res.id} added`)
        }
        setOpen(false)
        ;(e.target as HTMLFormElement).reset()
      } catch (err) {
        console.log("[v0] save student failed:", err)
        toast.error(isEdit ? "Could not update student." : "Could not add student.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        !isEdit && (
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Add Student
            </Button>
          </DialogTrigger>
        )
      )}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Student" : "Add New Student"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the student's details and save changes."
              : "Fill in the student's details. They'll be enrolled into the selected batch."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Rahul Sharma"
              defaultValue={student?.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              placeholder="+91 ..."
              defaultValue={student?.mobile}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              defaultValue={student?.email}
              required
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Permanent address..."
              defaultValue={student?.address}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Course</Label>
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COURSES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Batch</Label>
            <Select value={batch} onValueChange={setBatch}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BATCHES.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="joining">Joining Date</Label>
            <Input
              id="joining"
              name="joining"
              type="date"
              defaultValue={student?.joiningDate}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalFees">Total Fees (INR)</Label>
            <Input
              id="totalFees"
              name="totalFees"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="45000"
              defaultValue={student?.totalFees}
              required
            />
          </div>

          {isEdit && (
            <div className="space-y-2 sm:col-span-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as StudentStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin" />}
              {isEdit ? "Save Changes" : "Add Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
