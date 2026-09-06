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
      "玻璃底。最上是主题色分类名，标题用 18px 中文衬线；元信息是 [眼睛] 18,188看过 [爱心] 84 赞 2.3万字。",
    note: "全部列表和学院页共用这张卡，分类名用来辨认文档属于哪个学院。",
    Card: ConceptCurrent,
  },
]
