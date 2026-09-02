export const DICEBEAR_STYLES = [
  "glass",
  "identicon",
  "lorelei-neutral",
  "pixel-art-neutral",
  "rings",
  "bottts-neutral",
  "shapes",
  "thumbs",
  "dylan",
  "notionists-neutral",
  "icons",
  "adventurer-neutral",
] as const

export type DicebearStyle = (typeof DICEBEAR_STYLES)[number]

export const DEFAULT_DICEBEAR_STYLE: DicebearStyle = "shapes"

/**
 * 每个学院固定一种 DiceBear 风格，同一学院里的课用 seed（文档 token）区分。
 * 风格按学院气质手配，不是随机的。
 */
export const DICEBEAR_STYLE_BY_SLUG: Record<string, DicebearStyle> = {
  general: "glass",
  cs: "identicon",
  medicine: "lorelei-neutral",
  software: "pixel-art-neutral",
  glasgow: "rings",
  automation: "bottts-neutral",
  microelectronics: "shapes",
  infocomm: "thumbs",
  optoelectronics: "dylan",
  management: "notionists-neutral",
  others: "icons",
  life: "adventurer-neutral",
}

export function isDicebearStyle(value: string): value is DicebearStyle {
  return (DICEBEAR_STYLES as readonly string[]).includes(value)
}

export function dicebearStyleFor(slug?: string | null): DicebearStyle {
  if (slug && DICEBEAR_STYLE_BY_SLUG[slug]) {
    return DICEBEAR_STYLE_BY_SLUG[slug]
  }
  return DEFAULT_DICEBEAR_STYLE
}
