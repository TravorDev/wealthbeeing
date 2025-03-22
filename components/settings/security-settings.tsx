"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
    sessionTimeout: true,
    loginNotifications: true,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))

    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    })
  }

  return (
    <div className="space-y-6 py-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-truffle-800">Change Password</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => handleChange("currentPassword", e.target.value)}
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>

      <div className="space-y-4 pt-4 border-t border-late-100">
        <h3 className="text-lg font-medium text-truffle-800">Security Settings</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="twoFactorEnabled">Two-Factor Authentication</Label>
            <p className="text-sm text-truffle-500">Add an extra layer of security to your account</p>
          </div>
          <Switch
            id="twoFactorEnabled"
            checked={formData.twoFactorEnabled}
            onCheckedChange={(checked) => handleChange("twoFactorEnabled", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sessionTimeout">Session Timeout</Label>
            <p className="text-sm text-truffle-500">Automatically log out after 30 minutes of inactivity</p>
          </div>
          <Switch
            id="sessionTimeout"
            checked={formData.sessionTimeout}
            onCheckedChange={(checked) => handleChange("sessionTimeout", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="loginNotifications">Login Notifications</Label>
            <p className="text-sm text-truffle-500">Receive email notifications for new login attempts</p>
          </div>
          <Switch
            id="loginNotifications"
            checked={formData.loginNotifications}
            onCheckedChange={(checked) => handleChange("loginNotifications", checked)}
          />
        </div>
      </div>
    </div>
  )
}

