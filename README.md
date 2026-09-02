# UESTC Byte Lib

成电人的电子图书馆。一个纯前端的桌面端单页应用，把飞书知识库里的
**学院分类和期末复习文档**收进一个轻量、克制的「电子图书馆」里。

核心体验是 Keynote 式的分类舞台横移切换：当前分类居中完整展开，左右相邻分类以缩小、低透明度、
轻微模糊的姿态在两侧露出，暗示「还有更多」。支持鼠标滚轮、触控板、方向键、拖拽和指示器切换，
另有全局 `⌘K` 搜索与一个独立的概念词典。

## 快速开始

需要 Node.js 20.9+ 和 pnpm。

```bash
pnpm install
pnpm dev --port 43917
```

打开 http://localhost:43917 。唯一的服务端代码是一个取站点图标的代理
（`app/api/icon`），它只是转发请求并读取上游状态码，没有它页面也能正常渲染，
只是所有图标都会退化成字母图章。

课程目录来自飞书知识空间 [UESTC Byte Lib](https://my.feishu.cn/wiki/AatBwiDa7ig7RJkzdlocLm1cnTh)
的二级页面，由 `pnpm sync:wiki` 在每次 `pnpm build` 时刷新到 `lib/data/catalog.json`。
本机已登录 `lark-cli` 时会直接拉取；CI / Vercel 可配置 `FEISHU_APP_ID` + `FEISHU_APP_SECRET`
（或 `FEISHU_TENANT_ACCESS_TOKEN`）。没有凭证时沿用仓库里已提交的目录，避免把构建卡死。

## 部署到 Vercel

这是标准的 Next.js App Router 项目，Vercel 会按 `vercel.json` 识别框架并用 pnpm 安装依赖。
若要在构建时刷新飞书课程目录，在项目环境变量里配置
`FEISHU_APP_ID` 与 `FEISHU_APP_SECRET`（应用需能读取该知识空间），
或直接提供 `FEISHU_TENANT_ACCESS_TOKEN`。不配则使用仓库里已提交的 `lib/data/catalog.json`。

在 [Vercel](https://vercel.com/new) 导入本仓库即可；或在已登录 CLI 的情况下：

```bash
pnpm dlx vercel --prod --yes
```

其它命令：

```bash
pnpm sync:wiki   # 从飞书知识空间刷新课程目录
pnpm build       # 先 sync:wiki，再生产构建（Turbopack）
pnpm start       # 运行生产构建
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint
pnpm format      # prettier --write
```

## 交互速查

| 操作                  | 效果                |
| --------------------- | ------------------- |
| 滚轮 / 触控板 / 拖拽  | 在首页切换分类      |
| `←` `→` `↑` `↓`       | 切换分类            |
| `1`–`9`               | 直接跳到第 n 个学院 |
| `Enter` / `Space`     | 进入当前分类        |
| `Esc`                 | 从分类详情返回首页  |
| `⌘K` / `Ctrl+K` / `/` | 打开全局搜索        |
| `d`                   | 切换明暗主题        |

## 路由

分类、词典都是独立的 Next.js 页面，地址可直接分享：

| 地址                       | 视图                     |
| -------------------------- | ------------------------ |
| `/`                        | 分类舞台（首页）         |
| `/c/<slug>`                | 分类详情                 |
| `/c/<slug>?focus=<linkId>` | 分类详情，并高亮某条链接 |
| `/glossary`                | 概念词典                 |
| `/glossary?term=<termId>`  | 概念词典，并展开某个词条 |

`<slug>` 取值来自飞书知识空间一级节点，例如 `cs` `medicine` `general` `software`。

## 技术栈

- **Next.js 16**（App Router，Turbopack）+ React 19
- **Tailwind CSS v4**（CSS-first 配置，无 `tailwind.config.js`）
- **shadcn/ui**，`base-rhea` style + `olive` baseColor，底层是 **Base UI**（非 Radix）
- **hugeicons** 图标库，**cmdk** 命令面板，**next-themes** 主题
- TypeScript 严格模式

主题默认跟随系统 `prefers-color-scheme`，可通过顶部玻璃胶囊 header 的太阳 / 月亮按钮即时切换，
选择保存在 `localStorage`。

## 目录结构

```
app/
  layout.tsx            字体、主题、AppShell 外壳
  page.tsx              首页分类舞台
  c/[slug]/page.tsx     学院分类详情页
  glossary/page.tsx     概念词典
  globals.css           设计令牌：分类强调色、glass / surface-shadow、动效、reduced-motion
components/
  app-shell.tsx         header + 氛围层 + 命令面板
  site-header.tsx       固定居中的玻璃胶囊顶栏
  command-palette.tsx   ⌘K 全局搜索
  link-card.tsx         链接卡片（新标签页打开）
  favicon.tsx           favicon + 失败回退的字母 monogram
app/api/icon/route.ts   favicon 代理：读到上游真实状态码，查不到的站点才会正确回退
  stage/                分类舞台：容器、卡片、指示器
  category/             分类详情页
  glossary/             概念词典
  ui/                   shadcn 组件（未改动）
hooks/
  use-stage-nav.ts      滚轮 / 键盘 / 拖拽导航
  use-navigate.ts       App Router 跳转
lib/
  accents.ts            AccentKey → 静态 Tailwind 类名查表
  search.ts             命令面板检索
  data/                 全部内容数据（分类 / 链接 / 词条）
docs/
  DESIGN.md             完整实施规范
```

## 内容数据

所有内容集中在 `lib/data/`，类型定义在 `lib/data/types.ts`：

- `catalog.json` — 飞书知识空间同步结果：一级节点是学院，二级节点是课程文档
- `catalog.ts` / `library.ts` — 给站点用的目录导出（舞台、分类页、搜索都读这里）
- `college-meta.ts` — 学院英文名、tagline、强调色
- `categories.ts` / `links.ts` — 概念词典仍在引用的旧站外链接
- `glossary.ts` — 16 个概念词条，含别名、分组、详细释义，以及指向具体链接的 `relatedLinkIds`

单独刷新课程目录：

```bash
pnpm sync:wiki
```

课程文档在飞书知识空间里新增二级页面后，跑 `pnpm sync:wiki`（或直接 `pnpm build`）就会进站点。
学院英文名和强调色写在 `college-meta.ts`。概念词典的相关链接仍指向 `links.ts` 里的官方入口。
