"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Filter, Download, Upload } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateEventDialog } from "./create-event-dialog"

export function CalendarHeader() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-truffle-800">Calendar</h1>
          <p className="text-sm text-truffle-500 mt-1">Manage your schedule, meetings, and important dates</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-lg">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-lg">
              <DropdownMenuItem>All Events</DropdownMenuItem>
              <DropdownMenuItem>Meetings</DropdownMenuItem>
              <DropdownMenuItem>Birthdays</DropdownMenuItem>
              <DropdownMenuItem>Payments</DropdownMenuItem>
              <DropdownMenuItem>Renewals</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-lg">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-lg">
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as iCal</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" className="rounded-lg">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>

          <Button
            size="sm"
            className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
            onClick={() => setIsCreateEventOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
      </div>

      <CreateEventDialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen} />
    </>
  )
}

