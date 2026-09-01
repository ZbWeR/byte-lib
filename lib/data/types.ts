/** 分类的强调色，映射到 globals.css 中的 --accent-<key> 变量 */
export type AccentKey = "lime" | "teal" | "sky" | "violet" | "amber" | "rose"

export type Category = {
  slug: string
  /** 中文分类名，舞台卡片主标题 */
  name: string
  /** 英文副标题，mono 大写小字 */
  nameEn: string
  /** 一句话钩子，舞台卡片上用 */
  tagline: string
  /** 两三句介绍，分类详情页用 */
  description: string
  accent: AccentKey
  /** 该分类下的标签全集，顺序即筛选栏顺序 */
  tags: string[]
}

export type LibraryLink = {
  id: string
  categorySlug: string
  title: string
  url: string
  description: string
  tags: string[]
  /** 需要校园网 / 图书馆代理才能完整访问 */
  campusOnly?: boolean
  /** 搜索用的额外关键词：拼音首字母、英文别名、俗称 */
  keywords?: string[]
}

export type GlossaryGroup = "学业" | "升学" | "竞赛" | "校园" | "技术"

export type GlossaryTerm = {
  id: string
  term: string
  /** 英文或缩写 */
  en?: string
  /** 俗称、别名 */
  alias?: string[]
  group: GlossaryGroup
  /** 一句话定义 */
  summary: string
  /** 展开后的详细解释，每项一段 */
  detail: string[]
  /** 关联的 LibraryLink id，渲染成可跳转的 chips */
  relatedLinkIds?: string[]
  keywords?: string[]
}
