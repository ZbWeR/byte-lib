"use client"

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState, type Dispatch, type SetStateAction } from "react"

import { CategoryStageCard } from "@/components/stage/category-stage-card"
import { StageIndicator } from "@/components/stage/stage-indicator"
import { Button } from "@/components/ui/button"
import { navigate } from "@/hooks/use-hash-route"
import { useStageNav } from "@/hooks/use-stage-nav"
import { categories } from "@/lib/data/categories"
import { linksByCategory } from "@/lib/data/links"
import { cn } from "@/lib/utils"

type CategoryStageProps = {
  index: number
  setIndex: Dispatch<SetStateAction<number>>
  enabled: boolean
}

export function CategoryStage({
  index,
  setIndex,
  enabled,
}: CategoryStageProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [showHint, setShowHint] = useState(true)

  const { stageRef, step } = useStageNav({
    count: categories.length,
    index,
    setIndex,
    enabled,
    onEnter: () => navigate(`#/c/${categories[index]?.slug}`),
  })

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReducedMotion(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(false), 4800)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <section
      ref={stageRef}
      className="group relative h-svh touch-none overflow-hidden overscroll-none [--card-w:520px] [perspective:1800px] max-[900px]:[--card-w:min(520px,86vw)]"
    >
      <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]">
        {categories.map((category, i) => {
          const preview = (linksByCategory[category.slug] ?? []).slice(0, 5)
          const total = (linksByCategory[category.slug] ?? []).length
          return (
            <CategoryStageCard
              key={category.slug}
              category={category}
              index={i}
              offset={i - index}
              active={i === index}
              onActivate={() => setIndex(i)}
              previewLinks={preview}
              totalCount={total}
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
        className={cn(
          "absolute top-1/2 left-6 z-50 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          index === 0 && "group-hover:opacity-40"
        )}
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
        className={cn(
          "absolute top-1/2 right-6 z-50 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          index === categories.length - 1 && "group-hover:opacity-40"
        )}
      >
        <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
      </Button>

      <StageIndicator
        activeIndex={index}
        onSelect={setIndex}
        showHint={showHint}
      />
    </section>
  )
}
