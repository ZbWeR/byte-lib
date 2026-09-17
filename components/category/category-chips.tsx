"use client"

import Link from "next/link"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useMemo, useState } from "react"

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

  const previewItems = useMemo(() => {
    const current = CHIP_ITEMS.find((item) => item.slug === slug)
    const rest = CHIP_ITEMS.filter((item) => item.slug !== slug)
    return current ? [current, ...rest] : CHIP_ITEMS
  }, [slug])

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
        <div className="relative mt-6 md:mt-8 md:hidden">
          <div className="flex max-h-20 flex-wrap content-start gap-2 overflow-hidden p-0.5 pr-12">
            {previewItems.map((item) => (
              <CategoryChip
                key={item.slug}
                item={item}
                current={item.slug === slug}
                className="h-8 py-0"
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-background from-25% to-transparent" />
          <DrawerTrigger
            aria-expanded={open}
            aria-label="展开全部分类"
            className="absolute top-1/2 right-0 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full sticker-chip bg-secondary text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className={cn(
                "size-4 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </DrawerTrigger>
        </div>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>选择分类</DrawerTitle>
            <DrawerDescription>按学院筛选复习文档</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-wrap content-start gap-2.5 overflow-y-auto px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            {CHIP_ITEMS.map((item) => (
              <CategoryChip
                key={item.slug}
                item={item}
                current={item.slug === slug}
                onSelect={() => setOpen(false)}
                className="h-9 py-0"
              />
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
