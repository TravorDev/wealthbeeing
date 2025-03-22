"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash, ArrowDown, ArrowUp, Calculator, FileUp, Calendar, Copy, Check, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import { FinancialCsvImport } from "./financial-csv-import"

interface BalanceSheetFormProps {
  data: any
  updateData: (data: any) => void
}

export function BalanceSheetForm({ data, updateData }: BalanceSheetFormProps) {
  // Asset categories and subcategories
  const assetCategories = {
    "Cash & Equivalents": ["Checking Accounts", "Savings Accounts", "Money Market", "Certificates of Deposit", "Cash"],
    Investments: [
      "Stocks",
      "Bonds",
      "Mutual Funds",
      "ETFs",
      "Retirement Accounts",
      "Brokerage Accounts",
      "Other Investments",
    ],
    "Real Estate": ["Primary Residence", "Vacation Home", "Rental Properties", "Land", "Commercial Property"],
    "Personal Property": ["Vehicles", "Household Items", "Collectibles", "Jewelry", "Art", "Other Valuables"],
    "Business Interests": ["Business Ownership", "Partnerships", "Intellectual Property"],
    "Other Assets": ["Insurance Cash Value", "Trust Assets", "Inheritance", "Other"],
  }

  // Liability categories and subcategories
  const liabilityCategories = {
    "Secured Debt": ["Mortgage", "Home Equity Loan", "Auto Loan", "Other Secured Loans"],
    "Unsecured Debt": ["Credit Cards", "Personal Loans", "Student Loans", "Medical Debt"],
    "Business Debt": ["Business Loans", "Business Credit Lines", "Business Credit Cards"],
    "Other Liabilities": ["Taxes Owed", "Legal Obligations", "Other Debts"],
  }

  // Ownership options
  const ownershipOptions = [
    { value: "individual", label: "Individual" },
    { value: "joint", label: "Joint" },
    { value: "trust", label: "Trust" },
    { value: "business", label: "Business" },
  ]

  // State for assets and liabilities
  const [assets, setAssets] = useState(
    data.assets || [
      {
        mainCategory: "Cash & Equivalents",
        subCategory: "Checking Accounts",
        description: "Primary Checking",
        value: "",
        ownership: "individual",
        year: new Date().getFullYear().toString(),
        month: "1",
        isRecurring: true,
        monthlyValues: {},
      },
    ],
  )

  const [liabilities, setLiabilities] = useState(
    data.liabilities || [
      {
        mainCategory: "Secured Debt",
        subCategory: "Mortgage",
        description: "Primary Residence",
        value: "",
        interestRate: "",
        monthlyPayment: "",
        maturityDate: "",
        year: new Date().getFullYear().toString(),
        month: "1",
        isRecurring: true,
        monthlyValues: {},
      },
    ],
  )

  // State for UI controls
  const [activeTab, setActiveTab] = useState("assets")
  const [viewMode, setViewMode] = useState<"table" | "chart">("table")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [selectedMonth, setSelectedMonth] = useState("1") // January
  const [showCsvImport, setShowCsvImport] = useState(false)
  const [csvImportType, setCsvImportType] = useState<"assets" | "liabilities">("assets")
  const [timeView, setTimeView] = useState<"monthly" | "yearly">("monthly")

  // New state for monthly data entry
  const [showMonthlyDialog, setShowMonthlyDialog] = useState(false)
  const [currentEditItem, setCurrentEditItem] = useState<any>(null)
  const [currentEditIndex, setCurrentEditIndex] = useState<number>(-1)
  const [currentEditType, setCurrentEditType] = useState<"assets" | "liabilities">("assets")

  // Generate years (current year - 5 to current year + 5)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString())

  // Months for display
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  // Filter items by selected year and month
  const filteredAssets = assets.filter((item) => {
    if (timeView === "yearly") {
      return item.year === selectedYear
    } else {
      // For monthly view, show items that are either:
      // 1. Specifically for this month
      // 2. Recurring items that have a value for this month
      // 3. Recurring items that have a base amount
      return (
        (item.year === selectedYear && item.month === selectedMonth) ||
        (item.isRecurring && item.year === selectedYear && item.monthlyValues && item.monthlyValues[selectedMonth])
      )
    }
  })

  const filteredLiabilities = liabilities.filter((item) => {
    if (timeView === "yearly") {
      return item.year === selectedYear
    } else {
      // Same logic as assets
      return (
        (item.year === selectedYear && item.month === selectedMonth) ||
        (item.isRecurring && item.year === selectedYear && item.monthlyValues && item.monthlyValues[selectedMonth])
      )
    }
  })

  // Handle asset changes
  const addAsset = () => {
    const newAsset = {
      mainCategory: "Cash & Equivalents",
      subCategory: "Checking Accounts",
      description: "",
      value: "",
      ownership: "individual",
      year: selectedYear,
      month: selectedMonth,
      isRecurring: true,
      monthlyValues: {},
    }
    const newAssets = [newAsset, ...assets]
    setAssets(newAssets)
    updateData({ assets: newAssets })
  }

  const updateAsset = (index: number, field: string, value: string | boolean) => {
    const newAssets = [...assets]
    newAssets[index] = { ...newAssets[index], [field]: value }

    // If main category changes, update subcategory to first item in that category
    if (field === "mainCategory") {
      newAssets[index].subCategory = assetCategories[value as keyof typeof assetCategories][0]
    }

    setAssets(newAssets)
    updateData({ assets: newAssets })
  }

  const removeAsset = (index: number) => {
    const newAssets = assets.filter((_, i) => i !== index)
    setAssets(newAssets)
    updateData({ assets: newAssets })
  }

  // Handle liability changes
  const addLiability = () => {
    const newLiability = {
      mainCategory: "Secured Debt",
      subCategory: "Mortgage",
      description: "",
      value: "",
      interestRate: "",
      monthlyPayment: "",
      maturityDate: "",
      year: selectedYear,
      month: selectedMonth,
      isRecurring: true,
      monthlyValues: {},
    }
    const newLiabilities = [newLiability, ...liabilities]
    setLiabilities(newLiabilities)
    updateData({ liabilities: newLiabilities })
  }

  const updateLiability = (index: number, field: string, value: string | boolean) => {
    const newLiabilities = [...liabilities]
    newLiabilities[index] = { ...newLiabilities[index], [field]: value }

    // If main category changes, update subcategory to first item in that category
    if (field === "mainCategory") {
      newLiabilities[index].subCategory = liabilityCategories[value as keyof typeof liabilityCategories][0]
    }

    setLiabilities(newLiabilities)
    updateData({ liabilities: newLiabilities })
  }

  const removeLiability = (index: number) => {
    const newLiabilities = liabilities.filter((_, i) => i !== index)
    setLiabilities(newLiabilities)
    updateData({ liabilities: newLiabilities })
  }

  // Handle monthly values
  const openMonthlyDialog = (item: any, index: number, type: "assets" | "liabilities") => {
    setCurrentEditItem(JSON.parse(JSON.stringify(item))) // Deep copy to avoid reference issues
    setCurrentEditIndex(index)
    setCurrentEditType(type)
    setShowMonthlyDialog(true)
  }

  const updateMonthlyValue = (month: string, value: string) => {
    if (!currentEditItem) return

    const updatedItem = { ...currentEditItem }
    if (!updatedItem.monthlyValues) {
      updatedItem.monthlyValues = {}
    }
    updatedItem.monthlyValues[month] = value
    setCurrentEditItem(updatedItem)
  }

  const saveMonthlyValues = () => {
    if (currentEditType === "assets") {
      const newAssets = [...assets]
      newAssets[currentEditIndex] = currentEditItem
      setAssets(newAssets)
      updateData({ assets: newAssets })
    } else {
      const newLiabilities = [...liabilities]
      newLiabilities[currentEditIndex] = currentEditItem
      setLiabilities(newLiabilities)
      updateData({ liabilities: newLiabilities })
    }
    setShowMonthlyDialog(false)
  }

  const applyValueToAllMonths = () => {
    if (!currentEditItem) return

    const baseValue = currentEditItem.value || "0"
    const updatedItem = { ...currentEditItem }

    if (!updatedItem.monthlyValues) {
      updatedItem.monthlyValues = {}
    }

    // Apply the base amount to all months
    months.forEach((month) => {
      updatedItem.monthlyValues[month.value] = baseValue
    })

    setCurrentEditItem(updatedItem)
  }

  // Get the effective value for an item in a specific month
  const getMonthlyValue = (item: any, month: string) => {
    if (item.monthlyValues && item.monthlyValues[month]) {
      return item.monthlyValues[month]
    }

    // For recurring items without a specific monthly value, return the base value
    return item.isRecurring ? item.value : "0"
  }

  // Handle CSV import
  const handleOpenCsvImport = (type: "assets" | "liabilities") => {
    setCsvImportType(type)
    setShowCsvImport(true)
  }

  const handleCsvImport = (importedData: any[]) => {
    // Add isRecurring and monthlyValues to imported data
    const enhancedData = importedData.map((item) => ({
      ...item,
      isRecurring: true,
      monthlyValues: {},
      year: selectedYear,
      month: selectedMonth,
    }))

    if (csvImportType === "assets") {
      const newAssets = [...enhancedData, ...assets]
      setAssets(newAssets)
      updateData({ assets: newAssets })
    } else {
      const newLiabilities = [...enhancedData, ...liabilities]
      setLiabilities(newLiabilities)
      updateData({ liabilities: newLiabilities })
    }
  }

  // Calculate totals
  const calculateTotalAssets = () => {
    return filteredAssets.reduce((total, asset) => {
      return total + (Number.parseFloat(getMonthlyValue(asset, selectedMonth)) || 0)
    }, 0)
  }

  const calculateTotalLiabilities = () => {
    return filteredLiabilities.reduce((total, liability) => {
      return total + (Number.parseFloat(getMonthlyValue(liability, selectedMonth)) || 0)
    }, 0)
  }

  const calculateNetWorth = () => {
    return calculateTotalAssets() - calculateTotalLiabilities()
  }

  // Calculate asset allocation by category
  const calculateAssetsByCategory = () => {
    const result: Record<string, number> = {}

    filteredAssets.forEach((asset) => {
      const value = Number.parseFloat(getMonthlyValue(asset, selectedMonth)) || 0
      if (!result[asset.mainCategory]) {
        result[asset.mainCategory] = 0
      }
      result[asset.mainCategory] += value
    })

    return result
  }

  // Calculate liability allocation by category
  const calculateLiabilitiesByCategory = () => {
    const result: Record<string, number> = {}

    filteredLiabilities.forEach((liability) => {
      const value = Number.parseFloat(getMonthlyValue(liability, selectedMonth)) || 0
      if (!result[liability.mainCategory]) {
        result[liability.mainCategory] = 0
      }
      result[liability.mainCategory] += value
    })

    return result
  }

  // Prepare chart data
  const prepareAssetChartData = () => {
    const categoryTotals = calculateAssetsByCategory()
    return Object.entries(categoryTotals).map(([category, value]) => ({
      name: category,
      value,
    }))
  }

  const prepareLiabilityChartData = () => {
    const categoryTotals = calculateLiabilitiesByCategory()
    return Object.entries(categoryTotals).map(([category, value]) => ({
      name: category,
      value,
    }))
  }

  const prepareNetWorthChartData = () => {
    const totalAssets = calculateTotalAssets()
    const totalLiabilities = calculateTotalLiabilities()

    return [
      { name: "Assets", value: totalAssets },
      { name: "Liabilities", value: totalLiabilities },
    ]
  }

  // Prepare yearly trend data
  const prepareYearlyTrendData = () => {
    const data = []

    // Group by month
    for (let i = 1; i <= 12; i++) {
      const monthStr = i.toString()

      // Calculate monthly totals for this month
      const monthAssets = assets
        .filter((item) => item.year === selectedYear)
        .reduce((total, asset) => {
          return total + (Number.parseFloat(getMonthlyValue(asset, monthStr)) || 0)
        }, 0)

      const monthLiabilities = liabilities
        .filter((item) => item.year === selectedYear)
        .reduce((total, liability) => {
          return total + (Number.parseFloat(getMonthlyValue(liability, monthStr)) || 0)
        }, 0)

      const netWorth = monthAssets - monthLiabilities

      data.push({
        name: months.find((m) => m.value === monthStr)?.label || monthStr,
        assets: monthAssets,
        liabilities: monthLiabilities,
        netWorth: netWorth,
      })
    }

    return data
  }

  const totalAssets = calculateTotalAssets()
  const totalLiabilities = calculateTotalLiabilities()
  const netWorth = calculateNetWorth()

  // CSV import fields
  const assetFields = ["mainCategory", "subCategory", "description", "value", "ownership"]
  const liabilityFields = [
    "mainCategory",
    "subCategory",
    "description",
    "value",
    "interestRate",
    "monthlyPayment",
    "maturityDate",
  ]

  // Template data for CSV download
  const assetTemplateData = [
    {
      mainCategory: "Cash & Equivalents",
      subCategory: "Checking Accounts",
      description: "Primary Checking",
      value: "50000",
      ownership: "individual",
    },
    {
      mainCategory: "Investments",
      subCategory: "Stocks",
      description: "Stock Portfolio",
      value: "250000",
      ownership: "individual",
    },
  ]

  const liabilityTemplateData = [
    {
      mainCategory: "Secured Debt",
      subCategory: "Mortgage",
      description: "Primary Residence",
      value: "2000000",
      interestRate: "4.5",
      monthlyPayment: "12000",
      maturityDate: "2045-01-15",
    },
    {
      mainCategory: "Unsecured Debt",
      subCategory: "Credit Cards",
      description: "Credit Card Debt",
      value: "50000",
      interestRate: "18",
      monthlyPayment: "5000",
      maturityDate: "2024-12-31",
    },
  ]

  // Helper function to check if an item has monthly variations
  const hasMonthlyVariations = (item: any) => {
    if (!item.monthlyValues) return false

    const baseValue = item.value || "0"
    return Object.values(item.monthlyValues).some((value) => value !== baseValue)
  }

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"]
  const ASSET_COLOR = "#00C49F"
  const LIABILITY_COLOR = "#FF8042"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-truffle-800 mb-2">Balance Sheet</h2>
        <p className="text-sm text-truffle-500">
          Record the client's assets and liabilities to calculate their net worth and analyze their financial position.
        </p>
      </div>

      {/* Time Period Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={timeView === "monthly" ? "default" : "outline"}
              size="sm"
              className="rounded-lg"
              onClick={() => setTimeView("monthly")}
            >
              Monthly View
            </Button>
            <Button
              variant={timeView === "yearly" ? "default" : "outline"}
              size="sm"
              className="rounded-lg"
              onClick={() => setTimeView("yearly")}
            >
              Yearly View
            </Button>
          </div>

          {timeView === "monthly" && (
            <div className="flex items-center space-x-2">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[140px] rounded-lg">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px] rounded-lg">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            className="rounded-lg"
            onClick={() => setViewMode("table")}
          >
            Table
          </Button>
          <Button
            variant={viewMode === "chart" ? "default" : "outline"}
            size="sm"
            className="rounded-lg"
            onClick={() => setViewMode("chart")}
          >
            Chart
          </Button>
        </div>
      </div>

      {/* Balance Sheet Summary Card */}
      <Card className="bg-white border-late-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-truffle-700">Balance Sheet Summary</h3>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-truffle-500" />
              <span className="text-sm text-truffle-500">
                {timeView === "monthly"
                  ? `${months.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`
                  : `Year ${selectedYear}`}
              </span>
            </div>
          </div>

          {viewMode === "table" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-late-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-truffle-500">Total Assets</p>
                  <ArrowUp className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-xl font-semibold text-truffle-800">
                  ฿{totalAssets.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-truffle-500">{filteredAssets.length} asset entries</p>
              </div>

              <div className="bg-late-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-truffle-500">Total Liabilities</p>
                  <ArrowDown className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-xl font-semibold text-truffle-800">
                  ฿{totalLiabilities.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-truffle-500">{filteredLiabilities.length} liability entries</p>
              </div>

              <div className={`p-3 rounded-lg ${netWorth >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-truffle-500">Net Worth</p>
                  {netWorth >= 0 ? (
                    <ArrowUp className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className={`text-xl font-semibold ${netWorth >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  ฿{netWorth.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-truffle-500">
                  {netWorth >= 0 ? "Positive net worth" : "Negative net worth"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareNetWorthChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell key="cell-asset" fill={ASSET_COLOR} />
                      <Cell key="cell-liability" fill={LIABILITY_COLOR} />
                    </Pie>
                    <RechartsTooltip formatter={(value) => [`฿${Number(value).toLocaleString()}`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {timeView === "yearly" && (
                <div className="h-[300px]">
                  <h4 className="text-md font-medium text-truffle-700 mb-2">Monthly Trend for {selectedYear}</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareYearlyTrendData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => [`฿${Number(value).toLocaleString()}`, ""]} />
                      <Legend />
                      <Line type="monotone" dataKey="assets" stroke="#00C49F" name="Assets" />
                      <Line type="monotone" dataKey="liabilities" stroke="#FF8042" name="Liabilities" />
                      <Line type="monotone" dataKey="netWorth" stroke="#8884d8" name="Net Worth" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-truffle-700">Assets</h3>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => handleOpenCsvImport("assets")}
              >
                <FileUp className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addAsset}>
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </div>
          </div>

          {/* Asset Allocation Chart */}
          {filteredAssets.length > 0 && (
            <div className="h-[300px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareAssetChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {prepareAssetChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`฿${Number(value).toLocaleString()}`, ""]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Assets Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Category</TableHead>
                  <TableHead className="w-[180px]">Subcategory</TableHead>
                  <TableHead className="w-[250px]">Description</TableHead>
                  <TableHead className="w-[150px]">Base Value (฿)</TableHead>
                  <TableHead className="w-[150px]">Ownership</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-truffle-500">
                      No assets added yet. Click "Add Asset" to begin.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          value={asset.mainCategory}
                          onValueChange={(value) => updateAsset(assets.indexOf(asset), "mainCategory", value)}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(assetCategories).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={asset.subCategory}
                          onValueChange={(value) => updateAsset(assets.indexOf(asset), "subCategory", value)}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {assetCategories[asset.mainCategory as keyof typeof assetCategories]?.map((subCategory) => (
                              <SelectItem key={subCategory} value={subCategory}>
                                {subCategory}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={asset.description}
                          onChange={(e) => updateAsset(assets.indexOf(asset), "description", e.target.value)}
                          className="rounded-lg"
                          placeholder="e.g., Chase Checking, Primary Home"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={asset.value}
                            onChange={(e) => updateAsset(assets.indexOf(asset), "value", e.target.value)}
                            className="rounded-lg"
                            type="number"
                            min="0"
                            step="1000"
                          />
                          {hasMonthlyVariations(asset) && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex-shrink-0">
                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>This asset has monthly variations</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={asset.ownership}
                          onValueChange={(value) => updateAsset(assets.indexOf(asset), "ownership", value)}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ownershipOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-lg text-truffle-500 hover:text-truffle-700 hover:bg-truffle-50"
                            onClick={() => openMonthlyDialog(asset, assets.indexOf(asset), "assets")}
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeAsset(assets.indexOf(asset))}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="liabilities" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-truffle-700">Liabilities</h3>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => handleOpenCsvImport("liabilities")}
              >
                <FileUp className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addLiability}>
                <Plus className="h-4 w-4 mr-2" />
                Add Liability
              </Button>
            </div>
          </div>

          {/* Liability Allocation Chart */}
          {filteredLiabilities.length > 0 && (
            <div className="h-[300px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareLiabilityChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {prepareLiabilityChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`฿${Number(value).toLocaleString()}`, ""]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Liabilities Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Category</TableHead>
                  <TableHead className="w-[150px]">Subcategory</TableHead>
                  <TableHead className="w-[200px]">Description</TableHead>
                  <TableHead className="w-[120px]">Balance (฿)</TableHead>
                  <TableHead className="w-[100px]">Interest Rate (%)</TableHead>
                  <TableHead className="w-[120px]">Monthly Payment (฿)</TableHead>
                  <TableHead className="w-[120px]">Maturity Date</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLiabilities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-truffle-500">
                      No liabilities added yet. Click "Add Liability" to begin.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLiabilities.map((liability, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          value={liability.mainCategory}
                          onValueChange={(value) =>
                            updateLiability(liabilities.indexOf(liability), "mainCategory", value)
                          }
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(liabilityCategories).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={liability.subCategory}
                          onValueChange={(value) =>
                            updateLiability(liabilities.indexOf(liability), "subCategory", value)
                          }
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {liabilityCategories[liability.mainCategory as keyof typeof liabilityCategories]?.map(
                              (subCategory) => (
                                <SelectItem key={subCategory} value={subCategory}>
                                  {subCategory}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={liability.description}
                          onChange={(e) =>
                            updateLiability(liabilities.indexOf(liability), "description", e.target.value)
                          }
                          className="rounded-lg"
                          placeholder="e.g., Home Mortgage, Car Loan"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={liability.value}
                            onChange={(e) => updateLiability(liabilities.indexOf(liability), "value", e.target.value)}
                            className="rounded-lg"
                            type="number"
                            min="0"
                            step="1000"
                          />
                          {hasMonthlyVariations(liability) && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex-shrink-0">
                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>This liability has monthly variations</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={liability.interestRate}
                          onChange={(e) =>
                            updateLiability(liabilities.indexOf(liability), "interestRate", e.target.value)
                          }
                          className="rounded-lg"
                          type="number"
                          min="0"
                          step="0.1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={liability.monthlyPayment}
                          onChange={(e) =>
                            updateLiability(liabilities.indexOf(liability), "monthlyPayment", e.target.value)
                          }
                          className="rounded-lg"
                          type="number"
                          min="0"
                          step="100"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={liability.maturityDate}
                          onChange={(e) =>
                            updateLiability(liabilities.indexOf(liability), "maturityDate", e.target.value)
                          }
                          className="rounded-lg"
                          type="date"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-lg text-truffle-500 hover:text-truffle-700 hover:bg-truffle-50"
                            onClick={() => openMonthlyDialog(liability, liabilities.indexOf(liability), "liabilities")}
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeLiability(liabilities.indexOf(liability))}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Financial Ratios Analysis */}
      <Card className="bg-late-50 border-late-200">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium text-truffle-700 mb-4">Financial Ratios Analysis</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-truffle-700">Debt-to-Asset Ratio</p>
                <Calculator className="h-4 w-4 text-truffle-400" />
              </div>
              <p className="text-xl font-semibold text-truffle-800">
                {totalAssets > 0 ? ((totalLiabilities / totalAssets) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-truffle-500">
                {totalAssets > 0 && totalLiabilities / totalAssets <= 0.5
                  ? "Healthy ratio, less than 50% of assets financed by debt"
                  : "High ratio, more than 50% of assets financed by debt"}
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-truffle-700">Liquidity Ratio</p>
                <Calculator className="h-4 w-4 text-truffle-400" />
              </div>
              <p className="text-xl font-semibold text-truffle-800">
                {(() => {
                  const liquidAssets = filteredAssets
                    .filter((a) => a.mainCategory === "Cash & Equivalents")
                    .reduce((sum, a) => sum + (Number(getMonthlyValue(a, selectedMonth)) || 0), 0)

                  const shortTermLiabilities = filteredLiabilities
                    .filter((l) => l.mainCategory === "Unsecured Debt")
                    .reduce((sum, l) => sum + (Number(getMonthlyValue(l, selectedMonth)) || 0), 0)

                  return shortTermLiabilities > 0
                    ? (liquidAssets / shortTermLiabilities).toFixed(2)
                    : liquidAssets > 0
                      ? "∞"
                      : "0"
                })()}
              </p>
              <p className="text-xs text-truffle-500">
                {(() => {
                  const liquidAssets = filteredAssets
                    .filter((a) => a.mainCategory === "Cash & Equivalents")
                    .reduce((sum, a) => sum + (Number(getMonthlyValue(a, selectedMonth)) || 0), 0)

                  const shortTermLiabilities = filteredLiabilities
                    .filter((l) => l.mainCategory === "Unsecured Debt")
                    .reduce((sum, l) => sum + (Number(getMonthlyValue(l, selectedMonth)) || 0), 0)

                  const ratio =
                    shortTermLiabilities > 0
                      ? liquidAssets / shortTermLiabilities
                      : liquidAssets > 0
                        ? Number.POSITIVE_INFINITY
                        : 0

                  return ratio >= 1
                    ? "Good liquidity, can cover short-term obligations"
                    : "Low liquidity, may struggle to cover short-term obligations"
                })()}
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-truffle-700">Net Worth to Income Ratio</p>
                <Calculator className="h-4 w-4 text-truffle-400" />
              </div>
              <p className="text-xl font-semibold text-truffle-800">
                {(() => {
                  // This would need to be calculated using annual income from cashflow
                  const annualIncome = 1200000 // Placeholder value, should be from cashflow data
                  return annualIncome > 0 ? (netWorth / annualIncome).toFixed(2) : "0"
                })()}
              </p>
              <p className="text-xs text-truffle-500">
                {(() => {
                  const annualIncome = 1200000 // Placeholder value
                  const ratio = annualIncome > 0 ? netWorth / annualIncome : 0

                  if (ratio < 0) return "Negative ratio, focus on debt reduction"
                  if (ratio < 1) return "Low ratio, early wealth accumulation stage"
                  if (ratio < 5) return "Moderate ratio, building wealth"
                  return "Strong ratio, significant wealth accumulation"
                })()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Values Dialog */}
      <Dialog open={showMonthlyDialog} onOpenChange={setShowMonthlyDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {currentEditType === "assets" ? "Asset" : "Liability"} Monthly Values for {selectedYear}
            </DialogTitle>
            <DialogDescription>
              Set specific values for each month or use the base value for all months.
            </DialogDescription>
          </DialogHeader>

          {currentEditItem && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">
                    {currentEditType === "assets"
                      ? `${currentEditItem.mainCategory} - ${currentEditItem.subCategory}: ${currentEditItem.description || "No description"}`
                      : `${currentEditItem.mainCategory} - ${currentEditItem.subCategory}: ${currentEditItem.description || "No description"}`}
                  </h4>
                  <p className="text-sm text-truffle-500">Base value: ฿{currentEditItem.value || "0"}</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={applyValueToAllMonths}>
                  <Copy className="h-4 w-4 mr-2" />
                  Apply Base Value to All Months
                </Button>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {months.map((month) => (
                  <div key={month.value} className="space-y-2">
                    <Label htmlFor={`month-${month.value}`} className="text-sm">
                      {month.label}
                    </Label>
                    <Input
                      id={`month-${month.value}`}
                      value={currentEditItem.monthlyValues?.[month.value] || currentEditItem.value || ""}
                      onChange={(e) => updateMonthlyValue(month.value, e.target.value)}
                      type="number"
                      min="0"
                      step="1000"
                      className="rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowMonthlyDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveMonthlyValues}>
              <Check className="h-4 w-4 mr-2" />
              Save Monthly Values
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Import Dialog */}
      <FinancialCsvImport
        open={showCsvImport}
        onOpenChange={setShowCsvImport}
        onImport={handleCsvImport}
        fields={csvImportType === "assets" ? assetFields : liabilityFields}
        type="balance-sheet"
        templateData={csvImportType === "assets" ? assetTemplateData : liabilityTemplateData}
      />
    </div>
  )
}

