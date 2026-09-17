"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import { usePaletteOpen } from "@/components/palette-open"
import { CategoryStageCard } from "@/components/stage/category-stage-card"
import { CursorMark, SparkleMark } from "@/components/sticker-deco"
import { useNavigate } from "@/hooks/use-navigate"
import { useStageNav, wrapOffset } from "@/hooks/use-stage-nav"
import { categories, linksByCategory } from "@/lib/data/library"
import type { LibraryLink } from "@/lib/data/types"
import { categoryPath } from "@/lib/paths"
import { cn } from "@/lib/utils"

function popularity(link: LibraryLink) {
  return (link.likeCount ?? 0) * 1000 + (link.uv ?? 0) * 10 + (link.pv ?? 0)
}

function popularLinks(links: LibraryLink[], limit: number) {
  return [...links]
    .sort((a, b) => popularity(b) - popularity(a))
    .slice(0, limit)
}

function LogoOrnaments() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
      <span
        className="logo-ornament absolute top-[6%] left-[4%] text-sticker-pink"
        style={{ animationDelay: "0s" }}
      >
        <SparkleMark className="size-3.5" />
      </span>
      <span
        className="logo-ornament absolute -top-1 right-[10%] text-sticker-cyan"
        style={{ animationDelay: "0.45s" }}
      >
        <SparkleMark className="size-4" />
      </span>
      <span
        className="logo-ornament absolute top-[38%] -left-1 size-2 rounded-full border-2 border-white bg-sticker-yellow shadow-[0_0_0_2px_var(--sticker-ink)]"
        style={{ animationDelay: "0.9s" }}
      />
      <span
        className="logo-ornament absolute top-[36%] -right-2 text-sticker-blue"
        style={{ animationDelay: "1.2s" }}
      >
        <SparkleMark className="size-3" />
      </span>
      <span
        className="logo-ornament absolute right-[18%] bottom-[16%]"
        style={{ animationDelay: "1.7s" }}
      >
        <CursorMark className="size-7" />
      </span>
      <span
        className="logo-ornament absolute bottom-[20%] left-[10%] text-sticker-cyan"
        style={{ animationDelay: "2.1s" }}
      >
        <SparkleMark className="size-2.5" />
      </span>
      <span
        className="logo-ornament absolute top-[14%] right-[28%] size-1.5 rounded-full border-2 border-white bg-sticker-pink"
        style={{ animationDelay: "0.25s" }}
      />
    </div>
  )
}

export function CategoryStage() {
  const paletteOpen = usePaletteOpen()
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  const { stageRef, shiftRef } = useStageNav({
    count: categories.length,
    index,
    setIndex,
    enabled: !paletteOpen,
    onEnter: () => {
      const slug = categories[index]?.slug
      if (slug) {
        navigate(categoryPath(slug))
      }
    },
  })

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReducedMotion(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  return (
    <section
      ref={stageRef}
      className="relative flex h-svh touch-none flex-col overflow-hidden overscroll-none select-none [--card-h:min(26.25rem,calc(100svh-26rem))] [--card-top:3.25rem] [--card-w:23.75rem] [perspective:1800px] max-md:[--card-h:min(24rem,calc(100svh-15.5rem))] max-md:[--card-top:0.6rem] max-md:[--card-w:min(22.5rem,calc(100vw-3.25rem))] max-md:[perspective:1200px] max-sm:[--card-h:min(22rem,calc(100svh-13.75rem))] [@media(max-height:32rem)]:[--card-h:min(18rem,calc(100svh-9.5rem))] [@media(max-height:32rem)]:[--card-top:0.25rem]"
    >
      <div className="relative z-10 mx-auto w-full shrink-0 px-4 pt-[calc(3.5rem+env(safe-area-inset-top,0px))] pb-1 text-center sm:px-6 sm:pt-[calc(5rem+env(safe-area-inset-top,0px))] sm:pb-2">
        <div className="relative mx-auto w-[min(18rem,70vw)] sm:w-[min(28rem,86vw)] md:w-[min(32rem,68vw)]">
          <Image
            src="/iuestc-byte-lib.png"
            alt="iUESTC Byte Lib"
            width={1280}
            height={580}
            priority
            unoptimized
            className="relative mx-auto h-auto max-h-[14vh] w-full object-contain drop-shadow-[6px_8px_0_rgba(255,90,165,0.28)] select-none sm:max-h-none"
          />
          <div className="max-sm:hidden">
            <LogoOrnaments />
          </div>
        </div>
        <h1 className="mx-auto mt-2 px-3 font-heading text-[0.68rem] font-semibold tracking-[0.12em] text-foreground uppercase sm:mt-3 sm:text-base sm:tracking-[0.14em] [@media(max-height:32rem)]:hidden">
          <span className="relative inline-block px-1">
            <span
              aria-hidden
              className="absolute inset-x-[-0.18em] top-[0.46em] h-[0.58em] -rotate-[1.4deg] rounded-[1px] bg-sticker-yellow"
            />
            <span className="relative">UESTC COMMUNITY LIBRARY</span>
          </span>
        </h1>
      </div>

      <div
        ref={shiftRef}
        className="relative min-h-0 flex-1 overflow-hidden [transform-style:preserve-3d]"
      >
        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {categories.map((category, i) => {
            const all = linksByCategory[category.slug] ?? []
            const preview = popularLinks(all, 4)
            const offset = wrapOffset(i, index, categories.length)
            return (
              <CategoryStageCard
                key={category.slug}
                category={category}
                offset={offset}
                active={offset === 0}
                onActivate={() => setIndex(i)}
                previewLinks={preview}
                totalCount={all.length}
                reducedMotion={reducedMotion}
              />
            )
          })}
        </div>
      </div>

      <div
        data-stage-chrome=""
        className="relative z-20 flex shrink-0 items-center justify-center px-2 pt-1 pb-[calc(2.75rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(3.25rem+env(safe-area-inset-bottom,0px))]"
      >
        {categories.map((category, i) => {
          const current = i === index
          return (
            <button
              key={category.slug}
              type="button"
              aria-label={`查看${category.name}`}
              aria-current={current ? "true" : undefined}
              onClick={() => setIndex(i)}
              className="grid h-8 w-5 touch-manipulation place-items-center outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-8"
            >
              <span
                className={cn(
                  "h-1.5 rounded-full transition-[width,background-color] duration-300",
                  current
                    ? "w-5 bg-sticker-ink sm:w-6"
                    : "w-1.5 bg-sticker-ink/25"
                )}
              />
            </button>
          )
        })}
      </div>
    </section>
  )
}
