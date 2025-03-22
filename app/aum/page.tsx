import type { Metadata } from "next"
import { AumHeader } from "@/components/aum/aum-header"
import { AumOverview } from "@/components/aum/aum-overview"
import { AssetAllocation } from "@/components/aum/asset-allocation"
import { ClientAumTable } from "@/components/aum/client-aum-table"
import { AumTrends } from "@/components/aum/aum-trends"
import { ScrollReveal } from "@/components/dashboard/scroll-reveal"

export const metadata: Metadata = {
  title: "AUM Dashboard | WealthBeeing",
  description: "Track and analyze your assets under management",
}

export default function AumDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <AumHeader />

      <ScrollReveal>
        <AumOverview />
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ScrollReveal delay={200}>
          <AssetAllocation />
        </ScrollReveal>
        <ScrollReveal delay={300}>
          <AumTrends />
        </ScrollReveal>
      </div>

      <ScrollReveal delay={400}>
        <ClientAumTable />
      </ScrollReveal>
    </div>
  )
}

