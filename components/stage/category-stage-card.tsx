"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import type { CSSProperties, MouseEvent } from "react"

import { Separator } from "@/components/ui/separator"
import { accentClasses } from "@/lib/accents"
import { categoryIcon } from "@/lib/category-icons"
import type { Category, LibraryLink } from "@/lib/data/types"
import { categoryPath } from "@/lib/paths"
import { cn } from "@/lib/utils"

type CategoryStageCardProps = {
  category: Category
  offset: number
  active: boolean
  onActivate: () => void
  previewLinks: LibraryLink[]
  totalCount: number
  reducedMotion: boolean
}

function stageTransform(offset: number) {
  const abs = Math.abs(offset)
  const sign = offset === 0 ? 0 : offset > 0 ? 1 : -1
  const x = abs === 0 ? 0 : abs === 1 ? 0.86 : abs === 2 ? 1.52 : 2
  const scale = abs === 0 ? 1 : abs === 1 ? 0.86 : abs === 2 ? 0.72 : 0.64
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.78 : abs === 2 ? 0.32 : 0
  const blur = 0
  const rotateY = abs === 0 ? 0 : abs === 1 ? -sign * 7 : -sign * 10
  const zIndex = abs === 0 ? 40 : abs === 1 ? 30 : abs === 2 ? 20 : 10
  const pointerEvents = abs <= 1 ? "auto" : "none"

  return {
    x: sign * x,
    scale,
    opacity,
    blur,
    rotateY,
    zIndex,
    pointerEvents: pointerEvents as "auto" | "none",
    abs,
  }
}

export function CategoryStageCard({
  category,
  offset,
  active,
  onActivate,
  previewLinks,
  totalCount,
  reducedMotion,
}: CategoryStageCardProps) {
  const t = stageTransform(offset)
  const classes = accentClasses[category.accent]
  const enterDelay = Math.min(t.abs, 2) * 60

  const onCardClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (active || event.metaKey || event.ctrlKey || event.shiftKey) {
      return
    }
    event.preventDefault()
    onActivate()
  }

  return (
    <div
      data-stage-card=""
      data-slug={category.slug}
      data-offset={offset}
      aria-current={active ? "true" : undefined}
      className={cn(
        "stage-card-face absolute top-[calc(var(--card-top)+var(--card-h)/2)] left-1/2 h-[var(--card-h)] w-[var(--card-w)]",
        t.abs >= 2 && "max-[900px]:hidden"
      )}
      style={
        {
          marginLeft: "calc(var(--card-w) / -2)",
          marginTop: "calc(var(--card-h) / -2)",
          transform: `translateX(calc(${t.x} * var(--card-w))) scale(${t.scale}) rotateY(${t.rotateY}deg)`,
          opacity: t.opacity,
          zIndex: t.zIndex,
          pointerEvents: t.pointerEvents,
          "--stage-blur": reducedMotion ? "0px" : `${t.blur}px`,
          transition:
            "transform var(--dur-stage) var(--ease-stage), opacity 480ms var(--ease-soft), filter 480ms var(--ease-soft)",
        } as CSSProperties
      }
    >
      <Link
        href={categoryPath(category.slug)}
        aria-label={`进入 ${category.name} 分类`}
        onClick={onCardClick}
        style={{ animationDelay: `${enterDelay}ms` }}
        className="relative flex min-h-full w-full animate-in flex-col rounded-2xl bg-white px-6 py-6 text-left duration-500 fade-in-0 outline-none surface-shadow-stage [animation-fill-mode:backwards] slide-in-from-bottom-3 focus-visible:ring-2 focus-visible:ring-ring dark:bg-card"
      >
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "grid size-9 place-items-center rounded-xl",
              classes.mono,
              classes.text
            )}
          >
            <HugeiconsIcon
              icon={categoryIcon(category.slug)}
              strokeWidth={2}
              className="size-4"
            />
          </div>
          <p className="font-sans text-[12px] text-muted-foreground tabular-nums">
            <span className="font-mono">{totalCount}</span>
            {" 篇文档"}
          </p>
        </div>

        <p className="mt-5 font-sans text-[11px] tracking-[0.2em] text-muted-foreground/80 uppercase">
          {category.nameEn}
        </p>
        <h2 className="mt-2 font-heading text-[2rem] leading-[1.12] tracking-tight text-foreground">
          {category.name}
        </h2>
        <p className="mt-3.5 text-[14px] leading-relaxed text-foreground/62">
          {category.tagline}
        </p>

        <Separator className="mt-6 bg-border" />

        <p
          className={cn(
            "mt-5 font-mono text-[11px] tracking-[0.22em] uppercase",
            classes.text
          )}
        >
          热门资料
        </p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {previewLinks.map((link) => (
            <li key={link.id} className="flex min-w-0 items-center gap-2.5">
              <span
                className={cn("size-1.5 shrink-0 rounded-full", classes.dot)}
              />
              <span className="truncate text-[13.5px] text-foreground/90">
                {link.displayTitle ?? link.title}
              </span>
            </li>
          ))}
          {previewLinks.length === 0 ? (
            <li className="text-[13px] text-muted-foreground">暂无公开文档</li>
          ) : null}
        </ul>
      </Link>
    </div>
  )
}
