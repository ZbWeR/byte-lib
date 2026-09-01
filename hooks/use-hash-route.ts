"use client"

import { useSyncExternalStore } from "react"

import { categoryBySlug } from "@/lib/data/categories"

export type Route =
  | { name: "stage" }
  | { name: "category"; slug: string; focus?: string }
  | { name: "glossary"; term?: string }
  | { name: "not-found"; raw: string }

const STAGE_ROUTE: Route = { name: "stage" }

export function parseHash(hash: string): Route {
  const raw = hash || ""
  const stripped = raw.replace(/^#\/?/, "")
  if (!stripped) {
    return STAGE_ROUTE
  }

  const [path = "", queryString = ""] = stripped.split("?")
  const params = new URLSearchParams(queryString)

  if (path === "glossary") {
    return { name: "glossary", term: params.get("term") ?? undefined }
  }

  if (path.startsWith("c/")) {
    const slug = path.slice(2)
    if (slug && categoryBySlug.has(slug)) {
      return {
        name: "category",
        slug,
        focus: params.get("focus") ?? undefined,
      }
    }
    return { name: "not-found", raw: raw || "#" }
  }

  return { name: "not-found", raw: raw || "#" }
}

function pathOf(hash: string) {
  return hash.replace(/^#\/?/, "").split("?")[0] ?? ""
}

export function navigate(hash: string) {
  if (typeof window === "undefined") {
    return
  }
  const next = hash.startsWith("#") ? hash : `#${hash}`
  const prevPath = pathOf(window.location.hash)
  const nextPath = pathOf(next)
  if (window.location.hash === next) {
    if (prevPath !== nextPath) {
      window.scrollTo(0, 0)
    }
    return
  }
  window.location.hash = next
  if (prevPath !== nextPath) {
    window.scrollTo(0, 0)
  }
}

let cachedHash = "__init__"
let cachedRoute: Route = STAGE_ROUTE

function getSnapshot(): Route {
  const hash = window.location.hash
  if (hash === cachedHash) {
    return cachedRoute
  }
  cachedHash = hash
  cachedRoute = parseHash(hash)
  return cachedRoute
}

function getServerSnapshot(): Route {
  return STAGE_ROUTE
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange)
  return () => window.removeEventListener("hashchange", onStoreChange)
}

export function useHashRoute(): Route {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function routeKey(route: Route) {
  switch (route.name) {
    case "stage":
      return "stage"
    case "category":
      return `category:${route.slug}`
    case "glossary":
      return "glossary"
    case "not-found":
      return `not-found:${route.raw}`
  }
}
