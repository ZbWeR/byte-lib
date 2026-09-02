"use client"

import Link from "next/link"

import {
  LINK_CARD_VARIANTS,
  samplesFromLinks,
} from "@/components/lab/link-card-variants"
import { buttonVariants } from "@/components/ui/button"
import type { LibraryLink } from "@/lib/data/types"
import { HOME_PATH } from "@/lib/paths"
import { cn } from "@/lib/utils"

type LinkCardLabProps = {
  links: LibraryLink[]
}

export function LinkCardLab({ links }: LinkCardLabProps) {
  const samples = samplesFromLinks(links)

  return (
    <section className="mx-auto max-w-6xl px-6 pt-28 pb-24">
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
        Lab · 不进主导航
      </p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight">链接卡片候选</h1>
      <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
        飞书目录目前只有标题、学院、链接，没有每篇文档的摘要。下面六个版本用同一组真实课程，方便对照。点卡片会打开飞书；选定后把字母（A–F）发我就行。
      </p>

      <nav className="mt-8 flex flex-wrap gap-2">
        {LINK_CARD_VARIANTS.map((variant) => (
          <a
            key={variant.id}
            href={`#${variant.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full"
            )}
          >
            {variant.letter} · {variant.name}
          </a>
        ))}
        <Link
          href={HOME_PATH}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "rounded-full"
          )}
        >
          回图书馆
        </Link>
      </nav>

      <div className="mt-14 flex flex-col gap-20">
        {LINK_CARD_VARIANTS.map((variant) => {
          const Card = variant.Card
          return (
            <section key={variant.id} id={variant.id} className="scroll-mt-28">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-2xl space-y-2">
                  <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                    {variant.letter}
                  </p>
                  <h2 className="text-[1.65rem] font-medium tracking-tight">
                    {variant.name}
                  </h2>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {variant.summary}
                  </p>
                  <p className="text-[12px] leading-relaxed text-muted-foreground/80">
                    {variant.note}
                  </p>
                </div>
              </div>
              <div
                className={
                  variant.layout === "list"
                    ? "flex max-w-2xl flex-col gap-2"
                    : "grid gap-4 sm:grid-cols-2 xl:grid-cols-2"
                }
              >
                {samples.map((sample) => (
                  <Card
                    key={`${variant.id}-${sample.link.id}`}
                    sample={sample}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </section>
  )
}
