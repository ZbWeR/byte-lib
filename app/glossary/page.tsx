import type { Metadata } from "next"
import { Suspense } from "react"

import { GlossaryView } from "@/components/glossary/glossary-view"

export const metadata: Metadata = {
  title: "概念词典",
  description:
    "16 个成电人天天挂在嘴边、却很少有人正式解释过的词。点开词条看完整说法。",
}

export default function GlossaryPage() {
  return (
    <Suspense>
      <GlossaryView />
    </Suspense>
  )
}
