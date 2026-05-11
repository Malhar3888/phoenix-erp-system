"use client"

import { useState } from "react"
import { deleteBatch, assignStudentToBatch } from "@/lib/actions"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit2, Trash2, Users } from "lucide-react"
import type { Batch } from "@/lib/types"

interface BatchesTableProps {
  batches: Batch[]
  onEdit: (batch: Batch) => void
}

export function BatchesTable({ batches, onEdit }: BatchesTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this batch?")) {
      setIsDeleting(id)
      try {
        await deleteBatch(id)
      } finally {
        setIsDeleting(null)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Paused":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "Online":
        return "bg-purple-50 text-purple-700"
      case "Offline":
        return "bg-orange-50 text-orange-700"
      case "Hybrid":
        return "bg-pink-50 text-pink-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Batch Name</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Trainer</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No batches created yet
              </TableCell>
            </TableRow>
          ) : (
            batches.map((batch) => (
              <TableRow key={batch.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{batch.name}</TableCell>
                <TableCell>{batch.course}</TableCell>
                <TableCell>{batch.trainer || "—"}</TableCell>
                <TableCell>{batch.startDate}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getModeColor(batch.mode)}>
                    {batch.mode}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {batch.studentCount ?? 0}/{batch.maxStudents}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(batch.status)} variant="outline">
                    {batch.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(batch)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(batch.id)}
                        disabled={isDeleting === batch.id}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
