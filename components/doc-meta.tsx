"use client"

import { FavouriteIcon, Note01Icon, ViewIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { LibraryLink } from "@/lib/data/types"
import { formatCompactUv, isStubDoc } from "@/lib/format"
import { cn } from "@/lib/utils"

export type DocMetaKind = "readers" | "likes" | "stub"

type MetaItem = {
  kind: DocMetaKind
  icon: IconSvgElement
  value: string
  label: string
}

function itemsFor(link: LibraryLink, kinds: DocMetaKind[]): MetaItem[] {
  const want = new Set(kinds)
  const items: MetaItem[] = []

  if (want.has("readers")) {
    const readers = formatCompactUv(link.uv)
    if (readers) {
      items.push({
        kind: "readers",
        icon: ViewIcon,
        value: readers,
        label: `${link.uv} 人读过`,
      })
    }
  }

  if (want.has("likes") && link.likeCount && link.likeCount > 0) {
    items.push({
      kind: "likes",
      icon: FavouriteIcon,
      value: String(link.likeCount),
      label: `${link.likeCount} 次点赞`,
    })
  }

  if (want.has("stub") && isStubDoc(link.charCount)) {
    items.push({
      kind: "stub",
      icon: Note01Icon,
      value: "占位",
      label: "占位页，几乎还没有正文",
    })
  }

  return items
}

type DocMetaProps = {
  link: LibraryLink
  kinds?: DocMetaKind[]
  className?: string
}

export function DocMeta({
  link,
  kinds = ["readers", "likes", "stub"],
  className,
}: DocMetaProps) {
  const items = itemsFor(link, kinds)
  if (items.length === 0) return null

  return (
    <ul
      className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}
    >
      {items.map((item) => (
        <li key={item.kind}>
          <Tooltip>
            <TooltipTrigger
              delay={200}
              render={
                <span className="inline-flex items-center gap-1 text-muted-foreground" />
              }
            >
              <HugeiconsIcon
                icon={item.icon}
                strokeWidth={2}
                className="size-3.5 shrink-0"
              />
              <span className="font-mono text-[11px] tabular-nums">
                {item.value}
              </span>
            </TooltipTrigger>
            <TooltipContent>{item.label}</TooltipContent>
          </Tooltip>
        </li>
      ))}
    </ul>
  )
}
