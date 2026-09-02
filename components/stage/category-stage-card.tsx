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
  const scale = abs === 0 ? 1 : abs === 1 ? 0.84 : abs === 2 ? 0.7 : 0.62
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.4 : abs === 2 ? 0.14 : 0
  const blur = abs === 0 ? 0 : abs === 1 ? 3 : abs === 2 ? 6 : 8
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
        "stage-card-face absolute top-[calc(2rem+var(--card-h)/2)] left-1/2 h-[var(--card-h)] w-[var(--card-w)]",
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
        className="relative flex h-full w-full animate-in flex-col overflow-hidden rounded-2xl border border-border bg-white px-5 py-5 text-left duration-500 fade-in-0 outline-none [animation-fill-mode:backwards] slide-in-from-bottom-3 focus-visible:ring-2 focus-visible:ring-ring dark:bg-card"
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

        <p className="mt-4 font-sans text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          {category.nameEn}
        </p>
        <h2 className="mt-1.5 font-heading text-[1.85rem] leading-[1.15] tracking-tight">
          {category.name}
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
          {category.tagline}
        </p>

        <Separator className="mt-4 opacity-60" />

        <p className="mt-3 font-mono text-[11px] tracking-[0.16em] text-muted-foreground">
          热门资料
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {previewLinks.map((link) => (
            <li key={link.id} className="flex min-w-0 items-center gap-2.5">
              <span
                className={cn("size-1.5 shrink-0 rounded-full", classes.dot)}
              />
              <span className="truncate text-[13px] text-foreground/80">
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
