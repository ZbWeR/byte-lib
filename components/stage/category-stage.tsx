"use client"

import Image from "next/image"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState } from "react"

import { usePaletteOpen } from "@/components/palette-open"
import { CategoryStageCard } from "@/components/stage/category-stage-card"
import { StageIndicator } from "@/components/stage/stage-indicator"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@/hooks/use-navigate"
import { useStageNav, wrapOffset } from "@/hooks/use-stage-nav"
import { accentClasses } from "@/lib/accents"
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

export function CategoryStage() {
  const paletteOpen = usePaletteOpen()
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const accent = categories[index]?.accent ?? "lime"
  const classes = accentClasses[accent]

  const { stageRef, step } = useStageNav({
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
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed -top-40 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-50 blur-[120px] transition-colors duration-700",
          classes.glow
        )}
      />
      <section
        ref={stageRef}
        className="group relative flex h-svh touch-none flex-col overflow-hidden overscroll-none [--card-h:min(360px,calc(100svh-24rem))] [--card-top:4.5rem] [--card-w:380px] [perspective:1800px] max-[900px]:[--card-w:min(380px,82vw)]"
      >
        <div className="relative z-10 mx-auto w-full max-w-2xl shrink-0 px-6 pt-20 pb-0 text-center sm:pt-24">
          <h1 className="sr-only">从你的学院开始 · UESTC Byte Lib</h1>
          <Image
            src="/iuestc-byte-lib.png"
            alt="iUESTC Byte Lib"
            width={1280}
            height={720}
            priority
            quality={95}
            className="mx-auto h-auto w-[min(22rem,82vw)] select-none sm:w-[min(26rem,70vw)]"
          />
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden [transform-style:preserve-3d]">
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

          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            data-stage-chrome
            aria-label="上一个分类"
            onClick={() => step(-1)}
            className="absolute top-[calc(var(--card-top)+var(--card-h)/2)] left-6 z-50 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            data-stage-chrome
            aria-label="下一个分类"
            onClick={() => step(1)}
            className="absolute top-[calc(var(--card-top)+var(--card-h)/2)] right-6 z-50 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
        </div>

        <StageIndicator activeIndex={index} onSelect={setIndex} />
      </section>
    </>
  )
}
