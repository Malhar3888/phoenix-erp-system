"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { COURSES } from "@/lib/mock-data"
import type { Inquiry } from "@/lib/types"

type Props = {
  onSubmit?: (i: Inquiry) => void
}

export function InquiryFormDialog({ onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [course, setCourse] = useState<string>(COURSES[0])
  const [followUpDate, setFollowUpDate] = useState(
    new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
  )
  const [notes, setNotes] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const inquiry: Inquiry = {
      id: `INQ-${Math.floor(Math.random() * 9000) + 1000}`,
      name,
      mobile,
      course,
      followUpDate,
      status: "new",
      notes: notes || undefined,
    }
    onSubmit?.(inquiry)
    setOpen(false)
    setName("")
    setMobile("")
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          New Inquiry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log New Inquiry</DialogTitle>
          <DialogDescription>
            Capture leads from walk-ins, calls and online forms.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="iname">Full Name</Label>
            <Input
              id="iname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="imobile">Mobile</Label>
              <Input
                id="imobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 ..."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ifu">Follow-up</Label>
              <Input
                id="ifu"
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="icourse">Course Interested</Label>
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger id="icourse">
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
          <div className="grid gap-2">
            <Label htmlFor="inotes">Notes</Label>
            <Textarea
              id="inotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Preferred batch, source, comments..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Inquiry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
