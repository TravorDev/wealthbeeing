"use client"

import React from "react"

import { useState, useMemo } from "react"
import {
  Bell,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Gift,
  MoreHorizontal,
  Plus,
  Search,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// Combined data for all event types
const allEvents = [
  // Meetings
  {
    id: "m1",
    title: "Client Meeting: John Doe",
    date: "2024-03-18",
    time: "14:00",
    type: "meeting",
    description: "Quarterly portfolio review",
    status: "upcoming",
  },
  {
    id: "m2",
    title: "Team Huddle",
    date: "2024-03-19",
    time: "09:30",
    type: "meeting",
    description: "Weekly team sync",
    status: "upcoming",
  },
  {
    id: "m3",
    title: "Client Meeting: Sarah Lee",
    date: "2024-03-20",
    time: "11:00",
    type: "meeting",
    description: "Retirement planning discussion",
    status: "upcoming",
  },
  {
    id: "m4",
    title: "Quarterly Review: Michael Wong",
    date: "2024-03-22",
    time: "15:30",
    type: "meeting",
    description: "Performance review and strategy adjustment",
    status: "upcoming",
  },

  // Birthdays
  {
    id: "b1",
    title: "Sarah Lee's Birthday",
    date: "2024-03-20",
    type: "birthday",
    description: "Client turning 42",
    status: "upcoming",
  },
  {
    id: "b2",
    title: "Michael Wong's Birthday",
    date: "2024-03-28",
    type: "birthday",
    description: "Client turning 55",
    status: "upcoming",
  },
  {
    id: "b3",
    title: "Lisa Chen's Birthday",
    date: "2024-04-05",
    type: "birthday",
    description: "Client turning 38",
    status: "upcoming",
  },
  {
    id: "b4",
    title: "David Kim's Birthday",
    date: "2024-04-12",
    type: "birthday",
    description: "Client turning 47",
    status: "upcoming",
  },

  // Payments
  {
    id: "p1",
    title: "Michael Wong - Protection Plan Payment",
    date: "2024-03-22",
    type: "payment",
    description: "Annual premium: ฿45,000",
    status: "upcoming",
  },
  {
    id: "p2",
    title: "Lisa Chen - Education Plan Payment",
    date: "2024-03-25",
    type: "payment",
    description: "Quarterly premium: ฿15,000",
    status: "upcoming",
  },
  {
    id: "p3",
    title: "John Doe - Retirement Plan Payment",
    date: "2024-03-30",
    type: "payment",
    description: "Monthly contribution: ฿25,000",
    status: "upcoming",
  },
  {
    id: "p4",
    title: "Sarah Lee - Health Plan Payment",
    date: "2024-04-05",
    type: "payment",
    description: "Semi-annual premium: ฿32,000",
    status: "upcoming",
  },

  // Renewals
  {
    id: "r1",
    title: "Lisa Chen - Protection Plan Renewal",
    date: "2024-03-25",
    type: "renewal",
    description: "Policy #PT-2023-0472 expiring",
    status: "upcoming",
  },
  {
    id: "r2",
    title: "David Kim - Health Plan Renewal",
    date: "2024-04-10",
    type: "renewal",
    description: "Policy #HP-2023-1284 expiring",
    status: "upcoming",
  },
  {
    id: "r3",
    title: "Sarah Lee - Education Plan Renewal",
    date: "2024-04-15",
    type: "renewal",
    description: "Policy #ED-2023-0593 expiring",
    status: "upcoming",
  },
  {
    id: "r4",
    title: "Michael Wong - Retirement Plan Renewal",
    date: "2024-04-22",
    type: "renewal",
    description: "Policy #RT-2023-0847 expiring",
    status: "upcoming",
  },
]

// Helper functions
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0]
}

const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":").map(Number)
  return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// Event type configurations
const eventTypeConfig = {
  meeting: {
    icon: Calendar,
    color: "bg-blue-100 text-blue-800 border border-blue-200",
    hoverColor: "hover:bg-blue-200",
    lightColor: "bg-blue-50",
    darkColor: "bg-blue-600 text-white",
  },
  birthday: {
    icon: Gift,
    color: "bg-gold-100 text-truffle-800 border border-gold-200",
    hoverColor: "hover:bg-gold-200",
    lightColor: "bg-gold-50",
    darkColor: "bg-gold-400 text-truffle-800",
  },
  payment: {
    icon: CreditCard,
    color: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    hoverColor: "hover:bg-emerald-200",
    lightColor: "bg-emerald-50",
    darkColor: "bg-emerald-600 text-white",
  },
  renewal: {
    icon: Bell,
    color: "bg-purple-100 text-purple-800 border border-purple-200",
    hoverColor: "hover:bg-purple-200",
    lightColor: "bg-purple-50",
    darkColor: "bg-purple-600 text-white",
  },
}

export function SmartCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarTab, setSidebarTab] = useState<"upcoming" | "search">("upcoming")

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  const today = formatDate(new Date())

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

  // Navigation functions
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(today)
  }

  // Filter events by date and type
  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return allEvents.filter((event) => {
      const matchesDate = event.date === dateStr
      const matchesType = filterType ? event.type === filterType : true
      return matchesDate && matchesType
    })
  }

  // Get all upcoming events for the sidebar
  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return allEvents
      .filter((event) => {
        const eventDate = new Date(event.date)
        const matchesType = filterType ? event.type === filterType : true
        return eventDate >= now && matchesType
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [filterType])

  // Search events
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    return allEvents.filter((event) => {
      const matchesQuery =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesType = filterType ? event.type === filterType : true
      return matchesQuery && matchesType
    })
  }, [searchQuery, filterType])

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return []

    return allEvents.filter((event) => {
      const matchesDate = event.date === selectedDate
      const matchesType = filterType ? event.type === filterType : true
      return matchesDate && matchesType
    })
  }, [selectedDate, filterType])

  // Get event icon and color
  const getEventTypeProps = (type: string) => {
    return eventTypeConfig[type as keyof typeof eventTypeConfig] || eventTypeConfig.meeting
  }

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  // Handle day click
  const handleDayClick = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(dateStr)
  }

  // Handle event click
  const handleEventClick = (event: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEvent(event)
  }

  // Close event details
  const closeEventDetails = () => {
    setSelectedEvent(null)
  }

  // Count events by type for the current month
  const eventCounts = useMemo(() => {
    const counts = {
      meeting: 0,
      birthday: 0,
      payment: 0,
      renewal: 0,
    }

    allEvents.forEach((event) => {
      const eventDate = new Date(event.date)
      if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
        counts[event.type as keyof typeof counts]++
      }
    })

    return counts
  }, [currentMonth, currentYear])

  return (
    <Card className="premium-card overflow-hidden shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)] animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-3">
          <CardTitle className="text-xl font-semibold text-truffle-800">Smart Calendar</CardTitle>
          <div className="flex items-center gap-1">
            <Badge className="bg-blue-100 text-blue-800 border border-blue-200">{eventCounts.meeting} Meetings</Badge>
            <Badge className="bg-gold-100 text-truffle-800 border border-gold-200">
              {eventCounts.birthday} Birthdays
            </Badge>
            <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200">
              {eventCounts.payment} Payments
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
              {eventCounts.renewal} Renewals
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-lg">
                {filterType ? filterType.charAt(0).toUpperCase() + filterType.slice(1) : "All Events"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-lg">
              <DropdownMenuItem onClick={() => setFilterType(null)}>All Events</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("meeting")}>
                <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                Meetings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("birthday")}>
                <Gift className="mr-2 h-4 w-4 text-gold-600" />
                Birthdays
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("payment")}>
                <CreditCard className="mr-2 h-4 w-4 text-emerald-600" />
                Payments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("renewal")}>
                <Bell className="mr-2 h-4 w-4 text-purple-600" />
                Renewals
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <span className="ml-1 hidden sm:inline">Add Event</span>
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
              <h3 className="text-lg font-medium text-truffle-700">
                {monthNames[currentMonth]} {currentYear}
              </h3>
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

                {/* Empty cells for days before the first day of month */}
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square p-1 bg-white opacity-50" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1
                  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  const dayEvents = getEventsForDay(day)
                  const isToday = dateStr === today
                  const isSelected = dateStr === selectedDate

                  return (
                    <div
                      key={`day-${day}`}
                      className={cn(
                        "min-h-[100px] p-1 bg-white hover:bg-late-50 cursor-pointer overflow-hidden transition-colors duration-200",
                        isToday && "bg-gold-50",
                        isSelected && "ring-2 ring-gold-400 ring-inset",
                      )}
                      onClick={() => handleDayClick(day)}
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
                          {day}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-late-200 text-xs font-semibold text-truffle-700">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => {
                          const { icon: Icon, color } = getEventTypeProps(event.type)
                          return (
                            <div
                              key={event.id}
                              className={cn(
                                "px-1 py-0.5 text-[10px] rounded-md truncate shadow-sm flex items-center gap-1",
                                color,
                              )}
                              onClick={(e) => handleEventClick(event, e)}
                            >
                              <Icon className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{event.title}</span>
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
          <div className="p-3 border-b border-late-200">
            <Tabs defaultValue="upcoming" onValueChange={(value) => setSidebarTab(value as "upcoming" | "search")}>
              <TabsList className="grid grid-cols-2 bg-late-50 p-0 h-auto rounded-lg">
                <TabsTrigger
                  value="upcoming"
                  className={cn(
                    "flex items-center gap-1 py-2 rounded-lg",
                    sidebarTab === "upcoming" ? "bg-white text-truffle-800 shadow-sm" : "text-truffle-600",
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Upcoming</span>
                </TabsTrigger>
                <TabsTrigger
                  value="search"
                  className={cn(
                    "flex items-center gap-1 py-2 rounded-lg",
                    sidebarTab === "search" ? "bg-white text-truffle-800 shadow-sm" : "text-truffle-600",
                  )}
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-3">
                <h4 className="text-sm font-medium text-truffle-700 mb-2">
                  {selectedDate ? `Events on ${formatDateForDisplay(selectedDate)}` : "Upcoming Events"}
                </h4>
              </TabsContent>

              <TabsContent value="search" className="mt-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-truffle-400" />
                  <Input
                    type="search"
                    placeholder="Search events..."
                    className="w-full rounded-lg border border-late-200 bg-white/80 pl-8 focus-visible:ring-gold-400 h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <ScrollArea className="flex-1 p-0">
            {sidebarTab === "upcoming" && (
              <div className="divide-y divide-late-100">
                {(selectedDate ? selectedDateEvents : upcomingEvents).map((event) => {
                  const { icon: Icon, color, darkColor } = getEventTypeProps(event.type)
                  return (
                    <div
                      key={event.id}
                      className="p-3 hover:bg-late-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("p-2 rounded-lg", darkColor)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-truffle-700 text-sm">{event.title}</p>
                          <p className="text-xs text-truffle-500">
                            {formatDateForDisplay(event.date)}
                            {event.time && ` • ${formatTime(event.time)}`}
                          </p>
                          {event.description && (
                            <p className="text-xs text-truffle-500 mt-1 line-clamp-2">{event.description}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
                {(selectedDate ? selectedDateEvents : upcomingEvents).length === 0 && (
                  <div className="p-6 text-center">
                    <p className="text-truffle-500 text-sm">No events found</p>
                  </div>
                )}
              </div>
            )}

            {sidebarTab === "search" && (
              <div className="divide-y divide-late-100">
                {searchResults.map((event) => {
                  const { icon: Icon, color, darkColor } = getEventTypeProps(event.type)
                  return (
                    <div
                      key={event.id}
                      className="p-3 hover:bg-late-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("p-2 rounded-lg", darkColor)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-truffle-700 text-sm">{event.title}</p>
                          <p className="text-xs text-truffle-500">
                            {formatDateForDisplay(event.date)}
                            {event.time && ` • ${formatTime(event.time)}`}
                          </p>
                          {event.description && (
                            <p className="text-xs text-truffle-500 mt-1 line-clamp-2">{event.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {searchQuery && searchResults.length === 0 && (
                  <div className="p-6 text-center">
                    <p className="text-truffle-500 text-sm">No results found</p>
                  </div>
                )}
                {!searchQuery && (
                  <div className="p-6 text-center">
                    <p className="text-truffle-500 text-sm">Enter a search term</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>

      {/* Event Details Popover */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeEventDetails}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-truffle-800">Event Details</h3>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={closeEventDetails}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg", getEventTypeProps(selectedEvent.type).darkColor)}>
                  {React.createElement(getEventTypeProps(selectedEvent.type).icon, { className: "h-5 w-5" })}
                </div>
                <div>
                  <p className="font-medium text-truffle-700">{selectedEvent.title}</p>
                  <p className="text-sm text-truffle-500">
                    {formatDateForDisplay(selectedEvent.date)}
                    {selectedEvent.time && ` • ${formatTime(selectedEvent.time)}`}
                  </p>
                </div>
              </div>

              {selectedEvent.description && (
                <div>
                  <p className="text-sm font-medium text-truffle-700">Description</p>
                  <p className="text-sm text-truffle-500">{selectedEvent.description}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" className="rounded-lg" onClick={closeEventDetails}>
                  Close
                </Button>
                <Button size="sm" className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

