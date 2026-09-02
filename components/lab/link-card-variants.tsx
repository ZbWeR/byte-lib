"use client"

import { ArrowUpRight01Icon, File02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactNode } from "react"

import { Favicon } from "@/components/favicon"
import { LinkCard } from "@/components/link-card"
import { Badge } from "@/components/ui/badge"
import { accentClasses } from "@/lib/accents"
import { parseCourseTitle } from "@/lib/data/course-title"
import { categoryBySlug } from "@/lib/data/library"
import type { AccentKey, LibraryLink } from "@/lib/data/types"
import { displayHost } from "@/lib/search"
import { cn } from "@/lib/utils"

export type CardSample = {
  link: LibraryLink
  accent: AccentKey
  collegeName: string
}

function CardAnchor({
  link,
  accent,
  className,
  children,
}: {
  link: LibraryLink
  accent: AccentKey
  className?: string
  children: ReactNode
}) {
  const classes = accentClasses[accent]
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex transition-all duration-[var(--dur-micro)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        classes.ring,
        className
      )}
    >
      {children}
    </a>
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

/** B · 去描述：飞书没有摘要，干脆不画那一行。 */
export function VariantTight({ sample }: { sample: CardSample }) {
  const { link, accent } = sample
  const host = displayHost(link.url)
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
        <p className="font-mono text-[11px] text-muted-foreground/70">{host}</p>
      </div>
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
          {collegeName}
          {parsed.years[0] ? ` · ${parsed.years[0]}` : ""}
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
      "学院详情页正在用的版本。图标走飞书站点 favicon，描述是「UESTC Byte Lib · 学院名」模板句。",
    note: "问题：91 篇文档的描述几乎长一样，飞书图标也几乎长一样。",
    Card: VariantCurrent,
  },
  {
    id: "tight",
    letter: "B",
    name: "去描述",
    layout: "grid" as const,
    summary: "结构与现行相同，只删掉那两行假描述。标题和标签自己说话。",
    note: "改动最小，适合先止血、以后再换更激进的方案。",
    Card: VariantTight,
  },
  {
    id: "sheet",
    letter: "C",
    name: "文档纸片",
    layout: "grid" as const,
    summary:
      "用文件图标代替 favicon，学院名当副标，年份提到右上角。看起来更像知识库条目而不是外链。",
    note: "卡片仍是三列网格，扫描效率中等。",
    Card: VariantSheet,
  },
  {
    id: "row",
    letter: "D",
    name: "扫描列表",
    layout: "list" as const,
    summary:
      "一行一条。课名、学院、年份、状态摊开，适合计算机学院这种二十多篇的目录。",
    note: "牺牲了「一张卡一个主角」的舞台感，换来密度。",
    Card: VariantRow,
  },
  {
    id: "parsed",
    letter: "E",
    name: "拆题放大",
    layout: "grid" as const,
    summary:
      "从标题里拆出课名和年份。课名做主标题，年份做成强调色数字。没有年份的课就只留课名。",
    note: "长标题（军事理论挖空版…）会干净很多；拆题规则以后可以再调。",
    Card: VariantParsed,
  },
  {
    id: "spine",
    letter: "F",
    name: "书脊",
    layout: "grid" as const,
    summary: "左侧一条学院强调色，不放图标。年份和状态沉到底部 chips。",
    note: "信息层级清楚，也避开了「飞书 favicon 重复」的问题。",
    Card: VariantSpine,
  },
] as const

export function samplesFromLinks(links: LibraryLink[]): CardSample[] {
  return links.map((link) => {
    const category = categoryBySlug.get(link.categorySlug)
    return {
      link,
      accent: category?.accent ?? "lime",
      collegeName: category?.name ?? link.categorySlug,
    }
  })
}
