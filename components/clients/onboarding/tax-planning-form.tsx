"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TaxPlanningFormProps {
  data: any
  updateData: (data: any) => void
}

export function TaxPlanningForm({ data, updateData }: TaxPlanningFormProps) {
  const [taxDeductions, setTaxDeductions] = useState(data.taxDeductions || [])
  const [taxCredits, setTaxCredits] = useState(data.taxCredits || [])

  const handleChange = (field: string, value: string) => {
    updateData({ [field]: value })
  }

  const addTaxDeduction = () => {
    const newDeductions = [...taxDeductions, { type: "", amount: "" }]
    setTaxDeductions(newDeductions)
    updateData({ taxDeductions: newDeductions })
  }

  const updateTaxDeduction = (index: number, field: string, value: string) => {
    const newDeductions = [...taxDeductions]
    newDeductions[index] = { ...newDeductions[index], [field]: value }
    setTaxDeductions(newDeductions)
    updateData({ taxDeductions: newDeductions })
  }

  const removeTaxDeduction = (index: number) => {
    const newDeductions = taxDeductions.filter((_, i) => i !== index)
    setTaxDeductions(newDeductions)
    updateData({ taxDeductions: newDeductions })
  }

  const addTaxCredit = () => {
    const newCredits = [...taxCredits, { type: "", amount: "" }]
    setTaxCredits(newCredits)
    updateData({ taxCredits: newCredits })
  }

  const updateTaxCredit = (index: number, field: string, value: string) => {
    const newCredits = [...taxCredits]
    newCredits[index] = { ...newCredits[index], [field]: value }
    setTaxCredits(newCredits)
    updateData({ taxCredits: newCredits })
  }

  const removeTaxCredit = (index: number) => {
    const newCredits = taxCredits.filter((_, i) => i !== index)
    setTaxCredits(newCredits)
    updateData({ taxCredits: newCredits })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-truffle-800 mb-2">Tax Planning</h2>
        <p className="text-sm text-truffle-500">
          Optimize the client's tax situation and identify potential tax-saving opportunities.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Tax planning is a critical component of comprehensive financial planning. Proper tax planning can
          significantly impact overall financial outcomes.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-truffle-700">Tax Status</h3>

          <div className="space-y-2">
            <Label htmlFor="taxStatus">Filing Status</Label>
            <Select value={data.taxStatus} onValueChange={(value) => handleChange("taxStatus", value)}>
              <SelectTrigger id="taxStatus" className="rounded-lg">
                <SelectValue placeholder="Select filing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married-joint">Married Filing Jointly</SelectItem>
                <SelectItem value="married-separate">Married Filing Separately</SelectItem>
                <SelectItem value="head-household">Head of Household</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxBracket">Tax Bracket</Label>
            <Select value={data.taxBracket} onValueChange={(value) => handleChange("taxBracket", value)}>
              <SelectTrigger id="taxBracket" className="rounded-lg">
                <SelectValue placeholder="Select tax bracket" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0%</SelectItem>
                <SelectItem value="10">10%</SelectItem>
                <SelectItem value="20">20%</SelectItem>
                <SelectItem value="30">30%</SelectItem>
                <SelectItem value="35">35%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="bg-late-50 border-late-200">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium text-truffle-700 mb-2">Tax Planning Opportunities</h3>
            <ul className="space-y-2 text-sm text-truffle-600">
              <li>• Retirement account contributions</li>
              <li>• Tax-advantaged investments</li>
              <li>• Charitable giving strategies</li>
              <li>• Income timing and deferral</li>
              <li>• Tax-loss harvesting</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deductions" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="deductions">Tax Deductions</TabsTrigger>
          <TabsTrigger value="credits">Tax Credits</TabsTrigger>
        </TabsList>

        <TabsContent value="deductions" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-truffle-700">Tax Deductions</h3>
            <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addTaxDeduction}>
              <Plus className="h-4 w-4 mr-2" />
              Add Deduction
            </Button>
          </div>

          {taxDeductions.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-late-200 rounded-lg">
              <p className="text-truffle-500 mb-4">No tax deductions added yet</p>
              <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addTaxDeduction}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Deduction
              </Button>
            </div>
          ) : (
            taxDeductions.map((deduction, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-12 md:col-span-8 space-y-2">
                  <Label htmlFor={`deduction-type-${index}`}>Deduction Type</Label>
                  <Input
                    id={`deduction-type-${index}`}
                    value={deduction.type}
                    onChange={(e) => updateTaxDeduction(index, "type", e.target.value)}
                    className="rounded-lg"
                    placeholder="e.g., Mortgage Interest, Retirement Contributions"
                  />
                </div>

                <div className="col-span-11 md:col-span-3 space-y-2">
                  <Label htmlFor={`deduction-amount-${index}`}>Amount (฿)</Label>
                  <Input
                    id={`deduction-amount-${index}`}
                    value={deduction.amount}
                    onChange={(e) => updateTaxDeduction(index, "amount", e.target.value)}
                    className="rounded-lg"
                    type="number"
                    min="0"
                    step="1000"
                  />
                </div>

                <div className="col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeTaxDeduction(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="credits" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-truffle-700">Tax Credits</h3>
            <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addTaxCredit}>
              <Plus className="h-4 w-4 mr-2" />
              Add Credit
            </Button>
          </div>

          {taxCredits.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-late-200 rounded-lg">
              <p className="text-truffle-500 mb-4">No tax credits added yet</p>
              <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addTaxCredit}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Credit
              </Button>
            </div>
          ) : (
            taxCredits.map((credit, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-12 md:col-span-8 space-y-2">
                  <Label htmlFor={`credit-type-${index}`}>Credit Type</Label>
                  <Input
                    id={`credit-type-${index}`}
                    value={credit.type}
                    onChange={(e) => updateTaxCredit(index, "type", e.target.value)}
                    className="rounded-lg"
                    placeholder="e.g., Child Tax Credit, Education Credit"
                  />
                </div>

                <div className="col-span-11 md:col-span-3 space-y-2">
                  <Label htmlFor={`credit-amount-${index}`}>Amount (฿)</Label>
                  <Input
                    id={`credit-amount-${index}`}
                    value={credit.amount}
                    onChange={(e) => updateTaxCredit(index, "amount", e.target.value)}
                    className="rounded-lg"
                    type="number"
                    min="0"
                    step="1000"
                  />
                </div>

                <div className="col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeTaxCredit(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      <div className="p-4 bg-late-50 border border-late-200 rounded-lg">
        <h3 className="text-lg font-medium text-truffle-700 mb-2">Tax Planning Recommendations</h3>
        <p className="text-sm text-truffle-500">
          Based on the client's tax situation, we'll provide tailored tax planning recommendations in the final summary.
        </p>
      </div>
    </div>
  )
}

