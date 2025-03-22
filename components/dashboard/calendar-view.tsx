"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Mock data for calendar events
const events = [
  { id: 1, title: "Client Meeting: John Doe", date: "2024-03-18", type: "meeting" },
  { id: 2, title: "Client Birthday: Sarah Lee", date: "2024-03-20", type: "birthday" },
  { id: 3, title: "Plan Payment Due: Michael Wong", date: "2024-03-22", type: "payment" },
  { id: 4, title: "Plan Renewal: Lisa Chen", date: "2024-03-25", type: "renewal" },
  { id: 5, title: "Team Meeting", date: "2024-03-16", type: "meeting" },
]

// Helper function to get days in month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

// Helper function to get day of week (0-6) for first day of month
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => event.date === dateStr)
  }

  // Get event color based on type
  const getEventColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "birthday":
        return "bg-gold-100 text-truffle-800 border border-gold-200"
      case "payment":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200"
      case "renewal":
        return "bg-purple-100 text-purple-800 border border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  return (
    <Card
      className="premium-card overflow-hidden animate-fade-in shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)] h-full flex flex-col"
      style={{ animationDelay: "0.2s" }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-truffle-800">My Schedule</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn("rounded-lg", view === "day" && "bg-gold-50")}
            onClick={() => setView("day")}
          >
            Day
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn("rounded-lg", view === "week" && "bg-gold-50")}
            onClick={() => setView("week")}
          >
            Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn("rounded-lg", view === "month" && "bg-gold-50")}
            onClick={() => setView("month")}
          >
            Month
          </Button>
          <Button size="sm" className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="p-4 border-b border-late-200 flex items-center justify-between">
          <Button variant="ghost" size="icon" className="rounded-lg" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium text-truffle-700">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <Button variant="ghost" size="icon" className="rounded-lg" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col">
          {view === "month" && (
            <div className="grid grid-cols-7 gap-px bg-late-100 flex-1">
              {/* Day names */}
              {dayNames.map((day) => (
                <div key={day} className="text-center py-2 bg-white text-sm font-medium text-truffle-500">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before the first day of month */}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square p-1 bg-white opacity-50" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                const dayEvents = getEventsForDay(day)
                const isToday =
                  day === new Date().getDate() &&
                  currentMonth === new Date().getMonth() &&
                  currentYear === new Date().getFullYear()

                return (
                  <div
                    key={`day-${day}`}
                    className={cn(
                      "aspect-square p-1 bg-white hover:bg-late-50 cursor-pointer overflow-hidden transition-colors duration-200",
                      isToday && "bg-gold-50",
                    )}
                  >
                    <div className={cn("text-xs font-medium mb-1", isToday ? "text-truffle-800" : "text-truffle-500")}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "px-1 py-0.5 text-[10px] rounded-md truncate shadow-sm",
                            getEventColor(event.type),
                          )}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[10px] text-truffle-500 pl-1">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Placeholder for week and day views */}
          {view === "week" && (
            <div className="p-6 flex-1 flex items-center justify-center">
              <p className="text-truffle-500">Week view coming soon</p>
            </div>
          )}

          {view === "day" && (
            <div className="p-6 flex-1 flex items-center justify-center">
              <p className="text-truffle-500">Day view coming soon</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

