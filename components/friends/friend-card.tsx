"use client"

import { useState } from "react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
import { accentClasses } from "@/lib/accents"
import type { FriendLink } from "@/lib/data/types"
import { cn } from "@/lib/utils"

type FriendCardProps = {
  friend: FriendLink
}

function FriendLogo({ friend }: { friend: FriendLink }) {
  const [failed, setFailed] = useState(!friend.logoUrl)
  const letter = Array.from(friend.name)[0] ?? "?"
  const classes = accentClasses[friend.accent]

  return (
    <div
      className={cn(
        "grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-white shadow-[0_0_0_2px_var(--sticker-ink)]",
        failed && classes.mono
      )}
    >
      {failed ? (
        <span
          className={cn("font-heading text-lg font-semibold", classes.text)}
        >
          {letter}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={friend.logoUrl}
          alt=""
          width={48}
          height={48}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

export function FriendCard({ friend }: FriendCardProps) {
  const classes = accentClasses[friend.accent]
  const host = (() => {
    try {
      return new URL(friend.url).hostname.replace(/^www\./, "")
    } catch {
      return friend.url
    }
  })()

  return (
    <a
      href={friend.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex flex-col rounded-[28px] sticker bg-card p-6 sticker-pop focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        classes.sticker
      )}
    >
      <div className="flex items-start gap-4">
        <FriendLogo friend={friend} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg leading-snug font-semibold">
              {friend.name}
            </h2>
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              strokeWidth={2}
              className="mt-0.5 size-4 shrink-0 text-sticker-pink opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
            />
          </div>
          {friend.nameEn ? (
            <p className="mt-1 font-heading text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {friend.nameEn}
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-4 text-base leading-relaxed text-foreground/80">
        {friend.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
        <Badge variant="outline">{host}</Badge>
        {friend.github ? <Badge variant="secondary">GitHub</Badge> : null}
      </div>
    </a>
  )
}
