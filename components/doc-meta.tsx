"use client"

import { FavouriteIcon, ViewIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { LibraryLink } from "@/lib/data/types"
import {
  formatCardChars,
  formatCardLikes,
  formatCardViews,
  isStubDoc,
} from "@/lib/format"
import { cn } from "@/lib/utils"

type MetaItem = {
  kind: "readers" | "likes" | "volume"
  icon?: IconSvgElement
  value: string
  label: string
}

function itemsFor(link: LibraryLink): MetaItem[] {
  const items: MetaItem[] = []
  const views = formatCardViews(link.uv)
  if (views) {
    items.push({
      kind: "readers",
      icon: ViewIcon,
      value: views,
      label: `${link.uv} 人看过`,
    })
  }
  const likes = formatCardLikes(link.likeCount)
  if (likes) {
    items.push({
      kind: "likes",
      icon: FavouriteIcon,
      value: likes,
      label: `${link.likeCount} 次点赞`,
    })
  }
  const chars = formatCardChars(link.charCount)
  if (chars) {
    items.push({
      kind: "volume",
      value: chars,
      label: isStubDoc(link.charCount)
        ? "占位页，几乎还没有正文"
        : `约 ${chars}`,
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
      className={cn("flex flex-wrap items-center gap-x-2.5 gap-y-1", className)}
    >
      {items.map((item) => (
        <li key={item.kind} className="flex h-4 items-center">
          <Tooltip>
            <TooltipTrigger
              delay={200}
              render={
                <span className="inline-flex h-4 items-center gap-1 leading-none text-muted-foreground" />
              }
            >
              {item.icon ? (
                <HugeiconsIcon
                  icon={item.icon}
                  strokeWidth={2}
                  className="block size-3.5 shrink-0"
                />
              ) : null}
              <span className="text-[11px] leading-none tabular-nums">
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
