"use client"

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { DocMeta } from "@/components/doc-meta"
import { Favicon } from "@/components/favicon"
import {
  CardAnchor,
  type CardSample,
  type CardVariant,
} from "@/components/lab/card-shell"
import { LinkCard } from "@/components/link-card"
import { Badge } from "@/components/ui/badge"

function cardTitle(sample: CardSample) {
  return sample.link.displayTitle ?? sample.link.title
}

function StatusTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null
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

function StatusLine({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null
  return <p className="text-[11px] text-muted-foreground">{tags.join(" · ")}</p>
}

/** A · 就是分类页现在这张卡。 */
export function ConceptCurrent({ sample }: { sample: CardSample }) {
  return <LinkCard link={sample.link} accent={sample.accent} />
}

/** B · 元数据沉底，标题区更干净。 */
export function ConceptFloor({ sample }: { sample: CardSample }) {
  const { link, accent } = sample
  return (
    <CardAnchor
      link={link}
      accent={accent}
      className="flex-col gap-3 rounded-3xl border border-border/70 bg-card p-5 hover:-translate-y-0.5 hover:surface-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <Favicon
          url={link.url}
          title={cardTitle(sample)}
          accent={accent}
          categorySlug={link.categorySlug}
          className="size-10"
        />
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          strokeWidth={2}
          className="size-4 text-muted-foreground/50 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
        />
      </div>
      <h3 className="text-[15px] leading-snug font-medium">
        {cardTitle(sample)}
      </h3>
      <StatusLine tags={link.tags} />
      <div className="mt-auto border-t border-border/60 pt-3">
        <DocMeta link={link} />
      </div>
    </CardAnchor>
  )
}

/** C · 横排，适合一眼扫完。 */
export function ConceptRow({ sample }: { sample: CardSample }) {
  const { link, accent } = sample
  return (
    <CardAnchor
      link={link}
      accent={accent}
      className="items-start gap-4 rounded-3xl border border-border/70 bg-card p-4 hover:bg-muted/40"
    >
      <Favicon
        url={link.url}
        title={cardTitle(sample)}
        accent={accent}
        categorySlug={link.categorySlug}
        className="size-11 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] leading-snug font-medium">
            {cardTitle(sample)}
          </h3>
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            strokeWidth={2}
            className="mt-0.5 size-4 shrink-0 text-muted-foreground/50 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
          />
        </div>
        <DocMeta link={link} className="mt-2" />
        <div className="mt-2.5">
          <StatusTags tags={link.tags} />
        </div>
      </div>
    </CardAnchor>
  )
}

/** D · 年份和状态写在标题上面，不再做成标签。 */
export function ConceptKicker({ sample }: { sample: CardSample }) {
  const { link, accent } = sample
  return (
    <CardAnchor
      link={link}
      accent={accent}
      className="flex-col gap-3 rounded-3xl border border-border/70 bg-card p-5 hover:-translate-y-0.5 hover:surface-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <Favicon
          url={link.url}
          title={cardTitle(sample)}
          accent={accent}
          categorySlug={link.categorySlug}
          className="size-10"
        />
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          strokeWidth={2}
          className="size-4 text-muted-foreground/50 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
        />
      </div>
      <div className="space-y-1.5">
        <StatusLine tags={link.tags} />
        <h3 className="text-[15px] leading-snug font-medium">
          {cardTitle(sample)}
        </h3>
      </div>
      <DocMeta link={link} />
    </CardAnchor>
  )
}

export const LINK_CARD_CONCEPTS: CardVariant[] = [
  {
    id: "current",
    letter: "A",
    name: "现行微调",
    layout: "grid",
    summary:
      "分类页现在这张。分类名不再写；「评论待补充」从标题里拿掉；字数、阅读、赞、更新改成图标。",
    note: "每个学院一种 DiceBear 风格，同一学院里靠文档 token 区分。觉得这版能用就选 A。",
    Card: ConceptCurrent,
  },
  {
    id: "floor",
    letter: "B",
    name: "统计沉底",
    layout: "grid",
    summary: "标题先完事，元数据用一条细线隔开贴在底部。",
    note: "卡片高度更齐，扫标题更快。",
    Card: ConceptFloor,
  },
  {
    id: "row",
    letter: "C",
    name: "横排",
    layout: "list",
    summary: "图标在左，标题和统计在右。一篇学院几十份的时候更省地方。",
    note: "卡片感弱一点，密度高。",
    Card: ConceptRow,
  },
  {
    id: "kicker",
    letter: "D",
    name: "年份作肩题",
    layout: "grid",
    summary: "年份和施工中写在课名上面，底下不再堆标签。",
    note: "标题区更像一条目录，标签少的课会特别干净。",
    Card: ConceptKicker,
  },
]
