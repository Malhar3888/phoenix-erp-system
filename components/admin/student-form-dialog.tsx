"use client"

import { useState, useTransition } from "react"
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
import { createStudent } from "@/lib/actions"

export function StudentFormDialog() {
  const [open, setOpen] = useState(false)
  const [course, setCourse] = useState<string>(COURSES[0])
  const [batch, setBatch] = useState<string>(BATCHES[0])
  const [gender, setGender] = useState<string>("Male")
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload = {
      name: String(fd.get("name") ?? ""),
      mobile: String(fd.get("mobile") ?? ""),
      email: String(fd.get("email") ?? ""),
      address: String(fd.get("address") ?? ""),
      parentMobile: String(fd.get("parentMobile") ?? "") || undefined,
      gender,
      dateOfBirth: String(fd.get("dateOfBirth") ?? "") || undefined,
      course,
      batch,
      joiningDate: String(fd.get("joining") ?? ""),
      totalFees: Number(fd.get("totalFees") ?? 0),
      installmentPlan: String(fd.get("installmentPlan") ?? "") || undefined,
    }

    startTransition(async () => {
      try {
        const res = await createStudent(payload)
        toast.success(`Student ${res.id} added`)
        setOpen(false)
        ;(e.target as HTMLFormElement).reset()
      } catch (err) {
        console.log("[v0] createStudent failed:", err)
        toast.error("Could not add student. Please try again.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Fill in the student&apos;s details. They&apos;ll be enrolled into the selected batch.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="e.g. Rahul Sharma" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile</Label>
            <Input id="mobile" name="mobile" type="tel" placeholder="+91 ..." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" name="address" placeholder="Permanent address..." rows={2} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentMobile">Parent Mobile (Optional)</Label>
            <Input id="parentMobile" name="parentMobile" type="tel" placeholder="+91 ..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth (Optional)</Label>
            <Input id="dateOfBirth" name="dateOfBirth" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="installmentPlan">Installment Plan (Optional)</Label>
            <Input id="installmentPlan" name="installmentPlan" placeholder="e.g., 3 months" />
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
            <Input id="joining" name="joining" type="date" required />
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
              required
            />
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin" />}
              Add Student
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
