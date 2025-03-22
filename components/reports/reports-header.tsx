"use client"

import { Button } from "@/components/ui/button"
import { Plus, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateReportDialog } from "./create-report-dialog"
import { useState } from "react"

export function ReportsHeader() {
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-truffle-800">Reports</h1>
          <p className="text-sm text-truffle-500 mt-1">Generate and view financial reports</p>
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
              <DropdownMenuItem>All Reports</DropdownMenuItem>
              <DropdownMenuItem>Client Reports</DropdownMenuItem>
              <DropdownMenuItem>Performance Reports</DropdownMenuItem>
              <DropdownMenuItem>Compliance Reports</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
            onClick={() => setIsCreateReportOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Report
          </Button>
        </div>
      </div>

      <CreateReportDialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen} />
    </>
  )
}

