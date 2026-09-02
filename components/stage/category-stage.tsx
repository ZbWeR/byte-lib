"use client"

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState } from "react"

import { usePaletteOpen } from "@/components/palette-open"
import { CategoryStageCard } from "@/components/stage/category-stage-card"
import { StageIndicator } from "@/components/stage/stage-indicator"
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
      className="group relative flex h-svh touch-none flex-col overflow-hidden overscroll-none [--card-h:min(500px,calc(100svh-18rem))] [--card-w:400px] [perspective:1800px] max-[900px]:[--card-w:min(400px,82vw)]"
    >
      <div className="relative z-10 mx-auto w-full max-w-2xl px-6 pt-20 pb-2 text-center">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
          UESTC COMMUNITY LIBRARY
        </p>
        <h1 className="mt-3 font-heading text-[2.15rem] leading-[1.2] tracking-tight sm:text-[2.5rem]">
          从你的学院开始
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
          由电子科大学生共同维护的课程资料库
        </p>
      </div>

      <div className="relative min-h-0 flex-1 [transform-style:preserve-3d]">
        <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]">
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
          className="absolute top-1/2 left-6 z-50 -translate-y-1/2 rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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
          className="absolute top-1/2 right-6 z-50 -translate-y-1/2 rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
        </Button>
      </div>

      <StageIndicator activeIndex={index} onSelect={setIndex} />
    </section>
  )
}
