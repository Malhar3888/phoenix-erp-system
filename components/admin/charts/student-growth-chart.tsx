"use client"

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { studentGrowth } from "@/lib/mock-data"

const chartConfig = {
  students: { label: "Students", color: "var(--chart-1)" },
} satisfies ChartConfig

export function StudentGrowthChart() {
  const data = studentGrowth()
  return (
    <ChartContainer config={chartConfig} className="aspect-[16/9] w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} stroke="var(--muted-foreground)" fontSize={11} />
          <YAxis tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={11} width={28} />
          <ChartTooltip
            cursor={{ stroke: "var(--primary)", strokeOpacity: 0.2 }}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            dataKey="students"
            type="monotone"
            stroke="var(--color-students)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "var(--color-students)", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
