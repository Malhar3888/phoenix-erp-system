"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatINR, formatDate } from "@/lib/format"
import type { Expense, ExpenseCategory } from "@/lib/types"

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Rent: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Electricity: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  Salary: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Marketing: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Equipment: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
  Internet: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  Other: "bg-muted text-muted-foreground border-border",
}

export function ExpensesTable({ expenses }: { expenses: Expense[] }) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch =
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.id.toLowerCase().includes(search.toLowerCase())
      const matchesCat = category === "all" || e.category === category
      return matchesSearch && matchesCat
    })
  }, [expenses, search, category])

  return (
    <Card className="glass">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Expense Records</CardTitle>
          <CardDescription>
            {filtered.length} of {expenses.length} records
          </CardDescription>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search title or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-56"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {(Object.keys(CATEGORY_COLORS) as ExpenseCategory[]).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-muted-foreground"
                  >
                    {expenses.length === 0
                      ? "No expenses recorded yet. Click 'Add Expense' to log one."
                      : "No expenses match your filters."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {e.id}
                    </TableCell>
                    <TableCell className="font-medium">{e.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={CATEGORY_COLORS[e.category]}>
                        {e.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(e.date)}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatINR(e.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
