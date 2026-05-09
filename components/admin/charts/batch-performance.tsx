"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  students: { label: "Students", color: "var(--chart-1)" },
} satisfies ChartConfig

type Row = { batch: string; students: number; revenue?: number }

export function BatchPerformanceChart({ data = [] }: { data?: Row[] }) {
  if (data.length === 0) {
    return (
      <div className="grid h-48 place-items-center rounded-xl border border-dashed border-border/60 text-sm text-muted-foreground">
        No batches yet.
      </div>
    )
  }
  return (
    <ChartContainer config={chartConfig} className="aspect-[16/9] w-full">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke="var(--border)" strokeOpacity={0.3} />
          <XAxis type="number" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={11} />
          <YAxis
            type="category"
            dataKey="batch"
            tickLine={false}
            axisLine={false}
            stroke="var(--muted-foreground)"
            fontSize={11}
            width={88}
          />
          <ChartTooltip
            cursor={{ fill: "var(--primary)", fillOpacity: 0.08 }}
            content={<ChartTooltipContent indicator="dot" formatter={(value) => [`${value} students`, "Count"]} />}
          />
          <Bar dataKey="students" fill="var(--color-students)" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
