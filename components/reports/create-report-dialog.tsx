"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

interface CreateReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateReportDialog({ open, onOpenChange }: CreateReportDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    type: "client",
    period: "month",
    includeCharts: true,
    includeTables: true,
    includeCommentary: true,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title) {
      toast({
        title: "Missing information",
        description: "Please provide a report title.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    onOpenChange(false)

    // Reset form
    setFormData({
      title: "",
      type: "client",
      period: "month",
      includeCharts: true,
      includeTables: true,
      includeCommentary: true,
    })

    toast({
      title: "Report created",
      description: "Your report has been created successfully.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-truffle-800">Create New Report</DialogTitle>
          <DialogDescription>Generate a new report. Fill in the details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Report Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="rounded-lg"
              placeholder="Enter report title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Report Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger id="type" className="rounded-lg">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client Report</SelectItem>
                <SelectItem value="performance">Performance Report</SelectItem>
                <SelectItem value="aum">AUM Report</SelectItem>
                <SelectItem value="compliance">Compliance Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Time Period</Label>
            <Select value={formData.period} onValueChange={(value) => handleChange("period", value)}>
              <SelectTrigger id="period" className="rounded-lg">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-2">
            <Label>Report Contents</Label>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeCharts"
                checked={formData.includeCharts}
                onCheckedChange={(checked) => handleChange("includeCharts", checked as boolean)}
              />
              <Label htmlFor="includeCharts" className="cursor-pointer">
                Include Charts and Graphs
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeTables"
                checked={formData.includeTables}
                onCheckedChange={(checked) => handleChange("includeTables", checked as boolean)}
              />
              <Label htmlFor="includeTables" className="cursor-pointer">
                Include Data Tables
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeCommentary"
                checked={formData.includeCommentary}
                onCheckedChange={(checked) => handleChange("includeCommentary", checked as boolean)}
              />
              <Label htmlFor="includeCommentary" className="cursor-pointer">
                Include Commentary
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" className="rounded-lg" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Generate Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

