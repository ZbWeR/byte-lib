"use client"

import {
  Home01Icon,
  Idea01Icon,
  LibraryIcon,
  Search02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"
import { useMemo, useState } from "react"

import { Favicon } from "@/components/favicon"
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
import { categoryBySlug } from "@/lib/data/categories"
import { categoryIcon } from "@/lib/category-icons"
import { categoryPath, glossaryPath, HOME_PATH } from "@/lib/paths"
import { filterSearch } from "@/lib/search"

const SUGGESTIONS = ["教务", "LaTeX", "保研"] as const

type CommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const { resolvedTheme, setTheme } = useTheme()
  const navigate = useNavigate()

  const results = useMemo(() => filterSearch(query), [query])
  const total =
    results.categories.length +
    results.links.length +
    results.terms.length +
    results.nav.length

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
      description="搜索站点、分类或概念"
      className="sm:max-w-xl"
    >
      <Command shouldFilter={false} className="rounded-3xl bg-transparent">
        <CommandInput
          placeholder="搜索站点、分类或概念…"
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
              <p className="text-[13px] text-muted-foreground">
                没有找到「{query}」相关的内容
              </p>
              <p className="text-[12px] text-muted-foreground/80">
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
                    className="size-4"
                  />
                  <span>{item.category.name}</span>
                  <span className="ml-auto font-mono text-[11px] text-muted-foreground tabular-nums">
                    {item.count} 个站点
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {results.links.length > 0 ? (
            <CommandGroup heading="站点">
              {results.links.map((item) => {
                const category = categoryBySlug.get(item.link.categorySlug)
                return (
                  <CommandItem
                    key={item.id}
                    value={`link:${item.id}`}
                    onSelect={() => {
                      window.open(
                        item.link.url,
                        "_blank",
                        "noopener,noreferrer"
                      )
                      close()
                    }}
                  >
                    <Favicon
                      url={item.link.url}
                      title={item.link.title}
                      accent={category?.accent ?? "lime"}
                      className="size-6 rounded-lg p-0.5"
                    />
                    <span className="truncate">{item.link.title}</span>
                    <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                      {item.host}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          ) : null}

          {results.terms.length > 0 ? (
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
                    className="size-4"
                  />
                  <span>{item.term.term}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">
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
                    if (item.id === "home") {
                      navigate(HOME_PATH)
                    } else if (item.id === "glossary") {
                      navigate(glossaryPath())
                    } else {
                      setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                    close()
                  }}
                >
                  <HugeiconsIcon
                    icon={
                      item.id === "home"
                        ? Home01Icon
                        : item.id === "glossary"
                          ? LibraryIcon
                          : Sun03Icon
                    }
                    strokeWidth={2}
                    className="size-4"
                  />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
        <div className="flex items-center gap-3 border-t border-border/60 px-3 py-2 text-[11px] text-muted-foreground glass">
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
