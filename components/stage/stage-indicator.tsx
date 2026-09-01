"use client"

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { accentClasses } from "@/lib/accents"
import { categories } from "@/lib/data/categories"
import { cn } from "@/lib/utils"

type StageIndicatorProps = {
  activeIndex: number
  onSelect: (index: number) => void
  showHint: boolean
}

export function StageIndicator({
  activeIndex,
  onSelect,
  showHint,
}: StageIndicatorProps) {
  return (
    <div
      data-stage-chrome
      className="absolute bottom-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3"
    >
      <div className="flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-2 glass">
        {categories.map((category, index) => {
          const active = index === activeIndex
          return (
            <button
              key={category.slug}
              type="button"
              aria-label={`切换到${category.name}`}
              aria-current={active}
              onClick={() => onSelect(index)}
              className={cn(
                "rounded-full transition-all duration-300",
                active
                  ? cn("h-1.5 w-6", accentClasses[category.accent].dot)
                  : "size-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
            />
          )
        })}
      </div>
      {/* 箭头用矢量图标而不是 ← → 字符：等宽字体不一定收录这两个码位，
          缺字形时会掉成豆腐块。 */}
      <p
        className={cn(
          "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-muted-foreground transition-opacity duration-700",
          showHint ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        滚动或
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          strokeWidth={2.5}
          className="size-3"
        />
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          strokeWidth={2.5}
          className="size-3"
        />
        切换
      </p>
    </div>
  )
}
