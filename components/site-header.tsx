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
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "flex h-16 items-center justify-between px-6 transition-colors duration-300 md:px-10",
          !isHome && scrolled && "bg-background/90 backdrop-blur-md"
        )}
      >
        <Link
          href={HOME_PATH}
          className="rounded-full sticker-chip px-3.5 py-1.5 font-heading text-base font-semibold tracking-[0.04em] text-foreground transition-transform duration-[var(--dur-micro)] outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="回到图书馆首页"
        >
          UESTC · Byte Lib
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
              <Kbd>⌘K</Kbd>
            </TooltipContent>
          </Tooltip>
          <AboutTrigger />
        </div>
      </div>
    </header>
  )
}
