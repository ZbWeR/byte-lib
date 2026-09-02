"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileNotFoundIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { buttonVariants } from "@/components/ui/button"
import { SHOW_GLOSSARY } from "@/lib/features"
import { glossaryPath, HOME_PATH } from "@/lib/paths"

export function NotFoundView() {
  const pathname = usePathname()

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
      <HugeiconsIcon
        icon={FileNotFoundIcon}
        strokeWidth={1.5}
        className="size-10 text-muted-foreground/50"
      />
      <h1 className="mt-6 font-heading text-3xl tracking-tight">
        这一页还没有被收录
      </h1>
      <p className="mt-3 max-w-md text-[13px] leading-relaxed text-muted-foreground">
        地址{" "}
        <span className="font-mono text-xs break-all text-foreground">
          {pathname}
        </span>{" "}
        不在馆藏里。也许是抄错了路径，也许是我们还没把这一页编进去。
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <Link href={HOME_PATH} className={buttonVariants()}>
          回到图书馆
        </Link>
        {SHOW_GLOSSARY ? (
          <Link
            href={glossaryPath()}
            className={buttonVariants({ variant: "ghost" })}
          >
            打开概念词典
          </Link>
        ) : null}
      </div>
    </section>
  )
}
