import type { AccentKey } from "@/lib/data/types"

type AccentClasses = {
  text: string
  ring: string
  glow: string
  wash: string
  dot: string
  highlight: string
  mono: string
  edge: string
  sticker: string
}

export const accentClasses: Record<AccentKey, AccentClasses> = {
  lime: {
    text: "text-cat-lime",
    ring: "group-hover:border-cat-lime/40",
    glow: "bg-cat-lime/25",
    wash: "from-cat-lime/[0.12]",
    dot: "bg-cat-lime",
    highlight: "ring-cat-lime",
    mono: "bg-cat-lime/20",
    edge: "border-cat-lime/40",
    sticker: "[--sticker-shadow:var(--sticker-yellow)]",
  },
  teal: {
    text: "text-cat-teal",
    ring: "group-hover:border-cat-teal/40",
    glow: "bg-cat-teal/25",
    wash: "from-cat-teal/[0.12]",
    dot: "bg-cat-teal",
    highlight: "ring-cat-teal",
    mono: "bg-cat-teal/20",
    edge: "border-cat-teal/40",
    sticker: "[--sticker-shadow:var(--sticker-cyan)]",
  },
  sky: {
    text: "text-cat-sky",
    ring: "group-hover:border-cat-sky/40",
    glow: "bg-cat-sky/25",
    wash: "from-cat-sky/[0.12]",
    dot: "bg-cat-sky",
    highlight: "ring-cat-sky",
    mono: "bg-cat-sky/20",
    edge: "border-cat-sky/40",
    sticker: "[--sticker-shadow:var(--sticker-blue)]",
  },
  violet: {
    text: "text-cat-violet",
    ring: "group-hover:border-cat-violet/40",
    glow: "bg-cat-violet/25",
    wash: "from-cat-violet/[0.12]",
    dot: "bg-cat-violet",
    highlight: "ring-cat-violet",
    mono: "bg-cat-violet/20",
    edge: "border-cat-violet/40",
    sticker: "[--sticker-shadow:var(--sticker-pink)]",
  },
  amber: {
    text: "text-cat-amber",
    ring: "group-hover:border-cat-amber/40",
    glow: "bg-cat-amber/25",
    wash: "from-cat-amber/[0.12]",
    dot: "bg-cat-amber",
    highlight: "ring-cat-amber",
    mono: "bg-cat-amber/20",
    edge: "border-cat-amber/40",
    sticker: "[--sticker-shadow:var(--sticker-yellow)]",
  },
  rose: {
    text: "text-cat-rose",
    ring: "group-hover:border-cat-rose/40",
    glow: "bg-cat-rose/25",
    wash: "from-cat-rose/[0.12]",
    dot: "bg-cat-rose",
    highlight: "ring-cat-rose",
    mono: "bg-cat-rose/20",
    edge: "border-cat-rose/40",
    sticker: "[--sticker-shadow:var(--sticker-pink)]",
  },
}
