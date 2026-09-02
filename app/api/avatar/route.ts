import { createHash } from "node:crypto"

import { DEFAULT_DICEBEAR_STYLE, isDicebearStyle } from "@/lib/dicebear"

const SIZE = "64"

function seedFrom(raw: string) {
  const trimmed = raw.trim().slice(0, 160)
  if (!trimmed) return "bytelib"
  if (/^[A-Za-z0-9._-]+$/.test(trimmed)) return trimmed
  return createHash("sha1").update(trimmed).digest("hex").slice(0, 16)
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const seed = seedFrom(url.searchParams.get("seed") ?? "")
  const requested = url.searchParams.get("style") ?? ""
  const style = isDicebearStyle(requested) ? requested : DEFAULT_DICEBEAR_STYLE
  const upstream = `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=${SIZE}`

  try {
    const response = await fetch(upstream, {
      signal: AbortSignal.timeout(8000),
      headers: { Accept: "image/svg+xml" },
    })
    if (!response.ok || !response.body) {
      return new Response(null, { status: 404 })
    }
    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ??
          "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=2592000",
      },
    })
  } catch {
    return new Response(null, { status: 404 })
  }
}
