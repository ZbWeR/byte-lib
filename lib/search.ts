import { glossary } from "@/lib/data/glossary"
import { allCategory, categories, links } from "@/lib/data/library"
import type { Category, GlossaryTerm } from "@/lib/data/types"
import { SHOW_GLOSSARY } from "@/lib/features"

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

export type SearchTerm = {
  kind: "term"
  id: string
  haystack: string
  term: GlossaryTerm
}

export type SearchNav = {
  kind: "nav"
  id: "home" | "glossary" | "friends"
  haystack: string
  label: string
}

const linkCountBySlug = links.reduce<Record<string, number>>((acc, link) => {
  acc[link.categorySlug] = (acc[link.categorySlug] ?? 0) + 1
  return acc
}, {})

function categorySearchEntry(
  category: Category,
  count: number,
  extraHaystack = ""
): SearchCategory {
  return {
    kind: "category",
    id: category.slug,
    category,
    count,
    haystack: [
      category.name,
      category.nameEn,
      category.tagline,
      category.description,
      category.tags.join(" "),
      category.slug,
      extraHaystack,
    ]
      .join(" ")
      .toLowerCase(),
  }
}

export const searchCategories: SearchCategory[] = [
  categorySearchEntry(
    allCategory,
    links.length,
    "所有学院 全部分类 馆藏 通览 entire library"
  ),
  ...categories.map((category) =>
    categorySearchEntry(category, linkCountBySlug[category.slug] ?? 0)
  ),
]

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
  {
    kind: "nav",
    id: "friends",
    label: "打开友情链接",
    haystack: "打开友情链接 friends 友链 交换链接 友链申请 ac-wiki 友情链接",
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

export function filterSearch(query: string) {
  const q = query.trim()
  const empty = q.length === 0

  if (empty) {
    return {
      categories: searchCategories,
      terms: [] as SearchTerm[],
      nav: searchNav,
    }
  }

  return {
    categories: searchCategories.filter((item) =>
      matchesHaystack(item.haystack, q)
    ),
    terms: SHOW_GLOSSARY
      ? searchTerms.filter((item) => matchesHaystack(item.haystack, q))
      : [],
    nav: searchNav.filter((item) => matchesHaystack(item.haystack, q)),
  }
}
