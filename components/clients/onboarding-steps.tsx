"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  label: string
}

interface OnboardingStepsProps {
  steps: Step[]
  currentStep: string
  onStepClick: (stepId: string) => void
}

export function OnboardingSteps({ steps, currentStep, onStepClick }: OnboardingStepsProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <div className="p-6 border-b border-late-100">
      <div className="hidden md:flex items-center">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = index < currentStepIndex

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                  isActive && "bg-gold-400 text-truffle-800",
                  isCompleted && "bg-emerald-500 text-white",
                  !isActive && !isCompleted && "bg-late-200 text-truffle-500",
                )}
                disabled={index > currentStepIndex + 1}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </button>

              <div className="text-xs font-medium ml-2 text-truffle-700">{step.label}</div>

              {index < steps.length - 1 && (
                <div className={cn("h-0.5 flex-1 mx-2", index < currentStepIndex ? "bg-emerald-500" : "bg-late-200")} />
              )}
            </div>
          )
        })}
      </div>

      <div className="md:hidden">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium text-truffle-700">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
          <div className="text-sm font-medium text-truffle-700">{steps[currentStepIndex].label}</div>
        </div>

        <div className="w-full bg-late-200 h-1 rounded-full overflow-hidden">
          <div className="bg-gold-400 h-full" style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

