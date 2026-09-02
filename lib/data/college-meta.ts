import type { AccentKey } from "./types"

export type CollegeMeta = {
  nameEn: string
  tagline: string
  description: string
  accent: AccentKey
}

export const collegeMeta: Record<string, CollegeMeta> = {
  general: {
    nameEn: "General Education",
    tagline: "毛概、马原、近代史，通识课期末周最先翻的那几份。",
    description:
      "公共必修课的复习文档按学年堆在这里。挖空版、修订版都保留，对着自己那一学期的课名找就行。",
    accent: "lime",
  },
  cs: {
    nameEn: "Computer Science",
    tagline: "计网、操作系统、编译原理——计科核心课的开源笔记。",
    description:
      "计算机学院同学长期协作的期末复习文档。有的还在补评论，但不妨碍你先把提纲过一遍。",
    accent: "teal",
  },
  medicine: {
    nameEn: "Medicine",
    tagline: "从免疫病理到内外科，医学院的课表几乎都能对上。",
    description:
      "医学院各系统课程笔记。基础、临床都有收录，适合按学期对照培养方案来查。",
    accent: "rose",
  },
  software: {
    nameEn: "Software Engineering",
    tagline: "近年试卷向的软件学院复习材料。",
    description:
      "软件学院操作系统、计网、数据库、密码学等课的近年整理。标题里的年份就是那一版对应的学期。",
    accent: "violet",
  },
  glasgow: {
    nameEn: "Glasgow College",
    tagline: "格拉斯哥学院英文课的复习指南。",
    description:
      "UESTC-Glasgow 的课程笔记和 tutorial。英文课名保持原样，方便和课表对上。",
    accent: "sky",
  },
  automation: {
    nameEn: "Automation",
    tagline: "系统工程、控制原理，自动化方向的硬课笔记。",
    description: "自动化学院目前收录的复习文档。课少但都是会反复出现的核心课。",
    accent: "amber",
  },
  microelectronics: {
    nameEn: "Microelectronics",
    tagline: "集成电路工艺，以及 Matlab 这种会卡人的急救帖。",
    description:
      "电子与集成电路相关的笔记。工具向、工艺向都放在这一组，免得在别的学院目录里找不到。",
    accent: "violet",
  },
  infocomm: {
    nameEn: "Info & Communication",
    tagline: "信通学院目前公开的课程文档。",
    description:
      "信息与通信工程学院的复习材料。收录还在增加，先把能公开的课放上来。",
    accent: "sky",
  },
  optoelectronics: {
    nameEn: "Optoelectronics",
    tagline: "量子力学和电磁场，光电学院的两门硬骨头。",
    description:
      "光电学院的复习笔记。量子、电磁场这类课，有一份能看懂的提纲会省很多时间。",
    accent: "amber",
  },
  management: {
    nameEn: "Management",
    tagline: "经管学院的管理学纲要。",
    description: "经济与管理学院目前收录的课程文档，以管理学相关提纲为主。",
    accent: "teal",
  },
  others: {
    nameEn: "Others",
    tagline: "转专业、就业——暂时还没归进某个学院的材料。",
    description:
      "跨学院、或者还没找到合适分组的文档。转专业经验和就业指南目前住在这里。",
    accent: "lime",
  },
  life: {
    nameEn: "Life Science",
    tagline: "生信、分子、细胞，生命学院的基础课笔记。",
    description:
      "生命学院的复习文档。有的页面还在施工，标题写清楚了的已经可以点进去读。",
    accent: "rose",
  },
}

const FALLBACK_ACCENTS: AccentKey[] = [
  "lime",
  "teal",
  "sky",
  "violet",
  "amber",
  "rose",
]

export function metaForCollege(slug: string, index: number): CollegeMeta {
  return (
    collegeMeta[slug] ?? {
      nameEn: slug.replace(/-/g, " "),
      tagline: "这个分组下的期末复习文档。",
      description:
        "文档来自 UESTC Byte Lib 飞书知识库。点卡片会在新标签页打开对应飞书文档。",
      accent: FALLBACK_ACCENTS[index % FALLBACK_ACCENTS.length],
    }
  )
}
