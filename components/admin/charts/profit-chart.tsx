"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { monthlyRevenue } from "@/lib/mock-data"

const chartConfig = {
  profit: { label: "Profit", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ProfitChart() {
  const data = monthlyRevenue()
  return (
    <ChartContainer config={chartConfig} className="aspect-[16/9] w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} stroke="var(--muted-foreground)" fontSize={11} />
          <YAxis tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} width={36} />
          <ChartTooltip
            cursor={{ fill: "var(--primary)", fillOpacity: 0.08 }}
            content={
              <ChartTooltipContent
                indicator="dot"
                formatter={(value) => [`₹ ${Number(value).toLocaleString("en-IN")} `, "Profit"]}
              />
            }
          />
          <Bar dataKey="profit" fill="var(--color-profit)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
