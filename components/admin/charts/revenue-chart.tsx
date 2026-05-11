"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  expense: { label: "Expense", color: "var(--chart-3)" },
} satisfies ChartConfig

type Row = { month: string; revenue: number; expense: number }

export function RevenueChart({ data = [] }: { data?: Row[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-[16/8] w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.45} />
              <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-expense)" stopOpacity={0.32} />
              <stop offset="100%" stopColor="var(--color-expense)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            stroke="var(--muted-foreground)"
            fontSize={11}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="var(--muted-foreground)"
            fontSize={11}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            width={36}
          />
          <ChartTooltip
            cursor={{ stroke: "var(--primary)", strokeOpacity: 0.2 }}
            content={
              <ChartTooltipContent
                indicator="line"
                formatter={(value, name) => [
                  `INR ${Number(value).toLocaleString("en-IN")} `,
                  String(name),
                ]}
              />
            }
          />
          <Area
            dataKey="revenue"
            type="monotone"
            stroke="var(--color-revenue)"
            strokeWidth={2}
            fill="url(#revFill)"
          />
          <Area
            dataKey="expense"
            type="monotone"
            stroke="var(--color-expense)"
            strokeWidth={2}
            fill="url(#expFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
