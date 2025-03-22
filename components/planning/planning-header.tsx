"use client"

import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import Link from "next/link"

export function PlanningHeader() {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-truffle-800">Financial Planning</h1>
        <p className="text-sm text-truffle-500 mt-1">Comprehensive financial planning tools and resources</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
        <Button asChild variant="outline" size="sm" className="rounded-lg">
          <Link href="/clients">
            <Users className="mr-2 h-4 w-4" />
            Select Client
          </Link>
        </Button>
        <Button size="sm" className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500">
          <Plus className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </div>
    </div>
  )
}

