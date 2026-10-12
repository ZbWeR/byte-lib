import catalogJson from "./catalog.json"
import contributionsJson from "./contributions.json"
import docDescJson from "./doc-desc.json"
import type {
  ContributionDoc,
  ContributionFile,
  WikiCatalog,
  WikiCollege,
  WikiDoc,
} from "./types"

const WIKI_URL_BASE = "https://my.feishu.cn/wiki/"

export const catalog = catalogJson as WikiCatalog

export const contributionFile = contributionsJson as ContributionFile

export const docDescById = docDescJson as Record<string, string>

export const wikiColleges: WikiCollege[] = catalog.colleges

const collegeBySlug = new Map(
  wikiColleges.map((college) => [college.slug, college])
)

function requiredText(value: unknown, field: string, id: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`contributions.json: ${id || "?"} 缺少 ${field}`)
  }
  return value.trim()
}

function validateContributions(items: ContributionDoc[]): ContributionDoc[] {
  if (!Array.isArray(items)) {
    throw new Error("contributions.json: docs 必须是数组")
  }

  const seen = new Set<string>()
  return items.map((raw, index) => {
    const id = requiredText(raw?.id, "id", `docs[${index}]`)
    if (seen.has(id)) {
      throw new Error(`contributions.json: 重复 id ${id}`)
    }
    seen.add(id)

    const title = requiredText(raw.title, "title", id)
    const collegeSlug = requiredText(raw.collegeSlug, "collegeSlug", id)
    if (!collegeBySlug.has(collegeSlug)) {
      throw new Error(
        `contributions.json: ${id} 的 collegeSlug "${collegeSlug}" 不在 catalog 学院列表中`
      )
    }

    return {
      id,
      title,
      collegeSlug,
      desc: raw.desc?.trim() || undefined,
      wikiUrl: raw.wikiUrl?.trim() || undefined,
      objToken: raw.objToken?.trim() || undefined,
      objType: raw.objType?.trim() || undefined,
      supplementOf: raw.supplementOf?.trim() || undefined,
    }
  })
}

function descFor(id: string, contribution?: ContributionDoc) {
  return contribution?.desc || docDescById[id]
}

function applyCollege(
  collegeSlug: string
): Pick<WikiDoc, "collegeId" | "collegeSlug" | "collegeName"> {
  const college = collegeBySlug.get(collegeSlug)
  if (!college) {
    throw new Error(`未知学院 ${collegeSlug}`)
  }
  return {
    collegeId: college.id,
    collegeSlug: college.slug,
    collegeName: college.name,
  }
}

function contributionToDoc(item: ContributionDoc): WikiDoc {
  const snapshot = catalog.contributionSnapshots?.[item.id]
  return {
    id: item.id,
    title: item.title,
    ...applyCollege(item.collegeSlug),
    wikiUrl: item.wikiUrl || `${WIKI_URL_BASE}${item.id}`,
    nodeToken: item.id,
    objToken: snapshot?.objToken || item.objToken || "",
    objType: snapshot?.objType || item.objType || "docx",
    createdAt: snapshot?.createdAt,
    updatedAt: snapshot?.updatedAt,
    charCount: snapshot?.charCount,
    pv: snapshot?.pv,
    uv: snapshot?.uv,
    likeCount: snapshot?.likeCount,
    desc: descFor(item.id, item),
    source: "contribution",
    supplementOf: item.supplementOf,
  }
}

function insertContribution(docs: WikiDoc[], extra: WikiDoc) {
  let index = extra.supplementOf
    ? docs.findIndex((doc) => doc.id === extra.supplementOf)
    : -1
  if (index === -1) {
    index = docs.findLastIndex((doc) => doc.collegeSlug === extra.collegeSlug)
  }
  if (index === -1) {
    docs.push(extra)
    return
  }
  docs.splice(index + 1, 0, extra)
}

function mergeDocs(): WikiDoc[] {
  const contributions = validateContributions(contributionFile.docs)
  const contributionById = new Map(
    contributions.map((item) => [item.id, item])
  )
  const wikiIds = new Set(catalog.docs.map((doc) => doc.id))

  const merged: WikiDoc[] = catalog.docs.map((doc) => {
    const contribution = contributionById.get(doc.id)
    return {
      ...doc,
      ...(contribution ? applyCollege(contribution.collegeSlug) : null),
      desc: descFor(doc.id, contribution),
      source: "wiki",
      supplementOf: contribution?.supplementOf,
    }
  })

  for (const item of contributions) {
    if (wikiIds.has(item.id)) continue
    insertContribution(merged, contributionToDoc(item))
  }

  return merged
}

export const wikiDocs: WikiDoc[] = mergeDocs()

export const catalogStats = {
  collegeCount: wikiColleges.length,
  docCount: wikiDocs.length,
  wikiDocCount: catalog.docs.length,
  contributionCount: wikiDocs.filter((doc) => doc.source === "contribution")
    .length,
}

export const wikiCollegeBySlug = collegeBySlug

export const wikiDocsByCollege = wikiDocs.reduce<Record<string, WikiDoc[]>>(
  (acc, doc) => {
    ;(acc[doc.collegeSlug] ??= []).push(doc)
    return acc
  },
  {}
)
