"use client"

import { ByteLibLogo } from "@/components/byte-lib-logo"
import { CategoryDetail } from "@/components/category/category-detail"

export function HomeLibrary() {
  return (
    <div className="flex flex-col">
      <div className="px-6 pt-20 pb-2 sm:pt-24">
        <ByteLibLogo compact />
      </div>
      <CategoryDetail />
    </div>
  )
}
