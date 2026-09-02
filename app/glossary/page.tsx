import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { GlossaryView } from "@/components/glossary/glossary-view"
import { SHOW_GLOSSARY } from "@/lib/features"
import { HOME_PATH } from "@/lib/paths"

export const metadata: Metadata = {
  title: "概念词典",
  description:
    "16 个成电人天天挂在嘴边、却很少有人正式解释过的词。点开词条看完整说法。",
}

export default function GlossaryPage() {
  if (!SHOW_GLOSSARY) {
    redirect(HOME_PATH)
  }

  return (
    <Suspense>
      <GlossaryView />
    </Suspense>
  )
}
