"use client"

import { linkById } from "@/lib/data/links"
import type { GlossaryTerm } from "@/lib/data/types"
import { categoryBySlug } from "@/lib/data/categories"
import { Favicon } from "@/components/favicon"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "@/hooks/use-navigate"
import { glossaryPath } from "@/lib/paths"
import { cn } from "@/lib/utils"

type TermCardProps = {
  term: GlossaryTerm
  expanded: boolean
}

export function TermCard({ term, expanded }: TermCardProps) {
  const related = (term.relatedLinkIds ?? [])
    .map((id) => linkById.get(id))
    .filter((link) => link != null)
  const navigate = useNavigate()

  return (
    <article
      data-term-card=""
      data-term-id={term.id}
      className={cn(
        "rounded-3xl border border-border/70 bg-card p-5 surface-shadow transition-all duration-[var(--dur-micro)]",
        expanded && "ring-1 ring-border"
      )}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() =>
          navigate(expanded ? glossaryPath() : glossaryPath(term.id))
        }
        className="w-full text-left outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[17px] leading-snug font-semibold">
              {term.term}
            </h2>
            {term.en ? (
              <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                {term.en}
              </p>
            ) : null}
          </div>
          <Badge variant="secondary">{term.group}</Badge>
        </div>
        {term.alias && term.alias.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {term.alias.map((alias) => (
              <Badge key={alias} variant="outline" className="text-[11px]">
                {alias}
              </Badge>
            ))}
          </div>
        ) : null}
        <p className="mt-3 line-clamp-2 text-[14.5px] leading-relaxed text-foreground/75">
          {term.summary}
        </p>
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 pt-4 text-[15px] leading-relaxed text-foreground/75">
            {term.detail.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {related.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {related.map((link) => {
                const category = categoryBySlug.get(link.categorySlug)
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() =>
                      window.open(link.url, "_blank", "noopener,noreferrer")
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 py-1 pr-3 pl-1 text-[12px] transition-colors hover:bg-muted"
                  >
                    <Favicon
                      url={link.url}
                      title={link.title}
                      accent={category?.accent ?? "lime"}
                      className="size-5 rounded-full p-0.5"
                    />
                    {link.title}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}
