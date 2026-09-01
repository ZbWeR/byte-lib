# UESTC Byte Lib — 实施方案 v1

> 这份文档是实现规范，不是灵感板。凡是给了具体数值、类名、文件路径、导出名的地方，请照抄；
> 只有标注「可调」的地方允许按视觉效果微调。

---

## 0. 已完成 / 待完成

**已完成（不要重写）**

- `pnpm dlx shadcn@latest init --preset b5eZm1fGb --template next` 脚手架已落地：
  Next.js 16.2.6（App Router，Turbopack 默认）、React 19.2、Tailwind v4、
  shadcn `base-rhea` style + `olive` baseColor + **Base UI**（不是 Radix）+ **hugeicons** 图标库。
- 已安装的 `components/ui`：`button` `badge` `input` `textarea` `dialog` `command`
  `tooltip` `separator` `scroll-area` `kbd` `skeleton` `input-group`。
  **不要重新 `shadcn add` 这些组件，也不要改写它们的源码。**
- `components/theme-provider.tsx`：`next-themes`，`attribute="class"`、`defaultTheme="system"`、
  `enableSystem`，已内置按 `d` 键切换主题的快捷键。已在 `app/layout.tsx` 包裹。
- **数据层已写好，内容全部核对过，禁止改动 URL / 文案 / 数量**：
  - `lib/data/types.ts` — `Category` `LibraryLink` `GlossaryTerm` `AccentKey` `GlossaryGroup`
  - `lib/data/categories.ts` — `categories`（6 条）、`categoryBySlug`
  - `lib/data/links.ts` — `links`（**49 条**）、`linksByCategory`、`linkById`
  - `lib/data/glossary.ts` — `glossary`（**16 条**）、`glossaryById`、`glossaryGroups`

**你要做的**：全部 UI —— 设计令牌、字体、布局、四个视图、哈希路由、命令面板、动效、空/错状态。

---

## 1. 设计语言

### 1.1 气质

苹果式极简：**大留白、克制的层次、少量高饱和点缀、动效讲究但不炫技**。
读者是成电的学生，界面要像一件顺手的工具，而不是一个作品集 demo。

三条硬规则：

1. **一屏只有一个视觉主角。** 首页是当前分类卡片，详情页是链接网格，词典页是词条。其余一切降到背景。
2. **强调色只用于点缀。** primary（青柠色）只出现在：当前态指示、hover 边框、少量图标。大面积色块一律用中性色。
3. **不要边框套边框。** 卡片用 `border` + 极浅阴影表达层次，不要同时叠加多层描边。

### 1.2 字体

预设用 Inter 提供 `--font-sans`，但 Inter 没有中文字形，必须补 CJK 回退栈。

改 `app/layout.tsx`：把 Inter 的 `variable` 从 `--font-sans` 改成 `--font-inter`
（`Geist_Mono` 的 `--font-mono` 保持不变），并把 `<html>` 上的 `inter.variable` 保留。

在 `app/globals.css` 的 `@theme inline` 块里覆盖：

```css
--font-sans:
  var(--font-inter), "PingFang SC", "HarmonyOS Sans SC", "Hiragino Sans GB",
  "Source Han Sans SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
```

不要用 `next/font` 加载中文字体（体积几 MB，得不偿失）。系统中文字体正是苹果式观感的来源。

排版约定：

| 用途                   | 类名                                                                      |
| ---------------------- | ------------------------------------------------------------------------- |
| 舞台卡片分类名         | `text-[2.6rem] leading-[1.1] font-medium tracking-tight`                  |
| 详情页 / 词典页大标题  | `text-3xl font-medium tracking-tight`                                     |
| 英文副标、编号、快捷键 | `font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground` |
| 卡片标题               | `text-[15px] font-medium leading-snug`                                    |
| 正文描述               | `text-[13px] leading-relaxed text-muted-foreground`                       |
| 数字（计数、序号）     | 一律加 `font-mono tabular-nums`                                           |

中文正文行高要比英文松：正文统一 `leading-relaxed`，标题 `leading-tight`。
中文不要用 `font-bold`（系统中文字体加粗容易糊），最重只到 `font-medium`。

### 1.3 颜色令牌

预设已给全 `--background/--foreground/--card/--muted/--border/--primary/...`，直接用语义类
（`bg-background` `text-muted-foreground` `border-border`），**不要写死 hex**。

需要新增的是 6 个分类强调色。在 `app/globals.css` 追加：

```css
:root {
  --accent-lime: oklch(0.72 0.19 129);
  --accent-teal: oklch(0.68 0.12 183);
  --accent-sky: oklch(0.65 0.14 235);
  --accent-violet: oklch(0.62 0.16 300);
  --accent-amber: oklch(0.72 0.14 74);
  --accent-rose: oklch(0.64 0.17 15);
}

.dark {
  --accent-lime: oklch(0.8 0.21 130);
  --accent-teal: oklch(0.78 0.13 183);
  --accent-sky: oklch(0.75 0.14 235);
  --accent-violet: oklch(0.74 0.15 300);
  --accent-amber: oklch(0.82 0.15 76);
  --accent-rose: oklch(0.75 0.16 16);
}
```

在 `@theme inline` 里注册成真正的颜色工具类（因为引用的是 var，会自动跟随明暗主题）：

```css
--color-cat-lime: var(--accent-lime);
--color-cat-teal: var(--accent-teal);
--color-cat-sky: var(--accent-sky);
--color-cat-violet: var(--accent-violet);
--color-cat-amber: var(--accent-amber);
--color-cat-rose: var(--accent-rose);
```

**关键：Tailwind 是静态分析的，绝对不要拼接类名**（`` `bg-cat-${accent}` `` 会失效）。
建一个 `lib/accents.ts`，导出静态查表：

```ts
import type { AccentKey } from "@/lib/data/types"

type AccentClasses = {
  text: string // 图标 / 编号
  ring: string // hover 时的边框
  glow: string // 卡片背后的光晕（radial-gradient）
  wash: string // 卡片内部极浅底色
  dot: string // 指示器 / chip
}

export const accentClasses: Record<AccentKey, AccentClasses> = {
  lime: {
    text: "text-cat-lime",
    ring: "group-hover:border-cat-lime/40",
    glow: "bg-cat-lime/20",
    wash: "from-cat-lime/[0.07]",
    dot: "bg-cat-lime",
  },
  // teal / sky / violet / amber / rose 同构，全部写全，不要用循环生成
}
```

### 1.4 圆角、玻璃、阴影

`--radius: 0.625rem`（10px），预设已把 `rounded-2xl`→18px、`rounded-3xl`→22px、`rounded-4xl`→26px。

| 元素                     | 圆角                           |
| ------------------------ | ------------------------------ |
| 顶部胶囊 header          | `rounded-full`                 |
| 舞台分类卡片             | `rounded-4xl`                  |
| 链接卡片 / 词条卡片      | `rounded-3xl`                  |
| favicon 底座、chip、按钮 | `rounded-2xl` / `rounded-full` |

在 `globals.css` 里加两个工具类（用 `@utility`，Tailwind v4 写法）：

```css
@utility glass {
  background: color-mix(in oklab, var(--background) 72%, transparent);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}

@utility surface-shadow {
  box-shadow:
    0 1px 2px -1px color-mix(in oklab, var(--foreground) 10%, transparent),
    0 8px 24px -12px color-mix(in oklab, var(--foreground) 14%, transparent);
}
```

阴影一律走 `surface-shadow` 或 Tailwind 的 `shadow-sm`/`shadow-lg`，
不要手写一长串 rgba box-shadow。暗色下阴影几乎不可见是正常的，靠 `border-border` 撑层次。

### 1.5 页面底噪 / 氛围

`app/page.tsx` 外层加一个固定定位的氛围层（`fixed inset-0 -z-10 pointer-events-none`），包含：

1. 顶部一团随当前分类强调色变化的 radial glow：
   `absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[900px] rounded-full blur-[120px] opacity-50 transition-colors duration-700`，
   底色用 `accentClasses[accent].glow`。分类切换时颜色平滑过渡 —— 这是整站最重要的氛围细节。
2. 一层极淡网格或噪点，`opacity-[0.025] dark:opacity-[0.04]`。
   用内联 SVG data-uri 的 `feTurbulence` 噪点，或 1px 网格 `linear-gradient`。二选一，别都加。

### 1.6 动效令牌

在 `globals.css` 的 `:root` 里定义：

```css
--ease-stage: cubic-bezier(0.22, 1, 0.36, 1); /* 出场缓动，Keynote 手感 */
--ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
--dur-micro: 180ms; /* hover、图标位移 */
--dur-view: 300ms; /* 视图切换淡入 */
--dur-stage: 620ms; /* 舞台横移 */
```

**必须处理 `prefers-reduced-motion`**：在 `globals.css` 里加

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

并且舞台的 `filter: blur()` 在 reduced-motion 下要直接设为 0（模糊本身会引起不适）。

---

## 2. 路由（哈希 SPA）

全站是**一个** Next.js 页面（`app/page.tsx`），路由完全由 hash 驱动。这样 `#/glossary` 这类地址
能直接工作，也不依赖服务端。

| hash                        | 视图                           |
| --------------------------- | ------------------------------ |
| `#/`、`空`、`#`             | 分类舞台                       |
| `#/c/<slug>`                | 分类详情                       |
| `#/c/<slug>?focus=<linkId>` | 分类详情，高亮并滚动到某条链接 |
| `#/glossary`                | 概念词典                       |
| `#/glossary?term=<termId>`  | 词典，展开某词条               |
| 其它                        | NotFound 视图                  |

`hooks/use-hash-route.ts`：

```ts
export type Route =
  | { name: "stage" }
  | { name: "category"; slug: string; focus?: string }
  | { name: "glossary"; term?: string }
  | { name: "not-found"; raw: string }

export function useHashRoute(): Route
export function navigate(hash: string): void // 写 location.hash
```

实现要点：

- 用 `useState` + `useEffect` 监听 `hashchange`，**首次渲染返回 `{name:"stage"}`**，
  在 `useEffect` 里再读真实 hash。直接在 render 期间读 `window` 会导致 hydration mismatch。
- 解析：先 `raw.replace(/^#\/?/, "")`，再 `split("?")` 拿 query，用 `URLSearchParams` 取参数。
- slug 必须校验存在于 `categoryBySlug`，否则走 `not-found`。
- `navigate` 只写 `location.hash`，让 `hashchange` 统一驱动状态，不要两处各存一份状态。
- 切换到新视图时把 `window.scrollTo(0, 0)`（instant，不要 smooth）。

`app/page.tsx` 保持 Server Component，只渲染 `<AppShell />`；`AppShell` 是 `"use client"`。

视图切换动画：每个视图根节点挂 `key={routeKey}` 和入场动画
`animate-in fade-in-0 slide-in-from-bottom-2 duration-300`（`tw-animate-css` 已装）。

---

## 3. 顶部玻璃胶囊 Header

`components/site-header.tsx`

固定居中：`fixed top-5 left-1/2 -translate-x-1/2 z-50`。
胶囊本体：`glass surface-shadow flex h-13 items-center gap-1 rounded-full border border-border/60 pl-4 pr-2`。

从左到右：

1. **Wordmark** — 点击回 `#/`。
   `UESTC` 用 `font-mono text-[11px] tracking-[0.2em] text-muted-foreground`，
   紧跟 `Byte Lib` 用 `text-[15px] font-medium tracking-tight`。中间一个 `text-cat-lime` 的小圆点分隔。
2. `<Separator orientation="vertical" className="mx-2 h-5" />`
3. **两段式导航**（滑块指示器）：容器 `relative flex rounded-full bg-muted/60 p-1`，
   内部一个绝对定位滑块 `absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-background surface-shadow transition-transform duration-300`，
   `style={{ transform: isGlossary ? "translateX(100%)" : "translateX(0)" }}`。
   两个按钮 `relative z-10 px-4 text-[13px]`：「图书馆」→ `#/`（stage 和 category 都算激活）、「词典」→ `#/glossary`。
4. **搜索按钮** — `Search01Icon` + `搜索` 文案 + `<Kbd>⌘K</Kbd>`（窄屏只留图标）。点击开命令面板。
5. **主题切换** — 见下。

滚动时胶囊收紧一点：`scrollY > 8` 时加 `h-12` 与更强的 `shadow`，`transition-all duration-300`。

### 主题切换按钮

`components/theme-toggle.tsx`，`"use client"`：

- `const { resolvedTheme, setTheme } = useTheme()`；`const [mounted, setMounted] = useState(false)`。
- **未 mount 时渲染 `<div className="size-9" />` 占位**，否则 SSR/CSR 图标不一致会报 hydration 错。
- 图标 `Sun03Icon` / `Moon02Icon`，两个都渲染并叠在一起，用 `rotate-90 scale-0` ↔ `rotate-0 scale-100`
  加 `transition-all duration-300` 做交叉旋转，比直接换 DOM 好看得多。
- `aria-label` 写「切换到深色外观」/「切换到浅色外观」。
- next-themes 自带 localStorage 持久化（key `theme`）和跟随系统，**不要自己再写一套**。

---

## 4. 首页分类舞台（核心，做到位）

`components/stage/category-stage.tsx` + `category-stage-card.tsx` + `stage-indicator.tsx`

### 4.1 结构

```
section.relative.h-svh.overflow-hidden          舞台容器，[perspective:1800px]
└── div.absolute.inset-0.flex.items-center.justify-center
    └── 6 × CategoryStageCard（绝对定位、transform 定位）
├── 左右幽灵箭头（hover 舞台时淡入）
└── StageIndicator（底部居中）
```

卡片尺寸固定：`w-[520px] h-[600px]`（可调）。这是桌面端应用，不需要为手机重排舞台，
但窄于 900px 时把卡片宽度降到 `min(520px, 86vw)` 并隐藏 `|offset| >= 2` 的卡片。

### 4.2 变换公式（照抄）

`offset = index - activeIndex`，`w` = 卡片宽度：

| \|offset\| | translateX | scale | opacity | blur | rotateY | z-index | pointer-events |
| ---------- | ---------- | ----- | ------- | ---- | ------- | ------- | -------------- |
| 0          | 0          | 1     | 1       | 0    | 0       | 40      | auto           |
| 1          | ±0.80w     | 0.84  | 0.40    | 3px  | ∓7deg   | 30      | auto           |
| 2          | ±1.42w     | 0.70  | 0.14    | 6px  | ∓10deg  | 20      | none           |
| ≥3         | ±1.90w     | 0.62  | 0       | 8px  | ∓10deg  | 10      | none           |

符号：offset 为正（右侧）时 translateX 为正、rotateY 为负。
写成 `transform: translateX(...) scale(...) rotateY(...)`，配合容器的 `perspective`。

过渡：
`transition: transform var(--dur-stage) var(--ease-stage), opacity 480ms var(--ease-soft), filter 480ms var(--ease-soft)`。

**不循环**：`activeIndex` 夹在 `[0, 5]`。到边界继续滑动时，给舞台整体一个橡皮筋反馈
（`translateX(±10px)` 后 300ms 弹回），不要静默无响应。

首屏入场：6 张卡片按 `|offset|` 递增延迟（0 / 60 / 120ms）淡入并 `translateY(12px)→0`。

### 4.3 卡片内容

侧边卡片和中心卡片用**同一套 DOM**，靠 `opacity` 和 `blur` 区分 —— 这样切换时内容是连续的，
不会闪。只有 CTA 行在非激活时 `opacity-0`。

自上而下：

1. 顶行：`font-mono` 序号 `01`–`06`（`text-muted-foreground/70`）；右侧一个 `Badge variant="secondary"`
   写 `{count} 个站点`，数字 `tabular-nums`。
2. 分类图标：`size-11 rounded-2xl` 的浅色底座（`bg-muted`），内部 `size-5` 图标用强调色 `accentClasses[k].text`。
   图标映射（hugeicons，名称已核对，照抄）：

   | slug       | icon                   |
   | ---------- | ---------------------- |
   | `campus`   | `Building06Icon`       |
   | `learn`    | `Book02Icon`           |
   | `research` | `SearchVisualIcon`     |
   | `code`     | `SourceCodeIcon`       |
   | `tools`    | `Wrench01Icon`         |
   | `future`   | `GraduationScrollIcon` |

   下面这些图标名已逐个核对过确实存在于 `@hugeicons/core-free-icons`，可直接 import：
   `Building06Icon` `Book02Icon` `SearchVisualIcon` `SourceCodeIcon` `Wrench01Icon`
   `GraduationScrollIcon` `Home01Icon` `Sun03Icon` `Moon02Icon` `Search01Icon` `Search02Icon`
   `ArrowLeft01Icon` `ArrowRight01Icon` `ArrowUpRight01Icon` `Cancel01Icon` `CommandIcon`
   `Alert02Icon` `FileNotFoundIcon` `Idea01Icon` `LibraryIcon`。
   需要别的图标时，先 `ls node_modules/@hugeicons/core-free-icons/dist/types | grep -i <关键词>`
   确认名字 —— 名字写错会直接编译失败。
   用法：`<HugeiconsIcon icon={Book02Icon} className="size-5" strokeWidth={2} />`。

3. `nameEn` — 英文副标（mono 小字规格见 1.2）。
4. `name` — 大标题。
5. `tagline` — `text-[15px] text-muted-foreground leading-relaxed`。
6. 分隔线 `Separator className="opacity-60"`。
7. **代表站点列表**：取该分类前 5 条链接，每行一个 `<Favicon className="size-7">` 加站点标题
   （`truncate text-[13px]`），行间 `gap-2.5`；末尾补一行 `+{n} 个站点`。
   > 初版规范这里写的是叠压的 favicon 头像行。实际做出来发现 600px 高的卡片只有上半部分有内容，
   > CTA 下方空出近 200px，看起来像布局出错而不是留白。改成带名字的列表既填满了卡片，
   > 也真正告诉读者这个分类里装了什么。
8. 底部标签 chips：`category.tags.slice(0,4)`，`Badge variant="outline"` 风格，`text-[11px]`。
9. CTA：`进入分类` + `ArrowRight01Icon`，hover 时箭头 `translate-x-1`。仅激活卡片可见。

卡片外观：
`relative flex flex-col gap-5 rounded-4xl border border-border/70 bg-card p-8 surface-shadow overflow-hidden`
\+ 一层内部渐变 `absolute inset-0 bg-gradient-to-b {wash} to-transparent pointer-events-none`。
激活卡片 hover：`-translate-y-1` + 更强阴影 + 边框转强调色。

点击行为：非激活卡片 → 把它设为激活；激活卡片 → `navigate('#/c/'+slug)`。
用 `<button>` 包裹整卡以保证键盘可达，`aria-label` 写「进入 {name} 分类」。

### 4.4 交互（这一节是评分重点）

`hooks/use-stage-nav.ts`，导出 `useStageNav({ count, index, setIndex, enabled })`。

**滚轮 / 触控板** —— 触控板会连发几十个事件，必须做累积 + 冷却，否则一划过好几张：

**固定时长的冷却是挡不住触控板的**：一次滑动的惯性尾巴能持续一秒以上，冷却一过，
同一个手势就会再走一格。所以触发后直接「卸掉扳机」，只有当滚轮事件流真正静默之后才重新武装 ——
这样无论手势多长，一次滑动都只走一格。

同时鼠标滚轮要区别对待：滚轮是离散的（一格通常 ≥100px、间隔上百毫秒），
套用「等静默」那套会把连续拨轮吃掉，手感发木。所以大增量走单独的快速通道。

```
const THRESHOLD      = 42   // 触发一步的累积量
const REARM_IDLE_MS  = 160  // 滚轮静默这么久才重新武装（关键）
const NOTCH_DELTA    = 100  // 超过这个增量判定为鼠标滚轮的离散一格
const NOTCH_GAP_MS   = 220  // 两格之间的最小间隔，避免动画被打断
const IDLE_MS        = 180  // 未触发时清空累积

onWheel(e):
  if (!enabled) return
  e.preventDefault()                   // 阻止页面滚动，监听时必须 { passive: false }

  // 只要事件流还没断，就不断把「重新武装」往后推
  clearTimeout(rearmTimer)
  rearmTimer = setTimeout(() => { armed = true; acc = 0 }, REARM_IDLE_MS)

  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
  const isNotch = Math.abs(d) >= NOTCH_DELTA

  if (!armed) {
    // 惯性尾巴一律吞掉；但滚轮的离散大格应当继续响应
    if (!isNotch || now - lastStepAt < NOTCH_GAP_MS) { acc = 0; return }
    armed = true; acc = 0
  }

  acc += d
  clearTimeout(idleTimer); idleTimer = setTimeout(() => acc = 0, IDLE_MS)
  if (Math.abs(acc) >= THRESHOLD) {
    step(Math.sign(acc)); acc = 0; armed = false; lastStepAt = now
  }
```

监听挂在舞台 section 上，`addEventListener("wheel", handler, { passive: false })`
（React 的 `onWheel` 是 passive 的，`preventDefault` 会被警告，所以必须用 ref + 原生监听）。

**键盘**（挂 window，仅 stage 视图激活时生效）：

- `ArrowRight` / `ArrowDown` → 下一个；`ArrowLeft` / `ArrowUp` → 上一个
- `Home` / `End` → 首 / 末
- `1`–`6` → 直接跳到对应分类
- `Enter` / `Space` → 进入当前分类
- 输入框聚焦时（`input` / `textarea` / `contenteditable`）全部忽略；
  命令面板打开时全部忽略。注意别和 theme-provider 里的 `d` 键冲突。

**拖拽**：pointerdown 记起点，move 时舞台整体 `translateX(dx * 0.35)` 实时跟手（无 transition），
pointerup 时若 `|dx| > 60` 走一步，然后恢复 transition 归零。用 Pointer Events，一套代码覆盖鼠标和触屏。

### 4.5 指示器

`stage-indicator.tsx`：底部 `absolute bottom-10 left-1/2 -translate-x-1/2`，
`glass rounded-full border border-border/60 px-3 py-2` 里放 6 个点：
非激活 `size-1.5 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/60`，
激活变胶囊 `w-6 h-1.5 rounded-full` + `accentClasses[k].dot`，`transition-all duration-300`。
点可点击直达。右侧接一行提示：`滚动或 ← → 切换`（`font-mono text-[10px]`），一段时间后淡出（可调）。

---

## 5. 分类详情页

`components/category/category-detail.tsx`

- 顶部留白 `pt-28`（避开 header），主体 `mx-auto max-w-6xl px-6 pb-24`。
- **返回条**：`ArrowLeft01Icon` + 「图书馆」按钮（`variant="ghost"`），右边跟面包屑
  `图书馆 / {name}`，当前项 `text-foreground` 其余 `text-muted-foreground`。
  `Esc` 键也返回 `#/`。
- **标题区**：编号 + `nameEn`（mono 小字）；`name` 大标题；`description` 限宽 `max-w-2xl`；
  一行元信息：`{n} 个站点`、`{m} 个标签`，用 `·` 分隔。
- **分类横向切换条**：6 个分类的小 chip 一行（当前项高亮），点击直接换分类，
  不用先回首页。这是把「舞台」的连续感延续到详情页的关键，别省。
- **标签筛选**：`全部` + `category.tags`，`Badge` 做成可点 chip，单选。
  选中项 `bg-foreground text-background`，未选 `variant="outline"`。切换时列表用
  `animate-in fade-in-0 duration-200`。
- **链接网格**：`grid gap-4 sm:grid-cols-2 xl:grid-cols-3`。
- `?focus=<linkId>`：挂载后 `scrollIntoView({ block: "center" })`，
  并给该卡片加 2 秒的 `ring-2 ring-cat-*` 高亮然后淡出。
- **空状态**（筛选后无结果）：居中 `Idea01Icon` + 「这个标签下暂时没有站点」+ 「查看全部」按钮。

---

## 6. 链接卡片

`components/link-card.tsx`

整卡就是一个 `<a>`：`target="_blank"` `rel="noopener noreferrer"`。
类名：`group relative flex flex-col gap-3 rounded-3xl border border-border/70 bg-card p-5 transition-all duration-[var(--dur-micro)] hover:-translate-y-0.5 hover:surface-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`
\+ hover 时边框走该分类强调色 `accentClasses[k].ring`。

结构：

1. 顶行：`<Favicon>`（`size-10`）+ 右侧上方 `ArrowUpRight01Icon`
   （`size-4 text-muted-foreground/50 opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5`）。
2. 标题（规格见 1.2）。紧下面 host（`font-mono text-[11px] text-muted-foreground/70`），
   host 从 `new URL(url).hostname.replace(/^www\./, "")` 取。
3. 描述：`line-clamp-2`，`title` 属性给全文。
4. 底行：最多 3 个 tag chip；若 `campusOnly` 再加一个 `Badge variant="outline"` 写「校园网」
   （带 `Alert02Icon`，配 `Tooltip` 说明「需校园网或图书馆远程访问」）。

### Favicon 组件

`components/favicon.tsx`，`"use client"`：

- **经自家的 `/api/icon?host=<host>` 代理去取，不要在 `<img>` 里直连第三方图标服务。**
  原因是 `icons.duckduckgo.com` 对查不到的站点会返回「404 + 一张合法的 48×48 灰色占位图」，
  浏览器照样解码成功，于是 `onError` 永远不触发、monogram 兜底形同虚设，
  页面上会出现一排一模一样的灰圈（实测 49 个域名里有 9 个中招）。
  放到服务端（`app/api/icon/route.ts`）就能读到真实状态码：上游不 ok 就回 404，
  让 `<img>` 正常报错并走 monogram。顺带解决了国内直连该服务不稳的问题，也能加缓存。
  代理必须校验 host 在收录名单内，否则就成了任意 URL 转发器。
  注意前端传的 host 已去掉 `www.`，而图标服务认完整域名，映射表两边都要对上。
- **用原生 `<img>`，不要 `next/image`**（否则得配 `images.remotePatterns`，且这些图标本就不需要优化）。
  加 `loading="lazy" decoding="async" referrerPolicy="no-referrer" alt=""`。
  若 ESLint 的 `@next/next/no-img-element` 报错，就在该文件顶部加一行 `/* eslint-disable @next/next/no-img-element */`。
- **失败回退**：`onError` 置 state，改渲染字母 monogram —— 站点标题首个字符，
  中文站点会得到「网」「统」「本」这类单字图章，比 16px 的杂色小图标还好看。
  **另外必须在挂载后补查一次 `img.complete && img.naturalWidth === 0`**：
  首屏的 `<img>` 是服务端渲染的，浏览器在 hydration 之前就开始（并可能已经失败）加载，
  那次 error 事件没人监听，`onError` 永远不会被调用，图标会永久停留在破图状态。
  底色用该分类强调色的 12% 混色，`font-medium`。这就是本项目的「加载失败态」，必须实现。
- 外层统一 `rounded-2xl border border-border/60 bg-muted/40 p-1.5 grid place-items-center`，
  让不同尺寸、不同底色的 favicon 看起来整齐。

---

## 7. 概念词典 `#/glossary`

`components/glossary/glossary-view.tsx` + `term-card.tsx`

- 同样 `pt-28`，`mx-auto max-w-5xl px-6 pb-24`。
- 标题区：`GLOSSARY` mono 小字 + 「概念词典」大标题 + 一句说明
  （比如「16 个成电人天天挂在嘴边、却很少有人正式解释过的词」）+ `{n} 个词条`。
- **本地搜索框**：`<Input>` 配 `Search01Icon`，即时过滤 `term / en / alias / summary / keywords`。
  有输入时右侧出现清除按钮（`Cancel01Icon`）。
- **分组筛选**：`全部` + `glossaryGroups`（学业 / 升学 / 竞赛 / 校园 / 技术），单选 chip，
  每个后面带该组词条数（`tabular-nums`）。
- **词条列表**：`grid gap-4 md:grid-cols-2`，每项一张 `TermCard`。
- `TermCard`：
  - 收起态：`term` 大字 + `en`（mono 小字）+ `alias` chips + `summary`（2 行内）+ 分组 badge。
  - 点击展开（本地 state，或写入 `#/glossary?term=<id>` 以便分享，二者取其一，推荐后者）：
    `detail` 数组逐段渲染 `space-y-3 text-[13.5px] leading-relaxed text-muted-foreground`。
  - 展开动画：`grid-template-rows: 0fr → 1fr` 配 `transition-[grid-template-rows] duration-300`
    （比手算 max-height 稳）。
  - **相关链接**：`relatedLinkIds` 经 `linkById` 取出，渲染成一行小 chip
    （favicon 12px + 标题），点击 `navigate('#/c/'+categorySlug+'?focus='+id)`。
    这条跨视图跳转是词典的亮点，务必打通。
- **空状态**：搜索无结果时居中 `Search02Icon` + 「没有匹配的词条」+ 「清除筛选」按钮。

---

## 8. 全局搜索 `⌘K`

`components/command-palette.tsx`，基于已装的 `components/ui/command.tsx`（内部是 `cmdk`）。

- 由 `AppShell` 持有 `open` state，header 的搜索按钮和快捷键都改这一个 state。
- 快捷键：`⌘K` / `Ctrl+K` 开关；`/` 也可开（但在输入框里不响应）；`Esc` 关闭（`CommandDialog` 自带）。
- `CommandInput` placeholder：`搜索站点、分类或概念…`
- 分组顺序与标题：
  1. `分类`（6 条）— 图标 + 名称 + 右侧 `{n} 个站点`
  2. `站点`（49 条）— favicon + 标题 + 右侧 host
  3. `概念`（16 条）— `Idea01Icon` + 词条 + 右侧分组名
  4. `前往` — 「返回图书馆首页」、「打开概念词典」、「切换外观」
- **只在有查询时展示 `站点` 全量**；空查询时给一个精选默认列表
  （6 个分类 + 「打开概念词典」+ 4 个常用站点，比如教务系统、清水河畔、图书馆、Overleaf），
  避免一打开就是 71 行长列表。
- 匹配逻辑放 `lib/search.ts`：给每个条目预计算一个小写 `haystack`
  （`title + description + tags + host + keywords + alias`），
  用「查询按空格分词、每个词都要命中」的 AND 子串匹配。
  **给 `<Command>` 传 `shouldFilter={false}`，自己过滤**，因为 cmdk 默认的模糊打分对中文效果差。
- 选中行为：站点 → `window.open(url, "_blank", "noopener,noreferrer")`；
  分类 → `navigate('#/c/'+slug)`；概念 → `navigate('#/glossary?term='+id)`。选中后关闭面板。
- 底部状态条：`glass border-t border-border/60 px-3 py-2` 一行提示，
  `<Kbd>↵</Kbd> 打开` `<Kbd>↑↓</Kbd> 选择` `<Kbd>esc</Kbd> 关闭`，右侧显示结果数。
- **空状态**：`CommandEmpty` 里放 `Search02Icon` + 「没有找到「{query}」相关的内容」+
  一行建议（「试试搜索：教务、LaTeX、保研」，可点击直接填入）。

---

## 9. NotFound 视图

`components/not-found-view.tsx`：垂直居中，`FileNotFoundIcon`（`size-10 text-muted-foreground/50`）、
标题「这一页还没有被收录」、说明「地址 `{raw}` 不在馆藏里」（raw 用 `font-mono text-xs` 且 `break-all`）、
两个按钮：`回到图书馆`（primary）、`打开概念词典`（ghost）。

---

## 10. 文件清单

```
app/layout.tsx                          改：Inter → --font-inter；中文 metadata；lang="zh-CN"
app/page.tsx                            改：Server Component，只渲染 <AppShell />
app/globals.css                         改：字体栈、6 个 accent、cat-* 颜色、glass/surface-shadow、动效令牌、reduced-motion

components/app-shell.tsx                新：路由分发 + 命令面板 state + 氛围层
components/site-header.tsx              新
components/theme-toggle.tsx             新
components/command-palette.tsx          新
components/favicon.tsx                  新
components/link-card.tsx                新
components/not-found-view.tsx           新
components/stage/category-stage.tsx     新
components/stage/category-stage-card.tsx新
components/stage/stage-indicator.tsx    新
components/category/category-detail.tsx 新
components/glossary/glossary-view.tsx   新
components/glossary/term-card.tsx       新

hooks/use-hash-route.ts                 新
hooks/use-stage-nav.ts                  新
hooks/use-mounted.ts                    新（可选，给 theme-toggle 用）

lib/accents.ts                          新：AccentKey → 静态类名查表
lib/search.ts                           新：命令面板检索
lib/data/*                              已存在，只读
```

---

## 11. 元数据

`app/layout.tsx`：`<html lang="zh-CN">`，并导出

```ts
export const metadata: Metadata = {
  title: "UESTC Byte Lib · 成电人的电子图书馆",
  description:
    "6 个分类、49 个站外链接、16 个概念名词。把成电人真正用得上的网站和黑话收进一个轻量的电子图书馆。",
}
```

---

## 12. 验收标准

功能：

- [ ] 首页 6 张分类卡片，当前居中完整展开，左右相邻缩小 + 低透明度 + 轻微模糊露出
- [ ] 滚轮、触控板、`← →`、`1`–`6`、拖拽、指示器点击都能切换，且**触控板划一下只走一格**
- [ ] 滚轮切换时页面本身不滚动
- [ ] 点击激活卡片进入 `#/c/<slug>`；`Esc` 或返回按钮回首页
- [ ] 详情页链接卡片点击在新标签页打开，49 条链接全部可点
- [ ] `#/glossary` 直接输入地址可达，16 个词条可展开，相关链接 chip 能跳到对应分类并高亮
- [ ] `⌘K` / `Ctrl+K` 打开搜索，能搜到站点 / 分类 / 概念；中文和拼音关键词都能命中
- [ ] 主题按钮即时切换，刷新后保持；`localStorage` 清空后跟随系统
- [ ] 未知 hash 走 NotFound
- [ ] favicon 失败时显示 monogram 而不是破图
- [ ] 空状态：标签筛选无结果、词典搜索无结果、命令面板无结果，三处都有

质量：

- [ ] `pnpm typecheck` 零错误
- [ ] `pnpm lint` 零错误（警告尽量清零）
- [ ] `pnpm build` 成功
- [ ] `pnpm exec prettier --write "**/*.{ts,tsx,css}"` 跑过
- [ ] 明暗两个主题都检查过：暗色下 border 和玻璃层不能糊成一片
- [ ] 1440×900 与 1280×800 下不出现横向滚动条
- [ ] 控制台没有 hydration 警告、没有 React key 警告

---

## 13. 容易踩的坑

1. **Next.js 16 不是训练数据里的 Next.js。** 遇到 API 疑问先读 `node_modules/next/dist/docs/`。
   本项目是纯客户端 SPA，用不到 async `params`、`cacheComponents` 那些，但别自作主张改 `next.config.ts`。
2. **`next lint` 已被移除。** 用 `pnpm lint`（即 `eslint`）。
3. **组件库是 Base UI，不是 Radix。** 不要 `import ... from "@radix-ui/..."`，也不要装 Radix 包。
   需要的 UI 组件都已在 `components/ui/`，直接用。
4. **Tailwind 类名不能拼接。** 一律走 `lib/accents.ts` 的静态查表。
5. **`preventDefault` 需要非 passive 监听。** 滚轮必须 `ref` + `addEventListener(..., { passive: false })`。
6. **`useTheme` 必须等 mount。** 否则必然 hydration mismatch。
7. **hash 首次渲染不要读 `window`。** 先返回 stage，`useEffect` 里再同步。
8. **不要新增依赖。** 现有 `package.json` 足够（`cmdk` 随 command 组件已装）。
   特别是不要引入 framer-motion、pinyin-pro、lucide-react。
9. **不要改 `lib/data/**` 的内容。** URL 和文案都是逐条核对过的。
10. 数字务必 `tabular-nums`，否则切换分类时计数会跳动。
11. **开发服务器如果绑 `--hostname 0.0.0.0`，Next 16 会把 `127.0.0.1` 当成跨源开发主机，
    对 `/_next` 下的所有静态 chunk 返回 403。** 结果是客户端 JS 一个都加载不到，
    页面看着正常但完全没有交互（键盘失灵、滚轮变成翻页、主题按钮因为等 mount 而一直是空占位）。
    症状很容易被误判成「代码写错了」。已在 `next.config.ts` 里配 `allowedDevOrigins` 解决。
12. **`<img>` 的 `onError` 在 SSR 首屏会漏事件**，见 §6 的 Favicon 说明。
    凡是「服务端渲染 + 依赖 error/load 事件」的场景都要在 `useEffect` 里补查一次真实状态。
