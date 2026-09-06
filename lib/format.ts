/** 卡片和搜索里用的文档规模 / 活跃度文案。 */

function wan(count: number) {
  const value = count / 10000
  const text =
    value >= 10 ? value.toFixed(0) : value.toFixed(1).replace(/\.0$/, "")
  return text
}

export function formatCharCount(count?: number | null) {
  if (!count || count <= 0) return null
  if (count >= 10000) return `${wan(count)} 万字`
  return `${count} 字`
}

/** 低于这个字数的页面基本是只建了标题的占位页。 */
export const STUB_DOC_CHARS = 200

export function isStubDoc(count?: number | null) {
  return count != null && count < STUB_DOC_CHARS
}

/** 和 formatCharCount 一样，但把占位页说清楚，而不是显示「7 字」。 */
export function formatVolume(count?: number | null) {
  if (count == null) return null
  if (isStubDoc(count)) return "占位页"
  return formatCharCount(count)
}

export function formatCompactChars(count?: number | null) {
  if (!count || count <= 0) return null
  if (count >= 10000) return `${wan(count)}万`
  return String(count)
}

export function formatUv(count?: number | null) {
  if (!count || count <= 0) return null
  if (count >= 10000) return `${wan(count)} 万人看过`
  return `${count} 人看过`
}

export function formatCompactUv(count?: number | null) {
  if (!count || count <= 0) return null
  if (count >= 10000) return `${wan(count)}万`
  return String(count)
}

export function formatLikes(count?: number | null) {
  if (count == null || count <= 0) return null
  return `${count} 赞`
}

export function formatGroupedCount(count: number) {
  return count.toLocaleString("en-US")
}

export function formatCardViews(count?: number | null) {
  if (!count || count <= 0) return null
  return `${formatGroupedCount(count)}看过`
}

export function formatCardLikes(count?: number | null) {
  if (!count || count <= 0) return null
  return `${formatGroupedCount(count)} 赞`
}

export function formatCardChars(count?: number | null) {
  if (count == null || count <= 0) return null
  if (isStubDoc(count)) return "占位页"
  if (count >= 10000) return `${wan(count)}万字`
  return `${formatGroupedCount(count)}字`
}

export function formatAge(iso?: string | null) {
  if (!iso) return null
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return null
  const delta = Date.now() - then
  if (delta < 60_000) return "刚刚"
  const minutes = Math.floor(delta / 60_000)
  if (minutes < 60) return `${minutes} 分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} 天前`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} 个月前`
  const years = Math.floor(days / 365)
  return `${years} 年前`
}

export function formatUpdatedAt(iso?: string | null) {
  const age = formatAge(iso)
  if (!age) return null
  return age === "刚刚" ? "刚刚更新" : `${age}更新`
}

export function formatDocStats(doc: {
  charCount?: number
  updatedAt?: string
  uv?: number
  likeCount?: number
}) {
  return [
    formatCharCount(doc.charCount),
    formatUpdatedAt(doc.updatedAt),
    formatUv(doc.uv),
    formatLikes(doc.likeCount),
  ]
    .filter(Boolean)
    .join(" · ")
}
