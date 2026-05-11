"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteCourse } from "@/lib/actions"

interface CourseDeleteDialogProps {
  courseId: string
  courseName: string
  trigger?: React.ReactNode
}

export function CourseDeleteDialog({
  courseId,
  courseName,
  trigger,
}: CourseDeleteDialogProps) {
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteCourse(courseId)
        toast.success("Course deleted successfully")
      } catch (err) {
        toast.error("Failed to delete course")
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || <Button variant="ghost">Delete</Button>}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Course?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{courseName}</strong>? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2">
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={pending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {pending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
