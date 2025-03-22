"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, BookOpen, Calculator, FileText, Heart, Home, PiggyBank, School } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const planningModules = [
  {
    title: "Cashflow Planning",
    description: "Analyze income, expenses, and optimize cash flow",
    icon: Calculator,
    color: "bg-blue-50 text-blue-600",
    link: "/planning/cashflow",
  },
  {
    title: "Balance Sheet",
    description: "Track assets, liabilities, and net worth",
    icon: FileText,
    color: "bg-emerald-50 text-emerald-600",
    link: "/planning/balance-sheet",
  },
  {
    title: "Education Planning",
    description: "Plan for education expenses and goals",
    icon: School,
    color: "bg-gold-50 text-gold-600",
    link: "/planning/education",
  },
  {
    title: "Retirement Planning",
    description: "Prepare for a comfortable retirement",
    icon: PiggyBank,
    color: "bg-purple-50 text-purple-600",
    link: "/planning/retirement",
  },
  {
    title: "Wealth Protection",
    description: "Protect assets and manage risk",
    icon: Home,
    color: "bg-red-50 text-red-600",
    link: "/planning/protection",
  },
  {
    title: "Health & Critical Illness",
    description: "Plan for healthcare and critical illness",
    icon: Heart,
    color: "bg-teal-50 text-teal-600",
    link: "/planning/health",
  },
  {
    title: "Financial Knowledge",
    description: "Educational resources for clients",
    icon: BookOpen,
    color: "bg-amber-50 text-amber-600",
    link: "/planning/knowledge",
  },
  {
    title: "Plan Analytics",
    description: "Analyze and compare financial plans",
    icon: BarChart3,
    color: "bg-indigo-50 text-indigo-600",
    link: "/planning/analytics",
  },
]

export function PlanningOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {planningModules.map((module) => (
        <Card
          key={module.title}
          className="premium-card shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)] transition-all duration-300 hover:translate-y-[-2px]"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className={cn("p-2 rounded-lg", module.color)}>
                <module.icon className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-lg font-semibold text-truffle-800 mt-2">{module.title}</CardTitle>
            <CardDescription>{module.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full rounded-lg">
              <Link href={module.link}>
                Open Module
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

