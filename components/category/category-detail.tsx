"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft01Icon, LibraryIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Suspense, useEffect, useMemo, useState } from "react"

import { LinkCard } from "@/components/link-card"
import { buttonVariants } from "@/components/ui/button"
import { categoryIcon } from "@/lib/category-icons"
import {
  categories,
  categoryBySlug,
  links,
  linksByCategory,
  sortLinksByUpdatedAt,
} from "@/lib/data/library"
import type { LibraryLink } from "@/lib/data/types"
import { categoryPath, HOME_PATH } from "@/lib/paths"
import { cn } from "@/lib/utils"

type CategoryDetailProps = {
  slug?: string
}

function chipClass(current: boolean) {
  return cn(
    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] transition-all",
    current
      ? "border-foreground bg-foreground text-background"
      : "border-border/70 bg-card text-muted-foreground hover:text-foreground"
  )
}

function CategoryChips({ activeSlug }: { activeSlug?: string }) {
  const allActive = !activeSlug

  return (
    <div className="flex flex-wrap gap-2">
      <Link href={HOME_PATH} className={chipClass(allActive)}>
        <HugeiconsIcon
          icon={LibraryIcon}
          strokeWidth={2}
          className="size-3.5"
        />
        全部
      </Link>
      {categories.map((item) => (
        <Link
          key={item.slug}
          href={categoryPath(item.slug)}
          className={chipClass(item.slug === activeSlug)}
        >
          <HugeiconsIcon
            icon={categoryIcon(item.slug)}
            strokeWidth={2}
            className="size-3.5"
          />
          {item.name}
        </Link>
      ))}
    </div>
  )
}

function LinkGrid({ links: items }: { links: LibraryLink[] }) {
  const searchParams = useSearchParams()
  const focus = searchParams.get("focus")
  const [expiredFocus, setExpiredFocus] = useState<string | null>(null)
  const highlighted = focus && expiredFocus !== focus ? focus : null

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

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          highlighted={highlighted === link.id}
        />
      ))}
    </div>
  )
}

export function CategoryDetail({ slug }: CategoryDetailProps) {
  const isAll = !slug
  const category = slug ? categoryBySlug.get(slug) : undefined

  const allLinks = useMemo(() => {
    if (isAll) {
      return sortLinksByUpdatedAt(links)
    }
    return linksByCategory[slug!] ?? []
  }, [isAll, slug])

  if (!isAll && !category) {
    return null
  }

  const index = category
    ? categories.findIndex((item) => item.slug === category.slug)
    : -1

  return (
    <section
      className={cn("mx-auto max-w-6xl px-6 pb-24", isAll ? "pt-6" : "pt-28")}
    >
      {category ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={HOME_PATH}
              className={buttonVariants({ variant: "ghost" })}
            >
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
            <h1 className="font-heading text-3xl tracking-tight">
              {category.name}
            </h1>
            <p className="max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
              {category.description}
            </p>
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              <span className="tabular-nums">{allLinks.length}</span> 篇文档
            </p>
          </div>
        </>
      ) : (
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          <span className="tabular-nums">{allLinks.length}</span> 篇文档
          <span className="mx-2">·</span>
          按最近更新
        </p>
      )}

      <div className={cn(category ? "mt-8" : "mt-4")}>
        <CategoryChips activeSlug={slug} />
      </div>

      <Suspense
        fallback={
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {allLinks.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        }
      >
        <LinkGrid links={allLinks} />
      </Suspense>
    </section>
  )
}
