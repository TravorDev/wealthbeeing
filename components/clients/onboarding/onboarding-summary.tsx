"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CustomField {
  id: string
  label: string
  type: string
  value: string | boolean
  options?: { label: string; value: string }[]
  section: "client" | "spouse" | "children"
  childIndex?: number
}

interface OnboardingSummaryProps {
  data: any
}

export function OnboardingSummary({ data }: OnboardingSummaryProps) {
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format currency
  const formatCurrency = (amount: string | number) => {
    if (!amount) return "฿0"
    const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount
    return `฿${numAmount.toLocaleString()}`
  }

  // Calculate total assets
  const totalAssets =
    data.assets?.reduce((total: number, asset: any) => {
      return total + (Number.parseFloat(asset.value) || 0)
    }, 0) || 0

  // Calculate total liabilities
  const totalLiabilities =
    data.liabilities?.reduce((total: number, liability: any) => {
      return total + (Number.parseFloat(liability.value) || 0)
    }, 0) || 0

  // Calculate net worth
  const netWorth = totalAssets - totalLiabilities

  // Plan type configurations
  const planTypeConfig = {
    education: { color: "bg-blue-100 text-blue-800 border border-blue-200" },
    retirement: { color: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
    protection: { color: "bg-gold-100 text-truffle-800 border border-gold-200" },
    health: { color: "bg-purple-100 text-purple-800 border border-purple-200" },
  }

  // Filter custom fields by section and childIndex
  const getCustomFields = (section: "client" | "spouse" | "children", childIndex?: number) => {
    if (!data.customFields) return []

    return data.customFields.filter((field: CustomField) => {
      if (field.section !== section) return false
      if (section === "children" && field.childIndex !== childIndex) return false
      return true
    })
  }

  // Format custom field value for display
  const formatCustomFieldValue = (field: CustomField) => {
    if (field.type === "checkbox") {
      return field.value ? "Yes" : "No"
    }

    if (field.type === "date") {
      return formatDate(field.value as string)
    }

    if (field.type === "select" && field.options) {
      const option = field.options.find((opt) => opt.value === field.value)
      return option ? option.label : field.value
    }

    return field.value || "N/A"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-truffle-800 mb-2">Client Onboarding Summary</h2>
        <p className="text-sm text-truffle-500">
          Review the client's information and financial plan before completing the onboarding process.
        </p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium text-truffle-700 mb-4">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-truffle-500">Full Name (English)</p>
                  <p className="font-medium text-truffle-800">
                    {data.firstName} {data.lastName}
                  </p>
                </div>

                {data.hasLocalName && (
                  <div className="space-y-2">
                    <p className="text-sm text-truffle-500">
                      {data.country === "Thailand" ? "Full Name (Thai)" : "Full Name (Local)"}
                    </p>
                    <p className="font-medium text-truffle-800">
                      {data.localFirstName} {data.localLastName}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm text-truffle-500">Email</p>
                  <p className="font-medium text-truffle-800">{data.email || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-truffle-500">Phone</p>
                  <p className="font-medium text-truffle-800">{data.phone || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-truffle-500">Date of Birth</p>
                  <p className="font-medium text-truffle-800">{formatDate(data.dateOfBirth)}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-truffle-500">Gender</p>
                  <p className="font-medium text-truffle-800">
                    {data.gender ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1) : "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-truffle-500">Nationality</p>
                  <p className="font-medium text-truffle-800">{data.nationality || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-truffle-500">Occupation</p>
                  <p className="font-medium text-truffle-800">{data.occupation || "N/A"}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-truffle-500 mb-2">Address</p>
                <p className="font-medium text-truffle-800">
                  {data.addressLine1 ? (
                    <>
                      {data.addressLine1}
                      <br />
                      {data.addressLine2 && (
                        <>
                          {data.addressLine2}
                          <br />
                        </>
                      )}
                      {data.city}, {data.state} {data.postalCode}
                      <br />
                      {data.country}
                    </>
                  ) : (
                    "No address provided"
                  )}
                </p>
              </div>

              {/* Custom fields for client */}
              {getCustomFields("client").length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <p className="text-sm text-truffle-500 mb-3">Additional Information</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getCustomFields("client").map((field: CustomField) => (
                      <div key={field.id} className="space-y-1">
                        <p className="text-sm text-truffle-500">{field.label}</p>
                        <p className="font-medium text-truffle-800">{formatCustomFieldValue(field)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {data.hasSpouse && (
            <Card>
              <CardContent className="p-4">
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-truffle-700 mb-4">Spouse Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-truffle-500">Name (English)</p>
                      <p className="font-medium text-truffle-800">
                        {data.spouse.firstName} {data.spouse.lastName}
                      </p>
                    </div>

                    {data.spouse.hasLocalName && (
                      <div>
                        <p className="text-sm text-truffle-500">
                          {data.country === "Thailand" ? "Name (Thai)" : "Name (Local)"}
                        </p>
                        <p className="font-medium text-truffle-800">
                          {data.spouse.localFirstName} {data.spouse.localLastName}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-truffle-500">Date of Birth</p>
                      <p className="font-medium text-truffle-800">{formatDate(data.spouse.dateOfBirth)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-truffle-500">Occupation</p>
                      <p className="font-medium text-truffle-800">{data.spouse.occupation || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-truffle-500">Contact</p>
                      <p className="font-medium text-truffle-800">
                        {data.spouse.email || "No email"} / {data.spouse.phone || "No phone"}
                      </p>
                    </div>
                  </div>

                  {/* Custom fields for spouse */}
                  {getCustomFields("spouse").length > 0 && (
                    <div className="mt-6 border-t pt-4">
                      <p className="text-sm text-truffle-500 mb-3">Additional Information</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getCustomFields("spouse").map((field: CustomField) => (
                          <div key={field.id} className="space-y-1">
                            <p className="text-sm text-truffle-500">{field.label}</p>
                            <p className="font-medium text-truffle-800">{formatCustomFieldValue(field)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {data.hasChildren && data.children && data.children.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-truffle-700 mb-4">Dependent Children</h3>
                  <div className="space-y-4">
                    {data.children.map((child: any, index: number) => (
                      <div key={index} className="p-3 border border-late-100 rounded-lg">
                        <h4 className="font-medium text-truffle-800 mb-2">Child {index + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-truffle-500">Name (English)</p>
                            <p className="font-medium text-truffle-800">
                              {child.firstName} {child.lastName}
                            </p>
                          </div>

                          {child.hasLocalName && (
                            <div>
                              <p className="text-sm text-truffle-500">
                                {data.country === "Thailand" ? "Name (Thai)" : "Name (Local)"}
                              </p>
                              <p className="font-medium text-truffle-800">
                                {child.localFirstName} {child.localLastName}
                              </p>
                            </div>
                          )}

                          <div>
                            <p className="text-sm text-truffle-500">Date of Birth</p>
                            <p className="font-medium text-truffle-800">{formatDate(child.dateOfBirth)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-truffle-500">Relationship</p>
                            <p className="font-medium text-truffle-800">
                              {child.relationship.charAt(0).toUpperCase() + child.relationship.slice(1)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-truffle-500">Dependency Status</p>
                            <p className="font-medium text-truffle-800">
                              {child.isDependent ? "Financially dependent" : "Not financially dependent"}
                            </p>
                          </div>
                        </div>

                        {/* Custom fields for this child */}
                        {getCustomFields("children", index).length > 0 && (
                          <div className="mt-4 border-t pt-4">
                            <p className="text-sm text-truffle-500 mb-3">Additional Information</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {getCustomFields("children", index).map((field: CustomField) => (
                                <div key={field.id} className="space-y-1">
                                  <p className="text-sm text-truffle-500">{field.label}</p>
                                  <p className="font-medium text-truffle-800">{formatCustomFieldValue(field)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {data.dependents?.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-truffle-700 mb-4">Other Dependents</h3>

                <div className="space-y-3">
                  {data.dependents.map((dependent: any, index: number) => (
                    <div key={index} className="p-3 border border-late-100 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <p className="text-sm text-truffle-500">Name</p>
                          <p className="font-medium text-truffle-800">{dependent.name}</p>
                        </div>

                        <div>
                          <p className="text-sm text-truffle-500">Relationship</p>
                          <p className="font-medium text-truffle-800">
                            {dependent.relationship
                              ? dependent.relationship.charAt(0).toUpperCase() + dependent.relationship.slice(1)
                              : "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-truffle-500">Age</p>
                          <p className="font-medium text-truffle-800">{dependent.age || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="financial" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium text-truffle-700 mb-4">Financial Overview</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-late-50 rounded-lg">
                  <p className="text-sm text-truffle-500">Total Assets</p>
                  <p className="text-xl font-semibold text-truffle-800">{formatCurrency(totalAssets)}</p>
                </div>

                <div className="p-3 bg-late-50 rounded-lg">
                  <p className="text-sm text-truffle-500">Total Liabilities</p>
                  <p className="text-xl font-semibold text-truffle-800">{formatCurrency(totalLiabilities)}</p>
                </div>

                <div className="p-3 bg-late-50 rounded-lg">
                  <p className="text-sm text-truffle-500">Net Worth</p>
                  <p className={`text-xl font-semibold ${netWorth >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {formatCurrency(netWorth)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {data.policies?.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-truffle-700 mb-4">Current Insurance Policies</h3>

                <div className="space-y-3">
                  {data.policies.map((policy: any, index: number) => (
                    <div key={index} className="p-3 border border-late-100 rounded-lg">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                          {policy.type?.charAt(0).toUpperCase() + policy.type?.slice(1) || "Unknown"} Insurance
                        </Badge>
                        <Badge className="bg-late-100 text-truffle-700 border border-late-200">
                          {policy.provider || "Unknown Provider"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <p className="text-sm text-truffle-500">Coverage Amount</p>
                          <p className="font-medium text-truffle-800">{formatCurrency(policy.coverageAmount)}</p>
                        </div>

                        <div>
                          <p className="text-sm text-truffle-500">Premium</p>
                          <p className="font-medium text-truffle-800">
                            {formatCurrency(policy.premium)} {policy.frequency ? `(${policy.frequency})` : ""}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-truffle-500">Expiry Date</p>
                          <p className="font-medium text-truffle-800">{formatDate(policy.expiryDate)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {data.taxStatus && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-truffle-700 mb-4">Tax Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-truffle-500">Filing Status</p>
                    <p className="font-medium text-truffle-800">
                      {data.taxStatus === "single"
                        ? "Single"
                        : data.taxStatus === "married-joint"
                          ? "Married Filing Jointly"
                          : data.taxStatus === "married-separate"
                            ? "Married Filing Separately"
                            : data.taxStatus === "head-household"
                              ? "Head of Household"
                              : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-truffle-500">Tax Bracket</p>
                    <p className="font-medium text-truffle-800">{data.taxBracket ? `${data.taxBracket}%` : "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="plans" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium text-truffle-700 mb-4">Selected Financial Plans</h3>

              {data.selectedPlans?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.selectedPlans.map((planId: string) => {
                    // Convert plan ID to display name
                    const planName = planId
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")

                    // Determine plan type for styling
                    let planType = "protection"
                    if (planId.includes("education")) planType = "education"
                    if (planId.includes("retirement")) planType = "retirement"
                    if (planId.includes("health")) planType = "health"

                    return (
                      <div
                        key={planId}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium",
                          planTypeConfig[planType as keyof typeof planTypeConfig]?.color ||
                            "bg-late-100 text-truffle-700 border border-late-200",
                        )}
                      >
                        {planName}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-truffle-500">No financial plans selected yet.</p>
              )}
            </CardContent>
          </Card>

          {data.riskTolerance && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-truffle-700 mb-4">Risk Profile</h3>

                <div>
                  <p className="text-sm text-truffle-500">Risk Tolerance</p>
                  <p className="font-medium text-truffle-800">
                    {data.riskTolerance.charAt(0).toUpperCase() + data.riskTolerance.slice(1)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {data.estateDocuments?.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-truffle-700 mb-4">Estate Planning Documents</h3>

                <div className="space-y-3">
                  {data.estateDocuments.map((document: any, index: number) => (
                    <div key={index} className="p-3 border border-late-100 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <p className="text-sm text-truffle-500">Document Type</p>
                          <p className="font-medium text-truffle-800">
                            {document.type
                              .split("-")
                              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-truffle-500">Status</p>
                          <p className="font-medium text-truffle-800">
                            {document.status
                              .split("-")
                              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-truffle-500">Last Updated</p>
                          <p className="font-medium text-truffle-800">{formatDate(document.lastUpdated)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4 mt-4">
          {data.shortTermGoals?.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-truffle-700 mb-4">Short-Term Goals (0-2 years)</h3>

                <div className="space-y-3">
                  {data.shortTermGoals.map((goal: any, index: number) => (
                    <div key={index} className="p-3 border border-late-100 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-truffle-800">{goal.description}</p>
                        <Badge
                          className={cn(
                            "rounded-lg",
                            goal.priority === "high"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : goal.priority === "medium"
                                ? "bg-gold-100 text-truffle-800 border border-gold-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200",
                          )}
                        >
                          {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-truffle-500">Target Date</p>
                          <p className="text-sm text-truffle-700">{formatDate(goal.targetDate)}</p>
                        </div>

                        <div>
                          <p className="text-sm text-truffle-500">Estimated Cost</p>
                          <p className="text-sm text-truffle-700">{formatCurrency(goal.estimatedCost)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {data.mediumTermGoals?.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-truffle-700 mb-4">Medium-Term Goals (2-5 years)</h3>

                <div className="space-y-3">
                  {data.mediumTermGoals.map((goal: any, index: number) => (
                    <div key={index} className="p-3 border border-late-100 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-truffle-800">{goal.description}</p>
                        <Badge
                          className={cn(
                            "rounded-lg",
                            goal.priority === "high"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : goal.priority === "medium"
                                ? "bg-gold-100 text-truffle-800 border border-gold-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200",
                          )}
                        >
                          {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-truffle-500">Target Date</p>
                          <p className="text-sm text-truffle-700">{formatDate(goal.targetDate)}</p>
                        </div>

                        <div>
                          <p className="text-sm text-truffle-500">Estimated Cost</p>
                          <p className="text-sm text-truffle-700">{formatCurrency(goal.estimatedCost)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {data.longTermGoals?.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-truffle-700 mb-4">Long-Term Goals (5+ years)</h3>

                <div className="space-y-3">
                  {data.longTermGoals.map((goal: any, index: number) => (
                    <div key={index} className="p-3 border border-late-100 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-truffle-800">{goal.description}</p>
                        <Badge
                          className={cn(
                            "rounded-lg",
                            goal.priority === "high"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : goal.priority === "medium"
                                ? "bg-gold-100 text-truffle-800 border border-gold-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200",
                          )}
                        >
                          {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-truffle-500">Target Date</p>
                          <p className="text-sm text-truffle-700">{formatDate(goal.targetDate)}</p>
                        </div>

                        <div>
                          <p className="text-sm text-truffle-500">Estimated Cost</p>
                          <p className="text-sm text-truffle-700">{formatCurrency(goal.estimatedCost)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {!data.shortTermGoals?.length && !data.mediumTermGoals?.length && !data.longTermGoals?.length && (
            <div className="p-6 text-center border border-dashed border-late-200 rounded-lg">
              <p className="text-truffle-500">No financial goals have been added yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

