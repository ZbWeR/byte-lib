"use client"

import type { CardSample, CardVariant } from "@/components/lab/card-shell"
import { LinkCard } from "@/components/link-card"

/** A · 分类页现在这张卡。 */
export function ConceptCurrent({ sample }: { sample: CardSample }) {
  return <LinkCard link={sample.link} accent={sample.accent} />
}

export const LINK_CARD_CONCEPTS: CardVariant[] = [
  {
    id: "current",
    letter: "A",
    name: "文档卡",
    layout: "grid",
    summary:
      "纯白底。最上是主题色分类名，接着两行标题，外链图标悬停才出现；左下是字数、阅读量和点赞，右下是相对更新时间。",
    note: "全部列表和学院页共用这张卡，分类名用来辨认文档属于哪个学院。",
    Card: ConceptCurrent,
  },
]
