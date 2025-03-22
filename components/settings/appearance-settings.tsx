"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export function AppearanceSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    theme: "light",
    sidebarCollapsed: false,
    compactMode: false,
    animationsEnabled: true,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    toast({
      title: "Appearance settings updated",
      description: "Your appearance preferences have been saved.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-truffle-800">Theme</h3>

        <RadioGroup
          value={formData.theme}
          onValueChange={(value) => handleChange("theme", value)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="flex items-center space-x-2 border border-late-100 rounded-lg p-4 cursor-pointer hover:bg-late-50">
            <RadioGroupItem value="light" id="theme-light" />
            <Label htmlFor="theme-light" className="cursor-pointer">
              Light
            </Label>
          </div>
          <div className="flex items-center space-x-2 border border-late-100 rounded-lg p-4 cursor-pointer hover:bg-late-50">
            <RadioGroupItem value="dark" id="theme-dark" />
            <Label htmlFor="theme-dark" className="cursor-pointer">
              Dark
            </Label>
          </div>
          <div className="flex items-center space-x-2 border border-late-100 rounded-lg p-4 cursor-pointer hover:bg-late-50">
            <RadioGroupItem value="system" id="theme-system" />
            <Label htmlFor="theme-system" className="cursor-pointer">
              System
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4 pt-4 border-t border-late-100">
        <h3 className="text-lg font-medium text-truffle-800">Layout & Interface</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sidebarCollapsed">Collapsed Sidebar</Label>
            <p className="text-sm text-truffle-500">Keep sidebar collapsed by default</p>
          </div>
          <Switch
            id="sidebarCollapsed"
            checked={formData.sidebarCollapsed}
            onCheckedChange={(checked) => handleChange("sidebarCollapsed", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="compactMode">Compact Mode</Label>
            <p className="text-sm text-truffle-500">Reduce spacing and size of UI elements</p>
          </div>
          <Switch
            id="compactMode"
            checked={formData.compactMode}
            onCheckedChange={(checked) => handleChange("compactMode", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="animationsEnabled">Animations</Label>
            <p className="text-sm text-truffle-500">Enable animations and transitions</p>
          </div>
          <Switch
            id="animationsEnabled"
            checked={formData.animationsEnabled}
            onCheckedChange={(checked) => handleChange("animationsEnabled", checked)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </form>
  )
}

