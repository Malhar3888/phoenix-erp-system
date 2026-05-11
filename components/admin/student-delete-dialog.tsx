"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { deleteStudent } from "@/lib/actions"

type Props = {
  studentId: string
  studentName: string
  trigger: React.ReactNode
  /** If true, navigate to /students after deletion. Use on the profile page. */
  redirectAfter?: boolean
}

export function StudentDeleteDialog({
  studentId,
  studentName,
  trigger,
  redirectAfter,
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      try {
        await deleteStudent(studentId)
        toast.success(`${studentName} deleted`)
        setOpen(false)
        if (redirectAfter) router.push("/students")
      } catch (err) {
        console.log("[v0] deleteStudent failed:", err)
        toast.error("Could not delete student. Please try again.")
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this student?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove <strong>{studentName}</strong> ({studentId}) along
            with their payments, attendance records and documents. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {pending && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            Delete student
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
