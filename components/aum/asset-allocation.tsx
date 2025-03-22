"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for asset allocation
const data = [
  { name: "Equities", value: 45, color: "#3b82f6" },
  { name: "Fixed Income", value: 30, color: "#10b981" },
  { name: "Real Estate", value: 15, color: "#f59e0b" },
  { name: "Alternatives", value: 7, color: "#8b5cf6" },
  { name: "Cash", value: 3, color: "#6b7280" },
]

export function AssetAllocation() {
  return (
    <Card className="premium-card shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-truffle-800">Asset Allocation</CardTitle>
        <Select defaultValue="all">
          <SelectTrigger className="w-[120px] rounded-lg">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="all">All Clients</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, "Allocation"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e6e0da",
                  borderRadius: "0.75rem",
                  boxShadow: "0 4px 20px rgba(193,177,162,0.1)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

