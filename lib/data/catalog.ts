import catalogJson from "./catalog.json"
import docDescJson from "./doc-desc.json"
import type { WikiCatalog, WikiCollege, WikiDoc } from "./types"

export const catalog = catalogJson as WikiCatalog

export const docDescById = docDescJson as Record<string, string>

export const wikiColleges: WikiCollege[] = catalog.colleges
export const wikiDocs: WikiDoc[] = catalog.docs.map((doc) => ({
  ...doc,
  desc: docDescById[doc.id],
}))

export const wikiCollegeBySlug = new Map(
  wikiColleges.map((college) => [college.slug, college])
)

export const wikiDocsByCollege = wikiDocs.reduce<Record<string, WikiDoc[]>>(
  (acc, doc) => {
    ;(acc[doc.collegeSlug] ??= []).push(doc)
    return acc
  },
  {}
)
