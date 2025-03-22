import type { Metadata } from "next"
import { ClientHeader } from "@/components/clients/client-header"
import { ClientOverview } from "@/components/clients/client-overview"
import { ClientPlans } from "@/components/clients/client-plans"
import { ClientActivity } from "@/components/clients/client-activity"
import { ScrollReveal } from "@/components/dashboard/scroll-reveal"

export const metadata: Metadata = {
  title: "Client Details | WealthBeeing",
  description: "View and manage client details",
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6">
      <ClientHeader clientId={params.id} />

      <ScrollReveal>
        <ClientOverview clientId={params.id} />
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ScrollReveal delay={200}>
          <ClientPlans clientId={params.id} />
        </ScrollReveal>
        <ScrollReveal delay={300}>
          <ClientActivity clientId={params.id} />
        </ScrollReveal>
      </div>
    </div>
  )
}

