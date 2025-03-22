"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, HelpCircle, Plus, Settings, X, Upload, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { CSVImportDialog } from "../csv-import-dialog"
import { FieldTemplatesDialog } from "../field-templates-dialog"

// Define types for custom fields
type CustomFieldType = "text" | "number" | "date" | "select" | "textarea" | "checkbox"

interface CustomFieldOption {
  label: string
  value: string
}

interface CustomField {
  id: string
  label: string
  type: CustomFieldType
  value: string | boolean
  options?: CustomFieldOption[]
  section: "client" | "spouse" | "children"
  childIndex?: number
  required?: boolean
  description?: string
  validation?: string
}

interface PersonalInfoFormProps {
  data: any
  updateData: (data: any) => void
}

export function PersonalInfoForm({ data, updateData }: PersonalInfoFormProps) {
  const [activeTab, setActiveTab] = useState("client")
  const [showLocalizedName, setShowLocalizedName] = useState(false)
  const [newFieldDialogOpen, setNewFieldDialogOpen] = useState(false)
  const [csvImportDialogOpen, setCsvImportDialogOpen] = useState(false)
  const [fieldTemplatesDialogOpen, setFieldTemplatesDialogOpen] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [newField, setNewField] = useState<Omit<CustomField, "id">>({
    label: "",
    type: "text",
    value: "",
    section: "client",
    options: [],
    required: false,
  })
  const [tempOption, setTempOption] = useState("")

  // Check if localized name should be shown based on country
  useEffect(() => {
    // Countries that typically require localized names
    const localizedNameCountries = ["Thailand", "China", "Japan", "Korea", "Taiwan"]
    setShowLocalizedName(localizedNameCountries.includes(data.country))
  }, [data.country])

  // Initialize form data
  useEffect(() => {
    const updates: Record<string, any> = {}

    // Initialize spouse and children data if not present
    if (!data.maritalStatus) {
      updates.maritalStatus = "single"
      updates.hasSpouse = false
      updates.spouse = {
        firstName: "",
        lastName: "",
        localFirstName: "",
        localLastName: "",
        hasLocalName: false,
        dateOfBirth: "",
        occupation: "",
        email: "",
        phone: "",
      }
      updates.hasChildren = false
      updates.children = []
    }

    // Initialize localized name fields if not present
    if (data.localFirstName === undefined) {
      updates.localFirstName = ""
      updates.localLastName = ""
      updates.hasLocalName = false
    }

    // Initialize custom fields if not present
    if (!data.customFields) {
      updates.customFields = []
    }

    // Only update if there are changes to make
    if (Object.keys(updates).length > 0) {
      updateData(updates)
    }
  }, [data, updateData])

  const handleChange = (field: string, value: string) => {
    updateData({ [field]: value })

    // Clear validation error if field is filled
    if (validationErrors[field] && value) {
      const newErrors = { ...validationErrors }
      delete newErrors[field]
      setValidationErrors(newErrors)
    }
  }

  const handleSpouseChange = (field: string, value: string) => {
    updateData({
      spouse: {
        ...data.spouse,
        [field]: value,
      },
    })

    // Clear validation error if field is filled
    const errorKey = `spouse.${field}`
    if (validationErrors[errorKey] && value) {
      const newErrors = { ...validationErrors }
      delete newErrors[errorKey]
      setValidationErrors(newErrors)
    }
  }

  const handleMaritalStatusChange = (value: string) => {
    const hasSpouse = value === "married" || value === "domestic-partnership"
    updateData({
      maritalStatus: value,
      hasSpouse: hasSpouse,
    })
  }

  const handleHasChildrenChange = (value: boolean) => {
    updateData({
      hasChildren: value,
      // Initialize with one empty child if toggling on
      children:
        value && (!data.children || data.children.length === 0)
          ? [
              {
                firstName: "",
                lastName: "",
                localFirstName: "",
                localLastName: "",
                hasLocalName: false,
                dateOfBirth: "",
                relationship: "biological",
                isDependent: true,
              },
            ]
          : data.children,
    })
  }

  const addChild = () => {
    updateData({
      children: [
        ...(data.children || []),
        {
          firstName: "",
          lastName: "",
          localFirstName: "",
          localLastName: "",
          hasLocalName: false,
          dateOfBirth: "",
          relationship: "biological",
          isDependent: true,
        },
      ],
    })
  }

  const removeChild = (index: number) => {
    const updatedChildren = [...data.children]
    updatedChildren.splice(index, 1)
    updateData({ children: updatedChildren })

    // Remove custom fields for this child
    const updatedCustomFields = data.customFields.filter(
      (field: CustomField) => !(field.section === "children" && field.childIndex === index),
    )

    // Update childIndex for remaining children's custom fields
    updatedCustomFields.forEach((field: CustomField) => {
      if (field.section === "children" && field.childIndex !== undefined && field.childIndex > index) {
        field.childIndex -= 1
      }
    })

    updateData({ customFields: updatedCustomFields })

    // Clear validation errors for this child
    const newErrors = { ...validationErrors }
    Object.keys(newErrors).forEach((key) => {
      if (key.startsWith(`children[${index}]`)) {
        delete newErrors[key]
      }
    })
    setValidationErrors(newErrors)
  }

  const updateChild = (index: number, field: string, value: any) => {
    const updatedChildren = [...data.children]
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value,
    }
    updateData({ children: updatedChildren })

    // Clear validation error if field is filled
    const errorKey = `children[${index}].${field}`
    if (validationErrors[errorKey] && value) {
      const newErrors = { ...validationErrors }
      delete newErrors[errorKey]
      setValidationErrors(newErrors)
    }
  }

  // Custom fields handlers
  const addCustomField = () => {
    if (!newField.label.trim()) return

    const customField: CustomField = {
      ...newField,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      value: newField.type === "checkbox" ? false : "",
    }

    updateData({
      customFields: [...(data.customFields || []), customField],
    })

    // Reset new field form
    setNewField({
      label: "",
      type: "text",
      value: "",
      section: activeTab as "client" | "spouse" | "children",
      options: [],
      required: false,
    })

    setNewFieldDialogOpen(false)
  }

  const removeCustomField = (id: string) => {
    updateData({
      customFields: data.customFields.filter((field: CustomField) => field.id !== id),
    })

    // Clear validation error for this field
    if (validationErrors[id]) {
      const newErrors = { ...validationErrors }
      delete newErrors[id]
      setValidationErrors(newErrors)
    }
  }

  const updateCustomFieldValue = (id: string, value: string | boolean) => {
    const updatedFields = data.customFields.map((field: CustomField) => (field.id === id ? { ...field, value } : field))
    updateData({ customFields: updatedFields })

    // Clear validation error if field is filled
    if (validationErrors[id] && value) {
      const newErrors = { ...validationErrors }
      delete newErrors[id]
      setValidationErrors(newErrors)
    }
  }

  const addOption = () => {
    if (!tempOption.trim()) return

    setNewField({
      ...newField,
      options: [
        ...(newField.options || []),
        { label: tempOption, value: tempOption.toLowerCase().replace(/\s+/g, "-") },
      ],
    })

    setTempOption("")
  }

  const removeOption = (index: number) => {
    const updatedOptions = [...(newField.options || [])]
    updatedOptions.splice(index, 1)
    setNewField({
      ...newField,
      options: updatedOptions,
    })
  }

  const openNewFieldDialog = (section: "client" | "spouse" | "children", childIndex?: number) => {
    setNewField({
      label: "",
      type: "text",
      value: "",
      section,
      childIndex,
      options: [],
      required: false,
    })
    setNewFieldDialogOpen(true)
  }

  // Filter custom fields by section and childIndex
  const getCustomFields = (section: "client" | "spouse" | "children", childIndex?: number) => {
    return (
      data.customFields?.filter((field: CustomField) => {
        if (field.section !== section) return false
        if (section === "children" && field.childIndex !== childIndex) return false
        return true
      }) || []
    )
  }

  // Render custom field based on its type
  const renderCustomField = (field: CustomField) => {
    const hasError = !!validationErrors[field.id]

    switch (field.type) {
      case "text":
        return (
          <Input
            id={field.id}
            value={field.value as string}
            onChange={(e) => updateCustomFieldValue(field.id, e.target.value)}
            className={`rounded-lg ${hasError ? "border-red-500" : ""}`}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${field.id}-error` : undefined}
          />
        )
      case "number":
        return (
          <Input
            id={field.id}
            type="number"
            value={field.value as string}
            onChange={(e) => updateCustomFieldValue(field.id, e.target.value)}
            className={`rounded-lg ${hasError ? "border-red-500" : ""}`}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${field.id}-error` : undefined}
          />
        )
      case "date":
        return (
          <Input
            id={field.id}
            type="date"
            value={field.value as string}
            onChange={(e) => updateCustomFieldValue(field.id, e.target.value)}
            className={`rounded-lg ${hasError ? "border-red-500" : ""}`}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${field.id}-error` : undefined}
          />
        )
      case "select":
        return (
          <Select value={field.value as string} onValueChange={(value) => updateCustomFieldValue(field.id, value)}>
            <SelectTrigger
              id={field.id}
              className={`rounded-lg ${hasError ? "border-red-500" : ""}`}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${field.id}-error` : undefined}
            >
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "textarea":
        return (
          <Textarea
            id={field.id}
            value={field.value as string}
            onChange={(e) => updateCustomFieldValue(field.id, e.target.value)}
            className={`rounded-lg ${hasError ? "border-red-500" : ""}`}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${field.id}-error` : undefined}
          />
        )
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={field.id}
              checked={field.value as boolean}
              onCheckedChange={(checked) => updateCustomFieldValue(field.id, checked)}
            />
            <Label htmlFor={field.id}>{field.value ? "Yes" : "No"}</Label>
          </div>
        )
      default:
        return null
    }
  }

  // Validate fields
  const validateFields = () => {
    const errors: Record<string, string> = {}

    // Required standard fields
    if (!data.firstName) errors["firstName"] = "First name is required"
    if (!data.lastName) errors["lastName"] = "Last name is required"
    if (!data.email) errors["email"] = "Email is required"

    // Email format validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors["email"] = "Invalid email format"
    }

    // Validate spouse fields if applicable
    if (data.hasSpouse) {
      if (!data.spouse.firstName) errors["spouse.firstName"] = "Spouse first name is required"
      if (!data.spouse.lastName) errors["spouse.lastName"] = "Spouse last name is required"

      // Email format validation for spouse
      if (data.spouse.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.spouse.email)) {
        errors["spouse.email"] = "Invalid email format"
      }
    }

    // Validate children fields if applicable
    if (data.hasChildren && data.children) {
      data.children.forEach((child: any, index: number) => {
        if (!child.firstName) errors[`children[${index}].firstName`] = "Child first name is required"
        if (!child.lastName) errors[`children[${index}].lastName`] = "Child last name is required"
      })
    }

    // Validate custom fields
    data.customFields?.forEach((field: CustomField) => {
      if (field.required) {
        if (field.type === "checkbox") {
          // For checkbox, we might consider it required only if it needs to be checked
          // This depends on your business logic
        } else {
          if (!field.value) errors[field.id] = `${field.label} is required`
        }
      }

      // Validate number fields
      if (field.type === "number" && field.value && isNaN(Number(field.value))) {
        errors[field.id] = `${field.label} must be a valid number`
      }

      // Validate custom validation patterns
      if (field.validation && field.value) {
        try {
          const regex = new RegExp(field.validation)
          if (!regex.test(String(field.value))) {
            errors[field.id] = `${field.label} has an invalid format`
          }
        } catch (e) {
          // Invalid regex pattern, ignore validation
        }
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle CSV import
  const handleCsvImport = (importedData: any[]) => {
    if (importedData.length === 0) return

    // Process the first row as the main client
    const firstRow = importedData[0]

    // Update standard fields
    const standardFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "dateOfBirth",
      "gender",
      "nationality",
      "occupation",
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "postalCode",
      "country",
      "maritalStatus",
    ]

    const updatedData: Record<string, any> = {}

    standardFields.forEach((field) => {
      if (firstRow[field] !== undefined) {
        updatedData[field] = firstRow[field]
      }
    })

    // Handle spouse data if present
    if (firstRow["spouse.firstName"] || firstRow["spouse.lastName"]) {
      updatedData.hasSpouse = true
      updatedData.spouse = {
        ...data.spouse,
        firstName: firstRow["spouse.firstName"] || "",
        lastName: firstRow["spouse.lastName"] || "",
        email: firstRow["spouse.email"] || "",
        phone: firstRow["spouse.phone"] || "",
        dateOfBirth: firstRow["spouse.dateOfBirth"] || "",
        occupation: firstRow["spouse.occupation"] || "",
      }

      // Update marital status if not already set
      if (!updatedData.maritalStatus) {
        updatedData.maritalStatus = "married"
      }
    }

    // Handle children data if present in additional rows
    if (importedData.length > 1) {
      const children = importedData.slice(1).map((row, index) => ({
        firstName: row.firstName || "",
        lastName: row.lastName || "",
        dateOfBirth: row.dateOfBirth || "",
        relationship: row.relationship || "biological",
        isDependent: row.isDependent === "true" || row.isDependent === true || true,
        hasLocalName: false,
        localFirstName: "",
        localLastName: "",
      }))

      if (children.length > 0) {
        updatedData.hasChildren = true
        updatedData.children = children
      }
    }

    // Handle custom fields
    const customFieldsData = [...(data.customFields || [])]

    // Update custom field values from imported data
    customFieldsData.forEach((field) => {
      if (firstRow[field.label] !== undefined) {
        field.value =
          field.type === "checkbox"
            ? firstRow[field.label] === "true" || firstRow[field.label] === true
            : firstRow[field.label]
      }
    })

    updatedData.customFields = customFieldsData

    // Update form data
    updateData(updatedData)

    toast({
      title: "Data imported",
      description: `Imported ${importedData.length} record(s) successfully.`,
    })
  }

  // Export data as CSV
  const exportAsCSV = () => {
    // Prepare data for export
    const exportData: Record<string, any> = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phone: data.phone || "",
      dateOfBirth: data.dateOfBirth || "",
      gender: data.gender || "",
      nationality: data.nationality || "",
      occupation: data.occupation || "",
      addressLine1: data.addressLine1 || "",
      addressLine2: data.addressLine2 || "",
      city: data.city || "",
      state: data.state || "",
      postalCode: data.postalCode || "",
      country: data.country || "",
      maritalStatus: data.maritalStatus || "",
    }

    // Add spouse data if present
    if (data.hasSpouse) {
      exportData["spouse.firstName"] = data.spouse.firstName || ""
      exportData["spouse.lastName"] = data.spouse.lastName || ""
      exportData["spouse.email"] = data.spouse.email || ""
      exportData["spouse.phone"] = data.spouse.phone || ""
      exportData["spouse.dateOfBirth"] = data.spouse.dateOfBirth || ""
      exportData["spouse.occupation"] = data.spouse.occupation || ""
    }

    // Add custom field values
    data.customFields?.forEach((field: CustomField) => {
      if (field.section === "client") {
        exportData[field.label] = field.value !== undefined ? field.value : ""
      } else if (field.section === "spouse" && data.hasSpouse) {
        exportData[`spouse.${field.label}`] = field.value !== undefined ? field.value : ""
      }
    })

    // Convert to CSV
    const headers = Object.keys(exportData)
    const csvContent = [
      headers.join(","),
      headers
        .map((header) => {
          const value = exportData[header]
          // Handle values with commas by quoting them
          return typeof value === "string" && value.includes(",") ? `"${value}"` : value
        })
        .join(","),
    ].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `client_data_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Data exported",
      description: "Client data has been exported to CSV successfully.",
    })
  }

  // Apply field template
  const applyFieldTemplate = (templateFields: Omit<CustomField, "id" | "value">[]) => {
    // Create new custom fields from template
    const newFields = templateFields.map((field) => ({
      ...field,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      value: field.type === "checkbox" ? false : "",
    }))

    // Add to existing custom fields
    updateData({
      customFields: [...(data.customFields || []), ...newFields],
    })

    toast({
      title: "Template applied",
      description: `Added ${newFields.length} custom fields from template.`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-truffle-800 mb-2">Personal Information</h2>
        <p className="text-sm text-truffle-500">
          Enter the client's personal and family information to begin the onboarding process.
        </p>
      </div>

      {/* Import/Export/Templates toolbar */}
      <div className="flex flex-wrap gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-lg text-truffle-600"
          onClick={() => setCsvImportDialogOpen(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Import from CSV
        </Button>

        <Button type="button" variant="outline" size="sm" className="rounded-lg text-truffle-600" onClick={exportAsCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export to CSV
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-lg text-truffle-600"
          onClick={() => setFieldTemplatesDialogOpen(true)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Field Templates
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="client">Client Details</TabsTrigger>
          <TabsTrigger value="spouse" disabled={!data.hasSpouse}>
            Spouse Details
          </TabsTrigger>
          <TabsTrigger value="children" disabled={!data.hasChildren}>
            Dependent Children
          </TabsTrigger>
        </TabsList>

        <TabsContent value="client" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name (English) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={data.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={`rounded-lg ${validationErrors.firstName ? "border-red-500" : ""}`}
                required
                aria-invalid={!!validationErrors.firstName}
                aria-describedby={validationErrors.firstName ? "firstName-error" : undefined}
              />
              {validationErrors.firstName && (
                <p id="firstName-error" className="text-sm text-red-500">
                  {validationErrors.firstName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name (English) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={data.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={`rounded-lg ${validationErrors.lastName ? "border-red-500" : ""}`}
                required
                aria-invalid={!!validationErrors.lastName}
                aria-describedby={validationErrors.lastName ? "lastName-error" : undefined}
              />
              {validationErrors.lastName && (
                <p id="lastName-error" className="text-sm text-red-500">
                  {validationErrors.lastName}
                </p>
              )}
            </div>
          </div>

          {showLocalizedName && (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="hasLocalName" className="text-sm font-medium">
                    {data.country === "Thailand" ? "Thai Name" : "Local Name"}
                  </Label>
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
                          {data.country === "Thailand"
                            ? "For Thai nationals or residents with a Thai name. Foreign nationals without a Thai name can skip this section."
                            : "For local nationals or residents with a local name in the native language."}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasLocalName"
                    checked={data.hasLocalName}
                    onCheckedChange={(checked) => handleChange("hasLocalName", checked)}
                  />
                  <Label htmlFor="hasLocalName" className="text-sm">
                    {data.hasLocalName ? "Enabled" : "Not applicable"}
                  </Label>
                </div>
              </div>

              {data.hasLocalName && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-late-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="localFirstName">
                      {data.country === "Thailand" ? "First Name (Thai)" : "First Name (Local)"}
                    </Label>
                    <Input
                      id="localFirstName"
                      value={data.localFirstName}
                      onChange={(e) => handleChange("localFirstName", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="localLastName">
                      {data.country === "Thailand" ? "Last Name (Thai)" : "Last Name (Local)"}
                    </Label>
                    <Input
                      id="localLastName"
                      value={data.localLastName}
                      onChange={(e) => handleChange("localLastName", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`rounded-lg ${validationErrors.email ? "border-red-500" : ""}`}
                required
                aria-invalid={!!validationErrors.email}
                aria-describedby={validationErrors.email ? "email-error" : undefined}
              />
              {validationErrors.email && (
                <p id="email-error" className="text-sm text-red-500">
                  {validationErrors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={data.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={data.gender} onValueChange={(value) => handleChange("gender", value)}>
                <SelectTrigger id="gender" className="rounded-lg">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={data.nationality}
                onChange={(e) => handleChange("nationality", e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={data.occupation}
                onChange={(e) => handleChange("occupation", e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address Line 1</Label>
            <Input
              id="addressLine1"
              value={data.addressLine1}
              onChange={(e) => handleChange("addressLine1", e.target.value)}
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input
              id="addressLine2"
              value={data.addressLine2}
              onChange={(e) => handleChange("addressLine2", e.target.value)}
              className="rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={data.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={data.state}
                onChange={(e) => handleChange("state", e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={data.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={data.country} onValueChange={(value) => handleChange("country", value)}>
              <SelectTrigger id="country" className="rounded-lg">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Thailand">Thailand</SelectItem>
                <SelectItem value="Singapore">Singapore</SelectItem>
                <SelectItem value="Malaysia">Malaysia</SelectItem>
                <SelectItem value="Indonesia">Indonesia</SelectItem>
                <SelectItem value="Vietnam">Vietnam</SelectItem>
                <SelectItem value="Philippines">Philippines</SelectItem>
                <SelectItem value="Cambodia">Cambodia</SelectItem>
                <SelectItem value="Myanmar">Myanmar</SelectItem>
                <SelectItem value="Laos">Laos</SelectItem>
                <SelectItem value="Brunei">Brunei</SelectItem>
                <SelectItem value="Japan">Japan</SelectItem>
                <SelectItem value="China">China</SelectItem>
                <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                <SelectItem value="Taiwan">Taiwan</SelectItem>
                <SelectItem value="South Korea">South Korea</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="New Zealand">New Zealand</SelectItem>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select value={data.maritalStatus} onValueChange={handleMaritalStatusChange}>
                <SelectTrigger id="maritalStatus" className="rounded-lg">
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="domestic-partnership">Domestic Partnership</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="hasChildren" checked={data.hasChildren} onCheckedChange={handleHasChildrenChange} />
              <Label htmlFor="hasChildren">Include dependent children in financial plan</Label>
            </div>
          </div>

          {/* Custom fields for client */}
          {getCustomFields("client").length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-medium text-truffle-700">Additional Information</h3>
              </div>

              <div className="space-y-4">
                {getCustomFields("client").map((field: CustomField) => (
                  <div key={field.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={field.id}>
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {field.description && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                                  <HelpCircle className="h-4 w-4 text-truffle-400" />
                                  <span className="sr-only">Info</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{field.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-truffle-500"
                        onClick={() => removeCustomField(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove field</span>
                      </Button>
                    </div>
                    {renderCustomField(field)}
                    {validationErrors[field.id] && (
                      <p id={`${field.id}-error`} className="text-sm text-red-500">
                        {validationErrors[field.id]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add custom field button */}
          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg text-truffle-600"
              onClick={() => openNewFieldDialog("client")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Field
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="spouse" className="space-y-6 pt-4">
          {data.hasSpouse ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spouseFirstName">
                    First Name (English)
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="spouseFirstName"
                    value={data.spouse.firstName}
                    onChange={(e) => handleSpouseChange("firstName", e.target.value)}
                    className={`rounded-lg ${validationErrors["spouse.firstName"] ? "border-red-500" : ""}`}
                    required
                    aria-invalid={!!validationErrors["spouse.firstName"]}
                    aria-describedby={validationErrors["spouse.firstName"] ? "spouseFirstName-error" : undefined}
                  />
                  {validationErrors["spouse.firstName"] && (
                    <p id="spouseFirstName-error" className="text-sm text-red-500">
                      {validationErrors["spouse.firstName"]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spouseLastName">
                    Last Name (English)
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="spouseLastName"
                    value={data.spouse.lastName}
                    onChange={(e) => handleSpouseChange("lastName", e.target.value)}
                    className={`rounded-lg ${validationErrors["spouse.lastName"] ? "border-red-500" : ""}`}
                    required
                    aria-invalid={!!validationErrors["spouse.lastName"]}
                    aria-describedby={validationErrors["spouse.lastName"] ? "spouseLastName-error" : undefined}
                  />
                  {validationErrors["spouse.lastName"] && (
                    <p id="spouseLastName-error" className="text-sm text-red-500">
                      {validationErrors["spouse.lastName"]}
                    </p>
                  )}
                </div>
              </div>

              {showLocalizedName && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="spouseHasLocalName" className="text-sm font-medium">
                        {data.country === "Thailand" ? "Thai Name" : "Local Name"}
                      </Label>
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
                              {data.country === "Thailand"
                                ? "For Thai nationals or residents with a Thai name. Foreign nationals without a Thai name can skip this section."
                                : "For local nationals or residents with a local name in the native language."}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="spouseHasLocalName"
                        checked={data.spouse.hasLocalName}
                        onCheckedChange={(checked) => handleSpouseChange("hasLocalName", checked)}
                      />
                      <Label htmlFor="spouseHasLocalName" className="text-sm">
                        {data.spouse.hasLocalName ? "Enabled" : "Not applicable"}
                      </Label>
                    </div>
                  </div>

                  {data.spouse.hasLocalName && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-late-50 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="spouseLocalFirstName">
                          {data.country === "Thailand" ? "First Name (Thai)" : "First Name (Local)"}
                        </Label>
                        <Input
                          id="spouseLocalFirstName"
                          value={data.spouse.localFirstName}
                          onChange={(e) => handleSpouseChange("localFirstName", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spouseLocalLastName">
                          {data.country === "Thailand" ? "Last Name (Thai)" : "Last Name (Local)"}
                        </Label>
                        <Input
                          id="spouseLocalLastName"
                          value={data.spouse.localLastName}
                          onChange={(e) => handleSpouseChange("localLastName", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spouseDateOfBirth">Date of Birth</Label>
                  <Input
                    id="spouseDateOfBirth"
                    type="date"
                    value={data.spouse.dateOfBirth}
                    onChange={(e) => handleSpouseChange("dateOfBirth", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spouseOccupation">Occupation</Label>
                  <Input
                    id="spouseOccupation"
                    value={data.spouse.occupation}
                    onChange={(e) => handleSpouseChange("occupation", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spouseEmail">Email</Label>
                  <Input
                    id="spouseEmail"
                    type="email"
                    value={data.spouse.email}
                    onChange={(e) => handleSpouseChange("email", e.target.value)}
                    className={`rounded-lg ${validationErrors["spouse.email"] ? "border-red-500" : ""}`}
                    aria-invalid={!!validationErrors["spouse.email"]}
                    aria-describedby={validationErrors["spouse.email"] ? "spouseEmail-error" : undefined}
                  />
                  {validationErrors["spouse.email"] && (
                    <p id="spouseEmail-error" className="text-sm text-red-500">
                      {validationErrors["spouse.email"]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spousePhone">Phone Number</Label>
                  <Input
                    id="spousePhone"
                    value={data.spouse.phone}
                    onChange={(e) => handleSpouseChange("phone", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Custom fields for spouse */}
              {getCustomFields("spouse").length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium text-truffle-700">Additional Information</h3>
                  </div>

                  <div className="space-y-4">
                    {getCustomFields("spouse").map((field: CustomField) => (
                      <div key={field.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={field.id}>
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            {field.description && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                                      <HelpCircle className="h-4 w-4 text-truffle-400" />
                                      <span className="sr-only">Info</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{field.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-truffle-500"
                            onClick={() => removeCustomField(field.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove field</span>
                          </Button>
                        </div>
                        {renderCustomField(field)}
                        {validationErrors[field.id] && (
                          <p id={`${field.id}-error`} className="text-sm text-red-500">
                            {validationErrors[field.id]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add custom field button */}
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-truffle-600"
                  onClick={() => openNewFieldDialog("spouse")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Field
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-truffle-500">
                Please select "Married" or "Domestic Partnership" in the Client Details tab to add spouse information.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="children" className="space-y-6 pt-4">
          {data.hasChildren ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-truffle-800">Children Information</h3>
                <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addChild}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Child
                </Button>
              </div>

              {data.children &&
                data.children.map((child: any, index: number) => (
                  <Card key={index} className="border border-truffle-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-truffle-800">Child {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeChild(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`childFirstName-${index}`}>
                            First Name (English)
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`childFirstName-${index}`}
                            value={child.firstName}
                            onChange={(e) => updateChild(index, "firstName", e.target.value)}
                            className={`rounded-lg ${validationErrors[`children[${index}].firstName`] ? "border-red-500" : ""}`}
                            required
                            aria-invalid={!!validationErrors[`children[${index}].firstName`]}
                            aria-describedby={
                              validationErrors[`children[${index}].firstName`]
                                ? `childFirstName-${index}-error`
                                : undefined
                            }
                          />
                          {validationErrors[`children[${index}].firstName`] && (
                            <p id={`childFirstName-${index}-error`} className="text-sm text-red-500">
                              {validationErrors[`children[${index}].firstName`]}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`childLastName-${index}`}>
                            Last Name (English)
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`childLastName-${index}`}
                            value={child.lastName}
                            onChange={(e) => updateChild(index, "lastName", e.target.value)}
                            className={`rounded-lg ${validationErrors[`children[${index}].lastName`] ? "border-red-500" : ""}`}
                            required
                            aria-invalid={!!validationErrors[`children[${index}].lastName`]}
                            aria-describedby={
                              validationErrors[`children[${index}].lastName`]
                                ? `childLastName-${index}-error`
                                : undefined
                            }
                          />
                          {validationErrors[`children[${index}].lastName`] && (
                            <p id={`childLastName-${index}-error`} className="text-sm text-red-500">
                              {validationErrors[`children[${index}].lastName`]}
                            </p>
                          )}
                        </div>
                      </div>

                      {showLocalizedName && (
                        <>
                          <div className="flex items-center justify-between mt-4 mb-2">
                            <div className="flex items-center space-x-2">
                              <Label htmlFor={`childHasLocalName-${index}`} className="text-sm font-medium">
                                {data.country === "Thailand" ? "Thai Name" : "Local Name"}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`childHasLocalName-${index}`}
                                checked={child.hasLocalName}
                                onCheckedChange={(checked) => updateChild(index, "hasLocalName", checked)}
                              />
                              <Label htmlFor={`childHasLocalName-${index}`} className="text-sm">
                                {child.hasLocalName ? "Enabled" : "Not applicable"}
                              </Label>
                            </div>
                          </div>

                          {child.hasLocalName && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-late-50 rounded-lg mb-4">
                              <div className="space-y-2">
                                <Label htmlFor={`childLocalFirstName-${index}`}>
                                  {data.country === "Thailand" ? "First Name (Thai)" : "First Name (Local)"}
                                </Label>
                                <Input
                                  id={`childLocalFirstName-${index}`}
                                  value={child.localFirstName}
                                  onChange={(e) => updateChild(index, "localFirstName", e.target.value)}
                                  className="rounded-lg"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`childLocalLastName-${index}`}>
                                  {data.country === "Thailand" ? "Last Name (Thai)" : "Last Name (Local)"}
                                </Label>
                                <Input
                                  id={`childLocalLastName-${index}`}
                                  value={child.localLastName}
                                  onChange={(e) => updateChild(index, "localLastName", e.target.value)}
                                  className="rounded-lg"
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor={`childDateOfBirth-${index}`}>Date of Birth</Label>
                          <Input
                            id={`childDateOfBirth-${index}`}
                            type="date"
                            value={child.dateOfBirth}
                            onChange={(e) => updateChild(index, "dateOfBirth", e.target.value)}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`childRelationship-${index}`}>Relationship</Label>
                          <Select
                            value={child.relationship}
                            onValueChange={(value) => updateChild(index, "relationship", value)}
                          >
                            <SelectTrigger id={`childRelationship-${index}`} className="rounded-lg">
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="biological">Biological</SelectItem>
                              <SelectItem value="adopted">Adopted</SelectItem>
                              <SelectItem value="step-child">Step-child</SelectItem>
                              <SelectItem value="foster">Foster</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4">
                        <Switch
                          id={`childIsDependent-${index}`}
                          checked={child.isDependent}
                          onCheckedChange={(checked) => updateChild(index, "isDependent", checked)}
                        />
                        <Label htmlFor={`childIsDependent-${index}`}>Financially dependent</Label>
                      </div>

                      {/* Custom fields for this child */}
                      {getCustomFields("children", index).length > 0 && (
                        <div className="space-y-4 pt-4 mt-4 border-t">
                          <div className="flex items-center justify-between">
                            <h3 className="text-md font-medium text-truffle-700">Additional Information</h3>
                          </div>

                          <div className="space-y-4">
                            {getCustomFields("children", index).map((field: CustomField) => (
                              <div key={field.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Label htmlFor={field.id}>
                                      {field.label}
                                      {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </Label>
                                    {field.description && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                                              <HelpCircle className="h-4 w-4 text-truffle-400" />
                                              <span className="sr-only">Info</span>
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="max-w-xs">{field.description}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-truffle-500"
                                    onClick={() => removeCustomField(field.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Remove field</span>
                                  </Button>
                                </div>
                                {renderCustomField(field)}
                                {validationErrors[field.id] && (
                                  <p id={`${field.id}-error`} className="text-sm text-red-500">
                                    {validationErrors[field.id]}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add custom field button for this child */}
                      <div className="pt-4 mt-2 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-lg text-truffle-600"
                          onClick={() => openNewFieldDialog("children", index)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Custom Field
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-truffle-500">
                Please enable "Include dependent children in financial plan" in the Client Details tab to add children
                information.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog for adding new custom field */}
      <Dialog open={newFieldDialogOpen} onOpenChange={setNewFieldDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Custom Field</DialogTitle>
            <DialogDescription>Create a custom field to capture additional information.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fieldLabel">Field Label</Label>
              <Input
                id="fieldLabel"
                value={newField.label}
                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                placeholder="e.g., Passport Number"
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldType">Field Type</Label>
              <Select
                value={newField.type}
                onValueChange={(value: CustomFieldType) =>
                  setNewField({ ...newField, type: value, options: value === "select" ? [] : undefined })
                }
              >
                <SelectTrigger id="fieldType" className="rounded-lg">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="select">Dropdown</SelectItem>
                  <SelectItem value="textarea">Text Area</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldDescription">Description (Optional)</Label>
              <Input
                id="fieldDescription"
                value={newField.description || ""}
                onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                placeholder="Help text for this field"
                className="rounded-lg"
              />
            </div>

            {newField.type === "text" && (
              <div className="space-y-2">
                <Label htmlFor="fieldValidation">Validation Pattern (Optional)</Label>
                <Input
                  id="fieldValidation"
                  value={newField.validation || ""}
                  onChange={(e) => setNewField({ ...newField, validation: e.target.value })}
                  placeholder="e.g., ^[0-9]{13}$ for Thai ID"
                  className="rounded-lg"
                />
                <p className="text-xs text-truffle-500">Enter a regular expression pattern to validate this field.</p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="fieldRequired"
                checked={newField.required || false}
                onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
              />
              <Label htmlFor="fieldRequired">Required field</Label>
            </div>

            {newField.type === "select" && (
              <div className="space-y-2">
                <Label>Dropdown Options</Label>
                <div className="flex space-x-2">
                  <Input
                    value={tempOption}
                    onChange={(e) => setTempOption(e.target.value)}
                    placeholder="Add option"
                    className="rounded-lg"
                  />
                  <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addOption}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {newField.options && newField.options.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {newField.options.map((option, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-late-50 rounded-lg">
                        <span>{option.label}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-truffle-500"
                          onClick={() => removeOption(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNewFieldDialogOpen(false)} className="rounded-lg">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={addCustomField}
              className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
              disabled={
                !newField.label.trim() ||
                (newField.type === "select" && (!newField.options || newField.options.length === 0))
              }
            >
              Add Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Import Dialog */}
      <CSVImportDialog
        open={csvImportDialogOpen}
        onOpenChange={setCsvImportDialogOpen}
        onImport={handleCsvImport}
        formFields={[
          "firstName",
          "lastName",
          "email",
          "phone",
          "dateOfBirth",
          "gender",
          "nationality",
          "occupation",
          "addressLine1",
          "addressLine2",
          "city",
          "state",
          "postalCode",
          "country",
          "maritalStatus",
          "spouse.firstName",
          "spouse.lastName",
          "spouse.email",
          "spouse.phone",
          "spouse.dateOfBirth",
          "spouse.occupation",
        ]}
        customFields={data.customFields || []}
      />

      {/* Field Templates Dialog */}
      <FieldTemplatesDialog
        open={fieldTemplatesDialogOpen}
        onOpenChange={setFieldTemplatesDialogOpen}
        onApplyTemplate={applyFieldTemplate}
        currentFields={data.customFields || []}
      />
    </div>
  )
}

