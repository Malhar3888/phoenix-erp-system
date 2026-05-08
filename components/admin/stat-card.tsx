import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type StatCardProps = {
  label: string
  value: string
  icon: LucideIcon
  delta?: number
  hint?: string
  accent?: "primary" | "muted"
}

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  hint,
  accent = "muted",
}: StatCardProps) {
  const positive = (delta ?? 0) >= 0
  return (
    <Card className="glass relative overflow-hidden">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {value}
            </p>
          </div>
          <div
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-xl",
              accent === "primary"
                ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                : "bg-muted text-foreground/80 ring-1 ring-border",
            )}
          >
            <Icon className="size-5" />
          </div>
        </div>

        {(typeof delta === "number" || hint) && (
          <div className="flex items-center gap-2 text-xs">
            {typeof delta === "number" && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold",
                  positive
                    ? "bg-success/15 text-[oklch(0.78_0.15_145)]"
                    : "bg-destructive/15 text-[oklch(0.75_0.18_25)]",
                )}
              >
                {positive ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )}
                {Math.abs(delta)}%
              </span>
            )}
            {hint && <span className="text-muted-foreground">{hint}</span>}
          </div>
        )}
      </CardContent>
      <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-primary/5 blur-2xl" />
    </Card>
  )
}
