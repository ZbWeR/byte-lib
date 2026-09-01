import type { LibraryLink } from "./types"

/**
 * 49 个站外链接。URL 均已核对过，全部为官方或社区公认的主入口。
 * 标注 campusOnly 的站点需要校园网或图书馆远程访问才能看到全文。
 */
export const links: LibraryLink[] = [
  // ── 校内门户 campus (9) ─────────────────────────────────────────
  {
    id: "uestc-home",
    categorySlug: "campus",
    title: "电子科技大学官网",
    url: "https://www.uestc.edu.cn/",
    description:
      "学校主站。校历、机构设置、通知公告的最终出处，年年查校历都会回到这里。",
    tags: ["信息"],
    keywords: ["uestc", "cddx", "成电", "主页"],
  },
  {
    id: "uestc-portal",
    categorySlug: "campus",
    title: "网上服务大厅",
    url: "https://portal.uestc.edu.cn/",
    description:
      "一站式办事平台。请假、证明、报修、缴费都在这儿，搜索框里输业务名比翻菜单快得多。",
    tags: ["办事"],
    keywords: ["portal", "一站式", "办事大厅", "yzsfwdt"],
  },
  {
    id: "uestc-idas",
    categorySlug: "campus",
    title: "统一身份认证",
    url: "https://idas.uestc.edu.cn/authserver/login",
    description:
      "所有校内系统的总入口。密码忘了、账号被锁，都从这个页面找回，别到处乱试。",
    tags: ["办事"],
    keywords: ["idas", "sso", "登录", "统一认证"],
  },
  {
    id: "uestc-eams",
    categorySlug: "campus",
    title: "本科教务系统",
    url: "https://eams.uestc.edu.cn/",
    description:
      "选课、退课、查成绩、打培养方案。选课开放的那几分钟，这个域名的心跳全校同步。",
    tags: ["教务"],
    keywords: ["eams", "选课", "教务系统", "jwxt", "成绩"],
  },
  {
    id: "uestc-jwc",
    categorySlug: "campus",
    title: "教务处",
    url: "https://www.jwc.uestc.edu.cn/",
    description:
      "选课通知、考试安排、重新学习报名的原文都发在这里。别等到群里传谣言才想起来看。",
    tags: ["教务"],
    keywords: ["jwc", "教务处", "通知", "重修"],
  },
  {
    id: "uestc-gr",
    categorySlug: "campus",
    title: "研究生院",
    url: "https://gr.uestc.edu.cn/",
    description:
      "研究生的教务处。GMS 系统、选课、学位与答辩公示，保研成功之后你会天天见到它。",
    tags: ["教务"],
    keywords: ["gr", "研究生院", "gms", "yjsy"],
  },
  {
    id: "uestc-lib",
    categorySlug: "campus",
    title: "电子科技大学图书馆",
    url: "https://www.lib.uestc.edu.cn/",
    description:
      "馆藏检索、座位预约、电子资源导航。校外查文献前先在这里开远程访问，能省下大量下载费。",
    tags: ["图书馆"],
    keywords: ["lib", "图书馆", "座位", "数据库", "tsg"],
  },
  {
    id: "uestc-mail",
    categorySlug: "campus",
    title: "学生邮箱",
    url: "https://mail.uestc.edu.cn/",
    description:
      "教育网邮箱。申请学生优惠、注册学术账号、联系导师都靠它，比 QQ 邮箱正式得多。",
    tags: ["办事"],
    keywords: ["mail", "邮箱", "edu"],
  },
  {
    id: "uestc-bbs",
    categorySlug: "campus",
    title: "清水河畔",
    url: "https://bbs.uestc.edu.cn/",
    description:
      "成电自己的论坛。课程评价、二手交易、失物招领和各种真实吐槽，选课前值得先来搜一圈老师名字。",
    tags: ["社区"],
    keywords: ["bbs", "清水河畔", "论坛", "qshp"],
  },

  // ── 课程自学 learn (9) ─────────────────────────────────────────
  {
    id: "icourse163",
    categorySlug: "learn",
    title: "中国大学 MOOC",
    url: "https://www.icourse163.org/",
    description:
      "国内高校慕课的主平台。同一门专业课往往有七八个学校的版本，挑讲得顺的那个听。",
    tags: ["公开课"],
    keywords: ["mooc", "慕课", "icourse", "中国大学mooc"],
  },
  {
    id: "xuetangx",
    categorySlug: "learn",
    title: "学堂在线",
    url: "https://www.xuetangx.com/",
    description:
      "清华发起的慕课平台。理工科基础课储备厚，不少课程配套习题和判题，适合当第二遍复习。",
    tags: ["公开课"],
    keywords: ["xuetangx", "学堂在线", "慕课"],
  },
  {
    id: "mit-ocw",
    categorySlug: "learn",
    title: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu/",
    description:
      "MIT 把课程讲义、作业和考卷全部公开。线代找 18.06，算法找 6.006，几乎是通用共识。",
    tags: ["公开课", "计算机"],
    keywords: ["ocw", "mit", "麻省理工", "公开课"],
  },
  {
    id: "coursera",
    categorySlug: "learn",
    title: "Coursera",
    url: "https://www.coursera.org/",
    description:
      "英文慕课大平台。机器学习、深度学习的经典课都在这里，旁听模式免费看视频。",
    tags: ["公开课"],
    keywords: ["coursera", "慕课", "ml"],
  },
  {
    id: "missing-semester",
    categorySlug: "learn",
    title: "The Missing Semester of Your CS Education",
    url: "https://missing.csail.mit.edu/",
    description:
      "没人教但人人都要会的那一课：Shell、Git、vim、调试、数据处理。一个周末能刷完，受益整个大学。",
    tags: ["计算机", "路线图"],
    keywords: ["missing semester", "shell", "git", "vim", "mit"],
  },
  {
    id: "csdiy",
    categorySlug: "learn",
    title: "CS 自学指南",
    url: "https://csdiy.wiki/",
    description:
      "北大学长整理的计算机自学路线，把世界名校课程按主题串成了一条可执行的路径，附难度与工作量评价。",
    tags: ["路线图", "计算机"],
    keywords: ["csdiy", "自学指南", "路线", "cs"],
  },
  {
    id: "3blue1brown",
    categorySlug: "learn",
    title: "3Blue1Brown",
    url: "https://www.3blue1brown.com/",
    description:
      "用动画讲线性代数、微积分和傅里叶变换。考试前不一定管用，但能真正让你知道自己在算什么。",
    tags: ["数学"],
    keywords: ["3b1b", "3blue1brown", "线代", "可视化", "傅里叶"],
  },
  {
    id: "khan-academy",
    categorySlug: "learn",
    title: "Khan Academy",
    url: "https://www.khanacademy.org/",
    description:
      "从初等数学补到微积分和概率统计。基础没打牢的时候，回头补这里的短视频最不费劲。",
    tags: ["数学"],
    keywords: ["khan", "可汗学院", "数学"],
  },
  {
    id: "paul-math-notes",
    categorySlug: "learn",
    title: "Paul's Online Math Notes",
    url: "https://tutorial.math.lamar.edu/",
    description:
      "高数、线代、微分方程的完整讲义加习题详解。期末周凌晨想找例题步骤，这里几乎不会让你失望。",
    tags: ["数学"],
    keywords: ["paul", "math notes", "高数", "微积分", "习题"],
  },

  // ── 文献检索 research (8) ──────────────────────────────────────
  {
    id: "google-scholar",
    categorySlug: "research",
    title: "Google 学术",
    url: "https://scholar.google.com/",
    description:
      "找论文的默认起点。看被引数判断分量，用「引用」反查综述，导出 BibTeX 一步到位。",
    tags: ["外文库", "引文工具"],
    keywords: ["scholar", "谷歌学术", "google scholar", "gxs"],
  },
  {
    id: "cnki",
    categorySlug: "research",
    title: "中国知网 CNKI",
    url: "https://www.cnki.net/",
    description:
      "中文文献的主力库，硕博论文尤其齐。毕设查重和参考文献大多绕不开，记得用校园网入口。",
    tags: ["中文库"],
    campusOnly: true,
    keywords: ["cnki", "知网", "中国知网", "查重"],
  },
  {
    id: "wanfang",
    categorySlug: "research",
    title: "万方数据",
    url: "https://www.wanfangdata.com.cn/",
    description:
      "中文期刊、学位论文和标准文献。知网搜不到的会议论文，换到这里常有惊喜。",
    tags: ["中文库"],
    campusOnly: true,
    keywords: ["wanfang", "万方", "标准"],
  },
  {
    id: "ieee-xplore",
    categorySlug: "research",
    title: "IEEE Xplore",
    url: "https://ieeexplore.ieee.org/",
    description:
      "电子信息领域的核心库。成电人的专业方向大半躺在这儿，通过图书馆入口进去才有全文权限。",
    tags: ["外文库"],
    campusOnly: true,
    keywords: ["ieee", "xplore", "电子", "会议"],
  },
  {
    id: "arxiv",
    categorySlug: "research",
    title: "arXiv",
    url: "https://arxiv.org/",
    description:
      "预印本仓库，人工智能和通信方向的新工作往往先发这里。完全免费，比期刊快上半年到一年。",
    tags: ["预印本"],
    keywords: ["arxiv", "预印本", "preprint"],
  },
  {
    id: "dblp",
    categorySlug: "research",
    title: "dblp",
    url: "https://dblp.org/",
    description:
      "计算机领域的作者与会议索引。想确认某人发过什么、某会今年收了哪些论文，这里最干净准确。",
    tags: ["外文库", "引文工具"],
    keywords: ["dblp", "会议", "作者", "计算机"],
  },
  {
    id: "semantic-scholar",
    categorySlug: "research",
    title: "Semantic Scholar",
    url: "https://www.semanticscholar.org/",
    description:
      "带 AI 摘要和引用语境的检索器。能直接看到别人「为什么」引用这篇，筛文献效率高一截。",
    tags: ["外文库", "引文工具"],
    keywords: ["semantic scholar", "s2", "ai摘要"],
  },
  {
    id: "connected-papers",
    categorySlug: "research",
    title: "Connected Papers",
    url: "https://www.connectedpapers.com/",
    description:
      "输入一篇论文，画出整片相关文献的关系图。刚进入一个陌生方向时，用它铺开地图最快。",
    tags: ["引文工具"],
    keywords: ["connected papers", "文献图谱", "综述"],
  },

  // ── 代码工程 code (8) ──────────────────────────────────────────
  {
    id: "github",
    categorySlug: "code",
    title: "GitHub",
    url: "https://github.com/",
    description:
      "代码托管与开源世界的中心。用教育邮箱申请 Student Pack，能白拿一堆平时要付费的开发工具。",
    tags: ["文档", "在线工具"],
    keywords: ["github", "git", "开源", "student pack"],
  },
  {
    id: "stackoverflow",
    categorySlug: "code",
    title: "Stack Overflow",
    url: "https://stackoverflow.com/",
    description:
      "把报错信息整段粘进搜索引擎，最后大概率落到这里。看高赞回答，也记得看下面的评论。",
    tags: ["文档"],
    keywords: ["stackoverflow", "so", "报错", "问答"],
  },
  {
    id: "mdn",
    categorySlug: "code",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org/zh-CN/",
    description:
      "前端三件套的权威文档，中文翻译质量不错。任何关于 HTML / CSS / JavaScript 的争论都以它为准。",
    tags: ["文档"],
    keywords: ["mdn", "前端", "javascript", "css", "文档"],
  },
  {
    id: "leetcode-cn",
    categorySlug: "code",
    title: "力扣 LeetCode",
    url: "https://leetcode.cn/",
    description:
      "算法题库的国内站点。实习和秋招的笔试基本从这里出，按标签刷比按题号刷有效得多。",
    tags: ["刷题"],
    keywords: ["leetcode", "力扣", "刷题", "算法", "lc"],
  },
  {
    id: "oi-wiki",
    categorySlug: "code",
    title: "OI Wiki",
    url: "https://oi-wiki.org/",
    description:
      "中文算法竞赛百科，从基础数据结构讲到数论和图论，公式和代码都给全。ACM 入门的通用参考。",
    tags: ["算法"],
    keywords: ["oiwiki", "oi wiki", "算法竞赛", "acm", "数据结构"],
  },
  {
    id: "hello-algo",
    categorySlug: "code",
    title: "Hello 算法",
    url: "https://www.hello-algo.com/",
    description:
      "动画讲解数据结构与算法，一份代码同时给出多种语言实现。数据结构课的最佳配套读物。",
    tags: ["算法"],
    keywords: ["hello algo", "hello算法", "数据结构", "动画"],
  },
  {
    id: "godbolt",
    categorySlug: "code",
    title: "Compiler Explorer",
    url: "https://godbolt.org/",
    description:
      "在浏览器里看 C / C++ 代码编译出的汇编。想弄懂指针、内联和优化到底做了什么，这里最直观。",
    tags: ["在线工具"],
    keywords: ["godbolt", "compiler explorer", "汇编", "编译"],
  },
  {
    id: "devdocs",
    categorySlug: "code",
    title: "DevDocs",
    url: "https://devdocs.io/",
    description:
      "把上百种语言和框架的官方文档聚合到一个搜索框，还能离线用。断网写代码时的救命工具。",
    tags: ["文档", "在线工具"],
    keywords: ["devdocs", "文档", "离线"],
  },

  // ── 效率工具 tools (8) ─────────────────────────────────────────
  {
    id: "overleaf",
    categorySlug: "tools",
    title: "Overleaf",
    url: "https://www.overleaf.com/",
    description:
      "在线 LaTeX 编辑器，不用本地装几个 G 的发行版。写论文、做课程报告、和同学同时改一份稿都合适。",
    tags: ["写作"],
    keywords: ["overleaf", "latex", "论文", "排版"],
  },
  {
    id: "zotero",
    categorySlug: "tools",
    title: "Zotero",
    url: "https://www.zotero.org/",
    description:
      "免费的文献管理器。浏览器插件一键抓取论文元数据，写作时自动生成参考文献，毕设阶段的刚需。",
    tags: ["文献管理"],
    keywords: ["zotero", "文献管理", "参考文献", "bibtex"],
  },
  {
    id: "obsidian",
    categorySlug: "tools",
    title: "Obsidian",
    url: "https://obsidian.md/",
    description:
      "本地 Markdown 笔记，文件就在你自己的硬盘上。用双向链接把四年的课程笔记连成一张网。",
    tags: ["写作"],
    keywords: ["obsidian", "笔记", "markdown", "双链"],
  },
  {
    id: "excalidraw",
    categorySlug: "tools",
    title: "Excalidraw",
    url: "https://excalidraw.com/",
    description:
      "手绘风白板。画系统框图、时序图、答辩用示意图都很快，免登录，分享一个链接就能协作。",
    tags: ["画图"],
    keywords: ["excalidraw", "画图", "白板", "框图"],
  },
  {
    id: "desmos",
    categorySlug: "tools",
    title: "Desmos 图形计算器",
    url: "https://www.desmos.com/calculator",
    description:
      "输入函数立刻出图，还能拖动参数看曲线怎么变。验算作业和理解函数性质都比手画靠谱。",
    tags: ["计算", "画图"],
    keywords: ["desmos", "函数", "作图", "计算器"],
  },
  {
    id: "wolframalpha",
    categorySlug: "tools",
    title: "WolframAlpha",
    url: "https://www.wolframalpha.com/",
    description:
      "会解题的计算引擎。积分、微分方程、矩阵、级数丢进去就有答案，很多时候还附推导步骤。",
    tags: ["计算"],
    keywords: ["wolfram", "wolframalpha", "积分", "求解", "数学"],
  },
  {
    id: "detexify",
    categorySlug: "tools",
    title: "Detexify",
    url: "https://detexify.kirelabs.org/classify.html",
    description:
      "手写一个符号，它告诉你对应的 LaTeX 命令。忘了某个希腊字母或算子怎么敲时特别管用。",
    tags: ["写作"],
    keywords: ["detexify", "latex", "符号", "手写"],
  },
  {
    id: "regex101",
    categorySlug: "tools",
    title: "regex101",
    url: "https://regex101.com/",
    description:
      "正则表达式实时调试器，右侧逐段解释你写的每个符号在干什么。处理数据前先在这里试一遍。",
    tags: ["在线工具", "计算"],
    keywords: ["regex101", "正则", "regex"],
  },

  // ── 升学出路 future (7) ────────────────────────────────────────
  {
    id: "chsi-yz",
    categorySlug: "future",
    title: "中国研究生招生信息网",
    url: "https://yz.chsi.com.cn/",
    description:
      "研招网。考研报名、调剂、招生目录的唯一官方平台，所有时间节点以这里的公告为准。",
    tags: ["考研"],
    keywords: ["研招网", "chsi", "考研", "yz", "调剂"],
  },
  {
    id: "chsi-tuimian",
    categorySlug: "future",
    title: "推免服务系统",
    url: "https://yz.chsi.com.cn/tm/",
    description:
      "保研最后一步就在这里填志愿、接复试通知、点确认。系统开放当天务必守着，名额是秒级的。",
    tags: ["保研"],
    keywords: ["推免", "保研", "预推免", "tm", "填志愿"],
  },
  {
    id: "chsi",
    categorySlug: "future",
    title: "学信网",
    url: "https://www.chsi.com.cn/",
    description:
      "学籍学历的官方档案。在线验证报告是保研夏令营、留学申请、入职背调都会点名要的材料。",
    tags: ["保研", "求职"],
    keywords: ["学信网", "chsi", "学籍", "学历", "验证报告"],
  },
  {
    id: "uestc-jiuye",
    categorySlug: "future",
    title: "电子科大就业信息网",
    url: "https://jiuye.uestc.edu.cn/",
    description:
      "校招宣讲会、双选会日程和三方协议网签都在这里。成电的招聘资源密度很高，别只盯着外面的招聘 App。",
    tags: ["求职"],
    keywords: ["就业网", "jiuye", "双选会", "三方", "校招"],
  },
  {
    id: "cdgdc",
    categorySlug: "future",
    title: "中国学位与研究生教育信息网",
    url: "https://www.cdgdc.edu.cn/",
    description:
      "学位授权点、学科评估结果的官方来源。挑学校挑导师之前，先来看看那个学科到底是什么水平。",
    tags: ["保研", "考研"],
    keywords: ["cdgdc", "学位网", "学科评估", "a+"],
  },
  {
    id: "csc",
    categorySlug: "future",
    title: "国家留学网",
    url: "https://www.csc.edu.cn/",
    description:
      "国家留学基金委官网。公派留学、联合培养的申请通知和录取名单都在这里公布，是最省钱的出国路径。",
    tags: ["留学"],
    keywords: ["csc", "国家留学基金委", "公派", "留学"],
  },
  {
    id: "nowcoder",
    categorySlug: "future",
    title: "牛客网",
    url: "https://www.nowcoder.com/",
    description:
      "面经、笔试真题和实习招聘信息的聚集地。投递之前搜一下目标公司，能少走不少弯路。",
    tags: ["求职"],
    keywords: ["牛客", "nowcoder", "面经", "笔试", "实习"],
  },
]

export const linksByCategory = links.reduce<Record<string, LibraryLink[]>>(
  (acc, link) => {
    ;(acc[link.categorySlug] ??= []).push(link)
    return acc
  },
  {}
)

export const linkById = new Map(links.map((l) => [l.id, l]))
