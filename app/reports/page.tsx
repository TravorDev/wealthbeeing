import type { Metadata } from "next"
import { ReportsHeader } from "@/components/reports/reports-header"
import { ReportsList } from "@/components/reports/reports-list"
import { ScrollReveal } from "@/components/dashboard/scroll-reveal"

export const metadata: Metadata = {
  title: "Reports | WealthBeeing",
  description: "Generate and view financial reports",
}

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ReportsHeader />

      <ScrollReveal>
        <ReportsList />
      </ScrollReveal>
    </div>
  )
}

