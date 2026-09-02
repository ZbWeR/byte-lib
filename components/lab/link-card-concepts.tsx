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
    name: "学院信息卡",
    layout: "grid",
    summary:
      "大圆角、细描边、柔和阴影。顶部学院图标与名称，中部两行标题，辅以阅读量、点赞和占位状态；底部最多三个标签和相对更新时间。",
    note: "不同学院用低饱和主题色区分。悬停时卡片轻微上浮、阴影加深，右上外链按钮高亮。",
    Card: ConceptCurrent,
  },
]
