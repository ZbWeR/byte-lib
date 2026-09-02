"use client"

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactNode } from "react"

import { Favicon } from "@/components/favicon"
import { CardAnchor, type CardSample } from "@/components/lab/card-shell"
import { Badge } from "@/components/ui/badge"
import { accentClasses } from "@/lib/accents"
import { parseCourseTitle } from "@/lib/data/course-title"
import {
  formatAge,
  formatCompactChars,
  formatCompactUv,
  formatUpdatedAt,
  formatVolume,
  isStubDoc,
} from "@/lib/format"
import { cn } from "@/lib/utils"

const DOT = <span className="text-muted-foreground/40">·</span>

function Flags({ flags, stub }: { flags: string[]; stub?: boolean }) {
  const all = stub ? ["占位页", ...flags] : flags
  if (all.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {all.slice(0, 3).map((flag) => (
        <Badge key={flag} variant="outline" className="text-[11px]">
          {flag}
        </Badge>
      ))}
    </div>
  )
}

/** G · 索书卡：把统计排成对齐的账目行，像旧图书馆的卡片目录。 */
export function ConceptIndexCard({ sample }: { sample: CardSample }) {
  const { link, accent, collegeName } = sample
  const classes = accentClasses[accent]
  const parsed = parseCourseTitle(link.title)
  const callNumber = [
    link.categorySlug.toUpperCase(),
    parsed.years[0] ?? "—",
  ].join(" · ")

  const rows: [string, string | null][] = [
    ["字数", formatVolume(link.charCount)],
    [
      "阅读",
      formatCompactUv(link.uv) ? `${formatCompactUv(link.uv)} 人` : null,
    ],
    ["更新", formatAge(link.updatedAt)],
  ]

  return (
    <CardAnchor
      link={link}
      accent={accent}
      className="flex-col overflow-hidden rounded-3xl border border-border/70 bg-card p-5 hover:-translate-y-0.5 hover:surface-shadow"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent",
          classes.wash
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          {callNumber}
        </p>
        {link.likeCount ? (
          <span className="flex size-11 shrink-0 -rotate-6 flex-col items-center justify-center rounded-full border border-dashed border-border">
            <span
              className={cn(
                "font-mono text-[13px] leading-none font-medium tabular-nums",
                classes.text
              )}
            >
              {link.likeCount}
            </span>
            <span className="mt-0.5 font-mono text-[8px] tracking-[0.18em] text-muted-foreground uppercase">
              赞
            </span>
          </span>
        ) : null}
      </div>
      <h3 className="relative mt-4 text-[17px] leading-snug font-medium">
        {parsed.displayName}
      </h3>
      <p className="relative mt-1 text-[12px] text-muted-foreground">
        {collegeName}
      </p>
      <dl className="relative mt-4 border-t border-border/50">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-border/50 py-1.5"
          >
            <dt className="text-[11px] text-muted-foreground">{label}</dt>
            <dd className="font-mono text-[12px] tabular-nums">
              {value ?? "—"}
            </dd>
          </div>
        ))}
      </dl>
      <div className="relative mt-3">
        <Flags flags={parsed.flags} stub={isStubDoc(link.charCount)} />
      </div>
    </CardAnchor>
  )
}

/** H · 热度榜：阅读人数画成条，一眼看出这个学院里谁最常被翻。 */
export function ConceptRanking({ sample }: { sample: CardSample }) {
  const { link, accent, collegeName, peakUv, index } = sample
  const classes = accentClasses[accent]
  const parsed = parseCourseTitle(link.title)
  const pct = Math.max(3, Math.round(((link.uv ?? 0) / peakUv) * 100))

  return (
    <CardAnchor
      link={link}
      accent={accent}
      className="items-center gap-4 rounded-2xl border border-border/70 bg-card px-4 py-3 hover:bg-muted/40"
    >
      <span className="w-7 shrink-0 font-mono text-[24px] leading-none font-medium text-muted-foreground/30 tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate text-[14px] font-medium">
            {parsed.displayName}
          </p>
          <span
            className={cn(
              "shrink-0 font-mono text-[13px] font-medium tabular-nums",
              classes.text
            )}
          >
            {formatCompactUv(link.uv) ?? "—"}
          </span>
        </div>
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-muted">
          <span
            className={cn("block h-full rounded-full", classes.dot)}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1.5 truncate font-mono text-[10px] text-muted-foreground tabular-nums">
          {[
            collegeName,
            formatVolume(link.charCount),
            link.likeCount ? `${link.likeCount} 赞` : null,
            formatAge(link.updatedAt),
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </CardAnchor>
  )
}

/** I · 指标三栏：字数 / 阅读 / 赞 三个数字并排，像仪表盘。 */
export function ConceptMetrics({ sample }: { sample: CardSample }) {
  const { link, accent, collegeName } = sample
  const classes = accentClasses[accent]
  const parsed = parseCourseTitle(link.title)

  const cells: [string, string, boolean][] = [
    [formatCompactChars(link.charCount) ?? "—", "字数", true],
    [formatCompactUv(link.uv) ?? "—", "阅读", false],
    [link.likeCount ? String(link.likeCount) : "—", "赞", false],
  ]

  return (
    <CardAnchor
      link={link}
      accent={accent}
      className="flex-col rounded-3xl border border-border/70 bg-card p-5 hover:-translate-y-0.5 hover:surface-shadow"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="truncate font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          {[collegeName, parsed.years[0]].filter(Boolean).join(" · ")}
        </p>
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          strokeWidth={2}
          className="size-4 shrink-0 text-muted-foreground/50 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
        />
      </div>
      <h3 className="mt-2 min-h-[44px] text-[16px] leading-snug font-medium">
        {parsed.displayName}
      </h3>
      <div className="mt-4 grid grid-cols-3 divide-x divide-border/60 border-t border-border/60 pt-4">
        {cells.map(([value, label, highlight]) => (
          <div key={label} className="flex flex-col items-center gap-1 px-2">
            <span
              className={cn(
                "font-mono text-[17px] leading-none font-medium tabular-nums",
                highlight ? classes.text : "text-foreground"
              )}
            >
              {value}
            </span>
            <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[10px] text-muted-foreground">
        {formatUpdatedAt(link.updatedAt) ?? "更新时间未知"}
      </p>
    </CardAnchor>
  )
}

/** J · 杂志封面：年份做成背景巨字，课名当主视觉。 */
export function ConceptEditorial({ sample }: { sample: CardSample }) {
  const { link, accent, collegeName } = sample
  const classes = accentClasses[accent]
  const parsed = parseCourseTitle(link.title)

  return (
    <CardAnchor
      link={link}
      accent={accent}
      className="min-h-[220px] flex-col overflow-hidden rounded-3xl border border-border/70 bg-card p-6 hover:-translate-y-0.5 hover:surface-shadow"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent",
          classes.wash
        )}
      />
      {parsed.years[0] ? (
        <span className="pointer-events-none absolute -right-4 -bottom-10 font-mono text-[112px] leading-none font-medium text-foreground/[0.05] tabular-nums">
          {parsed.years[0]}
        </span>
      ) : null}
      <div className="relative flex items-center justify-between gap-3">
        <p className="truncate font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          {collegeName}
        </p>
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          strokeWidth={2}
          className="size-4 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
        />
      </div>
      <h3 className="relative mt-8 text-[1.6rem] leading-[1.12] font-medium tracking-tight">
        {parsed.displayName}
      </h3>
      <div className="relative mt-auto flex flex-wrap items-center gap-2 pt-6 font-mono text-[11px] text-muted-foreground tabular-nums">
        {[
          formatVolume(link.charCount),
          formatCompactUv(link.uv)
            ? `${formatCompactUv(link.uv)} 人读过`
            : null,
          link.likeCount ? `${link.likeCount} 赞` : null,
        ]
          .filter(Boolean)
          .map((text, i) => (
            <span key={text} className="flex items-center gap-2">
              {i > 0 ? DOT : null}
              {text}
            </span>
          ))}
      </div>
    </CardAnchor>
  )
}

/** K · 书本厚度：字数直接画成书口的页边线，厚的就是写得多的。 */
export function ConceptThickness({ sample }: { sample: CardSample }) {
  const { link, accent, collegeName, peakChars } = sample
  const classes = accentClasses[accent]
  const parsed = parseCourseTitle(link.title)
  const ratio = Math.sqrt((link.charCount ?? 0) / peakChars)
  const pages = Math.min(12, Math.max(1, Math.round(ratio * 12)))

  return (
    <CardAnchor
      link={link}
      accent={accent}
      className="gap-4 rounded-3xl border border-border/70 bg-card p-5 hover:-translate-y-0.5 hover:surface-shadow"
    >
      <div className="flex w-7 shrink-0 flex-col items-stretch justify-end gap-[3px]">
        {Array.from({ length: pages }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-[2px] rounded-full",
              i === 0 ? classes.dot : "bg-border"
            )}
            style={{ marginRight: `${(pages - 1 - i) * 1.5}px` }}
          />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="truncate font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          {[collegeName, parsed.years[0]].filter(Boolean).join(" · ")}
        </p>
        <h3 className="text-[15px] leading-snug font-medium">
          {parsed.displayName}
        </h3>
        <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {[
            formatVolume(link.charCount),
            formatCompactUv(link.uv)
              ? `${formatCompactUv(link.uv)} 人读过`
              : null,
            formatAge(link.updatedAt),
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <div className="mt-auto pt-1">
          <Flags flags={parsed.flags} stub={isStubDoc(link.charCount)} />
        </div>
      </div>
    </CardAnchor>
  )
}

/** L · 悬停展开：静止时只有课名，鼠标进来才把统计放出来。 */
export function ConceptReveal({ sample }: { sample: CardSample }) {
  const { link, accent, collegeName } = sample
  const parsed = parseCourseTitle(link.title)

  return (
    <CardAnchor
      link={link}
      accent={accent}
      className="min-h-[168px] flex-col gap-3 rounded-3xl border border-border/70 bg-card p-5 hover:-translate-y-0.5 hover:surface-shadow"
    >
      <Favicon
        url={link.url}
        title={link.title}
        accent={accent}
        className="size-11"
      />
      <h3 className="text-[15px] leading-snug font-medium">
        {parsed.displayName}
      </h3>
      <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
        {[collegeName, parsed.years[0]].filter(Boolean).join(" · ")}
      </p>
      <div className="mt-auto grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <p className="border-t border-border/50 pt-2 font-mono text-[11px] text-muted-foreground tabular-nums">
            {[
              formatVolume(link.charCount),
              formatCompactUv(link.uv)
                ? `${formatCompactUv(link.uv)} 人`
                : null,
              link.likeCount ? `${link.likeCount} 赞` : null,
              formatAge(link.updatedAt),
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </div>
    </CardAnchor>
  )
}

const TILTS = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2"] as const

/** M · 便签墙：贴在墙上的学生笔记，用学院色当纸色。 */
export function ConceptSticky({ sample }: { sample: CardSample }) {
  const { link, accent, collegeName, index } = sample
  const classes = accentClasses[accent]
  const parsed = parseCourseTitle(link.title)

  return (
    <CardAnchor
      link={link}
      accent={accent}
      className={cn(
        "min-h-[176px] flex-col rounded-2xl border border-border/40 p-5 surface-shadow hover:-translate-y-1 hover:shadow-lg",
        classes.mono,
        TILTS[index % TILTS.length]
      )}
    >
      <span className="absolute top-3 left-1/2 size-2 -translate-x-1/2 rounded-full bg-foreground/20" />
      <h3 className="mt-4 text-[17px] leading-relaxed font-medium">
        {parsed.displayName}
      </h3>
      <p className="mt-1.5 text-[12px] text-muted-foreground">
        {[collegeName, parsed.years[0]].filter(Boolean).join(" · ")}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-x-2 pt-4 font-mono text-[11px] text-muted-foreground tabular-nums">
        <span>{formatVolume(link.charCount) ?? "字数未知"}</span>
        {formatCompactUv(link.uv) ? (
          <>
            {DOT}
            <span>{formatCompactUv(link.uv)} 人</span>
          </>
        ) : null}
        {link.likeCount ? (
          <>
            {DOT}
            <span>{link.likeCount} 赞</span>
          </>
        ) : null}
      </div>
    </CardAnchor>
  )
}

/** N · 目录表：右对齐的等宽数字，一屏能扫完整个学院。 */
export function ConceptTable({ sample }: { sample: CardSample }) {
  const { link, accent } = sample
  const classes = accentClasses[accent]
  const parsed = parseCourseTitle(link.title)
  const stub = isStubDoc(link.charCount)

  return (
    <CardAnchor
      link={link}
      accent={accent}
      className="items-center gap-3 border-b border-border/40 px-4 py-2.5 hover:bg-muted/40"
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", classes.dot)} />
      <span className="min-w-0 flex-1 truncate text-[13.5px]">
        {parsed.displayName}
        {parsed.flags[0] ? (
          <span className="ml-2 text-[11px] text-muted-foreground">
            {parsed.flags[0]}
          </span>
        ) : null}
      </span>
      <span
        className={cn(
          "w-14 shrink-0 text-right font-mono text-[12px] tabular-nums",
          stub ? "text-muted-foreground/50" : "text-muted-foreground"
        )}
      >
        {stub ? "空" : (formatCompactChars(link.charCount) ?? "—")}
      </span>
      <span className="w-14 shrink-0 text-right font-mono text-[12px] text-muted-foreground tabular-nums">
        {formatCompactUv(link.uv) ?? "—"}
      </span>
      <span className="w-16 shrink-0 text-right font-mono text-[11px] text-muted-foreground tabular-nums">
        {formatAge(link.updatedAt) ?? "—"}
      </span>
    </CardAnchor>
  )
}

function TableHeader(): ReactNode {
  return (
    <div className="flex items-center gap-3 border-b border-border/60 px-4 pb-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
      <span className="size-1.5 shrink-0" />
      <span className="min-w-0 flex-1">课程</span>
      <span className="w-14 shrink-0 text-right">字数</span>
      <span className="w-14 shrink-0 text-right">阅读</span>
      <span className="w-16 shrink-0 text-right">更新</span>
    </div>
  )
}

export const LINK_CARD_CONCEPTS = [
  {
    id: "index-card",
    letter: "G",
    name: "索书卡",
    layout: "grid" as const,
    summary:
      "统计排成对齐的账目行，点赞做成右上角的印章。三个数字位置固定，同一列上下扫就能比。",
    note: "最贴「电子图书馆」这个设定，也是信息最好比较的一版。",
    Card: ConceptIndexCard,
  },
  {
    id: "ranking",
    letter: "H",
    name: "热度榜",
    layout: "list" as const,
    summary:
      "阅读人数按学院内最高值归一化成一条横杠，配左侧序号。哪份是大家真在用的，一眼就分出来。",
    note: "适合学院页默认排序按热度；冷门文档条会很短，这是有意的。",
    Card: ConceptRanking,
  },
  {
    id: "metrics",
    letter: "I",
    name: "指标三栏",
    layout: "grid" as const,
    summary:
      "字数 / 阅读 / 赞 三个数字并排，中间用细线分开，下面一行写更新时间。",
    note: "数字最突出，读起来像仪表盘。课名被压到 16px。",
    Card: ConceptMetrics,
  },
  {
    id: "editorial",
    letter: "J",
    name: "杂志封面",
    layout: "grid" as const,
    summary: "年份做成背景巨字，课名 26px 当主视觉，统计缩成底部一行小字。",
    note: "最好看但信息密度最低，没有年份的课会少一层视觉。",
    Card: ConceptEditorial,
  },
  {
    id: "thickness",
    letter: "K",
    name: "书本厚度",
    layout: "grid" as const,
    summary:
      "左边那叠页边线的厚度就是字数（按平方根缩放）。9 万字的和 200 字的放在一起，厚度差立刻能看见。",
    note: "把「这份写得够不够多」变成图形，不用读数字。",
    Card: ConceptThickness,
  },
  {
    id: "reveal",
    letter: "L",
    name: "悬停展开",
    layout: "grid" as const,
    summary: "静止时只有图标、课名、学院，鼠标进来才把统计推出来。",
    note: "最安静，保留首页舞台的克制感；但统计默认看不到。",
    Card: ConceptReveal,
  },
  {
    id: "sticky",
    letter: "M",
    name: "便签墙",
    layout: "grid" as const,
    summary:
      "用学院强调色当纸色，卡片轻微倾斜，顶上一个图钉点。像一墙学长贴的复习条。",
    note: "最有人味，但排满 20 张时会有点吵。",
    Card: ConceptSticky,
  },
  {
    id: "table",
    letter: "N",
    name: "目录表",
    layout: "table" as const,
    summary:
      "带表头的四列：课程 / 字数 / 阅读 / 更新。数字右对齐等宽，占位页直接写「空」。",
    note: "计算机学院 24 篇能一屏扫完，但完全没有卡片感。",
    Card: ConceptTable,
    Header: TableHeader,
  },
] as const
