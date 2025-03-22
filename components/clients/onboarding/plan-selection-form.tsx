"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PlanSelectionFormProps {
  data: any
  updateData: (data: any) => void
}

export function PlanSelectionForm({ data, updateData }: PlanSelectionFormProps) {
  const [selectedPlans, setSelectedPlans] = useState<string[]>(data.selectedPlans || [])

  const togglePlan = (planId: string) => {
    let newSelectedPlans

    if (selectedPlans.includes(planId)) {
      newSelectedPlans = selectedPlans.filter((id) => id !== planId)
    } else {
      newSelectedPlans = [...selectedPlans, planId]
    }

    setSelectedPlans(newSelectedPlans)
    updateData({ selectedPlans: newSelectedPlans })
  }

  // Plan data
  const planCategories = [
    {
      id: "protection",
      name: "Protection Plans",
      description: "Insurance and wealth protection solutions",
      plans: [
        {
          id: "life-insurance",
          name: "Life Insurance",
          description: "Comprehensive life insurance coverage",
          features: [
            "Death benefit protection",
            "Optional riders for additional coverage",
            "Tax-advantaged wealth transfer",
            "Cash value accumulation (for whole life)",
          ],
          recommended: true,
        },
        {
          id: "critical-illness",
          name: "Critical Illness",
          description: "Financial protection against serious illnesses",
          features: [
            "Lump sum payment upon diagnosis",
            "Coverage for major illnesses",
            "Helps cover medical expenses",
            "Provides income during recovery",
          ],
          recommended: false,
        },
        {
          id: "income-protection",
          name: "Income Protection",
          description: "Safeguard your income during disability",
          features: [
            "Monthly income replacement",
            "Coverage for temporary or permanent disability",
            "Customizable waiting periods",
            "Occupation-specific coverage options",
          ],
          recommended: true,
        },
      ],
    },
    {
      id: "investment",
      name: "Investment Plans",
      description: "Grow your wealth with strategic investments",
      plans: [
        {
          id: "retirement-plan",
          name: "Retirement Plan",
          description: "Secure your financial future",
          features: [
            "Tax-advantaged retirement savings",
            "Diversified investment options",
            "Regular income during retirement",
            "Legacy planning features",
          ],
          recommended: true,
        },
        {
          id: "education-plan",
          name: "Education Plan",
          description: "Fund education expenses for your children",
          features: [
            "Guaranteed education funding",
            "Protection against inflation",
            "Flexible withdrawal options",
            "Parental premium waiver benefit",
          ],
          recommended: false,
        },
        {
          id: "wealth-accumulation",
          name: "Wealth Accumulation",
          description: "Grow your assets strategically",
          features: [
            "Diversified investment portfolio",
            "Professional fund management",
            "Regular performance reviews",
            "Tax-efficient growth strategies",
          ],
          recommended: true,
        },
      ],
    },
    {
      id: "estate",
      name: "Estate Planning",
      description: "Preserve and transfer your wealth efficiently",
      plans: [
        {
          id: "will-trust",
          name: "Will & Trust Services",
          description: "Ensure your assets are distributed according to your wishes",
          features: [
            "Professional will drafting",
            "Trust establishment and management",
            "Estate tax planning",
            "Asset protection strategies",
          ],
          recommended: false,
        },
        {
          id: "legacy-planning",
          name: "Legacy Planning",
          description: "Create a lasting financial legacy",
          features: [
            "Wealth transfer strategies",
            "Charitable giving options",
            "Family business succession planning",
            "Multi-generational wealth preservation",
          ],
          recommended: false,
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-truffle-800 mb-2">Plan Selection</h2>
        <p className="text-sm text-truffle-500">
          Select the financial plans that best meet the client's needs and goals.
        </p>
      </div>

      <Tabs defaultValue="protection" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          {planCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {planCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.plans.map((plan) => {
                const isSelected = selectedPlans.includes(plan.id)

                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      isSelected && "border-gold-400 bg-gold-50",
                    )}
                    onClick={() => togglePlan(plan.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold text-truffle-800">{plan.name}</CardTitle>
                        {plan.recommended && (
                          <div className="bg-gold-100 text-truffle-800 text-xs font-medium px-2 py-1 rounded-full border border-gold-200">
                            Recommended
                          </div>
                        )}
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-2 border-t">
                      <div
                        className={cn(
                          "w-full flex items-center justify-center p-2 rounded-lg font-medium text-sm",
                          isSelected ? "bg-gold-400 text-truffle-800" : "bg-late-100 text-truffle-500",
                        )}
                      >
                        {isSelected ? "Selected" : "Select Plan"}
                      </div>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex items-start gap-2 p-4 bg-late-50 border border-late-200 rounded-lg">
        <Info className="h-5 w-5 text-truffle-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-truffle-700">Plan Selection Guidance</h3>
          <p className="text-sm text-truffle-500 mt-1">
            Select plans based on the client's financial goals, risk tolerance, and current situation. Recommended plans
            are highlighted based on the information provided in previous steps.
          </p>
        </div>
      </div>

      <div className="p-4 border border-late-100 rounded-lg">
        <h3 className="text-lg font-medium text-truffle-700 mb-2">Selected Plans ({selectedPlans.length})</h3>

        {selectedPlans.length === 0 ? (
          <p className="text-sm text-truffle-500">No plans selected yet. Click on plans above to select them.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedPlans.map((planId) => {
              // Find the plan details
              let planDetails = null
              for (const category of planCategories) {
                const plan = category.plans.find((p) => p.id === planId)
                if (plan) {
                  planDetails = plan
                  break
                }
              }

              return planDetails ? (
                <div
                  key={planId}
                  className="bg-gold-100 text-truffle-800 px-3 py-1.5 rounded-lg border border-gold-200 text-sm font-medium"
                >
                  {planDetails.name}
                </div>
              ) : null
            })}
          </div>
        )}
      </div>
    </div>
  )
}

