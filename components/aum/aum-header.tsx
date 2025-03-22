"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, Download } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function AumHeader() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  })

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-truffle-800">AUM Dashboard</h1>
        <p className="text-sm text-truffle-500 mt-1">Track and analyze your assets under management</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 rounded-lg w-full sm:w-auto">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  "Select date range"
                )}
              </span>
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
            />
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 rounded-lg w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-lg">
            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            <DropdownMenuItem>Export as Excel</DropdownMenuItem>
            <DropdownMenuItem>Export as CSV</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

