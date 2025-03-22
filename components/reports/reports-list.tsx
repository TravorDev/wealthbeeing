"use client"

import { useState } from "react"
import {
  Search,
  FileText,
  Download,
  Eye,
  MoreHorizontal,
  Calendar,
  BarChart,
  PieChart,
  FileBarChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock data for reports
const reports = [
  {
    id: "RPT001",
    title: "Monthly Performance Report",
    type: "performance",
    date: "2024-03-15",
    status: "completed",
    icon: BarChart,
  },
  {
    id: "RPT002",
    title: "Client Portfolio Summary - John Doe",
    type: "client",
    date: "2024-03-12",
    status: "completed",
    icon: PieChart,
  },
  {
    id: "RPT003",
    title: "Quarterly AUM Report",
    type: "aum",
    date: "2024-03-10",
    status: "completed",
    icon: FileBarChart,
  },
  {
    id: "RPT004",
    title: "Annual Compliance Review",
    type: "compliance",
    date: "2024-02-28",
    status: "completed",
    icon: FileText,
  },
  {
    id: "RPT005",
    title: "Client Birthday Report - March",
    type: "client",
    date: "2024-03-01",
    status: "completed",
    icon: Calendar,
  },
]

// Report type configurations
const reportTypeConfig = {
  performance: {
    color: "bg-blue-100 text-blue-800 border border-blue-200",
    label: "Performance",
  },
  client: {
    color: "bg-gold-100 text-truffle-800 border border-gold-200",
    label: "Client",
  },
  aum: {
    color: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    label: "AUM",
  },
  compliance: {
    color: "bg-purple-100 text-purple-800 border border-purple-200",
    label: "Compliance",
  },
}

const ReportsList = () => {
  const [searchQuery, setSearchQuery] = useState("")

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  // Filter reports
  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="premium-card shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-truffle-800">Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-truffle-400" />
            <Input
              type="search"
              placeholder="Search reports..."
              className="w-full rounded-lg pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-lg">
              All Reports
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg">
              Recent
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg">
              Favorites
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-late-100 overflow-hidden shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)] transition-all duration-300">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-late-50">
                <TableRow>
                  <TableHead className="w-[350px]">Report</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report, index) => (
                  <TableRow
                    key={report.id}
                    className="hover:bg-late-50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-late-100 flex items-center justify-center">
                          <report.icon className="h-5 w-5 text-truffle-600" />
                        </div>
                        <div>
                          <p className="font-medium text-truffle-700 hover:text-truffle-900 hover:underline">
                            {report.title}
                          </p>
                          <p className="text-sm text-truffle-500">{report.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "rounded-lg shadow-sm",
                          reportTypeConfig[report.type as keyof typeof reportTypeConfig].color,
                        )}
                      >
                        {reportTypeConfig[report.type as keyof typeof reportTypeConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(report.date)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="rounded-lg">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-lg">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-lg">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-lg">
                            <DropdownMenuItem>Share Report</DropdownMenuItem>
                            <DropdownMenuItem>Print Report</DropdownMenuItem>
                            <DropdownMenuItem>Add to Favorites</DropdownMenuItem>
                            <DropdownMenuItem>Delete Report</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReports.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-truffle-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-truffle-700 mb-2">No reports found</h3>
              <p className="text-sm text-truffle-500">Try adjusting your search or create a new report.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ReportsList

