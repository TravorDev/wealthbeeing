"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface WealthProtectionFormProps {
  data: any
  updateData: (data: any) => void
}

export function WealthProtectionForm({ data, updateData }: WealthProtectionFormProps) {
  const [dependents, setDependents] = useState(data.dependents || [])
  const [estateDocuments, setEstateDocuments] = useState(data.estateDocuments || [])

  const handleChange = (field: string, value: string) => {
    updateData({ [field]: value })
  }

  const addDependent = () => {
    const newDependents = [...dependents, { name: "", relationship: "", age: "" }]
    setDependents(newDependents)
    updateData({ dependents: newDependents })
  }

  const updateDependent = (index: number, field: string, value: string) => {
    const newDependents = [...dependents]
    newDependents[index] = { ...newDependents[index], [field]: value }
    setDependents(newDependents)
    updateData({ dependents: newDependents })
  }

  const removeDependent = (index: number) => {
    const newDependents = dependents.filter((_, i) => i !== index)
    setDependents(newDependents)
    updateData({ dependents: newDependents })
  }

  const addEstateDocument = () => {
    const newEstateDocuments = [...estateDocuments, { type: "will", status: "not-started", lastUpdated: "" }]
    setEstateDocuments(newEstateDocuments)
    updateData({ estateDocuments: newEstateDocuments })
  }

  const updateEstateDocument = (index: number, field: string, value: string) => {
    const newEstateDocuments = [...estateDocuments]
    newEstateDocuments[index] = { ...newEstateDocuments[index], [field]: value }
    setEstateDocuments(newEstateDocuments)
    updateData({ estateDocuments: newEstateDocuments })
  }

  const removeEstateDocument = (index: number) => {
    const newEstateDocuments = estateDocuments.filter((_, i) => i !== index)
    setEstateDocuments(newEstateDocuments)
    updateData({ estateDocuments: newEstateDocuments })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-truffle-800 mb-2">Wealth Protection</h2>
        <p className="text-sm text-truffle-500">
          Assess the client's risk profile and develop strategies to protect their wealth and dependents.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Wealth protection is a critical component of financial planning that helps safeguard assets and provide for
          dependents.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-truffle-700">Risk Assessment</h3>

        <div className="space-y-2">
          <Label htmlFor="riskTolerance">Risk Tolerance</Label>
          <Select value={data.riskTolerance} onValueChange={(value) => handleChange("riskTolerance", value)}>
            <SelectTrigger id="riskTolerance" className="rounded-lg">
              <SelectValue placeholder="Select risk tolerance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">Conservative</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="aggressive">Aggressive</SelectItem>
              <SelectItem value="very-aggressive">Very Aggressive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="dependents" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="dependents">Dependents</TabsTrigger>
          <TabsTrigger value="estate">Estate Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="dependents" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-truffle-700">Dependents</h3>
            <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addDependent}>
              <Plus className="h-4 w-4 mr-2" />
              Add Dependent
            </Button>
          </div>

          {dependents.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-late-200 rounded-lg">
              <p className="text-truffle-500 mb-4">No dependents added yet</p>
              <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addDependent}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Dependent
              </Button>
            </div>
          ) : (
            dependents.map((dependent, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-12 md:col-span-5 space-y-2">
                  <Label htmlFor={`dependent-name-${index}`}>Name</Label>
                  <Input
                    id={`dependent-name-${index}`}
                    value={dependent.name}
                    onChange={(e) => updateDependent(index, "name", e.target.value)}
                    className="rounded-lg"
                    placeholder="Dependent's name"
                  />
                </div>

                <div className="col-span-7 md:col-span-4 space-y-2">
                  <Label htmlFor={`dependent-relationship-${index}`}>Relationship</Label>
                  <Select
                    value={dependent.relationship}
                    onValueChange={(value) => updateDependent(index, "relationship", value)}
                  >
                    <SelectTrigger id={`dependent-relationship-${index}`} className="rounded-lg">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-4 md:col-span-2 space-y-2">
                  <Label htmlFor={`dependent-age-${index}`}>Age</Label>
                  <Input
                    id={`dependent-age-${index}`}
                    value={dependent.age}
                    onChange={(e) => updateDependent(index, "age", e.target.value)}
                    className="rounded-lg"
                    type="number"
                    min="0"
                    max="120"
                  />
                </div>

                <div className="col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeDependent(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="estate" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-truffle-700">Estate Planning Documents</h3>
            <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addEstateDocument}>
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </div>

          {estateDocuments.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-late-200 rounded-lg">
              <p className="text-truffle-500 mb-4">No estate planning documents added yet</p>
              <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addEstateDocument}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Document
              </Button>
            </div>
          ) : (
            estateDocuments.map((document, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-12 md:col-span-4 space-y-2">
                  <Label htmlFor={`document-type-${index}`}>Document Type</Label>
                  <Select value={document.type} onValueChange={(value) => updateEstateDocument(index, "type", value)}>
                    <SelectTrigger id={`document-type-${index}`} className="rounded-lg">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="will">Will</SelectItem>
                      <SelectItem value="trust">Trust</SelectItem>
                      <SelectItem value="power-of-attorney">Power of Attorney</SelectItem>
                      <SelectItem value="healthcare-directive">Healthcare Directive</SelectItem>
                      <SelectItem value="beneficiary-designation">Beneficiary Designation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-7 md:col-span-4 space-y-2">
                  <Label htmlFor={`document-status-${index}`}>Status</Label>
                  <Select
                    value={document.status}
                    onValueChange={(value) => updateEstateDocument(index, "status", value)}
                  >
                    <SelectTrigger id={`document-status-${index}`} className="rounded-lg">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="needs-update">Needs Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-4 md:col-span-3 space-y-2">
                  <Label htmlFor={`document-date-${index}`}>Last Updated</Label>
                  <Input
                    id={`document-date-${index}`}
                    type="date"
                    value={document.lastUpdated}
                    onChange={(e) => updateEstateDocument(index, "lastUpdated", e.target.value)}
                    className="rounded-lg"
                  />
                </div>

                <div className="col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeEstateDocument(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Card className="bg-late-50 border-late-200">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium text-truffle-700 mb-2">Wealth Protection Recommendations</h3>
          <p className="text-sm text-truffle-500">
            Based on the client's risk profile, dependents, and estate planning status, we'll provide tailored
            recommendations in the next steps.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

