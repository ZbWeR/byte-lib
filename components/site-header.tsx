"use client"

import Link from "next/link"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState } from "react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { SHOW_GLOSSARY } from "@/lib/features"
import { glossaryPath, HOME_PATH } from "@/lib/paths"
import { cn } from "@/lib/utils"

type SiteHeaderProps = {
  pathname: string
  onSearch: () => void
}

export function SiteHeader({ pathname, onSearch }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const isGlossary = pathname.startsWith("/glossary")

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
        "fixed top-5 left-1/2 z-50 w-max max-w-[calc(100vw-1.5rem)] -translate-x-1/2"
      )}
    >
      <div
        className={cn(
          "flex h-13 items-center gap-1 rounded-full border border-border/60 pr-2 pl-4 surface-shadow glass transition-all duration-300",
          scrolled && "h-12 shadow-lg"
        )}
      >
        <Link
          href={HOME_PATH}
          className="flex items-center gap-0 rounded-full pr-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="回到图书馆首页"
        >
          <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
            UESTC
          </span>
          <span className="mx-2 inline-block size-1 rounded-full bg-cat-lime" />
          <span className="text-[15px] font-medium tracking-tight">
            Byte Lib
          </span>
        </Link>

        {SHOW_GLOSSARY ? (
          <>
            <Separator orientation="vertical" className="mx-2 h-5" />
            <div className="relative flex rounded-full bg-muted/60 p-1">
              <span
                className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-background surface-shadow transition-transform duration-300"
                style={{
                  transform: isGlossary ? "translateX(100%)" : "translateX(0)",
                }}
                aria-hidden
              />
              <Link
                href={HOME_PATH}
                className={cn(
                  "relative z-10 rounded-full px-4 py-1 text-[13px] transition-colors",
                  !isGlossary
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                图书馆
              </Link>
              <Link
                href={glossaryPath()}
                className={cn(
                  "relative z-10 rounded-full px-4 py-1 text-[13px] transition-colors",
                  isGlossary
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                词典
              </Link>
            </div>
          </>
        ) : (
          <Separator orientation="vertical" className="mx-2 h-5" />
        )}

        <Button
          type="button"
          variant="ghost"
          className="ml-1 rounded-full"
          onClick={onSearch}
          aria-label="搜索"
        >
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
          <span className="hidden sm:inline">搜索</span>
          <Kbd className="hidden sm:inline">⌘K</Kbd>
        </Button>

        <ThemeToggle />
      </div>
    </header>
  )
}
