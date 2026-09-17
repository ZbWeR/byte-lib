import { wikiColleges, wikiDocs, wikiDocsByCollege } from "./catalog"
import { metaForCollege } from "./college-meta"
import { displayTitle } from "./course-title"
import type { Category, LibraryLink } from "./types"

function deriveTags(title: string) {
  const tags: string[] = []
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

export const ALL_CATEGORY_SLUG = "all"

export const allCategory: Category = {
  slug: ALL_CATEGORY_SLUG,
  name: "全部",
  nameEn: "All Collections",
  tagline: "不挑学院，把馆藏摊开看。",
  description:
    "公共课到专业课，目前公开的复习文档都在这一页。想按学院收窄，点上面的分类就行。",
  accent: "lime",
  tags: [],
}

export function isAllCategorySlug(slug: string) {
  return slug === ALL_CATEGORY_SLUG
}

export function resolveCategory(slug: string): Category | undefined {
  if (isAllCategorySlug(slug)) {
    return allCategory
  }
  return categoryBySlug.get(slug)
}

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
  displayTitle: displayTitle(doc.title),
  url: doc.wikiUrl,
  description: doc.desc ?? "",
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

export function linksForCategory(slug: string): LibraryLink[] {
  if (isAllCategorySlug(slug)) {
    return links
  }
  return linksByCategory[slug] ?? []
}
