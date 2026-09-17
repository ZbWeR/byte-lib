"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Add01Icon,
  ArrowLeft01Icon,
  ArrowUpRight01Icon,
  CheckmarkCircle01Icon,
  Copy01Icon,
  Link01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { FriendCard } from "@/components/friends/friend-card"
import { SparkleMark } from "@/components/sticker-deco"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  SITE_BLURB,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  ZBWER_AVATAR,
  ZBWER_INVITE,
  ZBWER_NAME,
} from "@/lib/contact"
import { friends } from "@/lib/data/friends"
import { HOME_PATH } from "@/lib/paths"
import { cn } from "@/lib/utils"

const APPLY_ITEMS = [
  { label: "站点名称", hint: "出现在卡片上的名字" },
  { label: "站点网址", hint: "能公开打开的 https 链接" },
  { label: "一句话简介", hint: "建议 20 字内，说明这是谁的站" },
  { label: "Logo 链接", hint: "正方形图标最好，没有也可以" },
  { label: "回链页面", hint: "你们挂上 Byte Lib 的那一页" },
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

function ContactAvatar() {
  const [failed, setFailed] = useState(false)

  return (
    <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-white bg-secondary shadow-[0_0_0_2px_var(--sticker-ink)]">
      {failed ? (
        <span className="font-heading text-xl font-semibold">
          {Array.from(ZBWER_NAME)[0]}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ZBWER_AVATAR}
          alt=""
          width={64}
          height={64}
          referrerPolicy="no-referrer"
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
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
        <p className="max-w-2xl text-base leading-relaxed text-foreground/75">
          馆外也有值得一逛的站点。我们先放上
          Ac-Wiki，后面会慢慢把互相挂链的朋友请进来。
        </p>
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
        <p className="max-w-2xl text-base leading-relaxed text-foreground/75">
          先在你的站点挂上 Byte
          Lib，再按模板把信息发给我们。人工核对，不保证一定收录，也不做付费交换。
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <div className="flex flex-col gap-6">
          <article className="relative rounded-[28px] sticker bg-card p-6 [--sticker-shadow:var(--sticker-pink)]">
            <SparkleMark className="absolute -top-3 -right-2 size-6 text-sticker-yellow" />
            <Badge variant="secondary">怎么联系</Badge>
            <a
              href={ZBWER_INVITE}
              target="_blank"
              rel="noreferrer"
              aria-label={`飞书加好友 ${ZBWER_NAME}`}
              className="group mt-5 flex items-center gap-4 rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ContactAvatar />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg leading-snug font-semibold">
                  {ZBWER_NAME}
                </h3>
                <p className="mt-1 font-heading text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  飞书加好友
                </p>
              </div>
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                strokeWidth={2}
                className="size-4 shrink-0 text-sticker-pink opacity-70 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />
            </a>
          </article>

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
            </ol>
          </article>
        </div>

        <article className="flex flex-col rounded-[28px] sticker bg-card p-6 [--sticker-shadow:var(--sticker-blue)]">
          <Badge variant="outline">请先挂上我们</Badge>
          <h3 className="mt-4 text-lg font-semibold">Byte Lib 的链接信息</h3>
          <p className="mt-2 text-base leading-relaxed text-foreground/80">
            把下面三行贴到你的友链页。核对回链时我们会打开你给的页面看一眼。
          </p>
          <div className="mt-4">
            <InfoRow label="名称" value={`${SITE_NAME} · ${SITE_TAGLINE}`} />
            <InfoRow label="网址" value={SITE_URL} mono />
            <InfoRow label="简介" value={SITE_BLURB} />
          </div>
          <div className="mt-auto flex items-start gap-3 pt-6">
            <HugeiconsIcon
              icon={CheckmarkCircle01Icon}
              strokeWidth={2}
              className="mt-0.5 size-5 shrink-0 text-sticker-blue"
            />
            <p className="text-sm leading-relaxed text-foreground/75">
              优先考虑面向大学生的开源知识站、校园指南和课程资料库。内容需可公开访问、没有骚扰和诱导跳转。
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}
