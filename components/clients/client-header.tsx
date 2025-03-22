"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Edit, MoreHorizontal, Plus, Trash } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Mock client data
const clients = {
  CLT001: {
    id: "CLT001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+66 81 234 5678",
    status: "client",
  },
  CLT002: {
    id: "CLT002",
    name: "Sarah Lee",
    email: "sarah.lee@example.com",
    phone: "+66 82 345 6789",
    status: "client",
  },
  CLT003: {
    id: "CLT003",
    name: "Michael Wong",
    email: "michael.wong@example.com",
    phone: "+66 83 456 7890",
    status: "client",
  },
  CLT004: {
    id: "CLT004",
    name: "Lisa Chen",
    email: "lisa.chen@example.com",
    phone: "+66 84 567 8901",
    status: "prospect",
  },
  CLT005: {
    id: "CLT005",
    name: "David Kim",
    email: "david.kim@example.com",
    phone: "+66 85 678 9012",
    status: "prospect",
  },
}

interface ClientHeaderProps {
  clientId: string
}

export function ClientHeader({ clientId }: ClientHeaderProps) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Get client data
  const client = clients[clientId as keyof typeof clients] || {
    id: clientId,
    name: "Unknown Client",
    email: "unknown@example.com",
    phone: "N/A",
    status: "unknown",
  }

  const handleDelete = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Client deleted",
      description: "The client has been deleted successfully.",
    })

    // Redirect to clients page
    router.push("/clients")
  }

  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-truffle-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {client.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-semibold text-truffle-800">{client.name}</h1>
              <Badge
                className={
                  client.status === "client"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-gold-100 text-truffle-800 border border-gold-200"
                }
              >
                {client.status === "client" ? "Client" : "Prospect"}
              </Badge>
            </div>
            <p className="text-sm text-truffle-500 mt-1">
              {client.email} • {client.phone}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
          <Button variant="outline" size="sm" className="rounded-lg">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500">
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-lg">
              <DropdownMenuItem onClick={() => router.push(`/clients/${clientId}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Client
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                Delete Client
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the client and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction className="rounded-lg bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

