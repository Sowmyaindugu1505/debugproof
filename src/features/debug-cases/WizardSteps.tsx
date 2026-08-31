import { Check } from "lucide-react"
import { cn } from "../../lib/utils"

interface WizardStepsProps {
  steps: string[]
  current: number
}

export function WizardSteps({ steps, current }: WizardStepsProps) {
  return (
    <ol className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-0">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex items-center gap-3 sm:flex-1">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                  done && "border-transparent bg-primary text-primary-foreground",
                  active && "border-primary text-primary",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="mx-3 hidden h-px flex-1 bg-border sm:block" aria-hidden="true" />
            )}
          </li>
        )
      })}
    </ol>
  )
}
