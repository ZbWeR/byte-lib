"use client"

import {
  Home01Icon,
  Idea01Icon,
  LibraryIcon,
  Search02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMemo, useState } from "react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import { useNavigate } from "@/hooks/use-navigate"
import { categoryIcon } from "@/lib/category-icons"
import { SHOW_GLOSSARY } from "@/lib/features"
import { categoryPath, glossaryPath, HOME_PATH } from "@/lib/paths"
import { filterSearch } from "@/lib/search"

const SUGGESTIONS = ["计算机", "医学院", "公共"] as const

type CommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const results = useMemo(() => filterSearch(query), [query])
  const total =
    results.categories.length + results.terms.length + results.nav.length

  const close = () => {
    onOpenChange(false)
    setQuery("")
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          setQuery("")
        }
      }}
      title="搜索"
      description={SHOW_GLOSSARY ? "搜索学院或概念" : "搜索学院"}
      className="sm:max-w-xl"
    >
      <Command shouldFilter={false} className="rounded-3xl bg-transparent">
        <CommandInput
          placeholder={SHOW_GLOSSARY ? "搜索学院或概念…" : "搜索学院…"}
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-80">
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 px-4 py-4">
              <HugeiconsIcon
                icon={Search02Icon}
                strokeWidth={2}
                className="size-6 text-muted-foreground/60"
              />
              <p className="text-sm text-muted-foreground">
                没有找到「{query}」相关的内容
              </p>
              <p className="text-xs text-muted-foreground/80">
                试试搜索：
                {SUGGESTIONS.map((hint, i) => (
                  <span key={hint}>
                    {i > 0 ? "、" : null}
                    <button
                      type="button"
                      className="text-foreground underline-offset-2 hover:underline"
                      onClick={() => setQuery(hint)}
                    >
                      {hint}
                    </button>
                  </span>
                ))}
              </p>
            </div>
          </CommandEmpty>

          {results.categories.length > 0 ? (
            <CommandGroup heading="分类">
              {results.categories.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`category:${item.id}`}
                  onSelect={() => {
                    navigate(categoryPath(item.category.slug))
                    close()
                  }}
                >
                  <HugeiconsIcon
                    icon={categoryIcon(item.category.slug)}
                    strokeWidth={2}
                    className="size-4 shrink-0"
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {item.category.name}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                    {item.count} 篇文档
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {SHOW_GLOSSARY && results.terms.length > 0 ? (
            <CommandGroup heading="概念">
              {results.terms.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`term:${item.id}`}
                  onSelect={() => {
                    navigate(glossaryPath(item.term.id))
                    close()
                  }}
                >
                  <HugeiconsIcon
                    icon={Idea01Icon}
                    strokeWidth={2}
                    className="size-4 shrink-0"
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {item.term.term}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {item.term.group}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {results.nav.length > 0 ? (
            <CommandGroup heading="前往">
              {results.nav.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`nav:${item.id}`}
                  onSelect={() => {
                    if (item.id === "glossary") {
                      navigate(glossaryPath())
                    } else {
                      navigate(HOME_PATH)
                    }
                    close()
                  }}
                >
                  <HugeiconsIcon
                    icon={item.id === "glossary" ? LibraryIcon : Home01Icon}
                    strokeWidth={2}
                    className="size-4 shrink-0"
                  />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
        <div className="hidden items-center gap-3 border-t-2 border-sticker-ink/10 px-3 py-2 font-heading text-xs font-semibold text-muted-foreground sm:flex">
          <span className="flex items-center gap-1">
            <Kbd>↵</Kbd> 打开
          </span>
          <span className="flex items-center gap-1">
            <Kbd>↑↓</Kbd> 选择
          </span>
          <span className="flex items-center gap-1">
            <Kbd>esc</Kbd> 关闭
          </span>
          <span className="ml-auto font-mono tabular-nums">{total} 条结果</span>
        </div>
      </Command>
    </CommandDialog>
  )
}
