"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for product sales
const data = [
  {
    name: "Education Plans",
    total: 65,
    activated: 42,
    color: "#3b82f6",
  },
  {
    name: "Retirement Plans",
    total: 78,
    activated: 56,
    color: "#10b981",
  },
  {
    name: "Protection Plans",
    total: 92,
    activated: 71,
    color: "#f59e0b",
  },
  {
    name: "Health & Critical Illness",
    total: 53,
    activated: 32,
    color: "#8b5cf6",
  },
]

export function ProductSalesOverview() {
  return (
    <Card
      className="premium-card animate-fade-in shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)]"
      style={{ animationDelay: "0.3s" }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-truffle-800">Product Sales Overview</CardTitle>
        <Select defaultValue="month">
          <SelectTrigger className="w-[120px] rounded-lg">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={data} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value}%`, "Activated"]}
                labelStyle={{ color: "#5c504c" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e6e0da",
                  borderRadius: "0.75rem",
                  boxShadow: "0 4px 20px rgba(193,177,162,0.1)",
                }}
              />
              <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={24} fill="#e6e0da" />
              <Bar
                dataKey="activated"
                radius={[0, 6, 6, 0]}
                barSize={24}
                fill="#ffd71c"
                label={{
                  position: "insideRight",
                  fill: "#5c504c",
                  fontSize: 12,
                  formatter: (value) => `${value}%`,
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

