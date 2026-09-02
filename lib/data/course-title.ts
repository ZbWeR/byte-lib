/** 从飞书文档标题里拆出课名、年份和状态。标题才是目前唯一的内容信号。 */
export type ParsedCourseTitle = {
  original: string
  displayName: string
  years: string[]
  flags: string[]
}

export function parseCourseTitle(title: string): ParsedCourseTitle {
  const flags: string[] = []
  if (/评论待补充|暂无评论|无评论|评论暂无/.test(title)) {
    flags.push("待补评论")
  }
  if (/施工中/.test(title)) {
    flags.push("施工中")
  }
  if (/图灵/.test(title)) {
    flags.push("图灵计划")
  }

  const years = Array.from(new Set(title.match(/20\d{2}/g) ?? []))

  const displayName = title
    .replace(/[（(][^）)]*(评论|引用文献)[^）)]*[）)]/g, "")
    .replace(/[（(]?施工中[）)]?/g, "")
    .replace(/[（(]图灵计划[）)]/g, "")
    .replace(/图灵计划/g, "")
    .replace(/20\d{2}(?:-\d+(?:\.\d+)*)?(?:修订)?/g, "")
    .replace(/\s*[丨|]\s*/g, " ")
    .replace(/[-–—]\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim()

  return {
    original: title,
    displayName: displayName || title,
    years,
    flags,
  }
}
