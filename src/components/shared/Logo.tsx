import { cn } from "@/lib/utils"

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string
  showWordmark?: boolean
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <path
            d="M5 6.5 9 12l-4 5.5M13 17.5h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight">
          Debug<span className="text-primary">Proof</span>
        </span>
      )}
    </span>
  )
}
