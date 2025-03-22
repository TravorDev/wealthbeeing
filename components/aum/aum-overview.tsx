"use client"

import { ArrowDownIcon, ArrowUpIcon, DollarSign, TrendingUp, Users, Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const metrics = [
  {
    title: "Total AUM",
    value: "฿248.5M",
    change: 3.2,
    increasing: true,
    icon: DollarSign,
    iconColor: "text-gold-600",
    iconBg: "bg-gold-50",
  },
  {
    title: "Average AUM per Client",
    value: "฿1.01M",
    change: 1.8,
    increasing: true,
    icon: Wallet,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
  },
  {
    title: "AUM Growth Rate",
    value: "5.7%",
    change: 0.5,
    increasing: true,
    icon: TrendingUp,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
  },
  {
    title: "Clients with AUM",
    value: "247",
    change: -1.2,
    increasing: false,
    icon: Users,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
  },
]

export function AumOverview() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 stagger-animation">
      {metrics.map((metric, index) => (
        <Card
          key={metric.title}
          className="premium-card overflow-hidden shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)] floating-element"
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm font-medium text-truffle-500 uppercase tracking-wide">
                  {metric.title}
                </p>
                <h3 className="text-xl md:text-2xl font-bold mt-1 text-truffle-800">{metric.value}</h3>
                <div className="flex items-center mt-1">
                  <span
                    className={cn("text-sm flex items-center", metric.increasing ? "text-emerald-500" : "text-red-500")}
                  >
                    {metric.increasing ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-truffle-400 text-xs ml-2">vs last month</span>
                </div>
              </div>
              <div
                className={cn("h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center", metric.iconBg)}
              >
                <metric.icon className={cn("h-5 w-5 md:h-6 md:w-6", metric.iconColor)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

