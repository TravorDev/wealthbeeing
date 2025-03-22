import type { Metadata } from "next"
import { PlanningHeader } from "@/components/planning/planning-header"
import { PlanningOverview } from "@/components/planning/planning-overview"
import { ScrollReveal } from "@/components/dashboard/scroll-reveal"

export const metadata: Metadata = {
  title: "Financial Planning | WealthBeeing",
  description: "Comprehensive financial planning tools and resources",
}

export default function PlanningPage() {
  return (
    <div className="flex flex-col gap-6">
      <PlanningHeader />

      <ScrollReveal>
        <PlanningOverview />
      </ScrollReveal>
    </div>
  )
}

