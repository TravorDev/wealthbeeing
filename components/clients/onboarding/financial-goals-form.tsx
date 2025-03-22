"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Trash } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FinancialGoalsFormProps {
  data: any
  updateData: (data: any) => void
}

export function FinancialGoalsForm({ data, updateData }: FinancialGoalsFormProps) {
  const [shortTermGoals, setShortTermGoals] = useState(data.shortTermGoals || [])
  const [mediumTermGoals, setMediumTermGoals] = useState(data.mediumTermGoals || [])
  const [longTermGoals, setLongTermGoals] = useState(data.longTermGoals || [])

  const addShortTermGoal = () => {
    const newGoals = [...shortTermGoals, { description: "", targetDate: "", estimatedCost: "", priority: "medium" }]
    setShortTermGoals(newGoals)
    updateData({ shortTermGoals: newGoals })
  }

  const updateShortTermGoal = (index: number, field: string, value: string) => {
    const newGoals = [...shortTermGoals]
    newGoals[index] = { ...newGoals[index], [field]: value }
    setShortTermGoals(newGoals)
    updateData({ shortTermGoals: newGoals })
  }

  const removeShortTermGoal = (index: number) => {
    const newGoals = shortTermGoals.filter((_, i) => i !== index)
    setShortTermGoals(newGoals)
    updateData({ shortTermGoals: newGoals })
  }

  const addMediumTermGoal = () => {
    const newGoals = [...mediumTermGoals, { description: "", targetDate: "", estimatedCost: "", priority: "medium" }]
    setMediumTermGoals(newGoals)
    updateData({ mediumTermGoals: newGoals })
  }

  const updateMediumTermGoal = (index: number, field: string, value: string) => {
    const newGoals = [...mediumTermGoals]
    newGoals[index] = { ...newGoals[index], [field]: value }
    setMediumTermGoals(newGoals)
    updateData({ mediumTermGoals: newGoals })
  }

  const removeMediumTermGoal = (index: number) => {
    const newGoals = mediumTermGoals.filter((_, i) => i !== index)
    setMediumTermGoals(newGoals)
    updateData({ mediumTermGoals: newGoals })
  }

  const addLongTermGoal = () => {
    const newGoals = [...longTermGoals, { description: "", targetDate: "", estimatedCost: "", priority: "medium" }]
    setLongTermGoals(newGoals)
    updateData({ longTermGoals: newGoals })
  }

  const updateLongTermGoal = (index: number, field: string, value: string) => {
    const newGoals = [...longTermGoals]
    newGoals[index] = { ...newGoals[index], [field]: value }
    setLongTermGoals(newGoals)
    updateData({ longTermGoals: newGoals })
  }

  const removeLongTermGoal = (index: number) => {
    const newGoals = longTermGoals.filter((_, i) => i !== index)
    setLongTermGoals(newGoals)
    updateData({ longTermGoals: newGoals })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-truffle-800 mb-2">Financial Goals</h2>
        <p className="text-sm text-truffle-500">
          Define the client's short-term, medium-term, and long-term financial goals.
        </p>
      </div>

      <Tabs defaultValue="short-term" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="short-term">Short-Term (0-2 years)</TabsTrigger>
          <TabsTrigger value="medium-term">Medium-Term (2-5 years)</TabsTrigger>
          <TabsTrigger value="long-term">Long-Term (5+ years)</TabsTrigger>
        </TabsList>

        <TabsContent value="short-term" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-truffle-700">Short-Term Goals (0-2 years)</h3>
            <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addShortTermGoal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>

          {shortTermGoals.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-late-200 rounded-lg">
              <p className="text-truffle-500 mb-4">No short-term goals added yet</p>
              <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addShortTermGoal}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Goal
              </Button>
            </div>
          ) : (
            shortTermGoals.map((goal, index) => (
              <div
                key={index}
                className="p-4 border border-late-100 rounded-lg hover:bg-late-50 transition-colors duration-200"
              >
                <div className="flex justify-end mb-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeShortTermGoal(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`short-goal-desc-${index}`}>Goal Description</Label>
                    <Input
                      id={`short-goal-desc-${index}`}
                      value={goal.description}
                      onChange={(e) => updateShortTermGoal(index, "description", e.target.value)}
                      className="rounded-lg"
                      placeholder="e.g., Build emergency fund, Pay off credit card debt"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`short-goal-date-${index}`}>Target Date</Label>
                      <Input
                        id={`short-goal-date-${index}`}
                        type="date"
                        value={goal.targetDate}
                        onChange={(e) => updateShortTermGoal(index, "targetDate", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`short-goal-cost-${index}`}>Estimated Cost (฿)</Label>
                      <Input
                        id={`short-goal-cost-${index}`}
                        value={goal.estimatedCost}
                        onChange={(e) => updateShortTermGoal(index, "estimatedCost", e.target.value)}
                        className="rounded-lg"
                        type="number"
                        min="0"
                        step="1000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`short-goal-priority-${index}`}>Priority</Label>
                      <Select
                        value={goal.priority}
                        onValueChange={(value) => updateShortTermGoal(index, "priority", value)}
                      >
                        <SelectTrigger id={`short-goal-priority-${index}`} className="rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="medium-term" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-truffle-700">Medium-Term Goals (2-5 years)</h3>
            <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addMediumTermGoal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>

          {mediumTermGoals.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-late-200 rounded-lg">
              <p className="text-truffle-500 mb-4">No medium-term goals added yet</p>
              <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addMediumTermGoal}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Goal
              </Button>
            </div>
          ) : (
            mediumTermGoals.map((goal, index) => (
              <div
                key={index}
                className="p-4 border border-late-100 rounded-lg hover:bg-late-50 transition-colors duration-200"
              >
                <div className="flex justify-end mb-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeMediumTermGoal(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`medium-goal-desc-${index}`}>Goal Description</Label>
                    <Input
                      id={`medium-goal-desc-${index}`}
                      value={goal.description}
                      onChange={(e) => updateMediumTermGoal(index, "description", e.target.value)}
                      className="rounded-lg"
                      placeholder="e.g., Down payment for home, Start a business"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`medium-goal-date-${index}`}>Target Date</Label>
                      <Input
                        id={`medium-goal-date-${index}`}
                        type="date"
                        value={goal.targetDate}
                        onChange={(e) => updateMediumTermGoal(index, "targetDate", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`medium-goal-cost-${index}`}>Estimated Cost (฿)</Label>
                      <Input
                        id={`medium-goal-cost-${index}`}
                        value={goal.estimatedCost}
                        onChange={(e) => updateMediumTermGoal(index, "estimatedCost", e.target.value)}
                        className="rounded-lg"
                        type="number"
                        min="0"
                        step="1000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`medium-goal-priority-${index}`}>Priority</Label>
                      <Select
                        value={goal.priority}
                        onValueChange={(value) => updateMediumTermGoal(index, "priority", value)}
                      >
                        <SelectTrigger id={`medium-goal-priority-${index}`} className="rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="long-term" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-truffle-700">Long-Term Goals (5+ years)</h3>
            <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addLongTermGoal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>

          {longTermGoals.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-late-200 rounded-lg">
              <p className="text-truffle-500 mb-4">No long-term goals added yet</p>
              <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addLongTermGoal}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Goal
              </Button>
            </div>
          ) : (
            longTermGoals.map((goal, index) => (
              <div
                key={index}
                className="p-4 border border-late-100 rounded-lg hover:bg-late-50 transition-colors duration-200"
              >
                <div className="flex justify-end mb-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeLongTermGoal(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`long-goal-desc-${index}`}>Goal Description</Label>
                    <Input
                      id={`long-goal-desc-${index}`}
                      value={goal.description}
                      onChange={(e) => updateLongTermGoal(index, "description", e.target.value)}
                      className="rounded-lg"
                      placeholder="e.g., Retirement, Children's education"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`long-goal-date-${index}`}>Target Date</Label>
                      <Input
                        id={`long-goal-date-${index}`}
                        type="date"
                        value={goal.targetDate}
                        onChange={(e) => updateLongTermGoal(index, "targetDate", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`long-goal-cost-${index}`}>Estimated Cost (฿)</Label>
                      <Input
                        id={`long-goal-cost-${index}`}
                        value={goal.estimatedCost}
                        onChange={(e) => updateLongTermGoal(index, "estimatedCost", e.target.value)}
                        className="rounded-lg"
                        type="number"
                        min="0"
                        step="1000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`long-goal-priority-${index}`}>Priority</Label>
                      <Select
                        value={goal.priority}
                        onValueChange={(value) => updateLongTermGoal(index, "priority", value)}
                      >
                        <SelectTrigger id={`long-goal-priority-${index}`} className="rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

