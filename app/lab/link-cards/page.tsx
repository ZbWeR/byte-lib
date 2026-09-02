import type { Metadata } from "next"

import { LinkCardLab } from "@/components/lab/link-card-lab"
import { links } from "@/lib/data/library"

export const metadata: Metadata = {
  title: "链接卡片候选",
  description: "给课程文档卡片挑一个 UI 版本。这是临时页，不进主导航。",
  robots: { index: false, follow: false },
}

/** 六个学院各一篇，顺带覆盖脏标题、占位页、英文课。 */
const SAMPLE_TITLES = [
  "马克思主义基本原理丨2024",
  "计算机网络（评论待补充）",
  "儿科学",
  "数字图像处理丨2024&2025",
  "ME Packaging Technology",
  "集成电路工艺-24.11.13修订",
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
