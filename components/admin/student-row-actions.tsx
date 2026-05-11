"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StudentFormDialog } from "@/components/admin/student-form-dialog"
import { StudentDeleteDialog } from "@/components/admin/student-delete-dialog"
import type { Student } from "@/lib/types"

export function StudentRowActions({ student }: { student: Student }) {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 opacity-60 transition group-hover:opacity-100"
            aria-label="Open actions"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link href={`/students/${student.id}`}>
              <Eye />
              View profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault()
            setEditOpen(true)
          }}>
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <StudentDeleteDialog
            studentId={student.id}
            studentName={student.name}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <StudentFormDialog student={student} open={editOpen} onOpenChange={setEditOpen} />
    </>
  )
}
