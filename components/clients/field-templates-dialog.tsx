"use client"

import { useState } from "react"
import { Trash2, Save, Copy } from "lucide-react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

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
}

interface FieldTemplate {
  id: string
  name: string
  description: string
  fields: Omit<CustomField, "id" | "value">[]
}

interface FieldTemplatesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyTemplate: (fields: Omit<CustomField, "id" | "value">[]) => void
  currentFields: CustomField[]
}

// Predefined templates
const predefinedTemplates: FieldTemplate[] = [
  {
    id: "thai-id",
    name: "Thai Identification",
    description: "Common identification fields for Thai clients",
    fields: [
      {
        label: "Thai ID Number",
        type: "text",
        section: "client",
      },
      {
        label: "Passport Number",
        type: "text",
        section: "client",
      },
      {
        label: "Tax ID",
        type: "text",
        section: "client",
      },
    ],
  },
  {
    id: "investment-preferences",
    name: "Investment Preferences",
    description: "Fields for capturing client investment preferences",
    fields: [
      {
        label: "Risk Tolerance",
        type: "select",
        section: "client",
        options: [
          { label: "Conservative", value: "conservative" },
          { label: "Moderate", value: "moderate" },
          { label: "Aggressive", value: "aggressive" },
        ],
      },
      {
        label: "Investment Horizon",
        type: "select",
        section: "client",
        options: [
          { label: "Short Term (< 2 years)", value: "short" },
          { label: "Medium Term (2-5 years)", value: "medium" },
          { label: "Long Term (> 5 years)", value: "long" },
        ],
      },
      {
        label: "ESG Preference",
        type: "checkbox",
        section: "client",
      },
    ],
  },
  {
    id: "education-planning",
    name: "Education Planning",
    description: "Fields for children's education planning",
    fields: [
      {
        label: "School Type",
        type: "select",
        section: "children",
        options: [
          { label: "Public", value: "public" },
          { label: "Private", value: "private" },
          { label: "International", value: "international" },
        ],
      },
      {
        label: "Education Fund Target",
        type: "number",
        section: "children",
      },
      {
        label: "University Preference",
        type: "text",
        section: "children",
      },
    ],
  },
]

export function FieldTemplatesDialog({
  open,
  onOpenChange,
  onApplyTemplate,
  currentFields,
}: FieldTemplatesDialogProps) {
  const [templates, setTemplates] = useState<FieldTemplate[]>(() => {
    // Try to load saved templates from localStorage
    const savedTemplates = typeof window !== "undefined" ? localStorage.getItem("fieldTemplates") : null

    return savedTemplates ? [...predefinedTemplates, ...JSON.parse(savedTemplates)] : predefinedTemplates
  })

  const [newTemplate, setNewTemplate] = useState<FieldTemplate>({
    id: "",
    name: "",
    description: "",
    fields: [],
  })

  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false)

  // Save current fields as a new template
  const saveAsTemplate = () => {
    if (!newTemplate.name) {
      toast({
        title: "Template name required",
        description: "Please provide a name for your template.",
        variant: "destructive",
      })
      return
    }

    // Create new template
    const template: FieldTemplate = {
      ...newTemplate,
      id: `custom-${Date.now()}`,
      fields: currentFields.map(({ id, value, ...rest }) => rest),
    }

    // Add to templates
    const updatedTemplates = [...templates, template]
    setTemplates(updatedTemplates)

    // Save to localStorage (excluding predefined templates)
    const customTemplates = updatedTemplates.filter(
      (t) =>
        !t.id.startsWith("thai-id") &&
        !t.id.startsWith("investment-preferences") &&
        !t.id.startsWith("education-planning"),
    )

    if (typeof window !== "undefined") {
      localStorage.setItem("fieldTemplates", JSON.stringify(customTemplates))
    }

    // Reset form
    setNewTemplate({
      id: "",
      name: "",
      description: "",
      fields: [],
    })

    setShowNewTemplateForm(false)

    toast({
      title: "Template saved",
      description: "Your field template has been saved successfully.",
    })
  }

  // Apply a template
  const applyTemplate = (template: FieldTemplate) => {
    onApplyTemplate(template.fields)
    onOpenChange(false)

    toast({
      title: "Template applied",
      description: `Applied template: ${template.name}`,
    })
  }

  // Delete a template
  const deleteTemplate = (templateId: string) => {
    // Only allow deleting custom templates
    if (
      templateId.startsWith("thai-id") ||
      templateId.startsWith("investment-preferences") ||
      templateId.startsWith("education-planning")
    ) {
      toast({
        title: "Cannot delete",
        description: "Predefined templates cannot be deleted.",
        variant: "destructive",
      })
      return
    }

    const updatedTemplates = templates.filter((t) => t.id !== templateId)
    setTemplates(updatedTemplates)

    // Save to localStorage
    const customTemplates = updatedTemplates.filter(
      (t) =>
        !t.id.startsWith("thai-id") &&
        !t.id.startsWith("investment-preferences") &&
        !t.id.startsWith("education-planning"),
    )

    if (typeof window !== "undefined") {
      localStorage.setItem("fieldTemplates", JSON.stringify(customTemplates))
    }

    toast({
      title: "Template deleted",
      description: "The template has been deleted.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Field Templates</DialogTitle>
          <DialogDescription>
            Apply a predefined template or save your current fields as a template for future use.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Available Templates</h3>

            {!showNewTemplateForm && currentFields.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowNewTemplateForm(true)}
                className="rounded-lg"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Current Fields as Template
              </Button>
            )}
          </div>

          {showNewTemplateForm && (
            <Card className="mb-4 border-gold-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Save as Template</CardTitle>
                <CardDescription>Save your current custom fields as a reusable template</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="e.g., Thai Client Extended Info"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateDescription">Description (Optional)</Label>
                  <Input
                    id="templateDescription"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    placeholder="Describe what this template is for"
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewTemplateForm(false)}
                  className="rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={saveAsTemplate}
                  className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
                >
                  Save Template
                </Button>
              </CardFooter>
            </Card>
          )}

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {templates.map((template) => (
                <Card key={template.id} className="border-truffle-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-md">{template.name}</CardTitle>
                      <div className="flex space-x-1">
                        {template.id.startsWith("custom-") && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTemplate(template.id)}
                            className="h-8 w-8 rounded-full text-truffle-500 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete template</span>
                          </Button>
                        )}
                      </div>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2">
                      {template.fields.map((field, index) => (
                        <Badge key={index} variant="outline" className="bg-late-50">
                          {field.label}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyTemplate(template)}
                      className="rounded-lg"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Apply Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)} className="rounded-lg">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

