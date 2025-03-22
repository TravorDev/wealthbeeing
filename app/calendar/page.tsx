import type { Metadata } from "next"
import { CalendarView } from "@/components/calendar/calendar-view"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { ScrollReveal } from "@/components/dashboard/scroll-reveal"

export const metadata: Metadata = {
  title: "Calendar | WealthBeeing",
  description: "Manage your schedule and appointments",
}

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-6">
      <CalendarHeader />

      <ScrollReveal>
        <CalendarView />
      </ScrollReveal>
    </div>
  )
}

