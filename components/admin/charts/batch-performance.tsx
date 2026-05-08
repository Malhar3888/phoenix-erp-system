"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { batchPerformance } from "@/lib/mock-data"

const chartConfig = {
  attendance: { label: "Attendance %", color: "var(--chart-1)" },
} satisfies ChartConfig

export function BatchPerformanceChart() {
  const data = batchPerformance()
  return (
    <ChartContainer config={chartConfig} className="aspect-[16/9] w-full">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke="var(--border)" strokeOpacity={0.3} />
          <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={11} />
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
            content={<ChartTooltipContent indicator="dot" formatter={(value) => [`${value}%`, "Attendance"]} />}
          />
          <Bar dataKey="attendance" fill="var(--color-attendance)" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
