#!/usr/bin/env node
/**
 * 从 UESTC Byte Lib 知识空间同步前台目录。
 *
 * 口径：
 * - 一级节点 = 学院 / 分组，只当分类
 * - 二级节点 = 课程文档，写入网站
 * - 空标题二级页跳过
 * - 一级叶子（欢迎页、备份说明等）不上架
 *
 * 认证优先级：
 * 1. 本机 lark-cli（默认 --as user，可用 LARK_CLI_AS 覆盖）
 * 2. FEISHU_TENANT_ACCESS_TOKEN
 * 3. FEISHU_APP_ID + FEISHU_APP_SECRET（换 tenant_access_token）
 *
 * 没有可用凭证时：若已有 catalog.json 且未设 CATALOG_SYNC_REQUIRED=1，则沿用旧文件并警告。
 */

import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const OUT_FILE = join(ROOT, "lib/data/catalog.json")

const SPACE_ID = process.env.WIKI_SPACE_ID || "7411795208001175556"
const SPACE_NAME = "UESTC Byte Lib"
const WELCOME_URL =
  process.env.WIKI_WELCOME_URL ||
  "https://my.feishu.cn/wiki/AatBwiDa7ig7RJkzdlocLm1cnTh"
const WIKI_URL_BASE = "https://my.feishu.cn/wiki/"
const OPEN_API = "https://open.feishu.cn/open-apis"

const COLLEGE_SLUGS = {
  公共必修课: "general",
  计算机学院: "cs",
  医学院: "medicine",
  软件学院: "software",
  格拉斯哥: "glasgow",
  自动化学院: "automation",
  "电子&集电": "microelectronics",
  信通学院: "infocomm",
  光电学院: "optoelectronics",
  经管学院: "management",
  Others: "others",
  生命学院: "life",
}

const args = new Set(process.argv.slice(2))
const allowStale =
  args.has("--allow-stale") || process.env.CATALOG_ALLOW_STALE === "1"
const syncRequired =
  args.has("--require") || process.env.CATALOG_SYNC_REQUIRED === "1"

function log(message) {
  process.stderr.write(`${message}\n`)
}

function fail(message, code = 1) {
  log(`sync-wiki: ${message}`)
  process.exit(code)
}

function slugForCollege(name) {
  if (COLLEGE_SLUGS[name]) return COLLEGE_SLUGS[name]
  const hash = createHash("sha1").update(name).digest("hex").slice(0, 8)
  return `college-${hash}`
}

function wikiUrl(nodeToken) {
  return `${WIKI_URL_BASE}${nodeToken}`
}

function resolveLarkBin() {
  if (process.env.LARK_CLI) return process.env.LARK_CLI
  const local = join(ROOT, "node_modules/.bin/lark-cli")
  if (existsSync(local)) return local
  const which = spawnSync("which", ["lark-cli"], { encoding: "utf8" })
  if (which.status === 0) return which.stdout.trim()
  return null
}

function runLark(bin, argv) {
  const result = spawnSync(bin, argv, {
    encoding: "utf8",
    env: {
      ...process.env,
      LARKSUITE_CLI_NO_UPDATE_NOTIFIER: "1",
      LARKSUITE_CLI_NO_SKILLS_NOTIFIER: "1",
    },
  })
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim()
    throw new Error(detail || `lark-cli exited ${result.status}`)
  }
  return JSON.parse(result.stdout)
}

function larkReadyIdentity(bin) {
  const forced = process.env.LARK_CLI_AS
  if (forced === "user" || forced === "bot") return forced
  try {
    const me = runLark(bin, ["whoami"])
    if (me.available && me.tokenStatus === "ready" && me.identity) {
      return me.identity
    }
  } catch {
    // fall through
  }
  return null
}

async function feishuFetch(path, token, { method = "GET", query, body } = {}) {
  const url = new URL(`${OPEN_API}${path}`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== "") url.searchParams.set(key, value)
    }
  }
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await response.json()
  if (!response.ok || json.code) {
    throw new Error(
      `Feishu API ${path} failed: HTTP ${response.status} code=${json.code ?? "?"} ${json.msg ?? json.message ?? ""}`.trim()
    )
  }
  return json.data
}

async function tenantAccessToken() {
  if (process.env.FEISHU_TENANT_ACCESS_TOKEN) {
    return process.env.FEISHU_TENANT_ACCESS_TOKEN
  }
  const appId = process.env.FEISHU_APP_ID
  const appSecret = process.env.FEISHU_APP_SECRET
  if (!appId || !appSecret) return null
  const response = await fetch(`${OPEN_API}/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  })
  const json = await response.json()
  if (!json.tenant_access_token) {
    throw new Error(`tenant_access_token failed: ${json.msg || json.code || "unknown"}`)
  }
  return json.tenant_access_token
}

function listNodesWithCli(bin, identity, parentNodeToken) {
  const argv = [
    "wiki",
    "+node-list",
    "--space-id",
    SPACE_ID,
    "--as",
    identity,
    "--page-all",
    "--page-limit",
    "0",
    "--format",
    "json",
  ]
  if (parentNodeToken) argv.push("--parent-node-token", parentNodeToken)
  const payload = runLark(bin, argv)
  if (payload.ok === false) {
    throw new Error(payload.error?.message || "lark-cli wiki +node-list failed")
  }
  return payload.data?.nodes ?? []
}

async function listNodesWithApi(token, parentNodeToken) {
  const items = []
  let pageToken = ""
  do {
    const data = await feishuFetch(`/wiki/v2/spaces/${SPACE_ID}/nodes`, token, {
      query: {
        parent_node_token: parentNodeToken || undefined,
        page_size: "50",
        page_token: pageToken || undefined,
      },
    })
    items.push(...(data.items ?? data.nodes ?? []))
    pageToken = data.has_more ? data.page_token || "" : ""
  } while (pageToken)
  return items
}

async function resolveSource() {
  const bin = resolveLarkBin()
  if (bin) {
    const identity = larkReadyIdentity(bin)
    if (identity) {
      log(`sync-wiki: using lark-cli (${bin}) as ${identity}`)
      return {
        identity: `lark-cli:${identity}`,
        listNodes: (parent) => listNodesWithCli(bin, identity, parent),
      }
    }
    log("sync-wiki: lark-cli found but identity is not ready")
  }

  const token = await tenantAccessToken()
  if (token) {
    log("sync-wiki: using Feishu OpenAPI tenant_access_token")
    return {
      identity: "openapi:bot",
      listNodes: (parent) => listNodesWithApi(token, parent),
    }
  }

  return null
}

function keepExistingCatalog(reason) {
  if (!existsSync(OUT_FILE)) {
    fail(`${reason}，且 ${OUT_FILE} 不存在，无法继续构建`)
  }
  if (syncRequired && !allowStale) {
    fail(`${reason}。已设置 CATALOG_SYNC_REQUIRED=1，拒绝使用旧目录`)
  }
  const current = JSON.parse(readFileSync(OUT_FILE, "utf8"))
  log(
    `sync-wiki: ${reason}；沿用已提交的 catalog.json（${current.stats?.docCount ?? "?"} 篇，syncedAt=${current.source?.syncedAt ?? "unknown"}）`
  )
}

function buildCatalog(roots, childrenByParent, identity) {
  const colleges = []
  const docs = []
  let skippedUntitled = 0

  for (const root of roots) {
    if (!root.has_child) continue
    const children = childrenByParent.get(root.node_token) ?? []
    const titled = []
    for (const child of children) {
      const title = (child.title || "").trim()
      if (!title) {
        skippedUntitled += 1
        continue
      }
      titled.push(child)
    }
    if (titled.length === 0) continue

    const name = (root.title || "").trim() || "未分组"
    const slug = slugForCollege(name)
    const college = {
      id: root.node_token,
      slug,
      name,
      nodeToken: root.node_token,
    }
    colleges.push(college)

    for (const child of titled) {
      docs.push({
        id: child.node_token,
        title: (child.title || "").trim(),
        collegeId: college.id,
        collegeSlug: college.slug,
        collegeName: college.name,
        wikiUrl: wikiUrl(child.node_token),
        nodeToken: child.node_token,
        objToken: child.obj_token || "",
        objType: child.obj_type || "docx",
      })
    }
  }

  return {
    source: {
      spaceId: SPACE_ID,
      spaceName: SPACE_NAME,
      welcomeUrl: WELCOME_URL,
      syncedAt: new Date().toISOString(),
      identity,
    },
    colleges,
    docs,
    stats: {
      collegeCount: colleges.length,
      docCount: docs.length,
      skippedUntitled,
    },
  }
}

function writeCatalog(catalog) {
  writeFileSync(OUT_FILE, `${JSON.stringify(catalog, null, 2)}\n`, "utf8")
  log(
    `sync-wiki: wrote ${OUT_FILE} (${catalog.stats.collegeCount} 个学院，${catalog.stats.docCount} 篇文档，跳过空标题 ${catalog.stats.skippedUntitled})`
  )
}

async function main() {
  const source = await resolveSource()
  if (!source) {
    keepExistingCatalog("没有可用的飞书凭证（lark-cli / FEISHU_APP_ID+FEISHU_APP_SECRET）")
    return
  }

  const roots = await source.listNodes()
  const childrenByParent = new Map()
  for (const root of roots) {
    if (!root.has_child) continue
    childrenByParent.set(root.node_token, await source.listNodes(root.node_token))
  }

  const catalog = buildCatalog(roots, childrenByParent, source.identity)
  if (catalog.docs.length === 0) {
    fail("同步成功但没有可用的二级文档，请检查知识空间结构或权限")
  }
  writeCatalog(catalog)
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  if (existsSync(OUT_FILE) && allowStale && !syncRequired) {
    log(`sync-wiki: ${message}`)
    keepExistingCatalog("同步失败")
    return
  }
  fail(message)
})
