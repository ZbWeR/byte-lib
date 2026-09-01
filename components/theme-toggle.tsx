"use client"

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { useMounted } from "@/hooks/use-mounted"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) {
    return <div className="size-9" />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      className="rounded-full"
      aria-label={isDark ? "切换到浅色外观" : "切换到深色外观"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="relative size-4">
        <HugeiconsIcon
          icon={Sun03Icon}
          strokeWidth={2}
          className={cn(
            "absolute inset-0 size-4 transition-all duration-300",
            isDark ? "scale-0 rotate-90" : "scale-100 rotate-0"
          )}
        />
        <HugeiconsIcon
          icon={Moon02Icon}
          strokeWidth={2}
          className={cn(
            "absolute inset-0 size-4 transition-all duration-300",
            isDark ? "scale-100 rotate-0" : "scale-0 rotate-90"
          )}
        />
      </span>
    </Button>
  )
}
