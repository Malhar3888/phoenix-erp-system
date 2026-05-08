"use client"

import { Download, Eye, FileText, Trash2, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { StudentDocument } from "@/lib/types"
import { formatDate } from "@/lib/format"
import { toast } from "sonner"

export function StudentDocuments({ documents }: { documents: StudentDocument[] }) {
  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => toast.info("Demo: connect Vercel Blob to enable real uploads")}
        className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 bg-muted/30 p-8 text-center transition hover:border-primary/50 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <div className="grid size-10 place-items-center rounded-full bg-primary/15 text-primary">
          <UploadCloud className="size-5" />
        </div>
        <div className="text-sm font-semibold">Click to upload documents</div>
        <p className="text-xs text-muted-foreground">
          PDF, JPG, PNG — up to 10 MB each
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
          No documents uploaded yet.
        </div>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {documents.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3"
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {d.name}
                  </span>
                  <Badge variant="outline" className="font-normal">
                    {d.type}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {d.size} • Uploaded {formatDate(d.uploadedAt)}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="size-8" aria-label="Preview">
                  <Eye className="size-4" />
                </Button>
                <Button size="icon" variant="ghost" className="size-8" aria-label="Download">
                  <Download className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
