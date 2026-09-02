import type { Metadata } from "next"

import { LinkCardLab } from "@/components/lab/link-card-lab"
import { links } from "@/lib/data/library"

export const metadata: Metadata = {
  title: "链接卡片候选",
  description: "给课程文档卡片挑一个 UI 版本。这是临时页，不进主导航。",
  robots: { index: false, follow: false },
}

const SAMPLE_TITLES = [
  "计算机网络（评论待补充）",
  "操作系统丨2025",
  "密码学（图灵计划）",
  "军事理论挖空版2025-25.1.14修订",
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
