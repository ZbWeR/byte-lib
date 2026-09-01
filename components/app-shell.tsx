"use client"

import { useEffect, useState } from "react"

import { CategoryDetail } from "@/components/category/category-detail"
import { CommandPalette } from "@/components/command-palette"
import { GlossaryView } from "@/components/glossary/glossary-view"
import { NotFoundView } from "@/components/not-found-view"
import { SiteHeader } from "@/components/site-header"
import { CategoryStage } from "@/components/stage/category-stage"
import { TooltipProvider } from "@/components/ui/tooltip"
import { navigate, routeKey, useHashRoute } from "@/hooks/use-hash-route"
import { isTypingTarget } from "@/hooks/use-stage-nav"
import { accentClasses } from "@/lib/accents"
import { categories, categoryBySlug } from "@/lib/data/categories"
import type { AccentKey } from "@/lib/data/types"
import { cn } from "@/lib/utils"

const NOISE_BG = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`
)}")`

function ambientAccent(
  routeName: string,
  stageIndex: number,
  slug?: string
): AccentKey {
  if (routeName === "category" && slug) {
    return categoryBySlug.get(slug)?.accent ?? "lime"
  }
  return categories[stageIndex]?.accent ?? "lime"
}

export function AppShell() {
  const route = useHashRoute()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [stageIndex, setStageIndex] = useState(0)

  if (route.name === "category") {
    const next = categories.findIndex((item) => item.slug === route.slug)
    if (next >= 0 && next !== stageIndex) {
      setStageIndex(next)
    }
  }

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

      if (event.key === "Escape" && !paletteOpen && route.name === "category") {
        navigate("#/")
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [paletteOpen, route.name])

  useEffect(() => {
    if (route.name === "stage") {
      const html = document.documentElement
      const prev = html.style.overflow
      html.style.overflow = "hidden"
      return () => {
        html.style.overflow = prev
      }
    }
  }, [route.name])

  const accent = ambientAccent(
    route.name,
    stageIndex,
    route.name === "category" ? route.slug : undefined
  )
  const key = routeKey(route)

  return (
    <TooltipProvider>
      <div className="relative min-h-svh">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div
            className={cn(
              "absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-50 blur-[120px] transition-colors duration-700",
              accentClasses[accent].glow
            )}
          />
          <div
            className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
            style={{ backgroundImage: NOISE_BG }}
          />
        </div>

        <SiteHeader route={route} onSearch={() => setPaletteOpen(true)} />

        <div
          key={key}
          className="animate-in duration-300 fade-in-0 slide-in-from-bottom-2"
        >
          {route.name === "stage" ? (
            <CategoryStage
              index={stageIndex}
              setIndex={setStageIndex}
              enabled={!paletteOpen}
            />
          ) : null}
          {route.name === "category" ? (
            <CategoryDetail slug={route.slug} focus={route.focus} />
          ) : null}
          {route.name === "glossary" ? (
            <GlossaryView term={route.term} />
          ) : null}
          {route.name === "not-found" ? <NotFoundView raw={route.raw} /> : null}
        </div>

        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      </div>
    </TooltipProvider>
  )
}
