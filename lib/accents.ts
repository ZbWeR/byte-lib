import type { AccentKey } from "@/lib/data/types"

type AccentClasses = {
  text: string
  ring: string
  glow: string
  wash: string
  tint: string
  mark: string
  dot: string
  highlight: string
  mono: string
}

export const accentClasses: Record<AccentKey, AccentClasses> = {
  lime: {
    text: "text-cat-lime",
    ring: "group-hover:border-cat-lime/40",
    glow: "bg-cat-lime/20",
    wash: "from-cat-lime/[0.07]",
    tint: "border-cat-lime/20",
    mark: "group-hover:border-cat-lime/40 group-hover:bg-cat-lime/15 group-hover:text-cat-lime",
    dot: "bg-cat-lime",
    highlight: "ring-cat-lime",
    mono: "bg-cat-lime/12",
  },
  teal: {
    text: "text-cat-teal",
    ring: "group-hover:border-cat-teal/40",
    glow: "bg-cat-teal/20",
    wash: "from-cat-teal/[0.07]",
    tint: "border-cat-teal/20",
    mark: "group-hover:border-cat-teal/40 group-hover:bg-cat-teal/15 group-hover:text-cat-teal",
    dot: "bg-cat-teal",
    highlight: "ring-cat-teal",
    mono: "bg-cat-teal/12",
  },
  sky: {
    text: "text-cat-sky",
    ring: "group-hover:border-cat-sky/40",
    glow: "bg-cat-sky/20",
    wash: "from-cat-sky/[0.07]",
    tint: "border-cat-sky/20",
    mark: "group-hover:border-cat-sky/40 group-hover:bg-cat-sky/15 group-hover:text-cat-sky",
    dot: "bg-cat-sky",
    highlight: "ring-cat-sky",
    mono: "bg-cat-sky/12",
  },
  violet: {
    text: "text-cat-violet",
    ring: "group-hover:border-cat-violet/40",
    glow: "bg-cat-violet/20",
    wash: "from-cat-violet/[0.07]",
    tint: "border-cat-violet/20",
    mark: "group-hover:border-cat-violet/40 group-hover:bg-cat-violet/15 group-hover:text-cat-violet",
    dot: "bg-cat-violet",
    highlight: "ring-cat-violet",
    mono: "bg-cat-violet/12",
  },
  amber: {
    text: "text-cat-amber",
    ring: "group-hover:border-cat-amber/40",
    glow: "bg-cat-amber/20",
    wash: "from-cat-amber/[0.07]",
    tint: "border-cat-amber/20",
    mark: "group-hover:border-cat-amber/40 group-hover:bg-cat-amber/15 group-hover:text-cat-amber",
    dot: "bg-cat-amber",
    highlight: "ring-cat-amber",
    mono: "bg-cat-amber/12",
  },
  rose: {
    text: "text-cat-rose",
    ring: "group-hover:border-cat-rose/40",
    glow: "bg-cat-rose/20",
    wash: "from-cat-rose/[0.07]",
    tint: "border-cat-rose/20",
    mark: "group-hover:border-cat-rose/40 group-hover:bg-cat-rose/15 group-hover:text-cat-rose",
    dot: "bg-cat-rose",
    highlight: "ring-cat-rose",
    mono: "bg-cat-rose/12",
  },
}
