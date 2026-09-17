"use client"

import Link from "next/link"
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState } from "react"

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { categoryIcon } from "@/lib/category-icons"
import { ALL_CATEGORY_SLUG, allCategory, categories } from "@/lib/data/library"
import { categoryPath } from "@/lib/paths"
import { cn } from "@/lib/utils"

const CHIP_ITEMS = [
  { slug: ALL_CATEGORY_SLUG, name: allCategory.name },
  ...categories.map((item) => ({ slug: item.slug, name: item.name })),
]

type ChipItem = (typeof CHIP_ITEMS)[number]

function CategoryChip({
  item,
  current,
  onSelect,
  className,
}: {
  item: ChipItem
  current: boolean
  onSelect?: () => void
  className?: string
}) {
  return (
    <Link
      href={categoryPath(item.slug)}
      aria-current={current ? "page" : undefined}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-2 rounded-full sticker-chip px-3 py-1.5 font-heading text-sm font-semibold transition-transform hover:-translate-y-0.5",
        current ? "bg-primary text-primary-foreground" : "text-foreground",
        className
      )}
    >
      <HugeiconsIcon
        icon={categoryIcon(item.slug)}
        strokeWidth={2}
        className="size-3.5"
      />
      {item.name}
    </Link>
  )
}

export function CategoryChips({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false)
  const currentItem =
    CHIP_ITEMS.find((item) => item.slug === slug) ?? CHIP_ITEMS[0]

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    const onChange = () => {
      if (media.matches) {
        setOpen(false)
      }
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return (
    <>
      <div className="mt-6 hidden flex-wrap gap-3 md:mt-8 md:flex">
        {CHIP_ITEMS.map((item) => (
          <CategoryChip
            key={item.slug}
            item={item}
            current={item.slug === slug}
          />
        ))}
      </div>

      <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
        <div className="mt-6 md:hidden">
          <DrawerTrigger
            aria-expanded={open}
            aria-label={`切换分类，当前为${currentItem.name}`}
            className="flex h-11 w-full items-center gap-2.5 rounded-full sticker-chip bg-card px-3.5 font-heading text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HugeiconsIcon
              icon={categoryIcon(currentItem.slug)}
              strokeWidth={2}
              className="size-4 shrink-0 text-sticker-pink"
            />
            <span className="min-w-0 flex-1 truncate text-left">
              {currentItem.name}
            </span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </DrawerTrigger>
        </div>

        <DrawerContent className="max-h-[min(26rem,58dvh)] [--drawer-content-max-height:min(26rem,58dvh)]">
          <DrawerHeader className="shrink-0">
            <DrawerTitle>切换分类</DrawerTitle>
            <DrawerDescription>
              当前为{currentItem.name}，点一项即可查看对应文档。
            </DrawerDescription>
          </DrawerHeader>
          <nav
            data-base-ui-swipe-ignore=""
            aria-label="学院分类"
            className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-3 pt-1 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
          >
            {CHIP_ITEMS.map((item) => {
              const current = item.slug === slug
              return (
                <Link
                  key={item.slug}
                  href={categoryPath(item.slug)}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex h-12 items-center gap-3 rounded-2xl px-3 font-heading text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    current
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <HugeiconsIcon
                    icon={categoryIcon(item.slug)}
                    strokeWidth={2}
                    className="size-4 shrink-0"
                  />
                  <span className="min-w-0 flex-1 truncate">{item.name}</span>
                  {current ? (
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      strokeWidth={2}
                      className="size-4 shrink-0"
                    />
                  ) : null}
                </Link>
              )
            })}
          </nav>
        </DrawerContent>
      </Drawer>
    </>
  )
}
