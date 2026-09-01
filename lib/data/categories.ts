import type { Category } from "./types"

export const categories: Category[] = [
  {
    slug: "campus",
    name: "校内门户",
    nameEn: "Campus Portal",
    tagline: "选课、成绩、借书、报修，先从这里进。",
    description:
      "成电人每学期都要打开无数次的官方入口。统一身份认证之后，教务、研究生、图书馆、邮箱基本都能一路直达。收藏这一页，比在浏览器历史里翻半天要快。",
    accent: "lime",
    tags: ["办事", "教务", "图书馆", "社区", "信息"],
  },
  {
    slug: "learn",
    name: "课程自学",
    nameEn: "Learn Anywhere",
    tagline: "这门课听不懂的时候，换个人讲给你听。",
    description:
      "高数、线代、信号与系统、编译原理——绝大多数专业课都能在网上找到讲得更清楚的版本。这里是经过筛选的公开课与自学路线图，不求全，只求真的能看下去。",
    accent: "teal",
    tags: ["公开课", "数学", "计算机", "路线图"],
  },
  {
    slug: "research",
    name: "文献检索",
    nameEn: "Research & Papers",
    tagline: "从「找不到参考文献」到「看不完参考文献」。",
    description:
      "大创、毕设、组会汇报都躲不开查文献。中英文数据库、预印本、引文网络工具各来一点，校内数据库记得先连校园网或用图书馆的远程访问。",
    accent: "sky",
    tags: ["中文库", "外文库", "预印本", "引文工具"],
  },
  {
    slug: "code",
    name: "代码工程",
    nameEn: "Code & Craft",
    tagline: "报错信息不必自己扛，站在巨人的仓库上。",
    description:
      "写代码这件事，查文档的时间往往比敲键盘更多。这里放的是文档、题库、算法讲义和几个能省下大把时间的在线工具，覆盖从第一门 C 语言到实习面试。",
    accent: "violet",
    tags: ["文档", "刷题", "算法", "在线工具"],
  },
  {
    slug: "tools",
    name: "效率工具",
    nameEn: "Daily Toolkit",
    tagline: "把重复劳动交给工具，把时间留给自己。",
    description:
      "写论文、画图、管文献、算积分。都是能在浏览器里直接用、不用装一堆软件的轻工具，装一次就能陪你走完整个本科。",
    accent: "amber",
    tags: ["写作", "文献管理", "画图", "计算"],
  },
  {
    slug: "future",
    name: "升学出路",
    nameEn: "What's Next",
    tagline: "保研、考研、出国、找工作，信息差最贵。",
    description:
      "大三下开始，每个人都在问同一批问题。官方系统在哪报名、时间线怎么排、面经在哪看——这些都是原始信息源，别只听学长学姐的二手转述。",
    accent: "rose",
    tags: ["保研", "考研", "留学", "求职"],
  },
]

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]))
