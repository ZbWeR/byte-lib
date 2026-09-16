import { glossary } from "@/lib/data/glossary"
import { categories, links } from "@/lib/data/library"
import type { Category, GlossaryTerm, LibraryLink } from "@/lib/data/types"
import { SHOW_GLOSSARY } from "@/lib/features"

export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

export function displayHost(url: string) {
  const host = hostOf(url)
  if (host.includes("feishu.cn") || host.includes("larksuite.com")) {
    return "飞书文档"
  }
  return host
}

export function matchesHaystack(haystack: string, query: string) {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) {
    return true
  }
  const hay = haystack.toLowerCase()
  return tokens.every((token) => hay.includes(token))
}

export type SearchCategory = {
  kind: "category"
  id: string
  haystack: string
  category: Category
  count: number
}

export type SearchLink = {
  kind: "link"
  id: string
  haystack: string
  link: LibraryLink
  host: string
}

export type SearchTerm = {
  kind: "term"
  id: string
  haystack: string
  term: GlossaryTerm
}

export type SearchNav = {
  kind: "nav"
  id: "home" | "glossary"
  haystack: string
  label: string
}

export type SearchEntry = SearchCategory | SearchLink | SearchTerm | SearchNav

const linkCountBySlug = links.reduce<Record<string, number>>((acc, link) => {
  acc[link.categorySlug] = (acc[link.categorySlug] ?? 0) + 1
  return acc
}, {})

export const searchCategories: SearchCategory[] = categories.map(
  (category) => ({
    kind: "category",
    id: category.slug,
    category,
    count: linkCountBySlug[category.slug] ?? 0,
    haystack: [
      category.name,
      category.nameEn,
      category.tagline,
      category.description,
      category.tags.join(" "),
      category.slug,
    ]
      .join(" ")
      .toLowerCase(),
  })
)

export const searchLinks: SearchLink[] = links.map((link) => {
  const host = displayHost(link.url)
  return {
    kind: "link",
    id: link.id,
    link,
    host,
    haystack: [
      link.title,
      link.displayTitle ?? "",
      link.description,
      link.tags.join(" "),
      host,
      hostOf(link.url),
      link.keywords?.join(" ") ?? "",
      link.id,
    ]
      .join(" ")
      .toLowerCase(),
  }
})

export const searchTerms: SearchTerm[] = glossary.map((term) => ({
  kind: "term",
  id: term.id,
  term,
  haystack: [
    term.term,
    term.en ?? "",
    term.alias?.join(" ") ?? "",
    term.summary,
    term.keywords?.join(" ") ?? "",
    term.group,
  ]
    .join(" ")
    .toLowerCase(),
}))

export const searchNav: SearchNav[] = [
  {
    kind: "nav",
    id: "home",
    label: "返回图书馆首页",
    haystack: "返回图书馆首页 图书馆 首页 home stage 舞台",
  },
  ...(SHOW_GLOSSARY
    ? [
        {
          kind: "nav" as const,
          id: "glossary" as const,
          label: "打开概念词典",
          haystack: "打开概念词典 glossary 词典 黑话 名词 概念",
        },
      ]
    : []),
]

const FEATURED_TITLES = [
  "毛概2026-26.1.6修订",
  "计算机网络（评论待补充）",
  "操作系统丨2025",
  "数据结构与算法",
] as const

export const FEATURED_LINK_IDS = FEATURED_TITLES.map((title) => {
  const match = links.find((link) => link.title === title)
  return match?.id
}).filter((id): id is string => Boolean(id))

export function filterSearch(query: string) {
  const q = query.trim()
  const empty = q.length === 0

  if (empty) {
    const featured = new Set<string>(FEATURED_LINK_IDS)
    return {
      categories: searchCategories,
      links: searchLinks.filter((item) => featured.has(item.id)),
      terms: [] as SearchTerm[],
      nav: searchNav,
    }
  }

  return {
    categories: searchCategories.filter((item) =>
      matchesHaystack(item.haystack, q)
    ),
    links: searchLinks.filter((item) => matchesHaystack(item.haystack, q)),
    terms: SHOW_GLOSSARY
      ? searchTerms.filter((item) => matchesHaystack(item.haystack, q))
      : [],
    nav: searchNav.filter((item) => matchesHaystack(item.haystack, q)),
  }
}
