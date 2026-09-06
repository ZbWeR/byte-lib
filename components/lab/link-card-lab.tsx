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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
      <h1 className="mt-3 text-3xl font-medium tracking-tight">链接卡片</h1>
      <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
        分类页用的就是这张：玻璃底、主题色分类名、中文标题，元信息是看过 / 赞 /
        字数。
      </p>

      <nav className="mt-8 flex flex-wrap gap-2">
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

      <div className="mt-16 flex flex-col gap-20">
        {LINK_CARD_CONCEPTS.map((variant) => (
          <VariantBlock key={variant.id} variant={variant} samples={samples} />
        ))}
      </div>
    </section>
  )
}
