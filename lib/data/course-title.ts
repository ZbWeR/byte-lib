/** 从飞书文档标题里拆出课名、年份和状态。标题才是目前唯一的内容信号。 */
export type ParsedCourseTitle = {
  original: string
  displayName: string
  years: string[]
  flags: string[]
}

export function parseCourseTitle(title: string): ParsedCourseTitle {
  const flags: string[] = []
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

/** 卡片上用的标题：去掉「评论待补充」这类噪音，年份和课名保留。 */
export function displayTitle(title: string) {
  return (
    title
      .replace(/[（(][^）)]*(评论|引用文献)[^）)]*[）)]/g, "")
      .replace(/评论待补充|评论暂无|暂无评论|无评论/g, "")
      .replace(/\s+/g, " ")
      .trim() || title
  )
}
