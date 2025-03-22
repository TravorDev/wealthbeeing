"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    clientRequests: true,
    clientBirthdays: true,
    paymentReminders: true,
    policyRenewals: true,
    marketUpdates: false,
    weeklyDigest: true,
  })

  const handleChange = (field: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-truffle-800">Notification Channels</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailNotifications">Email Notifications</Label>
            <p className="text-sm text-truffle-500">Receive notifications via email</p>
          </div>
          <Switch
            id="emailNotifications"
            checked={formData.emailNotifications}
            onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="pushNotifications">Push Notifications</Label>
            <p className="text-sm text-truffle-500">Receive notifications in your browser</p>
          </div>
          <Switch
            id="pushNotifications"
            checked={formData.pushNotifications}
            onCheckedChange={(checked) => handleChange("pushNotifications", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="smsNotifications">SMS Notifications</Label>
            <p className="text-sm text-truffle-500">Receive notifications via SMS</p>
          </div>
          <Switch
            id="smsNotifications"
            checked={formData.smsNotifications}
            onCheckedChange={(checked) => handleChange("smsNotifications", checked)}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-late-100">
        <h3 className="text-lg font-medium text-truffle-800">Notification Types</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="clientRequests">Client Requests</Label>
            <p className="text-sm text-truffle-500">Notifications about new client requests</p>
          </div>
          <Switch
            id="clientRequests"
            checked={formData.clientRequests}
            onCheckedChange={(checked) => handleChange("clientRequests", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="clientBirthdays">Client Birthdays</Label>
            <p className="text-sm text-truffle-500">Reminders about client birthdays</p>
          </div>
          <Switch
            id="clientBirthdays"
            checked={formData.clientBirthdays}
            onCheckedChange={(checked) => handleChange("clientBirthdays", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="paymentReminders">Payment Reminders</Label>
            <p className="text-sm text-truffle-500">Notifications about upcoming client payments</p>
          </div>
          <Switch
            id="paymentReminders"
            checked={formData.paymentReminders}
            onCheckedChange={(checked) => handleChange("paymentReminders", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="policyRenewals">Policy Renewals</Label>
            <p className="text-sm text-truffle-500">Notifications about upcoming policy renewals</p>
          </div>
          <Switch
            id="policyRenewals"
            checked={formData.policyRenewals}
            onCheckedChange={(checked) => handleChange("policyRenewals", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketUpdates">Market Updates</Label>
            <p className="text-sm text-truffle-500">Notifications about market changes and updates</p>
          </div>
          <Switch
            id="marketUpdates"
            checked={formData.marketUpdates}
            onCheckedChange={(checked) => handleChange("marketUpdates", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="weeklyDigest">Weekly Digest</Label>
            <p className="text-sm text-truffle-500">Receive a weekly summary of activities</p>
          </div>
          <Switch
            id="weeklyDigest"
            checked={formData.weeklyDigest}
            onCheckedChange={(checked) => handleChange("weeklyDigest", checked)}
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

