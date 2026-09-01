/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"

import { accentClasses } from "@/lib/accents"
import type { AccentKey } from "@/lib/data/types"
import { hostOf } from "@/lib/search"
import { cn } from "@/lib/utils"

type FaviconProps = {
  url: string
  title: string
  accent: AccentKey
  className?: string
}

export function Favicon({ url, title, accent, className }: FaviconProps) {
  const [failed, setFailed] = useState(false)
  const host = hostOf(url)
  const letter = Array.from(title)[0] ?? "?"

  return (
    <div
      className={cn(
        "grid place-items-center rounded-2xl border border-border/60 bg-muted/40 p-1.5",
        className
      )}
    >
      {failed ? (
        <span
          className={cn(
            "flex size-full items-center justify-center rounded-[10px] text-[13px] font-medium",
            accentClasses[accent].text,
            accentClasses[accent].mono
          )}
        >
          {letter}
        </span>
      ) : (
        <img
          src={`https://icons.duckduckgo.com/ip3/${host}.ico`}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="size-full object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
