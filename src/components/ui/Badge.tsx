import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Tone =
  | "neutral"
  | "primary"
  | "accent"
  | "warning"
  | "danger"
  | "ai"

type Variant = "neutral" | "primary" | "success" | "danger"

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted border-border",
  primary: "bg-primary-soft text-primary border-transparent",
  accent: "bg-accent-soft text-accent border-transparent",
  warning: "bg-warning-soft text-warning border-transparent",
  danger: "bg-danger-soft text-danger border-transparent",
  ai: "bg-ai-soft text-ai border-transparent",
}

const variantToTone: Record<Variant, Tone> = {
  neutral: "neutral",
  primary: "primary",
  success: "accent",
  danger: "danger",
}

export function Badge({
  children,
  tone,
  variant,
  className,
}: {
  children: ReactNode
  tone?: Tone
  variant?: Variant
  className?: string
}) {
  const resolvedTone: Tone =
    tone ?? (variant ? variantToTone[variant] : "neutral")

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide",
        tones[resolvedTone],
        className,
      )}
    >
      {children}
    </span>
  )
}