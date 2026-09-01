"use client"

import { FileNotFoundIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { navigate } from "@/hooks/use-hash-route"

type NotFoundViewProps = {
  raw: string
}

export function NotFoundView({ raw }: NotFoundViewProps) {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center px-6 pt-28 pb-24 text-center">
      <HugeiconsIcon
        icon={FileNotFoundIcon}
        strokeWidth={1.5}
        className="size-10 text-muted-foreground/50"
      />
      <h1 className="mt-6 text-3xl font-medium tracking-tight">
        这一页还没有被收录
      </h1>
      <p className="mt-3 max-w-md text-[13px] leading-relaxed text-muted-foreground">
        地址{" "}
        <span className="font-mono text-xs break-all text-foreground">
          {raw}
        </span>{" "}
        不在馆藏里。也许是抄错了 hash，也许是我们还没把这一页编进去。
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <Button type="button" onClick={() => navigate("#/")}>
          回到图书馆
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("#/glossary")}
        >
          打开概念词典
        </Button>
      </div>
    </section>
  )
}
