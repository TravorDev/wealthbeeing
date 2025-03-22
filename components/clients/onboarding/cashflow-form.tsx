"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Plus,
  Trash,
  ArrowDown,
  ArrowUp,
  Calculator,
  DollarSign,
  FileUp,
  Calendar,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react"
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { FinancialCsvImport } from "./financial-csv-import"

interface CashflowFormProps {
  data: any
  updateData: (data: any) => void
}

export function CashflowForm({ data, updateData }: CashflowFormProps) {
  // Income categories
  const incomeCategories = [
    "Salary/Wages",
    "Self-Employment",
    "Investment Income",
    "Rental Income",
    "Pension/Retirement",
    "Social Security",
    "Alimony/Child Support",
    "Bonus/Commission",
    "Other Income",
  ]

  // Expense categories
  const expenseCategories = {
    Housing: ["Mortgage/Rent", "Property Tax", "Home Insurance", "Utilities", "Maintenance/Repairs", "HOA Fees"],
    Transportation: ["Car Payment", "Fuel", "Insurance", "Maintenance", "Public Transit", "Parking"],
    Food: ["Groceries", "Dining Out", "Delivery Services"],
    Healthcare: ["Insurance Premium", "Out-of-Pocket Expenses", "Prescriptions", "Fitness"],
    Personal: ["Clothing", "Personal Care", "Entertainment", "Subscriptions", "Education", "Childcare"],
    Financial: ["Debt Payments", "Savings", "Investments", "Insurance Premiums", "Taxes"],
    Miscellaneous: ["Gifts/Donations", "Vacations", "Hobbies", "Other Expenses"],
  }

  // Frequency options
  const frequencyOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "annual", label: "Annual" },
    { value: "quarterly", label: "Quarterly" },
    { value: "biweekly", label: "Bi-Weekly" },
    { value: "weekly", label: "Weekly" },
    { value: "oneTime", label: "One-Time" },
  ]

  // Expense type options
  const expenseTypeOptions = [
    { value: "fixed", label: "Fixed" },
    { value: "variable", label: "Variable" },
    { value: "discretionary", label: "Discretionary" },
  ]

  // State for income and expense items
  const [incomeItems, setIncomeItems] = useState(
    data.incomeItems || [
      {
        category: "Salary/Wages",
        description: "Primary Employment",
        amount: "",
        frequency: "monthly",
        year: new Date().getFullYear().toString(),
        month: "1",
        isRecurring: true,
        monthlyValues: {},
      },
    ],
  )

  const [expenseItems, setExpenseItems] = useState(
    data.expenseItems || [
      {
        mainCategory: "Housing",
        subCategory: "Mortgage/Rent",
        amount: "",
        type: "fixed",
        year: new Date().getFullYear().toString(),
        month: "1",
        isRecurring: true,
        monthlyValues: {},
      },
      {
        mainCategory: "Transportation",
        subCategory: "Car Payment",
        amount: "",
        type: "fixed",
        year: new Date().getFullYear().toString(),
        month: "1",
        isRecurring: true,
        monthlyValues: {},
      },
      {
        mainCategory: "Food",
        subCategory: "Groceries",
        amount: "",
        type: "variable",
        year: new Date().getFullYear().toString(),
        month: "1",
        isRecurring: true,
        monthlyValues: {},
      },
    ],
  )

  // State for UI controls
  const [activeTab, setActiveTab] = useState("income")
  const [viewMode, setViewMode] = useState<"table" | "chart">("table")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [selectedMonth, setSelectedMonth] = useState("1") // January
  const [showCsvImport, setShowCsvImport] = useState(false)
  const [csvImportType, setCsvImportType] = useState<"income" | "expense">("income")
  const [timeView, setTimeView] = useState<"monthly" | "yearly">("monthly")

  // New state for monthly data entry
  const [showMonthlyDialog, setShowMonthlyDialog] = useState(false)
  const [currentEditItem, setCurrentEditItem] = useState<any>(null)
  const [currentEditIndex, setCurrentEditIndex] = useState<number>(-1)
  const [currentEditType, setCurrentEditType] = useState<"income" | "expense">("income")

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
  const filteredIncomeItems = incomeItems.filter((item) => {
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

  const filteredExpenseItems = expenseItems.filter((item) => {
    if (timeView === "yearly") {
      return item.year === selectedYear
    } else {
      // Same logic as income items
      return (
        (item.year === selectedYear && item.month === selectedMonth) ||
        (item.isRecurring && item.year === selectedYear && item.monthlyValues && item.monthlyValues[selectedMonth])
      )
    }
  })

  // Handle income changes
  const addIncomeItem = () => {
    const newIncomeItem = {
      category: "Salary/Wages",
      description: "",
      amount: "",
      frequency: "monthly",
      year: selectedYear,
      month: selectedMonth,
      isRecurring: true,
      monthlyValues: {},
    }
    const newIncomeItems = [newIncomeItem, ...incomeItems]
    setIncomeItems(newIncomeItems)
    updateData({ incomeItems: newIncomeItems })
  }

  const updateIncomeItem = (index: number, field: string, value: string | boolean) => {
    const newIncomeItems = [...incomeItems]
    newIncomeItems[index] = { ...newIncomeItems[index], [field]: value }
    setIncomeItems(newIncomeItems)
    updateData({ incomeItems: newIncomeItems })
  }

  const removeIncomeItem = (index: number) => {
    const newIncomeItems = incomeItems.filter((_, i) => i !== index)
    setIncomeItems(newIncomeItems)
    updateData({ incomeItems: newIncomeItems })
  }

  // Handle expense changes
  const addExpenseItem = () => {
    const newExpenseItem = {
      mainCategory: "Housing",
      subCategory: "Mortgage/Rent",
      amount: "",
      type: "fixed",
      year: selectedYear,
      month: selectedMonth,
      isRecurring: true,
      monthlyValues: {},
    }
    const newExpenseItems = [newExpenseItem, ...expenseItems]
    setExpenseItems(newExpenseItems)
    updateData({ expenseItems: newExpenseItems })
  }

  const updateExpenseItem = (index: number, field: string, value: string | boolean) => {
    const newExpenseItems = [...expenseItems]
    newExpenseItems[index] = { ...newExpenseItems[index], [field]: value }

    // If main category changes, update subcategory to first item in that category
    if (field === "mainCategory") {
      newExpenseItems[index].subCategory = expenseCategories[value as keyof typeof expenseCategories][0]
    }

    setExpenseItems(newExpenseItems)
    updateData({ expenseItems: newExpenseItems })
  }

  const removeExpenseItem = (index: number) => {
    const newExpenseItems = expenseItems.filter((_, i) => i !== index)
    setExpenseItems(newExpenseItems)
    updateData({ expenseItems: newExpenseItems })
  }

  // Handle monthly values
  const openMonthlyDialog = (item: any, index: number, type: "income" | "expense") => {
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
    if (currentEditType === "income") {
      const newIncomeItems = [...incomeItems]
      newIncomeItems[currentEditIndex] = currentEditItem
      setIncomeItems(newIncomeItems)
      updateData({ incomeItems: newIncomeItems })
    } else {
      const newExpenseItems = [...expenseItems]
      newExpenseItems[currentEditIndex] = currentEditItem
      setExpenseItems(newExpenseItems)
      updateData({ expenseItems: newExpenseItems })
    }
    setShowMonthlyDialog(false)
  }

  const applyValueToAllMonths = () => {
    if (!currentEditItem) return

    const baseAmount = currentEditItem.amount || "0"
    const updatedItem = { ...currentEditItem }

    if (!updatedItem.monthlyValues) {
      updatedItem.monthlyValues = {}
    }

    // Apply the base amount to all months
    months.forEach((month) => {
      updatedItem.monthlyValues[month.value] = baseAmount
    })

    setCurrentEditItem(updatedItem)
  }

  // Get the effective amount for an item in a specific month
  const getMonthlyAmount = (item: any, month: string) => {
    if (item.monthlyValues && item.monthlyValues[month]) {
      return item.monthlyValues[month]
    }

    // For one-time items, only return the amount if it's for the specific month
    if (item.frequency === "oneTime") {
      return item.month === month ? item.amount : "0"
    }

    // For recurring items without a specific monthly value, return the base amount
    return item.isRecurring ? item.amount : "0"
  }

  // Handle CSV import
  const handleOpenCsvImport = (type: "income" | "expense") => {
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

    if (csvImportType === "income") {
      const newIncomeItems = [...enhancedData, ...incomeItems]
      setIncomeItems(newIncomeItems)
      updateData({ incomeItems: newIncomeItems })
    } else {
      const newExpenseItems = [...enhancedData, ...expenseItems]
      setExpenseItems(newExpenseItems)
      updateData({ expenseItems: newExpenseItems })
    }
  }

  // Calculate totals for the selected period
  const calculateMonthlyIncome = () => {
    return filteredIncomeItems.reduce((total, item) => {
      const amount = Number.parseFloat(getMonthlyAmount(item, selectedMonth)) || 0
      if (item.frequency === "annual") {
        return total + amount / 12
      } else if (item.frequency === "quarterly") {
        return total + amount / 3
      } else if (item.frequency === "weekly") {
        return total + (amount * 52) / 12
      } else if (item.frequency === "biweekly") {
        return total + (amount * 26) / 12
      } else if (item.frequency === "oneTime") {
        // For one-time income, we'll count it fully in the month it occurs
        return total + amount
      }
      return total + amount
    }, 0)
  }

  const calculateAnnualIncome = () => {
    if (timeView === "yearly") {
      // Sum up all monthly incomes for the year
      let annualTotal = 0
      months.forEach((month) => {
        const monthlyTotal = incomeItems
          .filter((item) => item.year === selectedYear)
          .reduce((total, item) => {
            const amount = Number.parseFloat(getMonthlyAmount(item, month.value)) || 0
            if (item.frequency === "monthly") {
              return total + amount
            } else if (item.frequency === "quarterly") {
              return total + amount / 3
            } else if (item.frequency === "weekly") {
              return total + (amount * 52) / 12
            } else if (item.frequency === "biweekly") {
              return total + (amount * 26) / 12
            } else if (item.frequency === "oneTime") {
              return total + (item.month === month.value ? amount : 0)
            } else if (item.frequency === "annual") {
              return total + amount / 12
            }
            return total + amount
          }, 0)
        annualTotal += monthlyTotal
      })
      return annualTotal
    } else {
      // When in monthly view, we calculate the annual equivalent
      return calculateMonthlyIncome() * 12
    }
  }

  const calculateVariableIncome = () => {
    return filteredIncomeItems
      .filter((item) => item.frequency !== "monthly" && item.frequency !== "annual")
      .reduce((total, item) => {
        const amount = Number.parseFloat(getMonthlyAmount(item, selectedMonth)) || 0
        if (item.frequency === "quarterly") {
          return total + amount / 3
        } else if (item.frequency === "weekly") {
          return total + (amount * 52) / 12
        } else if (item.frequency === "biweekly") {
          return total + (amount * 26) / 12
        } else if (item.frequency === "oneTime") {
          return total + amount
        }
        return total + amount
      }, 0)
  }

  const calculateMonthlyExpensesByType = () => {
    const result = { fixed: 0, variable: 0, discretionary: 0 }

    filteredExpenseItems.forEach((item) => {
      const amount = Number.parseFloat(getMonthlyAmount(item, selectedMonth)) || 0
      result[item.type as keyof typeof result] += amount
    })

    return result
  }

  const calculateMonthlyExpensesByCategory = () => {
    const result: Record<string, number> = {}

    filteredExpenseItems.forEach((item) => {
      const amount = Number.parseFloat(getMonthlyAmount(item, selectedMonth)) || 0
      if (!result[item.mainCategory]) {
        result[item.mainCategory] = 0
      }
      result[item.mainCategory] += amount
    })

    return result
  }

  const calculateTotalMonthlyExpenses = () => {
    return filteredExpenseItems.reduce((total, item) => {
      return total + (Number.parseFloat(getMonthlyAmount(item, selectedMonth)) || 0)
    }, 0)
  }

  // Calculate annual expenses
  const calculateAnnualExpenses = () => {
    if (timeView === "yearly") {
      // Sum up all monthly expenses for the year
      let annualTotal = 0
      months.forEach((month) => {
        const monthlyTotal = expenseItems
          .filter((item) => item.year === selectedYear)
          .reduce((total, item) => {
            return total + (Number.parseFloat(getMonthlyAmount(item, month.value)) || 0)
          }, 0)
        annualTotal += monthlyTotal
      })
      return annualTotal
    } else {
      return calculateTotalMonthlyExpenses() * 12
    }
  }

  // Calculate net cashflow
  const calculateNetCashflow = () => {
    return calculateMonthlyIncome() - calculateTotalMonthlyExpenses()
  }

  // Calculate total cash flow for savings/investment
  const calculateCashFlowForSavings = () => {
    const monthlyIncome = calculateMonthlyIncome()
    const essentialExpenses = calculateMonthlyExpensesByType().fixed + calculateMonthlyExpensesByType().variable
    return monthlyIncome - essentialExpenses
  }

  // Prepare chart data
  const prepareIncomeChartData = () => {
    return filteredIncomeItems.map((item) => ({
      name: item.description || item.category,
      value:
        item.frequency === "annual"
          ? (Number.parseFloat(getMonthlyAmount(item, selectedMonth)) || 0) / 12
          : item.frequency === "quarterly"
            ? (Number.parseFloat(getMonthlyAmount(item, selectedMonth)) || 0) / 3
            : item.frequency === "weekly"
              ? ((Number.parseFloat(getMonthlyAmount(item, selectedMonth)) || 0) * 52) / 12
              : item.frequency === "biweekly"
                ? ((Number.parseFloat(getMonthlyAmount(item, selectedMonth)) || 0) * 26) / 12
                : Number.parseFloat(getMonthlyAmount(item, selectedMonth)) || 0,
    }))
  }

  const prepareExpenseChartData = () => {
    const categoryTotals = calculateMonthlyExpensesByCategory()
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
    }))
  }

  const prepareCashflowChartData = () => {
    const monthlyIncome = calculateMonthlyIncome()
    const expensesByType = calculateMonthlyExpensesByType()
    const cashFlowForSavings = calculateCashFlowForSavings()
    const netCashflow = calculateNetCashflow()

    return [
      { name: "Income", amount: monthlyIncome },
      { name: "Fixed Expenses", amount: expensesByType.fixed },
      { name: "Variable Expenses", amount: expensesByType.variable },
      { name: "Discretionary", amount: expensesByType.discretionary },
      { name: "For Savings/Investment", amount: cashFlowForSavings },
      { name: "Net Cashflow", amount: netCashflow },
    ]
  }

  // Prepare yearly trend data
  const prepareYearlyTrendData = () => {
    const data = []

    // Group by month
    for (let i = 1; i <= 12; i++) {
      const monthStr = i.toString()

      // Calculate monthly income for this month
      const monthlyIncome = incomeItems
        .filter((item) => item.year === selectedYear)
        .reduce((total, item) => {
          const amount = Number.parseFloat(getMonthlyAmount(item, monthStr)) || 0
          if (item.frequency === "annual") return total + amount / 12
          if (item.frequency === "quarterly") return total + amount / 3
          if (item.frequency === "weekly") return total + (amount * 52) / 12
          if (item.frequency === "biweekly") return total + (amount * 26) / 12
          if (item.frequency === "oneTime" && item.month !== monthStr) return total
          return total + amount
        }, 0)

      // Calculate monthly expenses for this month
      const monthlyExpenses = expenseItems
        .filter((item) => item.year === selectedYear)
        .reduce((total, item) => {
          return total + (Number.parseFloat(getMonthlyAmount(item, monthStr)) || 0)
        }, 0)

      data.push({
        name: months.find((m) => m.value === monthStr)?.label || monthStr,
        income: monthlyIncome,
        expenses: monthlyExpenses,
        netCashflow: monthlyIncome - monthlyExpenses,
      })
    }

    return data
  }

  // Calculate summary values
  const monthlyIncome = calculateMonthlyIncome()
  const annualIncome = calculateAnnualIncome()
  const variableIncome = calculateVariableIncome()
  const monthlyExpenses = calculateTotalMonthlyExpenses()
  const annualExpenses = calculateAnnualExpenses()
  const monthlySurplus = calculateNetCashflow()
  const annualSurplus = timeView === "yearly" ? monthlySurplus : monthlySurplus * 12
  const cashFlowForSavings = calculateCashFlowForSavings()
  const expensesByType = calculateMonthlyExpensesByType()

  // CSV import fields
  const incomeFields = ["category", "description", "amount", "frequency"]
  const expenseFields = ["mainCategory", "subCategory", "amount", "type"]

  // Template data for CSV download
  const incomeTemplateData = [
    { category: "Salary/Wages", description: "Primary Job", amount: "50000", frequency: "monthly" },
    { category: "Investment Income", description: "Dividends", amount: "1000", frequency: "quarterly" },
  ]

  const expenseTemplateData = [
    { mainCategory: "Housing", subCategory: "Mortgage/Rent", amount: "15000", type: "fixed" },
    { mainCategory: "Transportation", subCategory: "Car Payment", amount: "5000", type: "fixed" },
  ]

  // Helper function to check if an item has monthly variations
  const hasMonthlyVariations = (item: any) => {
    if (!item.monthlyValues) return false

    const baseAmount = item.amount || "0"
    return Object.values(item.monthlyValues).some((value) => value !== baseAmount)
  }

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-truffle-800 mb-2">Cashflow Analysis</h2>
        <p className="text-sm text-truffle-500">
          Record the client's income sources and expenses to analyze their monthly and annual cashflow.
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

      {/* Cashflow Summary Card */}
      <Card className="bg-white border-late-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-truffle-700">Cashflow Summary</h3>
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
              <div className="space-y-4">
                <div className="bg-late-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-truffle-500">
                      {timeView === "monthly" ? "Monthly Income" : "Annual Income"}
                    </p>
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-xl font-semibold text-truffle-800">
                    ฿
                    {(timeView === "monthly" ? monthlyIncome : annualIncome).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  {timeView === "monthly" && (
                    <p className="text-xs text-truffle-500">
                      Annual: ฿{annualIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  )}
                </div>

                <div className="bg-late-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-truffle-500">
                      {timeView === "monthly" ? "Monthly Expenses" : "Annual Expenses"}
                    </p>
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  </div>
                  <p className="text-xl font-semibold text-truffle-800">
                    ฿
                    {(timeView === "monthly" ? monthlyExpenses : annualExpenses).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  {timeView === "monthly" && (
                    <p className="text-xs text-truffle-500">
                      Annual: ฿{annualExpenses.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-late-50 p-3 rounded-lg">
                  <p className="text-sm text-truffle-500">Variable Income</p>
                  <p className="text-xl font-semibold text-truffle-800">
                    ฿{variableIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-truffle-500">
                    {monthlyIncome > 0 ? ((variableIncome / monthlyIncome) * 100).toFixed(1) : 0}% of total income
                  </p>
                </div>

                <div className="bg-late-50 p-3 rounded-lg">
                  <p className="text-sm text-truffle-500">Cash Flow For Savings/Investment</p>
                  <p className="text-xl font-semibold text-truffle-800">
                    ฿{cashFlowForSavings.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-truffle-500">
                    {monthlyIncome > 0 ? ((cashFlowForSavings / monthlyIncome) * 100).toFixed(1) : 0}% of income
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-late-50 p-3 rounded-lg">
                  <p className="text-sm text-truffle-500">Fixed & Variable Expenses</p>
                  <p className="text-xl font-semibold text-truffle-800">
                    ฿
                    {(expensesByType.fixed + expensesByType.variable).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-truffle-500">
                    {monthlyExpenses > 0
                      ? (((expensesByType.fixed + expensesByType.variable) / monthlyExpenses) * 100).toFixed(1)
                      : 0}
                    % of expenses
                  </p>
                </div>

                <div className={`p-3 rounded-lg ${monthlySurplus >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-truffle-500">Net Cashflow</p>
                    {monthlySurplus >= 0 ? (
                      <ArrowUp className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className={`text-xl font-semibold ${monthlySurplus >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {monthlySurplus >= 0 ? "+" : ""}฿
                    {monthlySurplus.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-truffle-500">
                    Annual: {annualSurplus >= 0 ? "+" : ""}฿
                    {annualSurplus.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareCashflowChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => [`฿${Number(value).toLocaleString()}`, ""]} />
                    <Legend />
                    <Bar dataKey="amount" name="Amount (฿)" fill="#8884d8" />
                  </BarChart>
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
                      <Line type="monotone" dataKey="income" stroke="#00C49F" name="Income" />
                      <Line type="monotone" dataKey="expenses" stroke="#FF8042" name="Expenses" />
                      <Line type="monotone" dataKey="netCashflow" stroke="#8884d8" name="Net Cashflow" />
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
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-truffle-700">Income Sources</h3>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => handleOpenCsvImport("income")}
              >
                <FileUp className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addIncomeItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Income Source
              </Button>
            </div>
          </div>

          {/* Income Chart */}
          {filteredIncomeItems.length > 0 && (
            <div className="h-[300px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareIncomeChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {prepareIncomeChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`฿${Number(value).toLocaleString()}`, "Monthly Amount"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Income Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Category</TableHead>
                  <TableHead className="w-[250px]">Description</TableHead>
                  <TableHead className="w-[150px]">Base Amount (฿)</TableHead>
                  <TableHead className="w-[150px]">Frequency</TableHead>
                  <TableHead className="w-[150px]">Monthly Value</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncomeItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-truffle-500">
                      No income sources added yet. Click "Add Income Source" to begin.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIncomeItems.map((item, index) => {
                    // Calculate monthly equivalent
                    const amount = Number.parseFloat(getMonthlyAmount(item, selectedMonth)) || 0
                    let monthlyEquivalent = amount
                    if (item.frequency === "annual") monthlyEquivalent = amount / 12
                    else if (item.frequency === "quarterly") monthlyEquivalent = amount / 3
                    else if (item.frequency === "weekly") monthlyEquivalent = (amount * 52) / 12
                    else if (item.frequency === "biweekly") monthlyEquivalent = (amount * 26) / 12
                    else if (item.frequency === "oneTime") monthlyEquivalent = amount

                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            value={item.category}
                            onValueChange={(value) => updateIncomeItem(incomeItems.indexOf(item), "category", value)}
                          >
                            <SelectTrigger className="rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {incomeCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => updateIncomeItem(incomeItems.indexOf(item), "description", e.target.value)}
                            className="rounded-lg"
                            placeholder="e.g., Primary Job, Rental Property"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={item.amount}
                              onChange={(e) => updateIncomeItem(incomeItems.indexOf(item), "amount", e.target.value)}
                              className="rounded-lg"
                              type="number"
                              min="0"
                              step="100"
                            />
                            {hasMonthlyVariations(item) && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex-shrink-0">
                                      <AlertCircle className="h-4 w-4 text-amber-500" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>This item has monthly variations</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.frequency}
                            onValueChange={(value) => updateIncomeItem(incomeItems.indexOf(item), "frequency", value)}
                          >
                            <SelectTrigger className="rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {frequencyOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="font-medium">
                          ฿{monthlyEquivalent.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="rounded-lg text-truffle-500 hover:text-truffle-700 hover:bg-truffle-50"
                              onClick={() => openMonthlyDialog(item, incomeItems.indexOf(item), "income")}
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeIncomeItem(incomeItems.indexOf(item))}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-truffle-700">
              {timeView === "monthly" ? "Monthly Expenses" : "Annual Expenses"}
            </h3>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => handleOpenCsvImport("expense")}
              >
                <FileUp className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addExpenseItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>

          {/* Expense Chart */}
          {filteredExpenseItems.length > 0 && (
            <div className="h-[300px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareExpenseChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {prepareExpenseChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`฿${Number(value).toLocaleString()}`, "Monthly Amount"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Expense Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Category</TableHead>
                  <TableHead className="w-[250px]">Subcategory</TableHead>
                  <TableHead className="w-[150px]">Base Amount (฿)</TableHead>
                  <TableHead className="w-[150px]">Type</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenseItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-truffle-500">
                      No expenses added yet. Click "Add Expense" to begin.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenseItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          value={item.mainCategory}
                          onValueChange={(value) =>
                            updateExpenseItem(expenseItems.indexOf(item), "mainCategory", value)
                          }
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(expenseCategories).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.subCategory}
                          onValueChange={(value) => updateExpenseItem(expenseItems.indexOf(item), "subCategory", value)}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {expenseCategories[item.mainCategory as keyof typeof expenseCategories]?.map(
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
                        <div className="flex items-center space-x-2">
                          <Input
                            value={item.amount}
                            onChange={(e) => updateExpenseItem(expenseItems.indexOf(item), "amount", e.target.value)}
                            className="rounded-lg"
                            type="number"
                            min="0"
                            step="100"
                          />
                          {hasMonthlyVariations(item) && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex-shrink-0">
                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>This item has monthly variations</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.type}
                          onValueChange={(value) => updateExpenseItem(expenseItems.indexOf(item), "type", value)}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {expenseTypeOptions.map((option) => (
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
                            onClick={() => openMonthlyDialog(item, expenseItems.indexOf(item), "expense")}
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeExpenseItem(expenseItems.indexOf(item))}
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

      {/* Cashflow Ratio Analysis */}
      <Card className="bg-late-50 border-late-200">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium text-truffle-700 mb-4">Cashflow Ratio Analysis</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-truffle-700">Savings Rate</p>
                <Calculator className="h-4 w-4 text-truffle-400" />
              </div>
              <p className="text-xl font-semibold text-truffle-800">
                {monthlyIncome > 0 ? ((monthlySurplus / monthlyIncome) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-truffle-500">
                {monthlySurplus >= 0
                  ? "Healthy savings rate, good for long-term goals"
                  : "Negative savings rate, expenses exceed income"}
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-truffle-700">Housing Ratio</p>
                <Calculator className="h-4 w-4 text-truffle-400" />
              </div>
              <p className="text-xl font-semibold text-truffle-800">
                {monthlyIncome > 0
                  ? (
                      (filteredExpenseItems
                        .filter((e) => e.mainCategory === "Housing")
                        .reduce((sum, e) => sum + (Number(getMonthlyAmount(e, selectedMonth)) || 0), 0) /
                        monthlyIncome) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-xs text-truffle-500">
                {monthlyIncome > 0 &&
                (filteredExpenseItems
                  .filter((e) => e.mainCategory === "Housing")
                  .reduce((sum, e) => sum + (Number(getMonthlyAmount(e, selectedMonth)) || 0), 0) /
                  monthlyIncome) *
                  100 <=
                  30
                  ? "Within recommended 30% of income"
                  : "Above recommended 30% of income"}
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-truffle-700">Debt-to-Income Ratio</p>
                <Calculator className="h-4 w-4 text-truffle-400" />
              </div>
              <p className="text-xl font-semibold text-truffle-800">
                {monthlyIncome > 0
                  ? (
                      (filteredExpenseItems
                        .filter(
                          (e) =>
                            e.subCategory === "Debt Payments" ||
                            e.subCategory === "Car Payment" ||
                            e.subCategory === "Mortgage/Rent",
                        )
                        .reduce((sum, e) => sum + (Number(getMonthlyAmount(e, selectedMonth)) || 0), 0) /
                        monthlyIncome) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-xs text-truffle-500">
                {monthlyIncome > 0 &&
                (filteredExpenseItems
                  .filter(
                    (e) =>
                      e.subCategory === "Debt Payments" ||
                      e.subCategory === "Car Payment" ||
                      e.subCategory === "Mortgage/Rent",
                  )
                  .reduce((sum, e) => sum + (Number(getMonthlyAmount(e, selectedMonth)) || 0), 0) /
                  monthlyIncome) *
                  100 <=
                  36
                  ? "Within recommended 36% of income"
                  : "Above recommended 36% of income"}
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
              {currentEditType === "income" ? "Income" : "Expense"} Monthly Values for {selectedYear}
            </DialogTitle>
            <DialogDescription>
              Set specific values for each month or use the base amount for all months.
            </DialogDescription>
          </DialogHeader>

          {currentEditItem && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">
                    {currentEditType === "income"
                      ? `${currentEditItem.category}: ${currentEditItem.description || "No description"}`
                      : `${currentEditItem.mainCategory} - ${currentEditItem.subCategory}`}
                  </h4>
                  <p className="text-sm text-truffle-500">Base amount: ฿{currentEditItem.amount || "0"}</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={applyValueToAllMonths}>
                  <Copy className="h-4 w-4 mr-2" />
                  Apply Base Amount to All Months
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
                      value={currentEditItem.monthlyValues?.[month.value] || currentEditItem.amount || ""}
                      onChange={(e) => updateMonthlyValue(month.value, e.target.value)}
                      type="number"
                      min="0"
                      step="100"
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
        fields={csvImportType === "income" ? incomeFields : expenseFields}
        type="cashflow"
        templateData={csvImportType === "income" ? incomeTemplateData : expenseTemplateData}
      />
    </div>
  )
}

