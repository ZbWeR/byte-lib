"use client"

import type { CardSample, CardVariant } from "@/components/lab/card-shell"
import { LinkCard } from "@/components/link-card"

/** A · 分类页现在这张卡，没有头像。 */
export function ConceptCurrent({ sample }: { sample: CardSample }) {
  return <LinkCard link={sample.link} accent={sample.accent} />
}

export const LINK_CARD_CONCEPTS: CardVariant[] = [
  {
    id: "current",
    letter: "A",
    name: "现行",
    layout: "grid",
    summary:
      "已采用。没有学院名、没有头像，「评论待补充」从标题里拿掉；字数、阅读、赞、更新是图标。",
    note: "首页预览和搜索结果里还有小图标，跟这张卡无关。",
    Card: ConceptCurrent,
  },
]
