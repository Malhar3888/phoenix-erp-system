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
import type { Expense, ExpenseCategory } from "@/lib/types"

const CATEGORIES: ExpenseCategory[] = [
  "Rent",
  "Electricity",
  "Salary",
  "Marketing",
  "Equipment",
  "Internet",
  "Other",
]

type Props = {
  onSubmit?: (expense: Expense) => void
}

export function ExpenseFormDialog({ onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState<ExpenseCategory>("Rent")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const expense: Expense = {
      id: `EXP-${Math.floor(Math.random() * 9000) + 1000}`,
      title,
      amount: Number(amount),
      category,
      date,
      note: note || undefined,
    }
    onSubmit?.(expense)
    setOpen(false)
    setTitle("")
    setAmount("")
    setCategory("Rent")
    setNote("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Expense</DialogTitle>
          <DialogDescription>
            Track institute operating expenses by category.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Office rent — May"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (INR)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as ExpenseCategory)}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
