import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { ScrollReveal } from "@/components/dashboard/scroll-reveal"

export const metadata: Metadata = {
  title: "Settings | WealthBeeing",
  description: "Manage your account settings and preferences",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 mb-6 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-semibold text-truffle-800">Settings</h1>
        <p className="text-sm text-truffle-500 mt-1">Manage your account settings and preferences</p>
      </div>

      <ScrollReveal>
        <Card className="premium-card shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-truffle-800">Account Settings</CardTitle>
            <CardDescription>Manage your account settings and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-4 w-full md:w-auto">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <ProfileSettings />
              </TabsContent>
              <TabsContent value="security">
                <SecuritySettings />
              </TabsContent>
              <TabsContent value="notifications">
                <NotificationSettings />
              </TabsContent>
              <TabsContent value="appearance">
                <AppearanceSettings />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  )
}

