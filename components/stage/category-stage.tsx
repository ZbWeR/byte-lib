"use client"

import Image from "next/image"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState } from "react"

import { usePaletteOpen } from "@/components/palette-open"
import { CategoryStageCard } from "@/components/stage/category-stage-card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@/hooks/use-navigate"
import { useStageNav, wrapOffset } from "@/hooks/use-stage-nav"
import { categories, linksByCategory } from "@/lib/data/library"
import type { LibraryLink } from "@/lib/data/types"
import { categoryPath } from "@/lib/paths"

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
    <section
      ref={stageRef}
      className="group relative flex h-svh touch-none flex-col overflow-hidden overscroll-none [--card-h:min(400px,calc(100svh-22rem))] [--card-top:1.5rem] [--card-w:380px] [perspective:1800px] max-[900px]:[--card-w:min(380px,82vw)]"
    >
      <div className="relative z-10 mx-auto w-full shrink-0 px-6 pt-16 pb-0 text-center sm:pt-20">
        <div className="relative mx-auto w-[min(25.2rem,77vw)] sm:w-[min(28.8rem,61vw)]">
          <Image
            src="/iuestc-byte-lib.png"
            alt="iUESTC Byte Lib"
            width={1280}
            height={580}
            priority
            unoptimized
            className="relative h-auto w-full select-none opacity-80 dark:opacity-100"
          />
        </div>
        <h1 className="mt-1.5 font-mono text-[11px] tracking-[0.22em] text-muted-foreground/50 uppercase">
          UESTC COMMUNITY LIBRARY
        </h1>
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
    </section>
  )
}
