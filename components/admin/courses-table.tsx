"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatINR } from "@/lib/format"
import type { Course } from "@/lib/types"
import { CourseRowActions } from "@/components/admin/course-row-actions"

interface CoursesTableProps {
  courses: Course[]
}

export function CoursesTable({ courses }: CoursesTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || c.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [courses, search, statusFilter])

  const statusColors = {
    Active: "bg-green-500/10 text-green-700 hover:bg-green-500/20",
    Inactive: "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20",
    Archived: "bg-gray-500/10 text-gray-700 hover:bg-gray-500/20",
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Course</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Fees</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No courses found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((course) => (
                <TableRow key={course.id} className="group hover:bg-muted/50">
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{course.code}</TableCell>
                  <TableCell className="text-sm">{course.duration}</TableCell>
                  <TableCell className="text-right font-medium">{formatINR(course.fees)}</TableCell>
                  <TableCell className="text-sm">{course.trainerName || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[course.status as keyof typeof statusColors]}
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <CourseRowActions course={course} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filtered.length} of {courses.length} courses
      </div>
    </div>
  )
}
