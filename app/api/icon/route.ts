import { links } from "@/lib/data/links"

/**
 * favicon 代理。
 *
 * 直接在 <img> 里指向第三方图标服务有两个问题：一是 icons.duckduckgo.com 在国内
 * 并不总是可达，二是它对查不到的站点会返回「404 + 一张 48×48 的灰色占位图」，
 * 浏览器照样能解码，于是 onError 永远不触发、monogram 兜底形同虚设，
 * 页面上就出现一排一模一样的灰圈。
 *
 * 放到服务端就能读到真实状态码：上游不 ok 就回 404，让 <img> 正常报错并走 monogram。
 */

/**
 * 前端传过来的 host 已经去掉了 www.（和链接卡片上显示的一致），
 * 而图标服务认的是完整域名，所以这里存一张「去 www 的 host -> 原始 hostname」映射，
 * 既做白名单校验，也用来还原真正要请求的上游域名。
 */
const ALLOWED_HOSTS = new Map(
  links.map((link) => {
    const hostname = new URL(link.url).hostname.toLowerCase()
    return [hostname.replace(/^www\./, ""), hostname]
  })
)

const UPSTREAM = (host: string) =>
  `https://icons.duckduckgo.com/ip3/${host}.ico`

export async function GET(request: Request) {
  const host = new URL(request.url).searchParams.get("host")?.toLowerCase()

  // 只允许收录过的域名，避免把这个接口变成任意 URL 的转发器
  const upstreamHost = host ? ALLOWED_HOSTS.get(host) : undefined
  if (!upstreamHost) {
    return new Response(null, { status: 400 })
  }

  try {
    const upstream = await fetch(UPSTREAM(upstreamHost), {
      signal: AbortSignal.timeout(6000),
      headers: { Accept: "image/*" },
    })

    if (!upstream.ok || !upstream.body) {
      return new Response(null, { status: 404 })
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "image/x-icon",
        // 图标几乎不变，缓存久一点；顺便让 CDN 也帮着扛
        "Cache-Control": "public, max-age=86400, s-maxage=2592000",
      },
    })
  } catch {
    return new Response(null, { status: 404 })
  }
}
