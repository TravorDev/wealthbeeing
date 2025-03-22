"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for AUM trends
const data = [
  { month: "Jan", aum: 220.5 },
  { month: "Feb", aum: 225.8 },
  { month: "Mar", aum: 230.2 },
  { month: "Apr", aum: 235.7 },
  { month: "May", aum: 238.9 },
  { month: "Jun", aum: 242.1 },
  { month: "Jul", aum: 245.3 },
  { month: "Aug", aum: 248.5 },
]

export function AumTrends() {
  return (
    <Card className="premium-card shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-truffle-800">AUM Trends</CardTitle>
        <Select defaultValue="year">
          <SelectTrigger className="w-[120px] rounded-lg">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="quarter">Quarter</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#5c504c" }}
                axisLine={{ stroke: "#e6e0da" }}
                tickLine={{ stroke: "#e6e0da" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#5c504c" }}
                tickFormatter={(value) => `฿${value}M`}
                domain={["dataMin - 10", "dataMax + 10"]}
                axisLine={{ stroke: "#e6e0da" }}
                tickLine={{ stroke: "#e6e0da" }}
              />
              <Tooltip
                formatter={(value) => [`฿${value}M`, "AUM"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e6e0da",
                  borderRadius: "0.75rem",
                  boxShadow: "0 4px 20px rgba(193,177,162,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="aum"
                stroke="#ebd69c"
                strokeWidth={3}
                dot={{ r: 6, fill: "#ebd69c", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 8, fill: "#ebd69c", strokeWidth: 2, stroke: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

