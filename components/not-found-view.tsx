"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { PawMark, SparkleMark } from "@/components/sticker-deco"
import { buttonVariants } from "@/components/ui/button"
import { SHOW_GLOSSARY } from "@/lib/features"
import { glossaryPath, HOME_PATH } from "@/lib/paths"

export function NotFoundView() {
  const pathname = usePathname()

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
      <div className="relative rounded-[32px] sticker px-10 py-12 [--sticker-shadow:var(--sticker-yellow)]">
        <SparkleMark className="absolute -top-3 -left-2 size-6 text-sticker-pink" />
        <PawMark className="mx-auto size-12" />
        <h1 className="mt-6 font-heading text-3xl tracking-tight">
          这一页还没有被收录
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-foreground/75">
          地址{" "}
          <span className="font-heading text-sm break-all text-sticker-blue">
            {pathname}
          </span>{" "}
          不在馆藏里。也许是抄错了路径，也许是我们还没把这一页编进去。
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href={HOME_PATH} className={buttonVariants()}>
            回到图书馆
          </Link>
          {SHOW_GLOSSARY ? (
            <Link
              href={glossaryPath()}
              className={buttonVariants({ variant: "outline" })}
            >
              打开概念词典
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
