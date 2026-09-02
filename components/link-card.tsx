"use client"

import { Alert02Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { DocMeta } from "@/components/doc-meta"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { accentClasses } from "@/lib/accents"
import { categoryIcon } from "@/lib/category-icons"
import { categoryBySlug } from "@/lib/data/library"
import type { AccentKey, LibraryLink } from "@/lib/data/types"
import { formatAge } from "@/lib/format"
import { cn } from "@/lib/utils"

type LinkCardProps = {
  link: LibraryLink
  accent: AccentKey
  highlighted?: boolean
}

export function LinkCard({ link, accent, highlighted }: LinkCardProps) {
  const tags = link.tags.slice(0, 3)
  const classes = accentClasses[accent]
  const title = link.displayTitle ?? link.title
  const college =
    link.collegeName ?? categoryBySlug.get(link.categorySlug)?.name
  const age = formatAge(link.updatedAt)
  const showFooter = tags.length > 0 || link.campusOnly || Boolean(age)

  return (
    <a
      id={link.id}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border bg-card p-6 surface-shadow transition-all duration-[var(--dur-micro)] hover:-translate-y-1 hover:surface-shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        classes.tint,
        classes.ring,
        highlighted && ["ring-2", classes.highlight]
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent",
          classes.wash
        )}
      />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-xl",
              classes.mono,
              classes.text
            )}
          >
            <HugeiconsIcon
              icon={categoryIcon(link.categorySlug)}
              strokeWidth={2}
              className="size-3.5"
            />
          </div>
          {college ? (
            <p className="truncate text-[12px] text-muted-foreground">
              {college}
            </p>
          ) : null}
        </div>
        <span
          aria-hidden
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full border border-border/70 bg-background/70 text-muted-foreground/55 transition-all duration-[var(--dur-micro)] group-hover:translate-x-px group-hover:-translate-y-px",
            classes.mark
          )}
        >
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            strokeWidth={2}
            className="size-3.5"
          />
        </span>
      </div>

      <div className="relative mt-5 flex flex-1 flex-col gap-3">
        <h3
          title={title}
          className="line-clamp-2 text-[15px] leading-snug font-medium"
        >
          {title}
        </h3>
        <DocMeta link={link} />
      </div>

      {showFooter ? (
        <div className="relative mt-auto flex items-end justify-between gap-3 pt-6">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
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
          {age ? (
            <Tooltip>
              <TooltipTrigger
                delay={200}
                render={
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums" />
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
      ) : null}
    </a>
  )
}
