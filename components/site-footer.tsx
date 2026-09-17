"use client"

import Link from "next/link"

import { useAboutDialog } from "@/components/about-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FRIENDS_PATH } from "@/lib/paths"
import { cn } from "@/lib/utils"

type SiteFooterProps = {
  overlay?: boolean
}

export function SiteFooter({ overlay = false }: SiteFooterProps) {
  const { setOpen } = useAboutDialog()

  return (
    <footer
      className={cn(
        "px-6 py-4 text-center font-heading text-xs font-semibold tracking-[0.04em] text-foreground/70",
        overlay
          ? "pointer-events-none fixed inset-x-0 bottom-0 z-40"
          : "mt-auto"
      )}
    >
      <div className="pointer-events-auto inline-flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger
            delay={200}
            render={
              <button
                type="button"
                className="tracking-[0.04em] text-foreground/55 transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setOpen(true)}
              />
            }
          >
            © 2023 UESTC Byte Lib.
          </TooltipTrigger>
          <TooltipContent side="top">关于我们</TooltipContent>
        </Tooltip>
        <span className="text-foreground/20" aria-hidden>
          ·
        </span>
        <Link
          href={FRIENDS_PATH}
          className="tracking-[0.04em] text-foreground/55 transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          友情链接
        </Link>
      </div>
    </footer>
  )
}
