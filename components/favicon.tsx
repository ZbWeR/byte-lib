/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useRef, useState } from "react"

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
  const imgRef = useRef<HTMLImageElement>(null)
  const host = hostOf(url)
  const letter = Array.from(title)[0] ?? "?"

  /**
   * 首屏的 <img> 是服务端渲染出来的，浏览器在 React 完成 hydration 之前就已经开始
   * （并且可能已经失败）加载图片。那次 error 事件没人监听，onError 永远不会被调用，
   * 图标就会永久停留在破图状态。所以挂载后要主动补查一次结果。
   */
  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true)
    }
  }, [])

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
          ref={imgRef}
          src={`/api/icon?host=${encodeURIComponent(host)}`}
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
