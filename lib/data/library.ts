import { formatCharCount, formatLikes, formatUv } from "@/lib/format"
import { wikiColleges, wikiDocs, wikiDocsByCollege } from "./catalog"
import { metaForCollege } from "./college-meta"
import type { Category, LibraryLink } from "./types"

function deriveTags(title: string) {
  const tags: string[] = []
  if (/评论待补充|暂无评论|无评论|评论暂无/.test(title)) {
    tags.push("待补评论")
  }
  if (/施工中/.test(title)) {
    tags.push("施工中")
  }
  if (/图灵/.test(title)) {
    tags.push("图灵计划")
  }
  const years = title.match(/20\d{2}/g) ?? []
  for (const year of years) {
    if (!tags.includes(year)) {
      tags.push(year)
    }
  }
  return tags
}

export const categories: Category[] = wikiColleges.map((college, index) => {
  const meta = metaForCollege(college.slug, index)
  const tags: string[] = []
  for (const doc of wikiDocsByCollege[college.slug] ?? []) {
    for (const tag of deriveTags(doc.title)) {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }
  }
  return {
    slug: college.slug,
    name: college.name,
    nameEn: meta.nameEn,
    tagline: meta.tagline,
    description: meta.description,
    accent: meta.accent,
    tags,
  }
})

export const categoryBySlug = new Map(
  categories.map((category) => [category.slug, category])
)

function extraKeywords(title: string) {
  const keywords: string[] = []
  if (title.includes("计算机网络")) keywords.push("计网")
  if (title.includes("操作系统")) keywords.push("os")
  if (title.includes("数据结构")) keywords.push("ds")
  if (title.includes("编译原理")) keywords.push("编译")
  return keywords
}

export const links: LibraryLink[] = wikiDocs.map((doc) => ({
  id: doc.id,
  categorySlug: doc.collegeSlug,
  collegeName: doc.collegeName,
  title: doc.title,
  url: doc.wikiUrl,
  description: [
    doc.collegeName,
    formatCharCount(doc.charCount),
    formatUv(doc.uv),
    formatLikes(doc.likeCount),
  ]
    .filter(Boolean)
    .join(" · "),
  tags: deriveTags(doc.title),
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
  charCount: doc.charCount,
  pv: doc.pv,
  uv: doc.uv,
  likeCount: doc.likeCount,
  keywords: [
    doc.collegeName,
    doc.collegeSlug,
    "飞书",
    "复习",
    "期末",
    ...extraKeywords(doc.title),
  ],
}))

export const linksByCategory = links.reduce<Record<string, LibraryLink[]>>(
  (acc, link) => {
    ;(acc[link.categorySlug] ??= []).push(link)
    return acc
  },
  {}
)

export const linkById = new Map(links.map((link) => [link.id, link]))
