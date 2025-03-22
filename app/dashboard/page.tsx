import type { Metadata } from "next"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics"
import { SmartCalendar } from "@/components/dashboard/smart-calendar"
import { ProductSalesOverview } from "@/components/dashboard/product-sales-overview"
import { ClientGrowthChart } from "@/components/dashboard/client-growth-chart"
import { ScrollReveal } from "@/components/dashboard/scroll-reveal"

export const metadata: Metadata = {
  title: "Dashboard | WealthBeeing",
  description: "Financial advisory dashboard with key performance metrics",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />

      <ScrollReveal>
        <PerformanceMetrics />
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <SmartCalendar />
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ScrollReveal delay={300}>
          <ProductSalesOverview />
        </ScrollReveal>
        <ScrollReveal delay={400}>
          <ClientGrowthChart />
        </ScrollReveal>
      </div>
    </div>
  )
}

