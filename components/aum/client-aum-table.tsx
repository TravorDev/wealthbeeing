"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Mock data for client AUM
const clients = [
  {
    id: "CLT001",
    name: "John Doe",
    aum: 4500000,
    allocation: { equities: 50, fixedIncome: 30, realEstate: 10, alternatives: 5, cash: 5 },
    growth: 3.2,
    lastUpdate: "2024-03-10",
  },
  {
    id: "CLT002",
    name: "Sarah Lee",
    aum: 2800000,
    allocation: { equities: 40, fixedIncome: 40, realEstate: 15, alternatives: 0, cash: 5 },
    growth: 2.5,
    lastUpdate: "2024-03-12",
  },
  {
    id: "CLT003",
    name: "Michael Wong",
    aum: 3200000,
    allocation: { equities: 60, fixedIncome: 20, realEstate: 10, alternatives: 10, cash: 0 },
    growth: 4.1,
    lastUpdate: "2024-03-08",
  },
  {
    id: "CLT004",
    name: "Lisa Chen",
    aum: 5100000,
    allocation: { equities: 45, fixedIncome: 25, realEstate: 20, alternatives: 5, cash: 5 },
    growth: 3.8,
    lastUpdate: "2024-03-15",
  },
  {
    id: "CLT005",
    name: "David Kim",
    aum: 1900000,
    allocation: { equities: 35, fixedIncome: 45, realEstate: 10, alternatives: 0, cash: 10 },
    growth: 1.9,
    lastUpdate: "2024-03-14",
  },
]

export function ClientAumTable() {
  const [sortField, setSortField] = useState<string>("aum")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  // Filter and sort clients
  const filteredClients = clients
    .filter((client) => client.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a]
      const bValue = b[sortField as keyof typeof b]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

  return (
    <Card className="premium-card shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-truffle-800">Client AUM</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-truffle-400" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="w-full rounded-lg pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-lg">
              All Clients
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg">
              Top 10
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg">
              Growth Leaders
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg">
              Export
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-late-100 overflow-hidden shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)] transition-all duration-300">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-late-50">
                <TableRow>
                  <TableHead className="w-[250px]">
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 p-0 font-medium"
                      onClick={() => handleSort("name")}
                    >
                      Client
                      {getSortIcon("name")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 p-0 font-medium"
                      onClick={() => handleSort("aum")}
                    >
                      AUM
                      {getSortIcon("aum")}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Asset Allocation</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 p-0 font-medium"
                      onClick={() => handleSort("growth")}
                    >
                      Growth
                      {getSortIcon("growth")}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 p-0 font-medium"
                      onClick={() => handleSort("lastUpdate")}
                    >
                      Last Update
                      {getSortIcon("lastUpdate")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client, index) => (
                  <TableRow
                    key={client.id}
                    className="hover:bg-late-50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-truffle-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {client.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-truffle-700 hover:text-truffle-900 hover:underline">
                            {client.name}
                          </p>
                          <p className="text-sm text-truffle-500">{client.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(client.aum)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex h-2 w-full overflow-hidden rounded-full bg-late-100">
                        <div className="bg-blue-500 h-full" style={{ width: `${client.allocation.equities}%` }} />
                        <div className="bg-emerald-500 h-full" style={{ width: `${client.allocation.fixedIncome}%` }} />
                        <div className="bg-gold-400 h-full" style={{ width: `${client.allocation.realEstate}%` }} />
                        <div className="bg-purple-500 h-full" style={{ width: `${client.allocation.alternatives}%` }} />
                        <div className="bg-gray-500 h-full" style={{ width: `${client.allocation.cash}%` }} />
                      </div>
                    </TableCell>
                    <TableCell className={cn("font-medium", client.growth > 0 ? "text-emerald-600" : "text-red-600")}>
                      {client.growth > 0 ? "+" : ""}
                      {client.growth}%
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{formatDate(client.lastUpdate)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-lg">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Allocation</DropdownMenuItem>
                          <DropdownMenuItem>View History</DropdownMenuItem>
                          <DropdownMenuItem>Generate Report</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t border-late-100 bg-white gap-2">
            <p className="text-sm text-truffle-500">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{filteredClients.length}</span> of{" "}
              <span className="font-medium">{filteredClients.length}</span> clients
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-lg" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

