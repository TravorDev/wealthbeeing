"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, MoreHorizontal, Pencil, Trash, UserCog } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock data for clients
const clients = [
  {
    id: "CLT001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+66 81 234 5678",
    status: "client",
    plans: ["education", "retirement", "protection"],
    aum: "฿4.5M",
    lastContact: "2024-03-10",
  },
  {
    id: "CLT002",
    name: "Sarah Lee",
    email: "sarah.lee@example.com",
    phone: "+66 82 345 6789",
    status: "client",
    plans: ["retirement", "health"],
    aum: "฿2.8M",
    lastContact: "2024-03-12",
  },
  {
    id: "CLT003",
    name: "Michael Wong",
    email: "michael.wong@example.com",
    phone: "+66 83 456 7890",
    status: "client",
    plans: ["education", "protection"],
    aum: "฿3.2M",
    lastContact: "2024-03-08",
  },
  {
    id: "CLT004",
    name: "Lisa Chen",
    email: "lisa.chen@example.com",
    phone: "+66 84 567 8901",
    status: "prospect",
    plans: [],
    aum: "฿0",
    lastContact: "2024-03-15",
  },
  {
    id: "CLT005",
    name: "David Kim",
    email: "david.kim@example.com",
    phone: "+66 85 678 9012",
    status: "prospect",
    plans: [],
    aum: "฿0",
    lastContact: "2024-03-14",
  },
]

// Plan type icons and colors
const planTypes = {
  education: { label: "Education", color: "bg-blue-100 text-blue-800 border border-blue-200" },
  retirement: { label: "Retirement", color: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
  protection: { label: "Protection", color: "bg-gold-100 text-truffle-800 border border-gold-200" },
  health: { label: "Health", color: "bg-purple-100 text-purple-800 border border-purple-200" },
}

export function ClientTable() {
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
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
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Plans</TableHead>
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
              <TableHead className="hidden sm:table-cell">
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 p-0 font-medium"
                  onClick={() => handleSort("lastContact")}
                >
                  Last Contact
                  {getSortIcon("lastContact")}
                </Button>
              </TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client, index) => (
              <TableRow
                key={client.id}
                className="hover:bg-late-50 transition-colors duration-200"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-truffle-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{getInitials(client.name)}</span>
                    </div>
                    <div>
                      <Link
                        href={`/clients/${client.id}`}
                        className="font-medium text-truffle-700 hover:text-truffle-900 hover:underline"
                      >
                        {client.name}
                      </Link>
                      <p className="text-sm text-truffle-500">{client.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "rounded-lg shadow-sm",
                      client.status === "prospect"
                        ? "bg-gold-100 text-truffle-800 border border-gold-200 hover:bg-gold-200"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200",
                    )}
                  >
                    {client.status === "client" ? "Client" : "Prospect"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {client.plans.length > 0 ? (
                      client.plans.map((plan) => (
                        <Badge
                          key={plan}
                          className={cn(
                            "text-xs rounded-lg shadow-sm",
                            planTypes[plan as keyof typeof planTypes].color,
                          )}
                        >
                          {planTypes[plan as keyof typeof planTypes].label}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-truffle-400">No plans</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{client.aum}</TableCell>
                <TableCell className="hidden sm:table-cell">{formatDate(client.lastContact)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-lg">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-lg">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="rounded-md cursor-pointer">
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>View Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-md cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="rounded-md cursor-pointer text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
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
          Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
          <span className="font-medium">5</span> clients
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
  )
}

