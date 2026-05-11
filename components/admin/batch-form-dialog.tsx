"use client"

import { useState } from "react"
import { createBatch, updateBatch } from "@/lib/actions"
import { COURSES } from "@/lib/mock-data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Batch } from "@/lib/types"

interface BatchFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  batch?: Batch | null
}

export function BatchFormDialog({ open, onOpenChange, batch }: BatchFormDialogProps) {
  const [name, setName] = useState(batch?.name ?? "")
  const [course, setCourse] = useState(batch?.course ?? "")
  const [trainer, setTrainer] = useState(batch?.trainer ?? "")
  const [startDate, setStartDate] = useState(batch?.startDate ?? "")
  const [endDate, setEndDate] = useState(batch?.endDate ?? "")
  const [batchTime, setBatchTime] = useState(batch?.batchTime ?? "")
  const [maxStudents, setMaxStudents] = useState(String(batch?.maxStudents ?? 30))
  const [mode, setMode] = useState<"Online" | "Offline" | "Hybrid">(batch?.mode ?? "Online")
  const [status, setStatus] = useState<"Active" | "Completed" | "Paused">(batch?.status ?? "Active")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (batch) {
        await updateBatch(batch.id, {
          name,
          course,
          trainer: trainer || undefined,
          startDate,
          endDate: endDate || undefined,
          batchTime: batchTime || undefined,
          maxStudents: parseInt(maxStudents),
          mode,
          status,
        })
      } else {
        await createBatch({
          name,
          course,
          trainer: trainer || undefined,
          startDate,
          endDate: endDate || undefined,
          batchTime: batchTime || undefined,
          maxStudents: parseInt(maxStudents),
          mode,
          status,
        })
      }
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{batch ? "Edit Batch" : "Create New Batch"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Batch Name</Label>
            <Input
              id="name"
              placeholder="e.g., Web Dev Batch-001"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="course">Course</Label>
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
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

          <div>
            <Label htmlFor="trainer">Trainer (Optional)</Label>
            <Input
              id="trainer"
              placeholder="Trainer name"
              value={trainer}
              onChange={(e) => setTrainer(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="batchTime">Batch Time (Optional)</Label>
            <Input
              id="batchTime"
              placeholder="9:00 AM - 5:00 PM"
              value={batchTime}
              onChange={(e) => setBatchTime(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="maxStudents">Max Students</Label>
              <Input
                id="maxStudents"
                type="number"
                min="1"
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="mode">Mode</Label>
              <Select value={mode} onValueChange={(v: any) => setMode(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : batch ? "Update Batch" : "Create Batch"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
