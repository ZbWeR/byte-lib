"use client"

import { useAboutDialog } from "@/components/about-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type SiteFooterProps = {
  overlay?: boolean
}

export function SiteFooter({ overlay = false }: SiteFooterProps) {
  const { setOpen } = useAboutDialog()

  return (
    <footer
      className={cn(
        "px-6 py-4 text-center text-[11px] tracking-[0.08em] text-muted-foreground",
        overlay
          ? "pointer-events-none fixed inset-x-0 bottom-0 z-40"
          : "mt-auto"
      )}
    >
      <Tooltip>
        <TooltipTrigger
          delay={200}
          render={
            <button
              type="button"
              className="pointer-events-auto rounded-md tracking-[0.08em] transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setOpen(true)}
            />
          }
        >
          © 2023 UESTC Byte Lib.
        </TooltipTrigger>
        <TooltipContent side="top">关于我们</TooltipContent>
      </Tooltip>
    </footer>
  )
}
