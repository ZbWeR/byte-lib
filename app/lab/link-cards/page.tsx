import type { Metadata } from "next"

import { LinkCardLab } from "@/components/lab/link-card-lab"
import { links } from "@/lib/data/library"

export const metadata: Metadata = {
  title: "链接卡片候选",
  description: "给课程文档卡片挑一个 UI 版本。这是临时页，不进主导航。",
  robots: { index: false, follow: false },
}

/** 刻意覆盖极端情况：最热、带状态、脏标题、冷门、占位页、超长英文。 */
const SAMPLE_TITLES = [
  "马克思主义基本原理丨2024",
  "计算机网络（评论待补充）",
  "军事理论挖空版2025-25.1.14修订",
  "密码学（图灵计划）",
  "儿科学",
  "ME Packaging Technology",
] as const

export default function LinkCardLabPage() {
  const samples = SAMPLE_TITLES.map((title) => {
    const link = links.find((item) => item.title === title)
    if (!link) {
      throw new Error(`Lab sample missing from catalog: ${title}`)
    }
    return link
  })

  return <LinkCardLab links={samples} />
}
