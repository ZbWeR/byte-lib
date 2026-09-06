import type { Metadata } from "next"

import { CategoryStage } from "@/components/stage/category-stage"

export const metadata: Metadata = {
  title: "分类舞台",
  description: "保留下来的分类舞台切换实验页，不进主导航。",
  robots: { index: false, follow: false },
}

export default function StageLabPage() {
  return <CategoryStage />
}
