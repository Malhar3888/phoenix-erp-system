"use client"

import { useMemo, useState, useTransition } from "react"
import { MessageCircle } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/format"
import type { Inquiry, InquiryStatus } from "@/lib/types"
import { updateInquiryStatus } from "@/lib/actions"
import { toast } from "sonner"

const STATUS_STYLES: Record<InquiryStatus, string> = {
  new: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  contacted: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  converted: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  lost: "bg-rose-500/15 text-rose-300 border-rose-500/30",
}

const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
  lost: "Lost",
}

export function InquiriesTable({ inquiries }: { inquiries: Inquiry[] }) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("all")
  const [pending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    return inquiries.filter((i) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.mobile.toLowerCase().includes(q) ||
        i.course.toLowerCase().includes(q)
      const matchesStatus = status === "all" || i.status === status
      return matchesSearch && matchesStatus
    })
  }, [inquiries, search, status])

  function changeStatus(id: string, s: InquiryStatus) {
    startTransition(async () => {
      try {
        await updateInquiryStatus(id, s)
        toast.success(`Marked as ${STATUS_LABEL[s]}`)
      } catch (err) {
        console.log("[v0] updateInquiryStatus failed:", err)
        toast.error("Could not update status.")
      }
    })
  }

  function whatsappLink(mobile: string, name: string) {
    const phone = mobile.replace(/\D/g, "")
    const msg = `Hi ${name}, this is Phoenix Computers. Following up on your enquiry — when can we connect for a course walk-through?`
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
  }

  return (
    <Card className="glass">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Inquiry Pipeline</CardTitle>
          <CardDescription>
            {filtered.length} of {inquiries.length} inquiries
          </CardDescription>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search name, mobile, course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
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
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Follow-up</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    {inquiries.length === 0
                      ? "No inquiries yet. Click 'New Inquiry' to log a lead."
                      : "No inquiries match your filters."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {i.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{i.name}</span>
                        {i.notes && (
                          <span className="text-xs font-normal text-muted-foreground">
                            {i.notes}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{i.mobile}</TableCell>
                    <TableCell className="text-muted-foreground">{i.course}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {i.followUpDate ? formatDate(i.followUpDate) : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_STYLES[i.status]}>
                        {STATUS_LABEL[i.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild size="sm" variant="outline">
                          <a
                            href={whatsappLink(i.mobile, i.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Message on WhatsApp"
                          >
                            <MessageCircle />
                          </a>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" disabled={pending}>
                              Update
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Set status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {(Object.keys(STATUS_LABEL) as InquiryStatus[]).map((s) => (
                              <DropdownMenuItem
                                key={s}
                                onClick={() => changeStatus(i.id, s)}
                                disabled={i.status === s}
                              >
                                {STATUS_LABEL[s]}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
