"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Plus } from "lucide-react"

export function DashboardHeader() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  })

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-truffle-800">Dashboard</h1>
        <p className="text-sm text-truffle-500 mt-1">Welcome back! Here's an overview of your advisory practice.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 rounded-lg w-full sm:w-auto">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Date Range</span>
              <span className="inline xs:hidden">Date</span>
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              className="rounded-md border"
              footer={
                <div className="p-3 border-t border-late-100">
                  <div className="text-sm text-truffle-600">
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      "Select a date range"
                    )}
                  </div>
                </div>
              }
            />
          </PopoverContent>
        </Popover>
        <Button
          size="sm"
          className="h-10 rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500 w-full sm:w-auto"
          asChild
        >
          <Link href="/clients/onboarding">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Link>
        </Button>
      </div>
    </div>
  )
}

