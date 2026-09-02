"use client"

import Link from "next/link"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { CSSProperties, MouseEvent } from "react"

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

function yearTags(tags: string[]) {
  return tags.filter((tag) => /^20\d{2}$/.test(tag)).slice(0, 6)
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
  const years = yearTags(category.tags)
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
        "stage-card-face absolute top-1/2 left-1/2 h-[var(--card-h)] w-[var(--card-w)]",
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
        className={cn(
          "group relative flex h-full w-full animate-in flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 text-left transition-[border-color,transform] duration-500 fade-in-0 outline-none [animation-fill-mode:backwards] slide-in-from-bottom-3 focus-visible:ring-2 focus-visible:ring-ring",
          active && "hover:-translate-y-0.5 hover:border-foreground/25"
        )}
      >
        <div className="flex items-baseline justify-between gap-4">
          <p className="min-w-0 truncate font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {category.nameEn}
          </p>
          <p className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
            {totalCount}
            {" 篇文档"}
          </p>
        </div>

        <h2 className="mt-5 font-heading text-[2rem] leading-[1.15] tracking-tight">
          {category.name}
        </h2>

        <p className="mt-8 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
          热门资料
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {previewLinks.map((link) => (
            <li key={link.id} className="flex min-w-0 items-center gap-2.5">
              <span className="size-1 shrink-0 rounded-full bg-muted-foreground/40" />
              <span className="truncate text-[13px] text-foreground/80">
                {link.displayTitle ?? link.title}
              </span>
            </li>
          ))}
          {previewLinks.length === 0 ? (
            <li className="text-[13px] text-muted-foreground">暂无公开文档</li>
          ) : null}
        </ul>

        {years.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {years.map((year) => (
              <span
                key={year}
                className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground tabular-nums"
              >
                {year}
              </span>
            ))}
          </div>
        ) : null}

        <div
          className={cn(
            "mt-auto flex items-center gap-1 pt-6 text-[13px] transition-opacity duration-300",
            active ? "opacity-100" : "opacity-0"
          )}
        >
          进入学院
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className="size-4 transition-transform duration-[var(--dur-micro)] group-hover:translate-x-1"
          />
        </div>
      </Link>
    </div>
  )
}
