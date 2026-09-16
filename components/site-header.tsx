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
          className="group relative inline-flex -rotate-[1.4deg] items-center px-4 py-1.5 font-heading text-base font-semibold tracking-[0.04em] text-foreground outline-none transition-colors duration-[var(--dur-micro)] focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="回到图书馆首页"
        >
          <svg
            aria-hidden
            viewBox="0 0 180 40"
            preserveAspectRatio="none"
            overflow="visible"
            className="absolute -inset-x-1.5 -inset-y-0.5 text-card transition-colors duration-[var(--dur-micro)] group-hover:text-sticker-yellow"
          >
            <path
              d="M21.4 4.8c-9.2-.6-17.8 4.8-18.8 14.1-1.1 9.8 5.4 17.6 16.6 18.4 8.2.6 22.4-1.8 34.8.8 14.2 3 31.6-1.2 46.2.6 13.6 1.6 28.8 2.4 42.4.2 11.8-1.8 22.8-7.4 23.6-16.8.9-10.6-8.4-17.8-20.2-18.6-12.4-.8-27.2 2.6-41.6.4-15.2-2.4-31.4 1.4-46.8-1.2C44.2 1.4 31.2 5.4 21.4 4.8Z"
              fill="currentColor"
              stroke="var(--sticker-ink)"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
          </svg>
          <span className="relative">UESTC · Byte Lib</span>
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
