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
  const scale = abs === 0 ? 1 : abs === 1 ? 0.8 : abs === 2 ? 0.66 : 0.58
  const opacity = abs <= 2 ? 1 : 0
  const wash = abs === 0 ? 0 : abs === 1 ? 0.52 : 0.72
  const rotateY = abs === 0 ? 0 : abs === 1 ? -sign * 7 : -sign * 10
  const zIndex = abs === 0 ? 40 : abs === 1 ? 30 : abs === 2 ? 20 : 10
  const pointerEvents = abs <= 1 ? "auto" : "none"

  return {
    x: sign * x,
    scale,
    opacity,
    wash,
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
          transition:
            "transform var(--dur-stage) var(--ease-stage), opacity 480ms var(--ease-soft)",
        } as CSSProperties
      }
    >
      <Link
        href={categoryPath(category.slug)}
        aria-label={`进入 ${category.name} 分类`}
        onClick={onCardClick}
        style={{ animationDelay: `${enterDelay}ms` }}
        className={cn(
          "relative flex min-h-full w-full animate-in flex-col rounded-[28px] sticker bg-card px-5 py-5 text-left duration-500 fade-in-0 outline-none [animation-fill-mode:backwards] slide-in-from-bottom-3 focus-visible:ring-2 focus-visible:ring-ring",
          classes.sticker
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "grid size-10 place-items-center rounded-2xl border-2 border-white shadow-[0_0_0_2px_var(--sticker-ink)]",
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
          <p className="rounded-full sticker-chip px-2 py-0.5 font-heading text-[12px] font-semibold text-foreground tabular-nums">
            <span className="font-mono">{totalCount}</span>
            {" 篇文档"}
          </p>
        </div>

        <p className="mt-4 font-heading text-[11px] font-semibold tracking-[0.16em] text-sticker-blue uppercase">
          {category.nameEn}
        </p>
        <h2 className="mt-1.5 font-heading text-[1.85rem] leading-[1.15] font-semibold tracking-tight">
          {category.name}
        </h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-foreground/75">
          {category.tagline}
        </p>

        <Separator className="mt-4 h-0.5 rounded-full bg-sticker-ink/15" />

        <p className="mt-3 font-heading text-[11px] font-semibold tracking-[0.14em] text-sticker-pink">
          热门资料
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {previewLinks.map((link) => (
            <li key={link.id} className="flex min-w-0 items-center gap-2.5">
              <span
                className={cn(
                  "size-2.5 shrink-0 rounded-full border-2 border-white shadow-[0_0_0_1.5px_var(--sticker-ink)]",
                  classes.dot
                )}
              />
              <span className="truncate text-[14.5px] font-medium text-foreground">
                {link.displayTitle ?? link.title}
              </span>
            </li>
          ))}
          {previewLinks.length === 0 ? (
            <li className="text-[13px] text-muted-foreground">暂无公开文档</li>
          ) : null}
        </ul>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[25px] bg-background"
          style={{
            opacity: t.wash,
            transition: reducedMotion
              ? "none"
              : "opacity 480ms var(--ease-soft)",
          }}
        />
      </Link>
    </div>
  )
}
