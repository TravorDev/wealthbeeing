import type { Metadata } from "next"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ClientTable } from "@/components/clients/client-table"

export const metadata: Metadata = {
  title: "Clients | WealthBeeing",
  description: "Manage your client relationships",
}

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-truffle-800">Clients</h1>
          <p className="text-sm text-truffle-500 mt-1">Manage your client relationships and portfolios</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
          <Button asChild className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500 mt-2 md:mt-0">
            <Link href="/clients/onboarding">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Client
            </Link>
          </Button>
        </div>
      </div>

      <Card
        className="premium-card animate-fade-in shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)]"
        style={{ animationDelay: "0.1s" }}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-truffle-800">Client List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="relative w-full md:w-72">
              <Input type="search" placeholder="Search clients..." className="w-full rounded-lg" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-lg">
                All Clients
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg">
                Active
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg">
                Prospects
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg">
                Export
              </Button>
            </div>
          </div>

          <ClientTable />
        </CardContent>
      </Card>
    </div>
  )
}

