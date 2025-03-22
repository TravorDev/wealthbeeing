"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { OnboardingSteps } from "./onboarding-steps"
import { PersonalInfoForm } from "./onboarding/personal-info-form"
import { CashflowForm } from "./onboarding/cashflow-form"
import { BalanceSheetForm } from "./onboarding/balance-sheet-form"
import { CurrentPoliciesForm } from "./onboarding/current-policies-form"
import { WealthProtectionForm } from "./onboarding/wealth-protection-form"
import { PlanSelectionForm } from "./onboarding/plan-selection-form"
import { FinancialGoalsForm } from "./onboarding/financial-goals-form"
import { TaxPlanningForm } from "./onboarding/tax-planning-form"
import { OnboardingSummary } from "./onboarding/onboarding-summary"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Define all the steps in the onboarding process
const steps = [
  { id: "personal", label: "Personal Information" },
  { id: "cashflow", label: "Cashflow" },
  { id: "balance-sheet", label: "Balance Sheet" },
  { id: "current-policies", label: "Current Policies" },
  { id: "wealth-protection", label: "Wealth Protection" },
  { id: "plan-selection", label: "Choose Plan" },
  { id: "financial-goals", label: "Financial Goals" },
  { id: "tax-planning", label: "Tax Planning" },
  { id: "summary", label: "Summary" },
]

export function ClientOnboardingForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    occupation: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Thailand",
    maritalStatus: "single",
    hasSpouse: false,
    localFirstName: "",
    localLastName: "",
    hasLocalName: false,
    spouse: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      occupation: "",
      email: "",
      phone: "",
      localFirstName: "",
      localLastName: "",
      hasLocalName: false,
    },
    hasChildren: false,
    children: [],
    customFields: [],

    // Cashflow
    monthlyIncome: "",
    annualIncome: "",
    incomeSource: "",
    monthlyExpenses: "",
    discretionaryExpenses: "",
    fixedExpenses: "",

    // Balance Sheet
    assets: [] as { type: string; description: string; value: string }[],
    liabilities: [] as { type: string; description: string; value: string; interestRate: string }[],

    // Current Policies
    policies: [] as { type: string; provider: string; coverageAmount: string; premium: string; expiryDate: string }[],

    // Wealth Protection
    riskTolerance: "",
    dependents: [] as { name: string; relationship: string; age: string }[],
    estateDocuments: [] as { type: string; status: string; lastUpdated: string }[],

    // Plan Selection
    selectedPlans: [] as string[],

    // Financial Goals
    shortTermGoals: [] as { description: string; targetDate: string; estimatedCost: string; priority: string }[],
    mediumTermGoals: [] as { description: string; targetDate: string; estimatedCost: string; priority: string }[],
    longTermGoals: [] as { description: string; targetDate: string; estimatedCost: string; priority: string }[],

    // Tax Planning
    taxStatus: "",
    taxBracket: "",
    taxDeductions: [] as { type: string; amount: string }[],
    taxCredits: [] as { type: string; amount: string }[],

    // Client Status
    status: "prospect", // prospect or client
  })

  // Find the current step index
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  // Determine if we're on the first or last step
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  // Handle form data changes
  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  // Save progress (this would typically save to a database)
  const saveProgress = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Progress saved",
        description: "Your progress has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error saving progress",
        description: "There was an error saving your progress. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Validate the current step
  const validateCurrentStep = () => {
    setValidationErrors({})

    // Validate personal information step
    if (currentStep === "personal") {
      const errors: Record<string, string> = {}

      // Required fields
      if (!formData.firstName) errors["firstName"] = "First name is required"
      if (!formData.lastName) errors["lastName"] = "Last name is required"
      if (!formData.email) errors["email"] = "Email is required"

      // Email format validation
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors["email"] = "Invalid email format"
      }

      // Validate spouse fields if applicable
      if (formData.hasSpouse) {
        if (!formData.spouse.firstName) errors["spouse.firstName"] = "Spouse first name is required"
        if (!formData.spouse.lastName) errors["spouse.lastName"] = "Spouse last name is required"

        // Email format validation for spouse
        if (formData.spouse.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.spouse.email)) {
          errors["spouse.email"] = "Invalid email format"
        }
      }

      // Validate children fields if applicable
      if (formData.hasChildren && formData.children) {
        formData.children.forEach((child: any, index: number) => {
          if (!child.firstName) errors[`children[${index}].firstName`] = "Child first name is required"
          if (!child.lastName) errors[`children[${index}].lastName`] = "Child last name is required"
        })
      }

      // Validate custom fields
      formData.customFields?.forEach((field: any) => {
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

    // For other steps, we can add validation as needed
    return true
  }

  // Navigate to the next step
  const handleNext = () => {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before proceeding.",
        variant: "destructive",
      })
      return
    }

    if (isLastStep) {
      handleSubmit()
      return
    }

    const nextStepIndex = currentStepIndex + 1
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].id)
      window.scrollTo(0, 0)
    }
  }

  // Navigate to the previous step
  const handlePrevious = () => {
    const prevStepIndex = currentStepIndex - 1
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex].id)
      window.scrollTo(0, 0)
    }
  }

  // Jump to a specific step
  const jumpToStep = (stepId: string) => {
    setCurrentStep(stepId)
    window.scrollTo(0, 0)
  }

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Client onboarded successfully",
        description: "The client has been added to your portfolio.",
      })

      // Redirect to client list or detail page
      router.push("/clients")
    } catch (error) {
      toast({
        title: "Error submitting form",
        description: "There was an error submitting the form. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Save as prospect
  const saveAsProspect = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Saved as prospect",
        description: "The client has been saved as a prospect.",
      })

      // Redirect to client list
      router.push("/clients")
    } catch (error) {
      toast({
        title: "Error saving prospect",
        description: "There was an error saving the prospect. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle exit
  const handleExit = () => {
    setShowExitDialog(true)
  }

  // Render the current step form
  const renderStepForm = () => {
    switch (currentStep) {
      case "personal":
        return <PersonalInfoForm data={formData} updateData={updateFormData} />
      case "cashflow":
        return <CashflowForm data={formData} updateData={updateFormData} />
      case "balance-sheet":
        return <BalanceSheetForm data={formData} updateData={updateFormData} />
      case "current-policies":
        return <CurrentPoliciesForm data={formData} updateData={updateFormData} />
      case "wealth-protection":
        return <WealthProtectionForm data={formData} updateData={updateFormData} />
      case "plan-selection":
        return <PlanSelectionForm data={formData} updateData={updateFormData} />
      case "financial-goals":
        return <FinancialGoalsForm data={formData} updateData={updateFormData} />
      case "tax-planning":
        return <TaxPlanningForm data={formData} updateData={updateFormData} />
      case "summary":
        return <OnboardingSummary data={formData} />
      default:
        return <PersonalInfoForm data={formData} updateData={updateFormData} />
    }
  }

  return (
    <>
      <Card className="premium-card shadow-[0_4px_20px_rgba(193,177,162,0.1)] hover:shadow-[0_8px_30px_rgba(193,177,162,0.15)]">
        <CardContent className="p-0">
          <OnboardingSteps steps={steps} currentStep={currentStep} onStepClick={jumpToStep} />

          <div className="p-6">
            {renderStepForm()}

            <div className="flex justify-between mt-8 border-t pt-6">
              <div>
                {!isFirstStep && (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-lg mr-2"
                    onClick={handlePrevious}
                    disabled={isLoading}
                  >
                    Previous
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg"
                  onClick={handleExit}
                  disabled={isLoading}
                >
                  Exit
                </Button>
              </div>

              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg mr-2"
                  onClick={saveProgress}
                  disabled={isLoading}
                >
                  Save Progress
                </Button>

                {currentStep === "personal" && (
                  <Button
                    type="button"
                    className="rounded-lg bg-late-400 text-truffle-800 hover:bg-late-500 mr-2"
                    onClick={saveAsProspect}
                    disabled={isLoading}
                  >
                    Save as Prospect
                  </Button>
                )}

                <Button
                  type="button"
                  className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  {isLastStep ? "Complete Onboarding" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Exit onboarding process?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be saved, but you will exit the onboarding process. You can continue later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-lg bg-gold-400 text-truffle-800 hover:bg-gold-500"
              onClick={() => router.push("/clients")}
            >
              Save & Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

