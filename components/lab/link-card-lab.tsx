"use client"

import Link from "next/link"

import { Favicon } from "@/components/favicon"
import {
  samplesFromLinks,
  type CardSample,
  type CardVariant,
} from "@/components/lab/card-shell"
import { LINK_CARD_CONCEPTS } from "@/components/lab/link-card-concepts"
import { buttonVariants } from "@/components/ui/button"
import { categories } from "@/lib/data/library"
import type { LibraryLink } from "@/lib/data/types"
import { dicebearStyleFor } from "@/lib/dicebear"
import { HOME_PATH } from "@/lib/paths"
import { cn } from "@/lib/utils"

type LinkCardLabProps = {
  links: LibraryLink[]
}

function DicebearLegend() {
  return (
    <div className="mt-10">
      <h2 className="text-[13px] font-medium tracking-tight">学院图标风格</h2>
      <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
        每个学院锁一种 DiceBear 风格，卡片上的差异来自文档 token。下面用学院
        slug 当 seed，方便对照。
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <li
            key={category.slug}
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-3 py-2.5"
          >
            <Favicon
              url={`https://wiki.feishu.cn/wiki/${category.slug}`}
              title={category.name}
              accent={category.accent}
              categorySlug={category.slug}
              className="size-9 shrink-0"
            />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium">
                {category.name}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {dicebearStyleFor(category.slug)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function VariantBlock({
  variant,
  samples,
}: {
  variant: CardVariant
  samples: CardSample[]
}) {
  const Card = variant.Card

  return (
    <section id={variant.id} className="scroll-mt-28">
      <div className="mb-6 max-w-2xl space-y-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          {variant.letter}
        </p>
        <h3 className="text-[1.65rem] font-medium tracking-tight">
          {variant.name}
        </h3>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {variant.summary}
        </p>
        <p className="text-[12px] leading-relaxed text-muted-foreground/80">
          {variant.note}
        </p>
      </div>

      <div
        className={
          variant.layout === "list"
            ? "flex max-w-2xl flex-col gap-2"
            : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        }
      >
        {samples.map((sample) => (
          <Card key={`${variant.id}-${sample.link.id}`} sample={sample} />
        ))}
      </div>
    </section>
  )
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
        上一批评语和热度条都拿掉了。样本来自六个学院，方便看图标风格；标题里的「评论待补充」也不会再出现。选定后把字母发我就行。
      </p>

      <nav className="mt-8 flex flex-wrap gap-2">
        {LINK_CARD_CONCEPTS.map((variant) => (
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

      <DicebearLegend />

      <div className="mt-16 flex flex-col gap-20">
        {LINK_CARD_CONCEPTS.map((variant) => (
          <VariantBlock key={variant.id} variant={variant} samples={samples} />
        ))}
      </div>
    </section>
  )
}
