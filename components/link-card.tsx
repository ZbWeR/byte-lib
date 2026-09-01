"use client"

import { Alert02Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Favicon } from "@/components/favicon"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { accentClasses } from "@/lib/accents"
import type { AccentKey, LibraryLink } from "@/lib/data/types"
import { hostOf } from "@/lib/search"
import { cn } from "@/lib/utils"

type LinkCardProps = {
  link: LibraryLink
  accent: AccentKey
  highlighted?: boolean
}

export function LinkCard({ link, accent, highlighted }: LinkCardProps) {
  const host = hostOf(link.url)
  const tags = link.tags.slice(0, 3)
  const classes = accentClasses[accent]

  return (
    <a
      id={link.id}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex flex-col gap-3 rounded-3xl border border-border/70 bg-card p-5 transition-all duration-[var(--dur-micro)] hover:-translate-y-0.5 hover:surface-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        classes.ring,
        highlighted && ["ring-2", classes.highlight]
      )}
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
      <p
        className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground"
        title={link.description}
      >
        {link.description}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-[11px]">
            {tag}
          </Badge>
        ))}
        {link.campusOnly ? (
          <Tooltip>
            <TooltipTrigger
              delay={200}
              render={<span className="inline-flex" />}
            >
              <Badge variant="outline" className="text-[11px]">
                <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} />
                校园网
              </Badge>
            </TooltipTrigger>
            <TooltipContent>需校园网或图书馆远程访问</TooltipContent>
          </Tooltip>
        ) : null}
      </div>
    </a>
  )
}
