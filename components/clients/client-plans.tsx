"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock client plans data
const clientPlans = {
  CLT001: [
    {
      id: "PLN001",
      name: "Education Plan",
      type: "education",
      value: "฿1,500,000",
      status: "active",
      startDate: "2022-05-10",
      endDate: "2030-05-10",
    },
    {
      id: "PLN002",
      name: "Retirement Plan",
      type: "retirement",
      value: "฿2,000,000",
      status: "active",
      startDate: "2021-03-15",
      endDate: "2045-03-15",
    },
    {
      id: "PLN003",
      name: "Protection Plan",
      type: "protection",
      value: "฿1,000,000",
      status: "active",
      startDate: "2023-01-20",
      endDate: "2033-01-20",
    },
  ],
  // Add other clients as needed
}

// Plan type configurations
const planTypeConfig = {
  education: { color: "bg-blue-100 text-blue-800 border border-blue-200" },
  retirement: { color: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
  protection: { color: "bg-gold-100 text-truffle-800 border border-gold-200" },
  health: { color: "bg-purple-100 text-purple-800 border border-purple-200" },
}

interface ClientPlansProps {
  clientId: string
}

export function ClientPlans({ clientId }: ClientPlansProps) {
  // Get client plans
  const plans = clientPlans[clientId as keyof typeof clientPlans] || []

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <Card className="premium-card shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-truffle-800">Financial Plans</CardTitle>
        <Button size="sm" className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500">
          <Plus className="mr-2 h-4 w-4" />
          Add Plan
        </Button>
      </CardHeader>
      <CardContent>
        {plans.length > 0 ? (
          <div className="space-y-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between p-3 rounded-lg border border-late-100 hover:bg-late-50 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    className={cn(
                      "rounded-lg shadow-sm",
                      planTypeConfig[plan.type as keyof typeof planTypeConfig]?.color || "bg-gray-100",
                    )}
                  >
                    {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                  </Badge>
                  <div>
                    <p className="font-medium text-truffle-700">{plan.name}</p>
                    <p className="text-sm text-truffle-500">
                      {plan.value} • {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-truffle-400" />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-late-200 rounded-lg">
            <p className="text-truffle-500 mb-4">No financial plans</p>
            <Button size="sm" className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500">
              <Plus className="mr-2 h-4 w-4" />
              Create First Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

