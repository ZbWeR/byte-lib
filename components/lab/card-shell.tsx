"use client"

import type { ReactNode } from "react"

import { accentClasses } from "@/lib/accents"
import { categoryBySlug } from "@/lib/data/library"
import type { AccentKey, LibraryLink } from "@/lib/data/types"
import { cn } from "@/lib/utils"

export type CardVariant = {
  id: string
  letter: string
  name: string
  layout: "grid" | "list" | "table"
  summary: string
  note: string
  Card: (props: { sample: CardSample }) => ReactNode
  Header?: () => ReactNode
}

export type CardSample = {
  link: LibraryLink
  accent: AccentKey
  index: number
}

export function CardAnchor({
  link,
  accent,
  className,
  children,
}: {
  link: LibraryLink
  accent: AccentKey
  className?: string
  children: ReactNode
}) {
  const classes = accentClasses[accent]
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex transition-all duration-[var(--dur-micro)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        classes.ring,
        className
      )}
    >
      {children}
    </a>
  )
}

export function samplesFromLinks(links: LibraryLink[]): CardSample[] {
  return links.map((link, index) => {
    const category = categoryBySlug.get(link.categorySlug)
    return {
      link,
      accent: category?.accent ?? "lime",
      index,
    }
  })
}
