"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useMemo, useState } from "react"

import { LinkCard } from "@/components/link-card"
import { buttonVariants } from "@/components/ui/button"
import { categoryIcon } from "@/lib/category-icons"
import { categories, categoryBySlug, linksByCategory } from "@/lib/data/library"
import { categoryPath, HOME_PATH } from "@/lib/paths"
import { cn } from "@/lib/utils"

type CategoryDetailProps = {
  slug: string
}

export function CategoryDetail({ slug }: CategoryDetailProps) {
  const category = categoryBySlug.get(slug)
  const searchParams = useSearchParams()
  const focus = searchParams.get("focus")
  const [expiredFocus, setExpiredFocus] = useState<string | null>(null)
  const highlighted = focus && expiredFocus !== focus ? focus : null

  const allLinks = useMemo(() => linksByCategory[slug] ?? [], [slug])

  useEffect(() => {
    if (!focus) {
      return
    }
    const scrollTimer = window.setTimeout(() => {
      document.getElementById(focus)?.scrollIntoView({ block: "center" })
    }, 80)
    const timer = window.setTimeout(() => setExpiredFocus(focus), 2000)
    return () => {
      window.clearTimeout(scrollTimer)
      window.clearTimeout(timer)
    }
  }, [focus])

  if (!category) {
    return null
  }

  const index = categories.findIndex((item) => item.slug === slug)

  return (
    <section className="mx-auto max-w-6xl px-6 pt-28 pb-24">
      <div className="flex flex-wrap items-center gap-3">
        <Link href={HOME_PATH} className={buttonVariants({ variant: "ghost" })}>
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          图书馆
        </Link>
        <p className="text-[13px] text-muted-foreground">
          图书馆
          <span className="mx-1.5 text-muted-foreground/50">/</span>
          <span className="text-foreground">{category.name}</span>
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          <span className="tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mx-2">·</span>
          {category.nameEn}
        </p>
        <h1 className="text-3xl font-medium tracking-tight">{category.name}</h1>
        <p className="max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
          {category.description}
        </p>
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          <span className="tabular-nums">{allLinks.length}</span> 篇文档
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((item) => {
          const current = item.slug === slug
          return (
            <Link
              key={item.slug}
              href={categoryPath(item.slug)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] transition-all",
                current
                  ? "border-foreground bg-foreground text-background"
                  : "border-border/70 bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <HugeiconsIcon
                icon={categoryIcon(item.slug)}
                strokeWidth={2}
                className="size-3.5"
              />
              {item.name}
            </Link>
          )
        })}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {allLinks.map((link) => (
          <LinkCard
            key={link.id}
            link={link}
            accent={category.accent}
            highlighted={highlighted === link.id}
          />
        ))}
      </div>
    </section>
  )
}
