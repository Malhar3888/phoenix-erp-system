"use client"

import { useState, useTransition } from "react"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { createCourse, updateCourse } from "@/lib/actions"
import type { Course } from "@/lib/types"

interface CourseFormDialogProps {
  course?: Course
  trigger?: React.ReactNode
}

export function CourseFormDialog({ course, trigger }: CourseFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"Active" | "Inactive" | "Archived">(
    course?.status ?? "Active"
  )
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload = {
      name: String(fd.get("name") ?? ""),
      code: String(fd.get("code") ?? ""),
      duration: String(fd.get("duration") ?? ""),
      fees: Number(fd.get("fees") ?? 0),
      trainerName: String(fd.get("trainerName") ?? "") || undefined,
      description: String(fd.get("description") ?? "") || undefined,
      status,
    }

    startTransition(async () => {
      try {
        if (course) {
          await updateCourse(course.id, { ...payload, status } as any)
          toast.success("Course updated successfully")
        } else {
          await createCourse(payload)
          toast.success("Course created successfully")
        }
        setOpen(false)
      } catch (err) {
        toast.error(course ? "Failed to update course" : "Failed to create course")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="gap-2">
            <PlusCircle className="size-4" />
            Add Course
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{course ? "Edit Course" : "Add New Course"}</DialogTitle>
          <DialogDescription>
            {course ? "Update course details" : "Create a new training course"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Web Development"
                defaultValue={course?.name ?? ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Course Code *</Label>
              <Input
                id="code"
                name="code"
                placeholder="e.g., WEB101"
                defaultValue={course?.code ?? ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                name="duration"
                placeholder="e.g., 3 months"
                defaultValue={course?.duration ?? ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fees">Fees (₹) *</Label>
              <Input
                id="fees"
                name="fees"
                type="number"
                placeholder="0"
                defaultValue={course?.fees ?? ""}
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="trainerName">Trainer Name</Label>
              <Input
                id="trainerName"
                name="trainerName"
                placeholder="e.g., John Doe"
                defaultValue={course?.trainerName ?? ""}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Course description..."
                rows={3}
                defaultValue={course?.description ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={pending} className="flex-1">
              {pending ? "Saving..." : course ? "Update Course" : "Add Course"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
