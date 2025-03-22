"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Trash, Shield, Heart, Home, Car, Briefcase, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface CurrentPoliciesFormProps {
  data: any
  updateData: (data: any) => void
}

export function CurrentPoliciesForm({ data, updateData }: CurrentPoliciesFormProps) {
  // Policy categories and subcategories
  const policyCategories = {
    "Life Insurance": ["Term Life", "Whole Life", "Universal Life", "Variable Life", "Group Life", "Endowment"],
    "Health Insurance": ["Medical", "Dental", "Vision", "Critical Illness", "Hospital Indemnity", "Disability"],
    "Property Insurance": ["Homeowners", "Renters", "Flood", "Earthquake", "Umbrella"],
    "Auto Insurance": ["Liability", "Collision", "Comprehensive", "Uninsured Motorist", "Personal Injury Protection"],
    "Business Insurance": [
      "General Liability",
      "Professional Liability",
      "Business Interruption",
      "Workers' Compensation",
      "Cyber Liability",
    ],
    "Other Insurance": ["Travel", "Pet", "Wedding", "Event", "Other"],
  }

  // Insurance providers
  const insuranceProviders = [
    "AIA",
    "Prudential",
    "Allianz",
    "AXA",
    "Bangkok Life Assurance",
    "Muang Thai Life",
    "Thai Life Insurance",
    "Krungthai-AXA Life",
    "FWD",
    "Tokio Marine",
    "Dhipaya Insurance",
    "Viriyah Insurance",
    "Other",
  ]

  const [policies, setPolicies] = useState(
    data.policies || [
      {
        category: "Life Insurance",
        subCategory: "Term Life",
        provider: "AIA",
        policyNumber: "",
        insured: "",
        beneficiary: "",
        coverageAmount: "",
        premium: "",
        frequency: "annual",
        startDate: "",
        expiryDate: "",
        notes: "",
      },
    ],
  )

  const [activeTab, setActiveTab] = useState<string>("all")

  const addPolicy = () => {
    const newPolicies = [
      ...policies,
      {
        category: "Life Insurance",
        subCategory: "Term Life",
        provider: "AIA",
        policyNumber: "",
        insured: "",
        beneficiary: "",
        coverageAmount: "",
        premium: "",
        frequency: "annual",
        startDate: "",
        expiryDate: "",
        notes: "",
      },
    ]
    setPolicies(newPolicies)
    updateData({ policies: newPolicies })
  }

  const updatePolicy = (index: number, field: string, value: string) => {
    const newPolicies = [...policies]
    newPolicies[index] = { ...newPolicies[index], [field]: value }

    // If category changes, update subcategory to first item in that category
    if (field === "category") {
      newPolicies[index].subCategory = policyCategories[value as keyof typeof policyCategories][0]
    }

    setPolicies(newPolicies)
    updateData({ policies: newPolicies })
  }

  const removePolicy = (index: number) => {
    const newPolicies = policies.filter((_, i) => i !== index)
    setPolicies(newPolicies)
    updateData({ policies: newPolicies })
  }

  // Policy type configurations
  const policyTypeConfig = {
    "Life Insurance": {
      icon: Shield,
      color: "bg-blue-100 text-blue-800 border border-blue-200",
      chartColor: "#3b82f6",
    },
    "Health Insurance": {
      icon: Heart,
      color: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      chartColor: "#10b981",
    },
    "Property Insurance": {
      icon: Home,
      color: "bg-gold-100 text-truffle-800 border border-gold-200",
      chartColor: "#f59e0b",
    },
    "Auto Insurance": {
      icon: Car,
      color: "bg-purple-100 text-purple-800 border border-purple-200",
      chartColor: "#8b5cf6",
    },
    "Business Insurance": {
      icon: Briefcase,
      color: "bg-red-100 text-red-800 border border-red-200",
      chartColor: "#ef4444",
    },
    "Other Insurance": {
      icon: AlertCircle,
      color: "bg-gray-100 text-gray-800 border border-gray-200",
      chartColor: "#6b7280",
    },
  }

  // Calculate totals
  const calculateTotalPremium = (frequency = "all") => {
    return policies.reduce((total, policy) => {
      if (frequency !== "all" && policy.frequency !== frequency) return total
      return total + (Number.parseFloat(policy.premium) || 0)
    }, 0)
  }

  const calculateTotalCoverage = (category = "all") => {
    return policies.reduce((total, policy) => {
      if (category !== "all" && policy.category !== category) return total
      return total + (Number.parseFloat(policy.coverageAmount) || 0)
    }, 0)
  }

  // Calculate premiums by frequency
  const calculatePremiumsByFrequency = () => {
    const result: Record<string, number> = {
      annual: 0,
      semiannual: 0,
      quarterly: 0,
      monthly: 0,
    }

    policies.forEach((policy) => {
      const premium = Number.parseFloat(policy.premium) || 0
      if (policy.frequency in result) {
        result[policy.frequency] += premium
      }
    })

    return result
  }

  // Calculate coverage by category
  const calculateCoverageByCategory = () => {
    const result: Record<string, number> = {}

    policies.forEach((policy) => {
      const coverage = Number.parseFloat(policy.coverageAmount) || 0
      if (!result[policy.category]) {
        result[policy.category] = 0
      }
      result[policy.category] += coverage
    })

    return result
  }

  // Prepare chart data
  const prepareCoverageChartData = () => {
    const categoryTotals = calculateCoverageByCategory()
    return Object.entries(categoryTotals).map(([category, value]) => ({
      name: category,
      value,
      color: policyTypeConfig[category as keyof typeof policyTypeConfig]?.chartColor || "#6b7280",
    }))
  }

  const preparePremiumChartData = () => {
    const frequencyTotals = calculatePremiumsByFrequency()
    return Object.entries(frequencyTotals).map(([frequency, value]) => ({
      name: frequency.charAt(0).toUpperCase() + frequency.slice(1),
      value,
    }))
  }

  // Filter policies by category for tabs
  const filteredPolicies = activeTab === "all" ? policies : policies.filter((policy) => policy.category === activeTab)

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  // Calculate annualized premium
  const calculateAnnualizedPremium = (premium: string, frequency: string) => {
    const premiumValue = Number.parseFloat(premium) || 0

    switch (frequency) {
      case "monthly":
        return premiumValue * 12
      case "quarterly":
        return premiumValue * 4
      case "semiannual":
        return premiumValue * 2
      default:
        return premiumValue
    }
  }

  // Calculate total annualized premium
  const totalAnnualizedPremium = policies.reduce((total, policy) => {
    return total + calculateAnnualizedPremium(policy.premium, policy.frequency)
  }, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-truffle-800 mb-2">Current Insurance Policies</h2>
        <p className="text-sm text-truffle-500">
          Record the client's existing insurance policies to identify coverage and potential gaps.
        </p>
      </div>

      {/* Insurance Summary Card */}
      <Card className="bg-white border-late-200">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium text-truffle-700 mb-4">Insurance Summary</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-late-50 p-3 rounded-lg">
                  <p className="text-sm text-truffle-500">Total Policies</p>
                  <p className="text-xl font-semibold text-truffle-800">{policies.length}</p>
                </div>
                <div className="bg-late-50 p-3 rounded-lg">
                  <p className="text-sm text-truffle-500">Annual Premium</p>
                  <p className="text-xl font-semibold text-truffle-800">
                    ฿{totalAnnualizedPremium.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Coverage by Category Chart */}
              {policies.length > 0 && (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareCoverageChartData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {prepareCoverageChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`฿${Number(value).toLocaleString()}`, "Coverage"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-truffle-700">Coverage by Category</h4>

              {Object.keys(policyTypeConfig).map((category) => {
                const totalCoverage = calculateTotalCoverage(category)
                const policyCount = policies.filter((p) => p.category === category).length
                const { icon: Icon, color } = policyTypeConfig[category as keyof typeof policyTypeConfig]

                return (
                  <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-truffle-700">{category}</p>
                        <p className="text-xs text-truffle-500">{policyCount} policies</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-truffle-700">
                        ฿{totalCoverage.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-truffle-700">Insurance Policies</h3>
        <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addPolicy}>
          <Plus className="h-4 w-4 mr-2" />
          Add Policy
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all">All Policies</TabsTrigger>
          {Object.keys(policyTypeConfig).map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {/* Policies Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Type</TableHead>
                  <TableHead className="w-[150px]">Provider</TableHead>
                  <TableHead className="w-[120px]">Policy Number</TableHead>
                  <TableHead className="w-[120px]">Insured</TableHead>
                  <TableHead className="w-[120px]">Coverage (฿)</TableHead>
                  <TableHead className="w-[120px]">Premium (฿)</TableHead>
                  <TableHead className="w-[120px]">Expiry Date</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-truffle-500">
                      No insurance policies added yet. Click "Add Policy" to begin.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPolicies.map((policy, index) => {
                    const actualIndex = policies.findIndex((p) => p === policy)
                    const { color } =
                      policyTypeConfig[policy.category as keyof typeof policyTypeConfig] ||
                      policyTypeConfig["Other Insurance"]

                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Select
                              value={policy.category}
                              onValueChange={(value) => updatePolicy(actualIndex, "category", value)}
                            >
                              <SelectTrigger className="rounded-lg">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.keys(policyCategories).map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={policy.subCategory}
                              onValueChange={(value) => updatePolicy(actualIndex, "subCategory", value)}
                            >
                              <SelectTrigger className="rounded-lg text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {policyCategories[policy.category as keyof typeof policyCategories]?.map(
                                  (subCategory) => (
                                    <SelectItem key={subCategory} value={subCategory}>
                                      {subCategory}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={policy.provider}
                            onValueChange={(value) => updatePolicy(actualIndex, "provider", value)}
                          >
                            <SelectTrigger className="rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {insuranceProviders.map((provider) => (
                                <SelectItem key={provider} value={provider}>
                                  {provider}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={policy.policyNumber}
                            onChange={(e) => updatePolicy(actualIndex, "policyNumber", e.target.value)}
                            className="rounded-lg"
                            placeholder="Policy #"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={policy.insured}
                            onChange={(e) => updatePolicy(actualIndex, "insured", e.target.value)}
                            className="rounded-lg"
                            placeholder="Insured Name"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={policy.coverageAmount}
                            onChange={(e) => updatePolicy(actualIndex, "coverageAmount", e.target.value)}
                            className="rounded-lg"
                            type="number"
                            min="0"
                            step="10000"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Input
                              value={policy.premium}
                              onChange={(e) => updatePolicy(actualIndex, "premium", e.target.value)}
                              className="rounded-lg"
                              type="number"
                              min="0"
                              step="100"
                            />
                            <Select
                              value={policy.frequency}
                              onValueChange={(value) => updatePolicy(actualIndex, "frequency", value)}
                            >
                              <SelectTrigger className="rounded-lg text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="annual">Annual</SelectItem>
                                <SelectItem value="semiannual">Semi-Annual</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={policy.expiryDate}
                            onChange={(e) => updatePolicy(actualIndex, "expiryDate", e.target.value)}
                            className="rounded-lg"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removePolicy(actualIndex)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Coverage Gap Analysis */}
      <Card className="bg-late-50 border-late-200">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium text-truffle-700 mb-4">Coverage Analysis</h3>

          <div className="space-y-4">
            {/* Life Insurance Analysis */}
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg", policyTypeConfig["Life Insurance"].color)}>
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-truffle-700">Life Insurance Coverage</p>
                  <p className="text-sm text-truffle-500">
                    {(() => {
                      const lifeCoverage = calculateTotalCoverage("Life Insurance")
                      // This would ideally be calculated based on income and other factors
                      const recommendedCoverage = 5000000 // Placeholder value

                      if (lifeCoverage === 0)
                        return "No life insurance coverage detected. Consider adding life insurance protection."
                      if (lifeCoverage < recommendedCoverage)
                        return `Current coverage (฿${lifeCoverage.toLocaleString()}) may be insufficient based on income and dependents.`
                      return `Current coverage (฿${lifeCoverage.toLocaleString()}) appears adequate.`
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* Health Insurance Analysis */}
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg", policyTypeConfig["Health Insurance"].color)}>
                  <Heart className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-truffle-700">Health Insurance Coverage</p>
                  <p className="text-sm text-truffle-500">
                    {(() => {
                      const healthCoverage = calculateTotalCoverage("Health Insurance")

                      if (healthCoverage === 0)
                        return "No health insurance coverage detected. Consider adding health protection."
                      if (
                        policies.filter(
                          (p) => p.category === "Health Insurance" && p.subCategory === "Critical Illness",
                        ).length === 0
                      )
                        return "Consider adding critical illness coverage to complement existing health insurance."
                      return `Current health coverage (฿${healthCoverage.toLocaleString()}) includes critical illness protection.`
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* Property Insurance Analysis */}
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg", policyTypeConfig["Property Insurance"].color)}>
                  <Home className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-truffle-700">Property Insurance Coverage</p>
                  <p className="text-sm text-truffle-500">
                    {(() => {
                      const propertyCoverage = calculateTotalCoverage("Property Insurance")
                      // This would ideally be calculated based on property values from balance sheet
                      const propertyAssets = 10000000 // Placeholder value

                      if (propertyCoverage === 0)
                        return "No property insurance detected. Consider adding coverage for real estate assets."
                      if (propertyCoverage < propertyAssets * 0.8)
                        return `Current coverage may be insufficient for property assets. Consider increasing coverage.`
                      return `Property insurance coverage appears adequate for current assets.`
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

