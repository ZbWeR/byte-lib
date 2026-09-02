import { cn } from "@/lib/utils"

type SiteFooterProps = {
  overlay?: boolean
}

export function SiteFooter({ overlay = false }: SiteFooterProps) {
  return (
    <footer
      className={cn(
        "px-6 py-8 text-center text-[11px] tracking-[0.08em] text-muted-foreground",
        overlay && "pointer-events-none absolute inset-x-0 bottom-0 z-40 py-3.5"
      )}
    >
      © 2023 UESTC Byte Lib.
    </footer>
  )
}
