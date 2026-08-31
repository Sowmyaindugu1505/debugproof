import type { ReactNode } from "react"

export function TechTag({
  label,
  children,
}: {
  label?: string
  children?: ReactNode
}) {
  const content = label ?? children

  return (
    <span className="inline-flex items-center rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted">
      {content}
    </span>
  )
}
