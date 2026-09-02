"use client"

import Image from "next/image"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  SourceCodeIcon,
  SparklesIcon,
  StarIcon,
} from "@hugeicons/core-free-icons"
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

function SparkleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M8 0c.35 3.4 1.4 5.25 4.2 6C9.4 7.15 8.35 9 8 12.4 7.65 9 6.6 7.15 3.8 6 6.6 5.25 7.65 3.4 8 0Z"
      />
    </svg>
  )
}

function LogoOrnaments() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
      <span
        className="logo-ornament absolute top-[6%] left-[4%] text-[#ff5aa5]"
        style={{ animationDelay: "0s" }}
      >
        <SparkleMark className="size-3.5" />
      </span>
      <span
        className="logo-ornament absolute -top-1 right-[10%] text-[#6ec8ff]"
        style={{ animationDelay: "0.45s" }}
      >
        <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} className="size-4" />
      </span>
      <span
        className="logo-ornament absolute top-[38%] -left-1 size-1.5 rounded-full bg-[#ffd54a]"
        style={{ animationDelay: "0.9s" }}
      />
      <span
        className="logo-ornament absolute top-[36%] -right-2 text-[#6ec8ff]"
        style={{ animationDelay: "1.2s" }}
      >
        <HugeiconsIcon
          icon={SourceCodeIcon}
          strokeWidth={2}
          className="size-4"
        />
      </span>
      <span
        className="logo-ornament absolute right-[18%] bottom-[16%] text-[#ff5aa5]"
        style={{ animationDelay: "1.7s" }}
      >
        <HugeiconsIcon icon={StarIcon} strokeWidth={2} className="size-3.5" />
      </span>
      <span
        className="logo-ornament absolute bottom-[20%] left-[10%] text-[#6ec8ff]"
        style={{ animationDelay: "2.1s" }}
      >
        <SparkleMark className="size-2.5" />
      </span>
      <span
        className="logo-ornament absolute top-[14%] right-[28%] size-1 rounded-full bg-[#ff5aa5]"
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
      className="group relative flex h-svh touch-none flex-col overflow-hidden overscroll-none [--card-h:min(360px,calc(100svh-26rem))] [--card-top:4.5rem] [--card-w:380px] [perspective:1800px] max-[900px]:[--card-w:min(380px,82vw)]"
    >
      <div className="relative z-10 mx-auto w-full shrink-0 px-6 pt-16 pb-0 text-center sm:pt-20">
        <h1 className="sr-only">从你的学院开始 · UESTC Byte Lib</h1>
        <div className="relative mx-auto w-[min(28rem,86vw)] sm:w-[min(32rem,68vw)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute top-[18%] left-1/2 h-28 w-[70%] -translate-x-1/2 rounded-full bg-[#ff5aa5]/40 blur-[56px] dark:bg-[#ff5aa5]/30" />
          </div>
          <Image
            src="/iuestc-byte-lib.png"
            alt="iUESTC Byte Lib"
            width={1280}
            height={580}
            priority
            unoptimized
            className="relative h-auto w-full select-none"
          />
          <LogoOrnaments />
        </div>
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
  )
}
