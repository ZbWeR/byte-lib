import { categoryBySlug } from "@/lib/data/library"

export const HOME_PATH = "/"

export function categoryPath(slug: string, focus?: string) {
  const path = `/c/${slug}`
  if (!focus) {
    return path
  }
  return `${path}?focus=${encodeURIComponent(focus)}`
}

export function glossaryPath(term?: string) {
  if (!term) {
    return "/glossary"
  }
  return `/glossary?term=${encodeURIComponent(term)}`
}

/** Map the old hash SPA URLs (`#/c/campus`) onto App Router paths. */
export function pathFromLegacyHash(hash: string): string | null {
  if (!hash) {
    return null
  }
  if (hash === "#" || hash === "#/") {
    return HOME_PATH
  }

  const stripped = hash.replace(/^#\/?/, "")
  const [path = "", queryString = ""] = stripped.split("?")
  const params = new URLSearchParams(queryString)

  if (path === "glossary") {
    return glossaryPath(params.get("term") ?? undefined)
  }

  if (path.startsWith("c/")) {
    const slug = path.slice(2)
    if (slug && categoryBySlug.has(slug)) {
      return categoryPath(slug, params.get("focus") ?? undefined)
    }
  }

  return null
}
