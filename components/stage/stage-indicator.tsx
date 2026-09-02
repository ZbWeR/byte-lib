"use client"

import { accentClasses } from "@/lib/accents"
import { categories } from "@/lib/data/library"
import { cn } from "@/lib/utils"

type StageIndicatorProps = {
  activeIndex: number
  onSelect: (index: number) => void
}

export function StageIndicator({ activeIndex, onSelect }: StageIndicatorProps) {
  return (
    <div data-stage-chrome className="relative z-50 flex justify-center py-4">
      <div className="flex max-w-[min(92vw,28rem)] flex-wrap items-center justify-center gap-1.5 px-3 py-2">
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
    </div>
  )
}
