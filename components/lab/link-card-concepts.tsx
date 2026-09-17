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
      "纯白底。最多两行标题，下面三行文档简介；外链箭头悬停时以贴纸粉出现；左下是字数、阅读量和点赞，右下是相对更新时间。",
    note: "不再展示标签或学院色。",
    Card: ConceptCurrent,
  },
]
