"use client"

import Link from "next/link"

import {
  samplesFromLinks,
  type CardSample,
  type CardVariant,
} from "@/components/lab/card-shell"
import { LINK_CARD_CONCEPTS } from "@/components/lab/link-card-concepts"
import { LINK_CARD_VARIANTS } from "@/components/lab/link-card-variants"
import { buttonVariants } from "@/components/ui/button"
import type { LibraryLink } from "@/lib/data/types"
import { HOME_PATH } from "@/lib/paths"
import { cn } from "@/lib/utils"

type LinkCardLabProps = {
  links: LibraryLink[]
}

const GROUPS: {
  title: string
  blurb: string
  variants: readonly CardVariant[]
}[] = [
  {
    title: "第二批",
    blurb:
      "这一批不再只是挪位置，而是各自挑一个主角：把统计排成可比较的行、把阅读量画成条、把字数画成厚度。",
    variants: LINK_CARD_CONCEPTS,
  },
  {
    title: "第一批",
    blurb: "留着对照。这几版的区别主要在布局，信息取舍差不多。",
    variants: LINK_CARD_VARIANTS,
  },
]

function VariantBlock({
  variant,
  samples,
}: {
  variant: CardVariant
  samples: CardSample[]
}) {
  const Card = variant.Card
  const Header = variant.Header

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

      {variant.layout === "table" ? (
        <div className="max-w-2xl overflow-hidden rounded-2xl border border-border/70 bg-card pt-3 [&>a:last-child]:border-b-0">
          {Header ? <Header /> : null}
          {samples.map((sample) => (
            <Card key={`${variant.id}-${sample.link.id}`} sample={sample} />
          ))}
        </div>
      ) : (
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
      )}
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
        六篇样本刻意挑得很不一样：有 2.6 万人读过的马原，也有只有 3
        个字的医学院占位页；有 9
        万字的英文课，也有标题很脏的军理。点卡片会打开飞书；选定后把字母发我就行。
      </p>

      <nav className="mt-8 flex flex-wrap gap-2">
        {GROUPS.flatMap((group) => group.variants).map((variant) => (
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

      {GROUPS.map((group) => (
        <div key={group.title} className="mt-16">
          <div className="mb-10 border-t border-border/60 pt-6">
            <h2 className="text-[13px] font-medium tracking-tight">
              {group.title}
            </h2>
            <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
              {group.blurb}
            </p>
          </div>
          <div className="flex flex-col gap-20">
            {group.variants.map((variant) => (
              <VariantBlock
                key={variant.id}
                variant={variant}
                samples={samples}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
