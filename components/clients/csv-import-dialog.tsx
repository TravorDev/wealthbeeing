"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FileUp, AlertCircle, Check, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CSVImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (data: any) => void
  formFields: string[]
  customFields: any[]
}

export function CSVImportDialog({ open, onOpenChange, onImport, formFields, customFields }: CSVImportDialogProps) {
  const [activeTab, setActiveTab] = useState("upload")
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [mappings, setMappings] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<string[]>([])
  const [importProgress, setImportProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)
  const [importComplete, setImportComplete] = useState(false)
  const [hasHeaderRow, setHasHeaderRow] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset state when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state when closing
      setActiveTab("upload")
      setFile(null)
      setCsvData([])
      setHeaders([])
      setMappings({})
      setErrors([])
      setImportProgress(0)
      setIsImporting(false)
      setImportComplete(false)
    }
    onOpenChange(open)
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      parseCSV(selectedFile)
    }
  }

  // Parse CSV file
  const parseCSV = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const result = parseCSVString(text)

      if (result.length > 0) {
        setCsvData(result)

        // If first row is headers
        if (hasHeaderRow) {
          setHeaders(result[0])

          // Auto-map columns based on headers
          const autoMappings: Record<string, string> = {}
          result[0].forEach((header, index) => {
            const normalizedHeader = header.toLowerCase().trim()

            // Try to find matching form field
            const matchingField = [...formFields, ...customFields.map((f) => f.label)].find(
              (field) => field.toLowerCase().trim() === normalizedHeader,
            )

            if (matchingField) {
              autoMappings[index.toString()] = matchingField
            }
          })

          setMappings(autoMappings)
        } else {
          // Generate placeholder headers (Column A, Column B, etc.)
          setHeaders(result[0].map((_, i) => `Column ${String.fromCharCode(65 + i)}`))
        }

        // Move to mapping tab
        setActiveTab("map")
      } else {
        setErrors(["The CSV file appears to be empty or invalid."])
      }
    }
    reader.readAsText(file)
  }

  // Parse CSV string into array
  const parseCSVString = (text: string): string[][] => {
    const lines = text.split(/\r\n|\n/)
    const result: string[][] = []

    lines.forEach((line) => {
      // Handle quoted values with commas inside
      const regex = /(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^,]*))/g
      const row: string[] = []
      let match

      while ((match = regex.exec(line + ",")) !== null) {
        const value =
          match[1] !== undefined
            ? match[1].replace(/""/g, '"') // Handle double quotes in quoted strings
            : match[2] || ""
        row.push(value)
      }

      if (row.length > 0 && !(row.length === 1 && row[0] === "")) {
        result.push(row)
      }
    })

    return result
  }

  // Update column mapping
  const updateMapping = (columnIndex: string, fieldName: string) => {
    setMappings((prev) => ({
      ...prev,
      [columnIndex]: fieldName,
    }))
  }

  // Get all available fields for mapping
  const getAllFields = () => {
    return [...formFields, ...customFields.map((field) => field.label)]
  }

  // Handle import
  const handleImport = () => {
    setIsImporting(true)
    setErrors([])

    // Validate mappings
    if (Object.keys(mappings).length === 0) {
      setErrors(["Please map at least one column before importing."])
      setIsImporting(false)
      return
    }

    try {
      // Start with empty data rows
      const dataRows = hasHeaderRow ? csvData.slice(1) : csvData

      if (dataRows.length === 0) {
        setErrors(["No data rows found to import."])
        setIsImporting(false)
        return
      }

      // Process each row with a delay to show progress
      const importData = async () => {
        const importedData: any[] = []

        for (let i = 0; i < dataRows.length; i++) {
          const row = dataRows[i]
          const rowData: Record<string, any> = {}

          // Map columns to fields
          Object.entries(mappings).forEach(([columnIndex, fieldName]) => {
            const index = Number.parseInt(columnIndex)
            if (index < row.length) {
              rowData[fieldName] = row[index]
            }
          })

          importedData.push(rowData)

          // Update progress
          setImportProgress(Math.round(((i + 1) / dataRows.length) * 100))

          // Small delay to show progress
          await new Promise((resolve) => setTimeout(resolve, 50))
        }

        // Complete import
        setImportComplete(true)
        setIsImporting(false)

        // Call onImport with the processed data
        onImport(importedData)
      }

      importData()
    } catch (error) {
      setErrors([`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`])
      setIsImporting(false)
    }
  }

  // Download sample CSV template
  const downloadTemplate = () => {
    const fields = getAllFields()
    const csvContent = fields.join(",") + "\n" + fields.map(() => "").join(",")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "client_import_template.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Import Clients from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import client data. You can map columns to fields in the next step.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="map" disabled={!file}>
              Map Fields
            </TabsTrigger>
            <TabsTrigger value="import" disabled={!file || Object.keys(mappings).length === 0}>
              Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="hasHeaderRow" className="text-sm font-medium">
                CSV has header row
              </Label>
              <input
                type="checkbox"
                id="hasHeaderRow"
                checked={hasHeaderRow}
                onChange={(e) => setHasHeaderRow(e.target.checked)}
                className="rounded border-gray-300 text-gold-500 focus:ring-gold-500"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                      <HelpCircle className="h-4 w-4 text-truffle-400" />
                      <span className="sr-only">Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Check this if your CSV file has column headers in the first row. This helps with automatic field
                      mapping.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="csv-file">CSV File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="rounded-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg"
                >
                  <FileUp className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-truffle-500">
                Upload a CSV file with client data. The file should have columns for client information.
              </p>
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={downloadTemplate} className="rounded-lg">
                Download Template
              </Button>

              <Button
                type="button"
                onClick={() => file && setActiveTab("map")}
                disabled={!file}
                className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
              >
                Next: Map Fields
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Map CSV Columns to Fields</h3>
                <Badge variant="outline" className="font-normal">
                  {csvData.length} {csvData.length === 1 ? "row" : "rows"} found
                </Badge>
              </div>

              <ScrollArea className="h-[300px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">CSV Column</TableHead>
                      <TableHead>Map to Field</TableHead>
                      <TableHead className="w-[200px]">Preview</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {headers.map((header, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{header}</TableCell>
                        <TableCell>
                          <Select
                            value={mappings[index.toString()] || ""}
                            onValueChange={(value) => updateMapping(index.toString(), value)}
                          >
                            <SelectTrigger className="rounded-lg">
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ignore">-- Ignore this column --</SelectItem>
                              <SelectItem value="firstName">First Name</SelectItem>
                              <SelectItem value="lastName">Last Name</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="dateOfBirth">Date of Birth</SelectItem>
                              <SelectItem value="gender">Gender</SelectItem>
                              <SelectItem value="nationality">Nationality</SelectItem>
                              <SelectItem value="occupation">Occupation</SelectItem>
                              <SelectItem value="addressLine1">Address Line 1</SelectItem>
                              <SelectItem value="addressLine2">Address Line 2</SelectItem>
                              <SelectItem value="city">City</SelectItem>
                              <SelectItem value="state">State/Province</SelectItem>
                              <SelectItem value="postalCode">Postal Code</SelectItem>
                              <SelectItem value="country">Country</SelectItem>
                              <SelectItem value="maritalStatus">Marital Status</SelectItem>
                              {customFields.map((field) => (
                                <SelectItem key={field.id} value={field.label}>
                                  {field.label} (Custom)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-sm text-truffle-600">
                          {csvData.length > 1 && csvData[hasHeaderRow ? 1 : 0][index]}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setActiveTab("upload")} className="rounded-lg">
                Back
              </Button>

              <Button
                type="button"
                onClick={() => setActiveTab("import")}
                disabled={Object.keys(mappings).length === 0}
                className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
              >
                Next: Import Data
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Import Data</h3>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ready to Import</AlertTitle>
                <AlertDescription>
                  You are about to import {csvData.length - (hasHeaderRow ? 1 : 0)} records. This will add new clients
                  to your database.
                </AlertDescription>
              </Alert>

              {isImporting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Importing...</span>
                    <span>{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="h-2" />
                </div>
              )}

              {importComplete && (
                <Alert className="bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Import Complete</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Successfully imported {csvData.length - (hasHeaderRow ? 1 : 0)} records.
                  </AlertDescription>
                </Alert>
              )}

              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("map")}
                disabled={isImporting || importComplete}
                className="rounded-lg"
              >
                Back
              </Button>

              {importComplete ? (
                <Button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
                >
                  Close
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleImport}
                  disabled={isImporting || Object.keys(mappings).length === 0}
                  className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
                >
                  {isImporting ? "Importing..." : "Start Import"}
                </Button>
              )}
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

