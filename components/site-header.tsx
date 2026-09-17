"use client"

import Link from "next/link"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState } from "react"

import { AboutTrigger } from "@/components/about-dialog"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HOME_PATH } from "@/lib/paths"
import { cn } from "@/lib/utils"

type SiteHeaderProps = {
  pathname: string
  onSearch: () => void
}

export function SiteHeader({ pathname, onSearch }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const isHome = pathname === HOME_PATH

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)]",
        !isHome && scrolled && "bg-background/90 backdrop-blur-md"
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 transition-colors duration-300 sm:h-16 sm:px-6 md:px-10">
        <Link
          href={HOME_PATH}
          className="group font-heading text-sm font-semibold tracking-[0.04em] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-base"
          aria-label="回到图书馆首页"
        >
          UESTC ·{" "}
          <span className="relative inline-block">
            Byte Lib
            <svg
              aria-hidden
              viewBox="0 0 88 8"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-[-0.08em] -bottom-[0.18em] h-[0.32em] w-[calc(100%+0.16em)] origin-left scale-x-0 text-sticker-yellow transition-transform duration-[var(--dur-micro)] group-hover:scale-x-100"
            >
              <path
                d="M1.2 5.1c18.4-2.6 35.2 2.2 52.8.2C66.4 4.2 76.8 2.4 86.6 4.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger
              delay={200}
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  aria-label="搜索"
                  onClick={onSearch}
                />
              }
            >
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2.2} />
            </TooltipTrigger>
            <TooltipContent>
              搜索
              <Kbd className="max-sm:hidden">⌘K</Kbd>
            </TooltipContent>
          </Tooltip>
          <AboutTrigger />
        </div>
      </div>
    </header>
  )
}
