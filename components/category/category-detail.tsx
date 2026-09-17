"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useMemo, useState } from "react"

import { CategoryChips } from "@/components/category/category-chips"
import { LinkCard } from "@/components/link-card"
import { buttonVariants } from "@/components/ui/button"
import {
  categories,
  isAllCategorySlug,
  linksByCategory,
  linksForCategory,
  resolveCategory,
} from "@/lib/data/library"
import type { AccentKey, LibraryLink } from "@/lib/data/types"
import { categoryPath, HOME_PATH } from "@/lib/paths"

type CategoryDetailProps = {
  slug: string
}

function LinkGrid({
  items,
  accentFor,
  highlighted,
}: {
  items: LibraryLink[]
  accentFor: (link: LibraryLink) => AccentKey
  highlighted: string | null
}) {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
      {items.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          accent={accentFor(link)}
          highlighted={highlighted === link.id}
        />
      ))}
    </div>
  )
}

export function CategoryDetail({ slug }: CategoryDetailProps) {
  const category = resolveCategory(slug)
  const searchParams = useSearchParams()
  const focus = searchParams.get("focus")
  const [expiredFocus, setExpiredFocus] = useState<string | null>(null)
  const highlighted = focus && expiredFocus !== focus ? focus : null
  const isAll = isAllCategorySlug(slug)

  const allLinks = useMemo(() => linksForCategory(slug), [slug])

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
    <section className="mx-auto w-full max-w-6xl min-w-0 px-6 pt-24 pb-14 md:pt-28 md:pb-24">
      <div className="flex items-center gap-3">
        <Link href={HOME_PATH} className={buttonVariants({ variant: "ghost" })}>
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          图书馆
        </Link>
        <p className="hidden min-w-0 truncate text-sm text-muted-foreground sm:block">
          图书馆
          <span className="mx-1.5 text-muted-foreground/50">/</span>
          <span className="text-foreground">{category.name}</span>
        </p>
      </div>

      <div className="mt-6 space-y-2 md:mt-8 md:space-y-3">
        <p className="font-heading text-xs font-semibold tracking-[0.16em] text-sticker-blue uppercase">
          <span className="tabular-nums">
            {isAll ? "ALL" : String(index + 1).padStart(2, "0")}
          </span>
          <span className="mx-2">·</span>
          {category.nameEn}
        </p>
        <h1 className="font-heading text-3xl tracking-tight md:text-4xl">
          {category.name}
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-foreground/75 md:text-base">
          {category.description}
        </p>
        <p className="font-heading text-xs font-semibold tracking-[0.14em] text-sticker-pink uppercase">
          <span className="tabular-nums">{allLinks.length}</span> 篇文档
        </p>
      </div>

      <CategoryChips slug={slug} />

      {isAll ? (
        <div className="mt-8 space-y-10 md:mt-10 md:space-y-14">
          {categories.map((item) => {
            const groupLinks = linksByCategory[item.slug] ?? []
            if (groupLinks.length === 0) {
              return null
            }
            return (
              <section key={item.slug} className="min-w-0">
                <div className="mb-5 flex min-w-0 flex-wrap items-end justify-between gap-3">
                  <Link
                    href={categoryPath(item.slug)}
                    className="group min-w-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <p className="font-heading text-xs font-semibold tracking-[0.16em] break-words text-sticker-blue uppercase">
                      {item.nameEn}
                    </p>
                    <h2 className="mt-1 font-heading text-2xl tracking-tight group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                      {item.name}
                    </h2>
                  </Link>
                  <p className="shrink-0 font-heading text-xs font-semibold tracking-[0.14em] text-sticker-pink uppercase">
                    <span className="tabular-nums">{groupLinks.length}</span>{" "}
                    篇文档
                  </p>
                </div>
                <LinkGrid
                  items={groupLinks}
                  accentFor={() => item.accent}
                  highlighted={highlighted}
                />
              </section>
            )
          })}
        </div>
      ) : (
        <div className="mt-8 md:mt-10">
          <LinkGrid
            items={allLinks}
            accentFor={() => category.accent}
            highlighted={highlighted}
          />
        </div>
      )}
    </section>
  )
}
