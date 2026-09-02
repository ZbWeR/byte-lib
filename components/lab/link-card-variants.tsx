"use client"

import { ArrowUpRight01Icon, File02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { CardAnchor, type CardSample } from "@/components/lab/card-shell"
import { Favicon } from "@/components/favicon"
import { LinkCard } from "@/components/link-card"
import { Badge } from "@/components/ui/badge"
import { accentClasses } from "@/lib/accents"
import { parseCourseTitle } from "@/lib/data/course-title"
import type { LibraryLink } from "@/lib/data/types"
import { formatDocStats } from "@/lib/format"
import { cn } from "@/lib/utils"

function StatsLine({ link }: { link: LibraryLink }) {
  const stats = formatDocStats(link)
  if (!stats) return null
  return (
    <p className="text-[12px] leading-relaxed text-muted-foreground">{stats}</p>
  )
}

function StatusBadges({ tags }: { tags: string[] }) {
  if (tags.length === 0) {
    return null
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.slice(0, 3).map((tag) => (
        <Badge key={tag} variant="outline" className="text-[11px]">
          {tag}
        </Badge>
      ))}
    </div>
  )
}

/** A · 现行：沿用学院详情页那张卡，描述是模板句。 */
export function VariantCurrent({ sample }: { sample: CardSample }) {
  return <LinkCard link={sample.link} accent={sample.accent} />
}

/** B · 去描述：结构与现行相同，底部换成真实统计。 */
export function VariantTight({ sample }: { sample: CardSample }) {
  const { link, accent, collegeName } = sample
  return (
    <CardAnchor
      link={link}
      accent={accent}
      className="flex-col gap-3 rounded-3xl border border-border/70 bg-card p-5 hover:-translate-y-0.5 hover:surface-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <Favicon
          url={link.url}
          title={link.title}
          accent={accent}
          className="size-10"
        />
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          strokeWidth={2}
          className="size-4 text-muted-foreground/50 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
        />
      </div>
      <div className="space-y-1">
        <h3 className="text-[15px] leading-snug font-medium">{link.title}</h3>
        <p className="font-mono text-[11px] text-muted-foreground/70">
          {collegeName}
        </p>
      </div>
      <StatsLine link={link} />
      <div className="mt-auto">
        <StatusBadges tags={link.tags} />
      </div>
    </CardAnchor>
  )
}

/** C · 文档纸片：飞书 favicon 都一样，改用文件图标 + 学院名。 */
export function VariantSheet({ sample }: { sample: CardSample }) {
  const { link, accent, collegeName } = sample
  const classes = accentClasses[accent]
  const parsed = parseCourseTitle(link.title)
  return (
    <CardAnchor
      link={link}
      accent={accent}
      className="flex-col gap-4 overflow-hidden rounded-3xl border border-border/70 bg-card p-5 hover:-translate-y-0.5 hover:surface-shadow"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent",
          classes.wash
        )}
      />
      <div className="relative flex items-start justify-between">
        <div
          className={cn(
            "grid size-10 place-items-center rounded-2xl bg-muted",
            classes.text
          )}
        >
          <HugeiconsIcon icon={File02Icon} strokeWidth={2} className="size-4" />
        </div>
        {parsed.years[0] ? (
          <span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase tabular-nums">
            {parsed.years[0]}
          </span>
        ) : (
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground/50 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
          />
        )}
      </div>
      <div className="relative space-y-1.5">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          {collegeName}
        </p>
        <h3 className="text-[15px] leading-snug font-medium">
          {parsed.displayName}
        </h3>
        <StatsLine link={link} />
      </div>
      <div className="relative mt-auto">
        <StatusBadges tags={parsed.flags.length ? parsed.flags : link.tags} />
      </div>
    </CardAnchor>
  )
}

/** D · 扫描列表：密度优先，适合一门学院里几十篇文档。 */
export function VariantRow({ sample }: { sample: CardSample }) {
  const { link, accent, collegeName } = sample
  const parsed = parseCourseTitle(link.title)
  const classes = accentClasses[accent]
  return (
    <CardAnchor
      link={link}
      accent={accent}
      className="items-center gap-4 rounded-2xl border border-border/70 bg-card px-4 py-3 hover:bg-muted/40"
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", classes.dot)} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium">{parsed.displayName}</p>
        <p className="truncate font-mono text-[11px] text-muted-foreground">
          {[collegeName, parsed.years[0], formatDocStats(link)]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      <div className="hidden shrink-0 sm:block">
        <StatusBadges tags={parsed.flags} />
      </div>
      <HugeiconsIcon
        icon={ArrowUpRight01Icon}
        strokeWidth={2}
        className="size-4 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
      />
    </CardAnchor>
  )
}

/** E · 拆题：把年份和状态从标题里拆出来，课名单独放大。 */
export function VariantParsed({ sample }: { sample: CardSample }) {
  const { link, accent, collegeName } = sample
  const parsed = parseCourseTitle(link.title)
  const classes = accentClasses[accent]
  return (
    <CardAnchor
      link={link}
      accent={accent}
      className="min-h-[168px] flex-col justify-between overflow-hidden rounded-3xl border border-border/70 bg-card p-5 hover:-translate-y-0.5 hover:surface-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          {collegeName}
        </p>
        {parsed.years[0] ? (
          <span
            className={cn(
              "font-mono text-[22px] leading-none font-medium tabular-nums",
              classes.text
            )}
          >
            {parsed.years[0]}
          </span>
        ) : null}
      </div>
      <h3 className="mt-6 text-[1.35rem] leading-[1.15] font-medium tracking-tight">
        {parsed.displayName}
      </h3>
      <div className="mt-3">
        <StatsLine link={link} />
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <StatusBadges tags={parsed.flags} />
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          strokeWidth={2}
          className="size-4 text-muted-foreground/50 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
        />
      </div>
    </CardAnchor>
  )
}

/** F · 书脊：左侧一条强调色，标题铺满，不依赖图标。 */
export function VariantSpine({ sample }: { sample: CardSample }) {
  const { link, accent, collegeName } = sample
  const parsed = parseCourseTitle(link.title)
  const classes = accentClasses[accent]
  return (
    <CardAnchor
      link={link}
      accent={accent}
      className="overflow-hidden rounded-3xl border border-border/70 bg-card hover:-translate-y-0.5 hover:surface-shadow"
    >
      <span className={cn("w-1.5 shrink-0 self-stretch", classes.dot)} />
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {collegeName}
          </p>
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground/50 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
          />
        </div>
        <h3 className="text-[15px] leading-snug font-medium">
          {parsed.displayName}
        </h3>
        <StatsLine link={link} />
        <div className="mt-auto flex flex-wrap items-center gap-1.5">
          {parsed.years.map((year) => (
            <Badge
              key={year}
              variant="secondary"
              className="font-mono text-[11px]"
            >
              {year}
            </Badge>
          ))}
          <StatusBadges tags={parsed.flags} />
        </div>
      </div>
    </CardAnchor>
  )
}

export const LINK_CARD_VARIANTS = [
  {
    id: "current",
    letter: "A",
    name: "现行卡片",
    layout: "grid" as const,
    summary:
      "学院详情页正在用的版本。DiceBear 图标 + 字数 / 更新时间 / 阅读 / 点赞。",
    note: "这是线上默认。其他方案只换布局，数据相同。",
    Card: VariantCurrent,
  },
  {
    id: "tight",
    letter: "B",
    name: "去标签强调",
    layout: "grid" as const,
    summary: "和现行接近，统计行稍小，适合信息已经够用、不想再挤标签的情况。",
    note: "标签仍保留，只是沉底。",
    Card: VariantTight,
  },
  {
    id: "sheet",
    letter: "C",
    name: "文档纸片",
    layout: "grid" as const,
    summary: "课名拆干净，年份放右上角，统计放在标题下面。",
    note: "图标仍用 DiceBear；文件图标那版先不用了。",
    Card: VariantSheet,
  },
  {
    id: "row",
    letter: "D",
    name: "扫描列表",
    layout: "list" as const,
    summary: "一行一条，统计跟在学院名后面。适合一篇学院几十份。",
    note: "密度最高，卡片感最弱。",
    Card: VariantRow,
  },
  {
    id: "parsed",
    letter: "E",
    name: "拆题放大",
    layout: "grid" as const,
    summary: "课名放大，年份做成强调色数字，统计垫在课名下面。",
    note: "长标题会干净很多。",
    Card: VariantParsed,
  },
  {
    id: "spine",
    letter: "F",
    name: "书脊",
    layout: "grid" as const,
    summary: "左侧一条学院强调色，不放图标，统计和标签沉底。",
    note: "信息层级清楚，图标完全让给排版。",
    Card: VariantSpine,
  },
] as const
