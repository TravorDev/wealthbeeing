"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpRight,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Gift,
  Mail,
  MapPin,
  Phone,
  User,
  Globe,
  Wallet,
  Activity,
  Target,
  Home,
  Shield,
  Heart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PieChart as PieChartComponent, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { BarChart as BarChartComponent, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

// Mock client data
const clientDetails = {
  CLT001: {
    personal: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+66 81 234 5678",
      dateOfBirth: "1980-05-15",
      age: 44,
      occupation: "Business Owner",
      nationality: "Thai",
    },
    address: {
      line1: "123 Sukhumvit Road",
      line2: "Apartment 45B",
      city: "Bangkok",
      state: "Bangkok",
      postalCode: "10110",
      country: "Thailand",
    },
    financial: {
      aum: "฿4,500,000",
      incomeRange: "฿2,000,000 - ฿5,000,000",
      netWorth: "฿10,000,000 - ฿50,000,000",
      riskTolerance: "Moderate",
      investmentGoals: "Retirement, Education",
    },
    plans: [
      { type: "education", name: "Education Plan", value: "฿1,500,000" },
      { type: "retirement", name: "Retirement Plan", value: "฿2,000,000" },
      { type: "protection", name: "Protection Plan", value: "฿1,000,000" },
    ],
    upcomingEvents: [
      { type: "meeting", date: "2024-03-25", title: "Quarterly Review" },
      { type: "payment", date: "2024-04-10", title: "Protection Plan Payment" },
      { type: "birthday", date: "2024-05-15", title: "Client Birthday" },
    ],
    cashflow: {
      monthlyIncome: 180000,
      monthlyExpenses: 120000,
      monthlySurplus: 60000,
      savingsRate: 33.3,
    },
    balanceSheet: {
      totalAssets: 15000000,
      totalLiabilities: 5000000,
      netWorth: 10000000,
      assetAllocation: [
        { name: "Cash & Equivalents", value: 2000000, color: "#0088FE" },
        { name: "Investments", value: 5000000, color: "#00C49F" },
        { name: "Real Estate", value: 7000000, color: "#FFBB28" },
        { name: "Personal Property", value: 1000000, color: "#FF8042" },
      ],
    },
    insurance: {
      policies: [
        {
          category: "Life Insurance",
          subCategory: "Term Life",
          provider: "AIA",
          coverageAmount: 5000000,
          premium: 45000,
          frequency: "annual",
          expiryDate: "2034-05-15",
        },
        {
          category: "Health Insurance",
          subCategory: "Medical",
          provider: "AXA",
          coverageAmount: 1000000,
          premium: 30000,
          frequency: "annual",
          expiryDate: "2025-01-10",
        },
        {
          category: "Property Insurance",
          subCategory: "Homeowners",
          provider: "Allianz",
          coverageAmount: 7000000,
          premium: 15000,
          frequency: "annual",
          expiryDate: "2025-03-20",
        },
      ],
      totalCoverage: 13000000,
      totalAnnualPremium: 90000,
    },
    goals: {
      shortTerm: [
        { description: "Emergency Fund", targetDate: "2024-12-31", estimatedCost: 500000, priority: "high" },
        { description: "Family Vacation", targetDate: "2025-04-15", estimatedCost: 300000, priority: "medium" },
      ],
      mediumTerm: [
        { description: "Child's Education", targetDate: "2028-08-01", estimatedCost: 2000000, priority: "high" },
        { description: "Home Renovation", targetDate: "2027-06-30", estimatedCost: 1500000, priority: "medium" },
      ],
      longTerm: [
        { description: "Retirement", targetDate: "2040-05-15", estimatedCost: 20000000, priority: "high" },
        { description: "Vacation Home", targetDate: "2035-01-01", estimatedCost: 10000000, priority: "low" },
      ],
    },
    taxPlanning: {
      filingStatus: "Married Filing Jointly",
      taxBracket: "30%",
      deductions: [
        { type: "Mortgage Interest", amount: 120000 },
        { type: "Retirement Contributions", amount: 200000 },
        { type: "Charitable Donations", amount: 50000 },
      ],
      credits: [{ type: "Child Tax Credit", amount: 30000 }],
      totalDeductions: 370000,
      estimatedTaxSavings: 111000,
    },
  },
  // Add other clients as needed
}

// Event type configurations
const eventTypeConfig = {
  meeting: {
    icon: Calendar,
    color: "bg-blue-100 text-blue-800 border border-blue-200",
  },
  birthday: {
    icon: Gift,
    color: "bg-gold-100 text-truffle-800 border border-gold-200",
  },
  payment: {
    icon: CreditCard,
    color: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  },
  renewal: {
    icon: FileText,
    color: "bg-purple-100 text-purple-800 border border-purple-200",
  },
}

// Plan type configurations
const planTypeConfig = {
  education: { color: "bg-blue-100 text-blue-800 border border-blue-200" },
  retirement: { color: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
  protection: { color: "bg-gold-100 text-truffle-800 border border-gold-200" },
  health: { color: "bg-purple-100 text-purple-800 border border-purple-200" },
}

interface ClientOverviewProps {
  clientId: string
}

export function ClientOverview({ clientId }: ClientOverviewProps) {
  // Get client data
  const client = clientDetails[clientId as keyof typeof clientDetails] || {
    personal: {
      name: "Unknown Client",
      email: "unknown@example.com",
      phone: "N/A",
      dateOfBirth: "N/A",
      age: "N/A",
      occupation: "N/A",
      nationality: "N/A",
    },
    address: {
      line1: "N/A",
      line2: "",
      city: "N/A",
      state: "N/A",
      postalCode: "N/A",
      country: "N/A",
    },
    financial: {
      aum: "฿0",
      incomeRange: "N/A",
      netWorth: "N/A",
      riskTolerance: "N/A",
      investmentGoals: "N/A",
    },
    plans: [],
    upcomingEvents: [],
    cashflow: {
      monthlyIncome: 0,
      monthlyExpenses: 0,
      monthlySurplus: 0,
      savingsRate: 0,
    },
    balanceSheet: {
      totalAssets: 0,
      totalLiabilities: 0,
      netWorth: 0,
      assetAllocation: [],
    },
    insurance: {
      policies: [],
      totalCoverage: 0,
      totalAnnualPremium: 0,
    },
    goals: {
      shortTerm: [],
      mediumTerm: [],
      longTerm: [],
    },
    taxPlanning: {
      filingStatus: "N/A",
      taxBracket: "N/A",
      deductions: [],
      credits: [],
      totalDeductions: 0,
      estimatedTaxSavings: 0,
    },
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <Card className="premium-card shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-truffle-800">Client Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="cashflow">Cashflow</TabsTrigger>
            <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="tax">Tax Planning</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-truffle-800">Personal Details</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-truffle-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-truffle-700">Full Name</p>
                      <p className="text-sm text-truffle-500">{client.personal.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-truffle-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-truffle-700">Email</p>
                      <p className="text-sm text-truffle-500">{client.personal.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-truffle-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-truffle-700">Phone</p>
                      <p className="text-sm text-truffle-500">{client.personal.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-truffle-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-truffle-700">Date of Birth</p>
                      <p className="text-sm text-truffle-500">
                        {client.personal.dateOfBirth !== "N/A"
                          ? `${formatDate(client.personal.dateOfBirth)} (${client.personal.age} years old)`
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-truffle-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-truffle-700">Occupation</p>
                      <p className="text-sm text-truffle-500">{client.personal.occupation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-truffle-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-truffle-700">Nationality</p>
                      <p className="text-sm text-truffle-500">{client.personal.nationality}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-truffle-800">Address</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-truffle-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-truffle-700">Address</p>
                      <p className="text-sm text-truffle-500">{client.address.line1}</p>
                      {client.address.line2 && <p className="text-sm text-truffle-500">{client.address.line2}</p>}
                      <p className="text-sm text-truffle-500">
                        {client.address.city}, {client.address.state} {client.address.postalCode}
                      </p>
                      <p className="text-sm text-truffle-500">{client.address.country}</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-truffle-800 mt-6">Upcoming Events</h3>
                <div className="space-y-2">
                  {client.upcomingEvents.length > 0 ? (
                    client.upcomingEvents.map((event, index) => {
                      const { icon: Icon, color } =
                        eventTypeConfig[event.type as keyof typeof eventTypeConfig] || eventTypeConfig.meeting

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border border-late-100 hover:bg-late-50 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg", color)}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium text-truffle-700">{event.title}</p>
                              <p className="text-sm text-truffle-500">{formatDate(event.date)}</p>
                            </div>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-truffle-400" />
                        </div>
                      )
                    })
                  ) : (
                    <div className="p-4 text-center border border-dashed border-late-200 rounded-lg">
                      <p className="text-truffle-500">No upcoming events</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-truffle-800">Financial Overview</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-truffle-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-truffle-700">Assets Under Management</p>
                      <p className="text-sm text-truffle-500">{client.financial.aum}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ArrowUpRight className="h-5 w-5 text-truffle-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-truffle-700">Annual Income Range</p>
                      <p className="text-sm text-truffle-500">{client.financial.incomeRange}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Wallet className="h-5 w-5 text-truffle-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-truffle-700">Estimated Net Worth</p>
                      <p className="text-sm text-truffle-500">{client.financial.netWorth}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Activity className="h-5 w-5 text-truffle-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-truffle-700">Risk Tolerance</p>
                      <p className="text-sm text-truffle-500">{client.financial.riskTolerance}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-truffle-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-truffle-700">Investment Goals</p>
                      <p className="text-sm text-truffle-500">{client.financial.investmentGoals}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-truffle-800">Active Plans</h3>

                {client.plans.length > 0 ? (
                  <div className="space-y-3">
                    {client.plans.map((plan, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-late-100 hover:bg-late-50 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Badge
                            className={cn(
                              "rounded-lg shadow-sm",
                              planTypeConfig[plan.type as keyof typeof planTypeConfig]?.color || "bg-gray-100",
                            )}
                          >
                            {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                          </Badge>
                          <div>
                            <p className="font-medium text-truffle-700">{plan.name}</p>
                            <p className="text-sm text-truffle-500">{plan.value}</p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-truffle-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center border border-dashed border-late-200 rounded-lg">
                    <p className="text-truffle-500">No active plans</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cashflow" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <h3 className="text-lg font-medium text-truffle-800 mb-4">Cashflow Summary</h3>

                <div className="h-[250px] mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChartComponent
                      data={[
                        { name: "Income", amount: client.cashflow.monthlyIncome },
                        { name: "Expenses", amount: client.cashflow.monthlyExpenses },
                        { name: "Surplus", amount: client.cashflow.monthlySurplus },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`฿${Number(value).toLocaleString()}`, ""]} />
                      <Bar dataKey="amount" name="Amount (฿)" fill="#8884d8" />
                    </BarChartComponent>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-late-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-truffle-500">Monthly Income</p>
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-xl font-semibold text-truffle-800">
                  ฿{client.cashflow.monthlyIncome.toLocaleString()}
                </p>
                <p className="text-xs text-truffle-500">
                  Annual: ฿{(client.cashflow.monthlyIncome * 12).toLocaleString()}
                </p>
              </div>

              <div className="bg-late-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-truffle-500">Monthly Expenses</p>
                  <ArrowDown className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-xl font-semibold text-truffle-800">
                  ฿{client.cashflow.monthlyExpenses.toLocaleString()}
                </p>
                <p className="text-xs text-truffle-500">
                  Annual: ฿{(client.cashflow.monthlyExpenses * 12).toLocaleString()}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${client.cashflow.monthlySurplus >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-truffle-500">Monthly Surplus/Deficit</p>
                  {client.cashflow.monthlySurplus >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p
                  className={`text-xl font-semibold ${client.cashflow.monthlySurplus >= 0 ? "text-emerald-600" : "text-red-600"}`}
                >
                  {client.cashflow.monthlySurplus >= 0 ? "+" : ""}฿{client.cashflow.monthlySurplus.toLocaleString()}
                </p>
                <p className="text-xs text-truffle-500">Savings Rate: {client.cashflow.savingsRate}%</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="balance-sheet" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <h3 className="text-lg font-medium text-truffle-800 mb-4">Balance Sheet Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChartComponent>
                        <Pie
                          data={client.balanceSheet.assetAllocation}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {client.balanceSheet.assetAllocation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`฿${Number(value).toLocaleString()}`, ""]} />
                        <Legend />
                      </PieChartComponent>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-late-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-truffle-500">Total Assets</p>
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      </div>
                      <p className="text-xl font-semibold text-truffle-800">
                        ฿{client.balanceSheet.totalAssets.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-late-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-truffle-500">Total Liabilities</p>
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      </div>
                      <p className="text-xl font-semibold text-truffle-800">
                        ฿{client.balanceSheet.totalLiabilities.toLocaleString()}
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-lg ${client.balanceSheet.netWorth >= 0 ? "bg-emerald-50" : "bg-red-50"}`}
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-truffle-500">Net Worth</p>
                        {client.balanceSheet.netWorth >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p
                        className={`text-xl font-semibold ${client.balanceSheet.netWorth >= 0 ? "text-emerald-600" : "text-red-600"}`}
                      >
                        ฿{client.balanceSheet.netWorth.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insurance" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-truffle-800 mb-4">Insurance Summary</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-late-50 p-3 rounded-lg">
                    <p className="text-sm text-truffle-500">Total Policies</p>
                    <p className="text-xl font-semibold text-truffle-800">{client.insurance.policies.length}</p>
                  </div>
                  <div className="bg-late-50 p-3 rounded-lg">
                    <p className="text-sm text-truffle-500">Annual Premium</p>
                    <p className="text-xl font-semibold text-truffle-800">
                      ฿{client.insurance.totalAnnualPremium.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-late-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-truffle-500">Total Coverage</p>
                  <p className="text-xl font-semibold text-truffle-800">
                    ฿{client.insurance.totalCoverage.toLocaleString()}
                  </p>
                </div>

                <h4 className="text-md font-medium text-truffle-700 mb-2">Coverage Analysis</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-late-100">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-800 border border-blue-200">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-truffle-700">Life Insurance</p>
                        <p className="text-sm text-truffle-500">
                          {client.insurance.policies.some((p) => p.category === "Life Insurance")
                            ? `Coverage: ฿${client.insurance.policies
                                .filter((p) => p.category === "Life Insurance")
                                .reduce((sum, p) => sum + p.coverageAmount, 0)
                                .toLocaleString()}`
                            : "No life insurance coverage detected"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-late-100">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <Heart className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-truffle-700">Health Insurance</p>
                        <p className="text-sm text-truffle-500">
                          {client.insurance.policies.some((p) => p.category === "Health Insurance")
                            ? `Coverage: ฿${client.insurance.policies
                                .filter((p) => p.category === "Health Insurance")
                                .reduce((sum, p) => sum + p.coverageAmount, 0)
                                .toLocaleString()}`
                            : "No health insurance coverage detected"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-late-100">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-gold-100 text-truffle-800 border border-gold-200">
                        <Home className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-truffle-700">Property Insurance</p>
                        <p className="text-sm text-truffle-500">
                          {client.insurance.policies.some((p) => p.category === "Property Insurance")
                            ? `Coverage: ฿${client.insurance.policies
                                .filter((p) => p.category === "Property Insurance")
                                .reduce((sum, p) => sum + p.coverageAmount, 0)
                                .toLocaleString()}`
                            : "No property insurance coverage detected"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-truffle-800 mb-4">Policy Details</h3>

                {client.insurance.policies.length > 0 ? (
                  <div className="space-y-3">
                    {client.insurance.policies.map((policy, index) => (
                      <div
                        key={index}
                        className="p-3 border border-late-100 rounded-lg hover:bg-late-50 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            className={`rounded-lg ${
                              policy.category === "Life Insurance"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : policy.category === "Health Insurance"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : policy.category === "Property Insurance"
                                    ? "bg-gold-100 text-truffle-800 border border-gold-200"
                                    : "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}
                          >
                            {policy.subCategory}
                          </Badge>
                          <p className="text-xs text-truffle-500">{policy.provider}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-truffle-500">Coverage</p>
                            <p className="font-medium text-truffle-700">฿{policy.coverageAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-truffle-500">Premium</p>
                            <p className="font-medium text-truffle-700">
                              ฿{policy.premium.toLocaleString()} ({policy.frequency})
                            </p>
                          </div>
                          <div>
                            <p className="text-truffle-500">Expiry Date</p>
                            <p className="font-medium text-truffle-700">{formatDate(policy.expiryDate)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center border border-dashed border-late-200 rounded-lg">
                    <p className="text-truffle-500">No insurance policies found</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium text-truffle-800 mb-4">Short-Term Goals (0-2 years)</h3>

                {client.goals.shortTerm.length > 0 ? (
                  <div className="space-y-3">
                    {client.goals.shortTerm.map((goal, index) => (
                      <div
                        key={index}
                        className="p-3 border border-late-100 rounded-lg hover:bg-late-50 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-truffle-700">{goal.description}</p>
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

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-truffle-500">Target Date</p>
                            <p className="font-medium text-truffle-700">{formatDate(goal.targetDate)}</p>
                          </div>
                          <div>
                            <p className="text-truffle-500">Estimated Cost</p>
                            <p className="font-medium text-truffle-700">฿{goal.estimatedCost.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center border border-dashed border-late-200 rounded-lg">
                    <p className="text-truffle-500">No short-term goals defined</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-truffle-800 mb-4">Medium-Term Goals (2-5 years)</h3>

                {client.goals.mediumTerm.length > 0 ? (
                  <div className="space-y-3">
                    {client.goals.mediumTerm.map((goal, index) => (
                      <div
                        key={index}
                        className="p-3 border border-late-100 rounded-lg hover:bg-late-50 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-truffle-700">{goal.description}</p>
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

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-truffle-500">Target Date</p>
                            <p className="font-medium text-truffle-700">{formatDate(goal.targetDate)}</p>
                          </div>
                          <div>
                            <p className="text-truffle-500">Estimated Cost</p>
                            <p className="font-medium text-truffle-700">฿{goal.estimatedCost.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center border border-dashed border-late-200 rounded-lg">
                    <p className="text-truffle-500">No medium-term goals defined</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-truffle-800 mb-4">Long-Term Goals (5+ years)</h3>

                {client.goals.longTerm.length > 0 ? (
                  <div className="space-y-3">
                    {client.goals.longTerm.map((goal, index) => (
                      <div
                        key={index}
                        className="p-3 border border-late-100 rounded-lg hover:bg-late-50 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-truffle-700">{goal.description}</p>
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

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-truffle-500">Target Date</p>
                            <p className="font-medium text-truffle-700">{formatDate(goal.targetDate)}</p>
                          </div>
                          <div>
                            <p className="text-truffle-500">Estimated Cost</p>
                            <p className="font-medium text-truffle-700">฿{goal.estimatedCost.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center border border-dashed border-late-200 rounded-lg">
                    <p className="text-truffle-500">No long-term goals defined</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tax" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-truffle-800 mb-4">Tax Status</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-late-50 p-3 rounded-lg">
                    <p className="text-sm text-truffle-500">Filing Status</p>
                    <p className="text-xl font-semibold text-truffle-800">{client.taxPlanning.filingStatus}</p>
                  </div>
                  <div className="bg-late-50 p-3 rounded-lg">
                    <p className="text-sm text-truffle-500">Tax Bracket</p>
                    <p className="text-xl font-semibold text-truffle-800">{client.taxPlanning.taxBracket}</p>
                  </div>
                </div>

                <div className="bg-late-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-truffle-500">Total Deductions</p>
                  <p className="text-xl font-semibold text-truffle-800">
                    ฿{client.taxPlanning.totalDeductions.toLocaleString()}
                  </p>
                </div>

                <div className="bg-emerald-50 p-3 rounded-lg">
                  <p className="text-sm text-truffle-500">Estimated Tax Savings</p>
                  <p className="text-xl font-semibold text-emerald-600">
                    ฿{client.taxPlanning.estimatedTaxSavings.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-truffle-800 mb-4">Tax Planning Details</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium text-truffle-700 mb-2">Tax Deductions</h4>
                    {client.taxPlanning.deductions.length > 0 ? (
                      <div className="space-y-2">
                        {client.taxPlanning.deductions.map((deduction, index) => (
                          <div key={index} className="flex justify-between p-2 border-b border-late-100">
                            <p className="text-sm text-truffle-700">{deduction.type}</p>
                            <p className="text-sm font-medium text-truffle-700">฿{deduction.amount.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-truffle-500">No tax deductions recorded</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-truffle-700 mb-2">Tax Credits</h4>
                    {client.taxPlanning.credits.length > 0 ? (
                      <div className="space-y-2">
                        {client.taxPlanning.credits.map((credit, index) => (
                          <div key={index} className="flex justify-between p-2 border-b border-late-100">
                            <p className="text-sm text-truffle-700">{credit.type}</p>
                            <p className="text-sm font-medium text-truffle-700">฿{credit.amount.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-truffle-500">No tax credits recorded</p>
                    )}
                  </div>

                  <div className="p-3 bg-late-50 rounded-lg">
                    <h4 className="text-md font-medium text-truffle-700 mb-2">Tax Planning Recommendations</h4>
                    <ul className="text-sm text-truffle-500 space-y-1 list-disc pl-4">
                      <li>Consider maximizing retirement contributions to reduce taxable income</li>
                      <li>Explore tax-advantaged investment options</li>
                      <li>Review timing of income and deductions for optimal tax planning</li>
                      <li>Consider charitable giving strategies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

