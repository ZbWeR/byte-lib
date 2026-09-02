/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useRef, useState } from "react"

import { accentClasses } from "@/lib/accents"
import type { AccentKey } from "@/lib/data/types"
import { dicebearStyleFor } from "@/lib/dicebear"
import { cn } from "@/lib/utils"

type FaviconProps = {
  url: string
  title: string
  accent: AccentKey
  categorySlug?: string
  className?: string
}

function avatarSeed(url: string, title: string) {
  try {
    const parsed = new URL(url)
    const last = parsed.pathname.split("/").filter(Boolean).pop()
    if (last) return last
    return parsed.hostname
  } catch {
    return title
  }
}

export function Favicon({
  url,
  title,
  accent,
  categorySlug,
  className,
}: FaviconProps) {
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const seed = avatarSeed(url, title)
  const style = dicebearStyleFor(categorySlug)
  const letter = Array.from(title)[0] ?? "?"

  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true)
    }
  }, [seed, style])

  return (
    <div
      className={cn(
        "grid place-items-center overflow-hidden rounded-2xl border border-border/60 bg-muted/40",
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
          ref={imgRef}
          src={`/api/avatar?seed=${encodeURIComponent(seed)}&style=${encodeURIComponent(style)}`}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
