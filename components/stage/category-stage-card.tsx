"use client"

import Link from "next/link"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { CSSProperties, MouseEvent } from "react"

import { Favicon } from "@/components/favicon"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { accentClasses } from "@/lib/accents"
import { categoryIcon } from "@/lib/category-icons"
import type { Category, LibraryLink } from "@/lib/data/types"
import { categoryPath } from "@/lib/paths"
import { cn } from "@/lib/utils"

type CategoryStageCardProps = {
  category: Category
  index: number
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
  index,
  offset,
  active,
  onActivate,
  previewLinks,
  totalCount,
  reducedMotion,
}: CategoryStageCardProps) {
  const t = stageTransform(offset)
  const classes = accentClasses[category.accent]
  const extra = Math.max(0, totalCount - previewLinks.length)
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
          "group relative flex h-full w-full animate-in flex-col gap-4 overflow-hidden rounded-4xl border border-border/70 bg-card p-6 text-left surface-shadow duration-500 fade-in-0 outline-none [animation-fill-mode:backwards] slide-in-from-bottom-3 focus-visible:ring-2 focus-visible:ring-ring",
          classes.ring,
          active && "hover:-translate-y-1 hover:shadow-lg"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent",
            classes.wash
          )}
        />
        <div className="relative flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground/70 uppercase tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Badge variant="secondary">
              <span className="font-mono tabular-nums">{totalCount}</span>
              {" 个站点"}
            </Badge>
          </div>

          <div
            className={cn(
              "grid size-9 place-items-center rounded-2xl bg-muted",
              classes.text
            )}
          >
            <HugeiconsIcon
              icon={categoryIcon(category.slug)}
              strokeWidth={2}
              className="size-4"
            />
          </div>

          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {category.nameEn}
          </p>
          <h2 className="text-[2rem] leading-[1.1] font-medium tracking-tight">
            {category.name}
          </h2>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {category.tagline}
          </p>

          <Separator className="opacity-60" />

          <ul className="flex flex-col gap-2">
            {previewLinks.map((link) => (
              <li key={link.id} className="flex min-w-0 items-center gap-2">
                <Favicon
                  url={link.url}
                  title={link.title}
                  accent={category.accent}
                  className="size-6 shrink-0 rounded-lg"
                />
                <span className="truncate text-[13px] text-foreground/80">
                  {link.title}
                </span>
              </li>
            ))}
            {extra > 0 ? (
              <li className="pl-[32px] font-mono text-[11px] text-muted-foreground tabular-nums">
                +{extra} 个站点
              </li>
            ) : null}
          </ul>

          <div className="flex flex-wrap gap-1.5">
            {category.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[11px]">
                {tag}
              </Badge>
            ))}
          </div>

          <div
            className={cn(
              "mt-auto flex items-center gap-1 text-[13px] font-medium transition-opacity duration-300",
              active ? "opacity-100" : "opacity-0"
            )}
          >
            进入分类
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4 transition-transform duration-[var(--dur-micro)] group-hover:translate-x-1"
            />
          </div>
        </div>
      </Link>
    </div>
  )
}
