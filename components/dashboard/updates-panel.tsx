"use client"

import { useState } from "react"
import { Bell, Calendar, CreditCard, Gift } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Mock data for updates
const updates = {
  meetings: [
    { id: 1, title: "Client Meeting: John Doe", date: "Today, 2:00 PM", status: "upcoming" },
    { id: 2, title: "Team Huddle", date: "Tomorrow, 9:30 AM", status: "upcoming" },
    { id: 3, title: "Client Meeting: Sarah Lee", date: "Mar 20, 11:00 AM", status: "upcoming" },
    { id: 4, title: "Quarterly Review: Michael Wong", date: "Mar 22, 3:30 PM", status: "upcoming" },
  ],
  birthdays: [
    { id: 1, title: "Sarah Lee", date: "Mar 20", status: "upcoming" },
    { id: 2, title: "Michael Wong", date: "Mar 28", status: "upcoming" },
    { id: 3, title: "Lisa Chen", date: "Apr 5", status: "upcoming" },
    { id: 4, title: "David Kim", date: "Apr 12", status: "upcoming" },
  ],
  payments: [
    { id: 1, title: "Michael Wong - Protection Plan", date: "Mar 22", status: "upcoming" },
    { id: 2, title: "Lisa Chen - Education Plan", date: "Mar 25", status: "upcoming" },
    { id: 3, title: "John Doe - Retirement Plan", date: "Mar 30", status: "upcoming" },
    { id: 4, title: "Sarah Lee - Health Plan", date: "Apr 5", status: "upcoming" },
  ],
  renewals: [
    { id: 1, title: "Lisa Chen - Protection Plan", date: "Mar 25", status: "upcoming" },
    { id: 2, title: "David Kim - Health Plan", date: "Apr 10", status: "upcoming" },
    { id: 3, title: "Sarah Lee - Education Plan", date: "Apr 15", status: "upcoming" },
    { id: 4, title: "Michael Wong - Retirement Plan", date: "Apr 22", status: "upcoming" },
  ],
}

export function UpdatesPanel() {
  const [activeTab, setActiveTab] = useState("meetings")

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "meetings":
        return <Calendar className="h-4 w-4" />
      case "birthdays":
        return <Gift className="h-4 w-4" />
      case "payments":
        return <CreditCard className="h-4 w-4" />
      case "renewals":
        return <Bell className="h-4 w-4" />
      default:
        return null
    }
  }

  const getTabCount = (tab: string) => {
    return updates[tab as keyof typeof updates].length
  }

  return (
    <Card
      className="premium-card animate-fade-in shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)] h-full flex flex-col"
      style={{ animationDelay: "0.2s" }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-truffle-800">Updates and Alerts</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <Tabs defaultValue="meetings" onValueChange={setActiveTab} className="flex flex-col h-full">
          <TabsList className="grid grid-cols-4 bg-late-50 p-0 h-auto rounded-none">
            {["meetings", "birthdays", "payments", "renewals"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={cn(
                  "flex items-center gap-1 py-3 capitalize rounded-none",
                  activeTab === tab ? "bg-white text-truffle-800 shadow-sm" : "text-truffle-600",
                )}
              >
                {getTabIcon(tab)}
                <span className="hidden md:inline">{tab}</span>
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-late-200 text-xs font-semibold text-truffle-700">
                  {getTabCount(tab)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(updates).map(([key, items]) => (
            <TabsContent key={key} value={key} className="m-0 flex-1 overflow-auto">
              <div className="divide-y divide-late-100 h-full flex flex-col">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 hover:bg-late-50 transition-colors duration-200 gap-2"
                  >
                    <div>
                      <p className="font-medium text-truffle-700">{item.title}</p>
                      <p className="text-sm text-truffle-500">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <Button variant="outline" size="sm" className="rounded-lg">
                        Snooze
                      </Button>
                      <Button size="sm" className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500">
                        {key === "meetings" ? "Join" : "View"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

