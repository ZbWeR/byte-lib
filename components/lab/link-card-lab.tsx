"use client"

import Link from "next/link"

import {
  samplesFromLinks,
  type CardSample,
  type CardVariant,
} from "@/components/lab/card-shell"
import { LINK_CARD_CONCEPTS } from "@/components/lab/link-card-concepts"
import { buttonVariants } from "@/components/ui/button"
import type { LibraryLink } from "@/lib/data/types"
import { HOME_PATH } from "@/lib/paths"
import { cn } from "@/lib/utils"

type LinkCardLabProps = {
  links: LibraryLink[]
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
        <p className="font-heading text-xs font-semibold tracking-[0.16em] text-sticker-blue uppercase">
          {variant.letter}
        </p>
        <h3 className="text-2xl tracking-tight">{variant.name}</h3>
        <p className="text-base leading-relaxed text-foreground/75">
          {variant.summary}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {variant.note}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
      <p className="font-heading text-xs font-semibold tracking-[0.16em] text-sticker-pink uppercase">
        Lab · 不进主导航
      </p>
      <h1 className="mt-3 text-4xl tracking-tight">链接卡片</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/75">
        分类页用的就是这张：两行标题，下面是文档简介，左下字数 / 阅读 /
        点赞，右下更新时间。
      </p>

      <nav className="mt-8 flex flex-wrap gap-2">
        <Link
          href={HOME_PATH}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "rounded-full"
          )}
        >
          回首页
        </Link>
      </nav>

      <div className="mt-16 flex flex-col gap-20">
        {LINK_CARD_CONCEPTS.map((variant) => (
          <VariantBlock key={variant.id} variant={variant} samples={samples} />
        ))}
      </div>
    </section>
  )
}
