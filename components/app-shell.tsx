"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

import { AboutDialogProvider } from "@/components/about-dialog"
import { CommandPalette } from "@/components/command-palette"
import { FluidCursor } from "@/components/fluid-cursor"
import { MemphisLayer } from "@/components/sticker-deco"
import { PaletteOpenContext } from "@/components/palette-open"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TooltipProvider } from "@/components/ui/tooltip"
import { isTypingTarget } from "@/hooks/use-stage-nav"
import { HOME_PATH, pathFromLegacyHash } from "@/lib/paths"

function HashRedirect() {
  const router = useRouter()

  useEffect(() => {
    const next = pathFromLegacyHash(window.location.hash)
    if (!next) {
      return
    }
    const current = `${window.location.pathname}${window.location.search}`
    if (next === current || (next === HOME_PATH && current === HOME_PATH)) {
      if (window.location.hash) {
        window.history.replaceState(null, "", next)
      }
      return
    }
    router.replace(next)
  }, [router])

  return null
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const isHome = pathname === HOME_PATH
  const isCategory = pathname.startsWith("/c/")

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setPaletteOpen((open) => !open)
        return
      }

      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        if (isTypingTarget(event.target)) {
          return
        }
        event.preventDefault()
        setPaletteOpen(true)
        return
      }

      if (event.key === "Escape" && !paletteOpen && isCategory) {
        router.push(HOME_PATH)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isCategory, paletteOpen, router])

  useEffect(() => {
    if (!isHome) {
      return
    }
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = "hidden"
    return () => {
      html.style.overflow = prev
    }
  }, [isHome])

  return (
    <TooltipProvider>
      <AboutDialogProvider>
        <HashRedirect />
        <div className="relative isolate flex min-h-svh flex-col">
          <div className="pointer-events-none fixed inset-0 -z-10">
            {isHome ? (
              <>
                <FluidCursor />
                <MemphisLayer variant="home" />
              </>
            ) : (
              <>
                <div className="absolute top-[30%] right-[-8%] h-[360px] w-[360px] rounded-full bg-sticker-yellow/30 blur-[100px]" />
                <div className="absolute inset-0 dot-grid opacity-[0.12]" />
                <MemphisLayer variant="page" />
              </>
            )}
          </div>

          <SiteHeader
            pathname={pathname}
            onSearch={() => setPaletteOpen(true)}
          />

          <PaletteOpenContext.Provider value={paletteOpen}>
            <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          </PaletteOpenContext.Provider>

          <SiteFooter overlay={isHome} />

          <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
        </div>
      </AboutDialogProvider>
    </TooltipProvider>
  )
}
