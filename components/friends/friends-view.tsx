"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Add01Icon,
  ArrowLeft01Icon,
  ArrowUpRight01Icon,
  Copy01Icon,
  Link01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { FriendCard } from "@/components/friends/friend-card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  FRIENDS_APPLY_URL,
  SITE_BLURB,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/contact"
import { friends } from "@/lib/data/friends"
import { HOME_PATH } from "@/lib/paths"
import { cn } from "@/lib/utils"

const APPLY_ITEMS = [
  { label: "站点名称", hint: "出现在卡片上的名字" },
  { label: "站点网址", hint: "能公开打开的 https 链接" },
  { label: "一句话简介", hint: "建议 20 字内，说明这是谁的站" },
  { label: "Logo 链接", hint: "正方形图标最好，没有也可以" },
] as const

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={copied ? "已复制" : `复制${label}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1600)
        } catch {
          setCopied(false)
        }
      }}
    >
      <HugeiconsIcon icon={copied ? Tick01Icon : Copy01Icon} strokeWidth={2} />
    </Button>
  )
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 98 96"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      />
    </svg>
  )
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b-2 border-sticker-ink/10 py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="font-heading text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          {label}
        </p>
        <p
          className={cn(
            "mt-1 text-base leading-relaxed break-all",
            mono && "font-mono text-sm"
          )}
        >
          {value}
        </p>
      </div>
      <CopyButton value={value} label={label} />
    </div>
  )
}

export function FriendsView() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-28 pb-24">
      <div className="flex flex-wrap items-center gap-3">
        <Link href={HOME_PATH} className={buttonVariants({ variant: "ghost" })}>
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          首页
        </Link>
        <p className="text-sm text-muted-foreground">
          首页
          <span className="mx-1.5 text-muted-foreground/50">/</span>
          <span className="text-foreground">友情链接</span>
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <p className="font-heading text-xs font-semibold tracking-[0.16em] text-sticker-blue uppercase">
          FRIENDS
        </p>
        <h1 className="font-heading text-4xl tracking-tight">友情链接</h1>
        <p className="font-heading text-xs font-semibold tracking-[0.14em] text-sticker-pink uppercase">
          <span className="tabular-nums">{friends.length}</span> 个站点
        </p>
      </div>

      <div className="mt-8 grid animate-in gap-6 duration-200 fade-in-0 md:grid-cols-2">
        {friends.map((friend) => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
        <a
          href="#apply"
          className="group relative flex flex-col rounded-[28px] sticker bg-card p-6 [--sticker-shadow:var(--sticker-yellow)] sticker-pop focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-white bg-secondary shadow-[0_0_0_2px_var(--sticker-ink)]">
              <HugeiconsIcon
                icon={Add01Icon}
                strokeWidth={2.2}
                className="size-5"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg leading-snug font-semibold">
                  你的站点？
                </h2>
                <HugeiconsIcon
                  icon={Link01Icon}
                  strokeWidth={2}
                  className="mt-0.5 size-4 shrink-0 text-sticker-pink opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                />
              </div>
              <p className="mt-1 font-heading text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                交换友链
              </p>
            </div>
          </div>
          <p className="mt-4 text-base leading-relaxed text-foreground/80">
            高校知识站、校园生活指南、开源学习项目，只要对同学有用，都欢迎来交换。
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
            <Badge variant="outline">看申请指引</Badge>
          </div>
        </a>
      </div>

      <div id="apply" className="mt-20 scroll-mt-28 space-y-3">
        <p className="font-heading text-xs font-semibold tracking-[0.16em] text-sticker-blue uppercase">
          APPLY
        </p>
        <h2 className="font-heading text-3xl tracking-tight">想出现在这一页</h2>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <article className="rounded-[28px] sticker bg-card p-6 [--sticker-shadow:var(--sticker-cyan)]">
          <Badge>需要提供</Badge>
          <ol className="mt-4 space-y-3">
            {APPLY_ITEMS.map((item, index) => (
              <li key={item.label} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full sticker-chip font-heading text-xs font-semibold tabular-nums">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-sm font-semibold">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {item.hint}
                  </p>
                </div>
              </li>
            ))}
            <li>
              <a
                href={FRIENDS_APPLY_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="在 GitHub Issues 提交友链申请"
                className="group flex items-center gap-3 transition-all outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full sticker-chip">
                  <GitHubMark className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-sm font-semibold transition-colors group-hover:text-sticker-pink">
                    GitHub Issues
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/80">
                    开一个 Issue 发申请
                  </p>
                </div>
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  strokeWidth={2}
                  className="size-4 shrink-0 text-sticker-pink opacity-70 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                />
              </a>
            </li>
          </ol>
        </article>

        <article className="rounded-[28px] sticker bg-card p-6 [--sticker-shadow:var(--sticker-blue)]">
          <Badge variant="outline">请先挂上我们</Badge>
          <h3 className="mt-4 text-lg font-semibold">Byte Lib 的链接信息</h3>
          <div className="mt-4">
            <InfoRow label="名称" value={`${SITE_NAME} · ${SITE_TAGLINE}`} />
            <InfoRow label="网址" value={SITE_URL} mono />
            <InfoRow label="简介" value={SITE_BLURB} />
          </div>
        </article>
      </div>
    </section>
  )
}
