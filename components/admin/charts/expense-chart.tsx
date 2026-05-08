"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { expenseBreakdown } from "@/lib/mock-data"
import { formatINR } from "@/lib/format"

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "oklch(0.6 0.12 30)",
  "oklch(0.7 0.1 90)",
]

const chartConfig = {
  amount: { label: "Amount" },
} satisfies ChartConfig

export function ExpenseChart() {
  const data = expenseBreakdown()
  const total = data.reduce((s, d) => s + d.amount, 0)

  return (
    <div className="grid items-center gap-4 sm:grid-cols-[1fr,1.1fr]">
      <ChartContainer config={chartConfig} className="aspect-square w-full max-w-[220px]">
        <ResponsiveContainer>
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => [`₹ ${Number(value).toLocaleString("en-IN")} `, String(name)]}
                />
              }
            />
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={55}
              outerRadius={85}
              strokeWidth={2}
              stroke="var(--background)"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ul className="space-y-2 text-sm">
        {data
          .sort((a, b) => b.amount - a.amount)
          .map((d, i) => {
            const pct = Math.round((d.amount / total) * 100)
            return (
              <li key={d.category} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-sm"
                    style={{ background: COLORS[i % COLORS.length] }}
                    aria-hidden
                  />
                  <span className="truncate text-foreground">{d.category}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">{pct}%</span>
                  <span className="font-semibold text-foreground">{formatINR(d.amount)}</span>
                </div>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
