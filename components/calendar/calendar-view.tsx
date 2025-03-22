"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreateEventDialog } from "./create-event-dialog"

// Mock data for calendar events
const events = [
  {
    id: 1,
    title: "Client Meeting: John Doe",
    date: "2024-03-18",
    time: "14:00",
    duration: 60,
    type: "meeting",
    description: "Quarterly portfolio review",
    location: "Virtual Meeting",
  },
  {
    id: 2,
    title: "Team Huddle",
    date: "2024-03-19",
    time: "09:30",
    duration: 30,
    type: "meeting",
    description: "Weekly team sync",
    location: "Conference Room A",
  },
  {
    id: 3,
    title: "Sarah Lee's Birthday",
    date: "2024-03-20",
    type: "birthday",
    description: "Client turning 42",
  },
  {
    id: 4,
    title: "Michael Wong - Protection Plan Payment",
    date: "2024-03-22",
    type: "payment",
    description: "Annual premium: ฿45,000",
  },
  {
    id: 5,
    title: "Lisa Chen - Protection Plan Renewal",
    date: "2024-03-25",
    type: "renewal",
    description: "Policy #PT-2023-0472 expiring",
  },
]

// Event type configurations
const eventTypeConfig = {
  meeting: {
    icon: CalendarIcon,
    color: "bg-blue-100 text-blue-800 border border-blue-200",
    hoverColor: "hover:bg-blue-200",
    lightColor: "bg-blue-50",
    darkColor: "bg-blue-600 text-white",
  },
  birthday: {
    icon: CalendarIcon,
    color: "bg-gold-100 text-truffle-800 border border-gold-200",
    hoverColor: "hover:bg-gold-200",
    lightColor: "bg-gold-50",
    darkColor: "bg-gold-400 text-truffle-800",
  },
  payment: {
    icon: CalendarIcon,
    color: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    hoverColor: "hover:bg-emerald-200",
    lightColor: "bg-emerald-50",
    darkColor: "bg-emerald-600 text-white",
  },
  renewal: {
    icon: CalendarIcon,
    color: "bg-purple-100 text-purple-800 border border-purple-200",
    hoverColor: "hover:bg-purple-200",
    lightColor: "bg-purple-50",
    darkColor: "bg-purple-600 text-white",
  },
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  const [filterType, setFilterType] = useState<string | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Add days from previous and next month to fill the calendar grid
  const startDay = monthStart.getDay()
  const endDay = 6 - monthEnd.getDay()

  const prevMonthDays =
    startDay > 0
      ? eachDayOfInterval({
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), -startDay + 1),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 0),
        })
      : []

  const nextMonthDays =
    endDay > 0
      ? eachDayOfInterval({
          start: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, endDay),
        })
      : []

  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Navigation functions
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    const formattedDate = format(day, "yyyy-MM-dd")
    return events.filter((event) => {
      const matchesDate = event.date === formattedDate
      const matchesType = filterType ? event.type === filterType : true
      return matchesDate && matchesType
    })
  }

  // Get events for selected date
  const selectedDateEvents = selectedDate
    ? events.filter((event) => {
        const matchesDate = event.date === format(selectedDate, "yyyy-MM-dd")
        const matchesType = filterType ? event.type === filterType : true
        return matchesDate && matchesType
      })
    : []

  // Get event type properties
  const getEventTypeProps = (type: string) => {
    return eventTypeConfig[type as keyof typeof eventTypeConfig] || eventTypeConfig.meeting
  }

  // Format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number)
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="premium-card overflow-hidden shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)]">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <CardTitle className="text-xl font-semibold text-truffle-800">Calendar</CardTitle>
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
          <Button
            size="sm"
            className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
            onClick={() => setIsCreateEventOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col md:flex-row">
        {/* Main Calendar Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-late-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-lg" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-medium text-truffle-700">{format(currentDate, "MMMM yyyy")}</h3>
              <Button variant="ghost" size="icon" className="rounded-lg" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg ml-2" onClick={handleToday}>
                Today
              </Button>
            </div>
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

                {/* Calendar days */}
                {allDays.map((day, index) => {
                  const isCurrentMonth = isSameMonth(day, currentDate)
                  const isToday = isSameDay(day, new Date())
                  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
                  const dayEvents = getEventsForDay(day)

                  return (
                    <div
                      key={index}
                      className={cn(
                        "min-h-[100px] p-1 bg-white hover:bg-late-50 cursor-pointer overflow-hidden transition-colors duration-200",
                        !isCurrentMonth && "opacity-40",
                        isToday && "bg-gold-50",
                        isSelected && "ring-2 ring-gold-400 ring-inset",
                      )}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div
                        className={cn(
                          "text-xs font-medium mb-1 flex items-center justify-between",
                          isToday ? "text-truffle-800" : "text-truffle-500",
                        )}
                      >
                        <span
                          className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-full",
                            isToday && "bg-gold-400 text-truffle-800",
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-late-200 text-xs font-semibold text-truffle-700">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => {
                          const { color } = getEventTypeProps(event.type)
                          return (
                            <div
                              key={event.id}
                              className={cn("px-1 py-0.5 text-[10px] rounded-md truncate shadow-sm", color)}
                            >
                              {event.time && `${formatTime(event.time)} · `}
                              {event.title}
                            </div>
                          )
                        })}
                        {dayEvents.length > 3 && (
                          <div className="text-[10px] text-truffle-500 pl-1">+{dayEvents.length - 3} more</div>
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
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-late-200 flex flex-col">
          <div className="p-4 border-b border-late-200">
            <h3 className="text-lg font-medium text-truffle-700">
              {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Select a date"}
            </h3>
          </div>

          <ScrollArea className="flex-1 p-4">
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => {
                  const { icon: Icon, color, darkColor } = getEventTypeProps(event.type)
                  return (
                    <div key={event.id} className={cn("p-3 rounded-lg", color)}>
                      <h4 className="font-medium text-truffle-800">{event.title}</h4>

                      {event.time && (
                        <div className="flex items-center mt-2 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatTime(event.time)}</span>
                          {event.duration && <span> · {event.duration} min</span>}
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center mt-1 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      )}

                      {event.description && <p className="mt-2 text-sm text-truffle-600">{event.description}</p>}

                      <div className="flex justify-end mt-2">
                        <Badge className={cn("rounded-full", darkColor)}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <CalendarIcon className="h-12 w-12 text-truffle-300 mb-4" />
                <h4 className="text-lg font-medium text-truffle-700 mb-2">No events</h4>
                <p className="text-sm text-truffle-500 mb-4">
                  {selectedDate
                    ? `No events scheduled for ${format(selectedDate, "MMMM d, yyyy")}`
                    : "Select a date to view events"}
                </p>
                <Button
                  size="sm"
                  className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
                  onClick={() => setIsCreateEventOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>

      <CreateEventDialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen} />
    </Card>
  )
}

