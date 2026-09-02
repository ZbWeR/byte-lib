"use client"

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { DocMeta } from "@/components/doc-meta"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { accentClasses } from "@/lib/accents"
import type { AccentKey, LibraryLink } from "@/lib/data/types"
import { formatAge } from "@/lib/format"
import { cn } from "@/lib/utils"

type LinkCardProps = {
  link: LibraryLink
  accent: AccentKey
  highlighted?: boolean
}

export function LinkCard({ link, accent, highlighted }: LinkCardProps) {
  const classes = accentClasses[accent]
  const title = link.displayTitle ?? link.title
  const age = formatAge(link.updatedAt)

  return (
    <a
      id={link.id}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex flex-col rounded-3xl border border-border/70 bg-card p-6 surface-shadow transition-all duration-[var(--dur-micro)] hover:-translate-y-1 hover:surface-shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        highlighted && ["ring-2", classes.highlight]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          title={title}
          className="line-clamp-2 text-[15px] leading-snug font-medium"
        >
          {title}
        </h3>
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          strokeWidth={2}
          className="mt-0.5 size-4 shrink-0 text-muted-foreground/50 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
        />
      </div>

      <div className="mt-auto flex items-end gap-3 pt-6">
        <DocMeta link={link} />
        {age ? (
          <Tooltip>
            <TooltipTrigger
              delay={200}
              render={
                <span className="ml-auto shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums" />
              }
            >
              {age}
            </TooltipTrigger>
            <TooltipContent>
              {link.updatedAt
                ? `最近更新于 ${new Date(link.updatedAt).toLocaleDateString("zh-CN")}`
                : "最近更新"}
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
    </a>
  )
}
