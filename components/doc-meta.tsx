"use client"

import {
  Clock01Icon,
  FavouriteIcon,
  Note01Icon,
  TextFontIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { LibraryLink } from "@/lib/data/types"
import {
  formatAge,
  formatCompactChars,
  formatCompactUv,
  formatVolume,
  isStubDoc,
} from "@/lib/format"
import { cn } from "@/lib/utils"

type MetaItem = {
  icon: IconSvgElement
  value: string
  label: string
}

function itemsFor(link: LibraryLink): MetaItem[] {
  const items: MetaItem[] = []
  const stub = isStubDoc(link.charCount)
  const volume = stub ? "占位" : formatCompactChars(link.charCount)
  if (volume) {
    items.push({
      icon: stub ? Note01Icon : TextFontIcon,
      value: volume,
      label: stub
        ? "占位页，几乎还没有正文"
        : `约 ${formatVolume(link.charCount)}`,
    })
  }
  const readers = formatCompactUv(link.uv)
  if (readers) {
    items.push({
      icon: ViewIcon,
      value: readers,
      label: `${link.uv} 人读过`,
    })
  }
  if (link.likeCount && link.likeCount > 0) {
    items.push({
      icon: FavouriteIcon,
      value: String(link.likeCount),
      label: `${link.likeCount} 次点赞`,
    })
  }
  const age = formatAge(link.updatedAt)
  if (age) {
    items.push({
      icon: Clock01Icon,
      value: age,
      label: link.updatedAt
        ? `最近更新于 ${new Date(link.updatedAt).toLocaleDateString("zh-CN")}`
        : "最近更新",
    })
  }
  return items
}

type DocMetaProps = {
  link: LibraryLink
  className?: string
}

export function DocMeta({ link, className }: DocMetaProps) {
  const items = itemsFor(link)
  if (items.length === 0) return null

  return (
    <ul
      className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}
    >
      {items.map((item) => (
        <li key={item.label}>
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
