"use client"

import Image from "next/image"
import { SourceCodeIcon, SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

function CursorMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      overflow="visible"
      aria-hidden
    >
      <path
        fill="#2d9afd"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.6"
        paintOrder="stroke"
        d="M9.80282 4.62973L15.8364 6.99069C19.3164 8.35243 21.0564 9.03329 20.9987 10.1133C20.941 11.1934 19.1251 11.6886 15.4933 12.6791C14.412 12.974 13.8713 13.1215 13.4964 13.4963C13.1215 13.8712 12.9741 14.4119 12.6791 15.4933C11.6887 19.125 11.1934 20.9409 10.1134 20.9986C9.03335 21.0563 8.35249 19.3163 6.99075 15.8363L4.62979 9.80276C3.20411 6.15934 2.49127 4.33764 3.41448 3.41442C4.3377 2.49121 6.15941 3.20405 9.80282 4.62973Z"
      />
    </svg>
  )
}

function SparkleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M8 0c.35 3.4 1.4 5.25 4.2 6C9.4 7.15 8.35 9 8 12.4 7.65 9 6.6 7.15 3.8 6 6.6 5.25 7.65 3.4 8 0Z"
      />
    </svg>
  )
}

function LogoOrnaments() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
      <span
        className="logo-ornament absolute top-[6%] left-[4%] text-[#ff5aa5]"
        style={{ animationDelay: "0s" }}
      >
        <SparkleMark className="size-3.5" />
      </span>
      <span
        className="logo-ornament absolute -top-1 right-[10%] text-[#6ec8ff]"
        style={{ animationDelay: "0.45s" }}
      >
        <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} className="size-4" />
      </span>
      <span
        className="logo-ornament absolute top-[38%] -left-1 size-1.5 rounded-full bg-[#ffd54a]"
        style={{ animationDelay: "0.9s" }}
      />
      <span
        className="logo-ornament absolute top-[36%] -right-2 text-[#6ec8ff]"
        style={{ animationDelay: "1.2s" }}
      >
        <HugeiconsIcon
          icon={SourceCodeIcon}
          strokeWidth={2}
          className="size-4"
        />
      </span>
      <span
        className="logo-ornament absolute right-[18%] bottom-[16%]"
        style={{ animationDelay: "1.7s" }}
      >
        <CursorMark className="size-7" />
      </span>
      <span
        className="logo-ornament absolute bottom-[20%] left-[10%] text-[#6ec8ff]"
        style={{ animationDelay: "2.1s" }}
      >
        <SparkleMark className="size-2.5" />
      </span>
      <span
        className="logo-ornament absolute top-[14%] right-[28%] size-1 rounded-full bg-[#ff5aa5]"
        style={{ animationDelay: "0.25s" }}
      />
    </div>
  )
}

type ByteLibLogoProps = {
  compact?: boolean
  className?: string
}

export function ByteLibLogo({ compact = false, className }: ByteLibLogoProps) {
  return (
    <div className={cn("text-center", className)}>
      <div
        className={cn(
          "relative mx-auto",
          compact
            ? "w-[min(22rem,80vw)] sm:w-[min(26rem,58vw)]"
            : "w-[min(28rem,86vw)] sm:w-[min(32rem,68vw)]"
        )}
      >
        <Image
          src="/iuestc-byte-lib.png"
          alt="iUESTC Byte Lib"
          width={1280}
          height={580}
          preload
          unoptimized
          className="relative h-auto w-full select-none"
        />
        <LogoOrnaments />
      </div>
      <p className="mt-1.5 font-mono text-[11px] tracking-[0.22em] text-muted-foreground/50 uppercase">
        UESTC COMMUNITY LIBRARY
      </p>
    </div>
  )
}
