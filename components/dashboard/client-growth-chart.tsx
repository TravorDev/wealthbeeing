"use client"

import { Area, CartesianGrid, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for client growth and AUM
const data = [
  { month: "Jan", newClients: 5, aumGrowth: 2.3 },
  { month: "Feb", newClients: 7, aumGrowth: 3.1 },
  { month: "Mar", newClients: 10, aumGrowth: 4.2 },
  { month: "Apr", newClients: 8, aumGrowth: 3.8 },
  { month: "May", newClients: 12, aumGrowth: 5.7 },
  { month: "Jun", newClients: 9, aumGrowth: 4.5 },
  { month: "Jul", newClients: 11, aumGrowth: 5.2 },
  { month: "Aug", newClients: 13, aumGrowth: 6.1 },
  { month: "Sep", newClients: 10, aumGrowth: 4.8 },
  { month: "Oct", newClients: 8, aumGrowth: 3.9 },
  { month: "Nov", newClients: 7, aumGrowth: 3.5 },
  { month: "Dec", newClients: 6, aumGrowth: 3.0 },
]

export function ClientGrowthChart() {
  return (
    <Card
      className="premium-card animate-fade-in shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)]"
      style={{ animationDelay: "0.4s" }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-truffle-800">Client Growth Relative to AUM</CardTitle>
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
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorNewClients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5c504c" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#5c504c" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAumGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ebd69c" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ebd69c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#5c504c" }}
                axisLine={{ stroke: "#e6e0da" }}
                tickLine={{ stroke: "#e6e0da" }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                tick={{ fontSize: 12, fill: "#5c504c" }}
                tickFormatter={(value) => `${value}`}
                domain={[0, "dataMax + 2"]}
                axisLine={{ stroke: "#e6e0da" }}
                tickLine={{ stroke: "#e6e0da" }}
                label={{
                  value: "New Clients",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fill: "#5c504c", fontSize: 12 },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: "#9e7041" }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, "dataMax + 1"]}
                axisLine={{ stroke: "#e6e0da" }}
                tickLine={{ stroke: "#e6e0da" }}
                label={{
                  value: "AUM Growth (%)",
                  angle: 90,
                  position: "insideRight",
                  style: { textAnchor: "middle", fill: "#9e7041", fontSize: 12 },
                }}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "newClients") return [`${value}`, "New Clients"]
                  if (name === "aumGrowth") return [`${value}%`, "AUM Growth"]
                  return [value, name]
                }}
                labelStyle={{ color: "#5c504c" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e6e0da",
                  borderRadius: "0.75rem",
                  boxShadow: "0 4px 20px rgba(193,177,162,0.1)",
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="newClients"
                stroke="#5c504c"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorNewClients)"
                dot={{ r: 4, fill: "#5c504c" }}
                activeDot={{ r: 6, fill: "#5c504c" }}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="aumGrowth"
                stroke="#ebd69c"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAumGrowth)"
                dot={{ r: 4, fill: "#ebd69c" }}
                activeDot={{ r: 6, fill: "#ebd69c" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

