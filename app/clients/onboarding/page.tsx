import type { Metadata } from "next"
import { ClientOnboardingForm } from "@/components/clients/client-onboarding-form"
import { ScrollReveal } from "@/components/dashboard/scroll-reveal"

export const metadata: Metadata = {
  title: "Client Onboarding | WealthBeeing",
  description: "Comprehensive client onboarding process",
}

export default function ClientOnboardingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 mb-6 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-semibold text-truffle-800">Client Onboarding</h1>
        <p className="text-sm text-truffle-500 mt-1">
          Complete the client onboarding process to create a comprehensive financial profile
        </p>
      </div>

      <ScrollReveal>
        <ClientOnboardingForm />
      </ScrollReveal>
    </div>
  )
}

