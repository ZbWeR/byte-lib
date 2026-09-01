# UESTC Byte Lib

成电人的电子图书馆。一个纯前端的桌面端单页应用，把 **6 个分类、49 个站外链接、16 个概念名词**
收进一个轻量、克制的「电子图书馆」里。

核心体验是 Keynote 式的分类舞台横移切换：当前分类居中完整展开，左右相邻分类以缩小、低透明度、
轻微模糊的姿态在两侧露出，暗示「还有更多」。支持鼠标滚轮、触控板、方向键、拖拽和指示器切换，
另有全局 `⌘K` 搜索与一个独立的概念词典。

## 快速开始

需要 Node.js 20.9+ 和 pnpm。

```bash
pnpm install
pnpm dev --port 43917
```

打开 http://localhost:43917 。没有任何环境变量、数据库或后端依赖 —— 所有内容都是
`lib/data/` 下的静态 TypeScript 数据。

其它命令：

```bash
pnpm build       # 生产构建（Turbopack）
pnpm start       # 运行生产构建
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint
pnpm format      # prettier --write
```

## 交互速查

| 操作                     | 效果                     |
| ------------------------ | ------------------------ |
| 滚轮 / 触控板 / 拖拽     | 在首页切换分类           |
| `←` `→` `↑` `↓`          | 切换分类                 |
| `1`–`6`                  | 直接跳到第 n 个分类      |
| `Enter` / `Space`        | 进入当前分类             |
| `Esc`                    | 从分类详情返回首页       |
| `⌘K` / `Ctrl+K` / `/`    | 打开全局搜索             |
| `d`                      | 切换明暗主题             |

## 路由

全站是单个 Next.js 页面，路由完全由 URL hash 驱动，因此每个视图都能直接分享：

| 地址                         | 视图                           |
| ---------------------------- | ------------------------------ |
| `#/`                         | 分类舞台（首页）               |
| `#/c/<slug>`                 | 分类详情                       |
| `#/c/<slug>?focus=<linkId>`  | 分类详情，并高亮某条链接       |
| `#/glossary`                 | 概念词典                       |
| `#/glossary?term=<termId>`   | 概念词典，并展开某个词条       |

`<slug>` 取值：`campus` `learn` `research` `code` `tools` `future`。

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
  layout.tsx            字体、主题 Provider、中文 metadata
  page.tsx              Server Component，只渲染 <AppShell />
  globals.css           设计令牌：分类强调色、glass / surface-shadow、动效、reduced-motion
components/
  app-shell.tsx         哈希路由分发 + 命令面板状态 + 氛围层
  site-header.tsx       固定居中的玻璃胶囊顶栏
  command-palette.tsx   ⌘K 全局搜索
  link-card.tsx         链接卡片（新标签页打开）
  favicon.tsx           favicon + 失败回退的字母 monogram
  stage/                分类舞台：容器、卡片、指示器
  category/             分类详情页
  glossary/             概念词典
  ui/                   shadcn 组件（未改动）
hooks/
  use-hash-route.ts     hash 路由
  use-stage-nav.ts      滚轮 / 键盘 / 拖拽导航
lib/
  accents.ts            AccentKey → 静态 Tailwind 类名查表
  search.ts             命令面板检索
  data/                 全部内容数据（分类 / 链接 / 词条）
docs/
  DESIGN.md             完整实施规范
```

## 内容数据

所有内容集中在 `lib/data/`，类型定义在 `lib/data/types.ts`：

- `categories.ts` — 6 个分类
- `links.ts` — 49 个站外链接，每条含标题、描述、标签、搜索关键词，
  需要校园网的站点标了 `campusOnly`
- `glossary.ts` — 16 个概念词条，含别名、分组、详细释义，以及指向具体链接的 `relatedLinkIds`

新增一个链接只需往 `links.ts` 里追加一条并填上已存在的 `categorySlug`，UI 会自动收录，
计数、筛选和 `⌘K` 搜索都不用改。

链接均为官方或社区公认的主入口，收录时逐条核对过可达性。发现失效链接欢迎直接改数据文件。
