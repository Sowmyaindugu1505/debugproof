import { cn } from "@/lib/utils"

/**
 * Lightweight, dependency-free code presentation. Renders diff lines with
 * add/remove tinting and keeps everything monospaced and precise.
 */
export function CodeBlock({
  code,
  language,
  filename,
  className,
}: {
  code: string
  language?: string
  filename?: string
  className?: string
}) {
  const lines = code.split("\n")

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-[#0c0d12]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-3.5 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        </div>
        <span className="font-mono text-[11px] tracking-wide text-muted-2">
          {filename ?? language ?? "code"}
        </span>
      </div>
      <pre className="overflow-x-auto px-0 py-3 font-mono text-[13px] leading-6">
        <code>
          {lines.map((line, i) => {
            const isAdd = line.startsWith("+")
            const isRemove = line.startsWith("-")
            return (
              <div
                key={i}
                className={cn(
                  "px-4",
                  isAdd && "bg-accent-soft text-accent",
                  isRemove && "bg-danger-soft text-danger",
                  !isAdd && !isRemove && "text-foreground/85",
                )}
              >
                {line || "\u00A0"}
              </div>
            )
          })}
        </code>
      </pre>
    </div>
  )
}
