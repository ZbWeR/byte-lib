"use client"

import {
  Cancel01Icon,
  Search01Icon,
  Search02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { TermCard } from "@/components/glossary/term-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { glossary, glossaryGroups } from "@/lib/data/glossary"
import type { GlossaryGroup } from "@/lib/data/types"
import { matchesHaystack } from "@/lib/search"
import { cn } from "@/lib/utils"

function termHaystack(item: (typeof glossary)[number]) {
  return [
    item.term,
    item.en ?? "",
    item.alias?.join(" ") ?? "",
    item.summary,
    item.keywords?.join(" ") ?? "",
  ].join(" ")
}

export function GlossaryView() {
  const searchParams = useSearchParams()
  const term = searchParams.get("term")
  const [query, setQuery] = useState("")
  const [group, setGroup] = useState<GlossaryGroup | null>(null)

  const counts = useMemo(() => {
    const map = new Map<GlossaryGroup, number>()
    for (const item of glossary) {
      map.set(item.group, (map.get(item.group) ?? 0) + 1)
    }
    return map
  }, [])

  const filtered = useMemo(() => {
    return glossary.filter((item) => {
      if (group && item.group !== group) {
        return false
      }
      return matchesHaystack(termHaystack(item), query)
    })
  }, [group, query])

  const clear = () => {
    setQuery("")
    setGroup(null)
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pt-28 pb-24">
      <p className="font-heading text-xs font-semibold tracking-[0.16em] text-sticker-blue uppercase">
        GLOSSARY
      </p>
      <h1 className="mt-2 font-heading text-4xl tracking-tight">概念词典</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/75">
        16
        个成电人天天挂在嘴边、却很少有人正式解释过的词。点开词条看完整说法，相关链接会把你送回对应分类。
      </p>
      <p className="mt-2 font-heading text-xs font-semibold tracking-[0.14em] text-sticker-pink uppercase">
        <span className="tabular-nums">{glossary.length}</span> 个词条
      </p>

      <div className="relative mt-8 max-w-md">
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={2}
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索词条、别名或关键词…"
          className="h-10 pr-9 pl-9"
        />
        {query ? (
          <button
            type="button"
            aria-label="清除搜索"
            onClick={() => setQuery("")}
            className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              strokeWidth={2}
              className="size-3.5"
            />
          </button>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setGroup(null)}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-full sticker-chip px-3 font-heading text-xs font-semibold transition-transform hover:-translate-y-0.5",
            group === null && "bg-primary text-primary-foreground"
          )}
        >
          全部
          <span className="font-mono text-xs tabular-nums">
            {glossary.length}
          </span>
        </button>
        {glossaryGroups.map((item) => {
          const selected = group === item
          return (
            <button
              key={item}
              type="button"
              onClick={() => setGroup(item)}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-full sticker-chip px-3 font-heading text-xs font-semibold transition-transform hover:-translate-y-0.5",
                selected && "bg-primary text-primary-foreground"
              )}
            >
              {item}
              <span className="font-mono text-xs tabular-nums">
                {counts.get(item) ?? 0}
              </span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <HugeiconsIcon
            icon={Search02Icon}
            strokeWidth={1.5}
            className="size-10 text-muted-foreground/50"
          />
          <p className="mt-4 text-base font-medium">没有匹配的词条</p>
          <p className="mt-1 text-sm text-muted-foreground">
            换个说法，或者把筛选清掉再看看。
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={clear}
          >
            清除筛选
          </Button>
        </div>
      ) : (
        <div
          key={`${group ?? "all"}:${query}`}
          className="mt-8 grid animate-in gap-6 duration-200 fade-in-0 md:grid-cols-2"
        >
          {filtered.map((item) => (
            <TermCard key={item.id} term={item} expanded={term === item.id} />
          ))}
        </div>
      )}
    </section>
  )
}
