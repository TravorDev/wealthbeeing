"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AddClientForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    occupation: "",

    // Contact Information
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Thailand",

    // Financial Information
    incomeRange: "",
    netWorth: "",
    riskTolerance: "",
    investmentGoals: "",
    notes: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)

    toast({
      title: "Client added",
      description: "The client has been added successfully.",
    })

    // Redirect to clients page
    router.push("/clients")
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleNext = () => {
    if (activeTab === "personal") {
      setActiveTab("contact")
    } else if (activeTab === "contact") {
      setActiveTab("financial")
    }
  }

  const handlePrevious = () => {
    if (activeTab === "financial") {
      setActiveTab("contact")
    } else if (activeTab === "contact") {
      setActiveTab("personal")
    }
  }

  return (
    <Card className="premium-card shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-truffle-800">Client Information</CardTitle>
        <CardDescription>Enter the client's details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="contact">Contact Information</TabsTrigger>
              <TabsTrigger value="financial">Financial Information</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className="rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                    <SelectTrigger id="gender" className="rounded-lg">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => handleChange("nationality", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => handleChange("occupation", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  type="button"
                  className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
                  onClick={handleNext}
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  value={formData.addressLine1}
                  onChange={(e) => handleChange("addressLine1", e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  value={formData.addressLine2}
                  onChange={(e) => handleChange("addressLine2", e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" className="rounded-lg" onClick={handlePrevious}>
                  Previous
                </Button>
                <Button
                  type="button"
                  className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
                  onClick={handleNext}
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incomeRange">Annual Income Range</Label>
                  <Select value={formData.incomeRange} onValueChange={(value) => handleChange("incomeRange", value)}>
                    <SelectTrigger id="incomeRange" className="rounded-lg">
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below-500k">Below ฿500,000</SelectItem>
                      <SelectItem value="500k-1m">฿500,000 - ฿1,000,000</SelectItem>
                      <SelectItem value="1m-2m">฿1,000,000 - ฿2,000,000</SelectItem>
                      <SelectItem value="2m-5m">฿2,000,000 - ฿5,000,000</SelectItem>
                      <SelectItem value="above-5m">Above ฿5,000,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="netWorth">Estimated Net Worth</Label>
                  <Select value={formData.netWorth} onValueChange={(value) => handleChange("netWorth", value)}>
                    <SelectTrigger id="netWorth" className="rounded-lg">
                      <SelectValue placeholder="Select net worth" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below-1m">Below ฿1,000,000</SelectItem>
                      <SelectItem value="1m-5m">฿1,000,000 - ฿5,000,000</SelectItem>
                      <SelectItem value="5m-10m">฿5,000,000 - ฿10,000,000</SelectItem>
                      <SelectItem value="10m-50m">฿10,000,000 - ฿50,000,000</SelectItem>
                      <SelectItem value="above-50m">Above ฿50,000,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                <Select value={formData.riskTolerance} onValueChange={(value) => handleChange("riskTolerance", value)}>
                  <SelectTrigger id="riskTolerance" className="rounded-lg">
                    <SelectValue placeholder="Select risk tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="investmentGoals">Investment Goals</Label>
                <Select
                  value={formData.investmentGoals}
                  onValueChange={(value) => handleChange("investmentGoals", value)}
                >
                  <SelectTrigger id="investmentGoals" className="rounded-lg">
                    <SelectValue placeholder="Select investment goals" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="wealth-preservation">Wealth Preservation</SelectItem>
                    <SelectItem value="wealth-accumulation">Wealth Accumulation</SelectItem>
                    <SelectItem value="income-generation">Income Generation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="rounded-lg min-h-[100px]"
                  placeholder="Enter any additional notes about the client"
                />
              </div>

              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" className="rounded-lg" onClick={handlePrevious}>
                  Previous
                </Button>
                <Button
                  type="submit"
                  className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding Client..." : "Add Client"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-between">
        <Button variant="outline" className="rounded-lg" onClick={() => router.push("/clients")}>
          Cancel
        </Button>
        <p className="text-sm text-truffle-500">
          Fields marked with <span className="text-red-500">*</span> are required
        </p>
      </CardFooter>
    </Card>
  )
}

