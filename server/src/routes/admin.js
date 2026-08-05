// 后台 API：单管理员 session 鉴权 + 内容 CRUD（ADR-0003）
import { Router } from 'express'
import { randomBytes } from 'node:crypto'
import { db, LOCALES, DEFAULT_LOCALE } from '../db.js'
import { verifyPassword } from '../lib/passwords.js'
import { COLLECTIONS } from '../lib/content.js'
import { getCosConfig, saveCosConfig, getSignedUploadUrl, buildUploadKey } from '../lib/storage.js'

export const adminRouter = Router()

const SESSION_COOKIE = 'portal_admin'
const SESSION_TTL_MS = 7 * 24 * 3600 * 1000

function parseCookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie ?? '').split(';').map((p) => p.trim().split('=')).filter((p) => p.length === 2),
  )
}

function validSession(token) {
  if (!token) return false
  const row = db.prepare('SELECT expires_at FROM sessions WHERE token = ?').get(token)
  if (!row) return false
  if (row.expires_at < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token)
    return false
  }
  return true
}

function requireAuth(req, res, next) {
  if (validSession(parseCookies(req)[SESSION_COOKIE])) return next()
  res.status(401).json({ message: '未登录或会话已过期' })
}

adminRouter.post('/login', (req, res) => {
  const { username, password } = req.body ?? {}
  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(String(username ?? ''))
  if (!user || !verifyPassword(String(password ?? ''), user.password_hash)) {
    return res.status(401).json({ message: '账号或密码错误' })
  }
  const token = randomBytes(32).toString('hex')
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now())
  db.prepare('INSERT INTO sessions (token, expires_at) VALUES (?, ?)').run(token, Date.now() + SESSION_TTL_MS)
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_MS / 1000}`)
  res.json({ username: user.username })
})

adminRouter.post('/logout', (req, res) => {
  const token = parseCookies(req)[SESSION_COOKIE]
  if (token) db.prepare('DELETE FROM sessions WHERE token = ?').run(token)
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; Max-Age=0`)
  res.json({ ok: true })
})

adminRouter.get('/me', requireAuth, (req, res) => res.json({ ok: true }))

adminRouter.use(requireAuth)

// ---- 集合 CRUD（business / services / cases）----

const collOf = (req) => COLLECTIONS[req.params.coll]

function adminList(cfg) {
  const items = db.prepare(`SELECT * FROM ${cfg.table} ORDER BY sort, id`).all()
  const zhStmt = db.prepare(`SELECT payload FROM ${cfg.i18nTable} WHERE ${cfg.idCol} = ? AND locale = '${DEFAULT_LOCALE}'`)
  return items.map((it) => {
    let name = ''
    try { name = JSON.parse(zhStmt.get(it.id)?.payload ?? '{}').name ?? JSON.parse(zhStmt.get(it.id)?.payload ?? '{}').title ?? '' } catch { /* 忽略坏行 */ }
    return {
      id: it.id, slug: it.slug, sort: it.sort, visible: !!it.visible,
      media: it[cfg.mediaKey] ?? null, video: it.video ?? null, videoAutoplay: !!it.video_autoplay,
      name,
    }
  })
}

function adminGet(cfg, id) {
  const row = db.prepare(`SELECT * FROM ${cfg.table} WHERE id = ?`).get(id)
  if (!row) return null
  const rows = db.prepare(`SELECT locale, payload FROM ${cfg.i18nTable} WHERE ${cfg.idCol} = ?`).all(id)
  const i18n = Object.fromEntries(rows.map((r) => [r.locale, JSON.parse(r.payload)]))
  return {
    id: row.id, slug: row.slug, sort: row.sort, visible: !!row.visible,
    media: row[cfg.mediaKey] ?? null, video: row.video ?? null, videoAutoplay: !!row.video_autoplay,
    i18n,
  }
}

const SLUG_RE = /^[\w-]{1,100}$/

adminRouter.get('/collections/:coll', (req, res) => {
  const cfg = collOf(req)
  cfg ? res.json(adminList(cfg)) : res.status(404).json({ message: '未知集合' })
})

adminRouter.post('/collections/:coll', (req, res) => {
  const cfg = collOf(req)
  if (!cfg) return res.status(404).json({ message: '未知集合' })
  const { slug, media, video, videoAutoplay, i18n } = req.body ?? {}
  if (!SLUG_RE.test(String(slug ?? ''))) return res.status(400).json({ message: 'slug 必填且仅限字母数字中划线' })
  if (db.prepare(`SELECT 1 FROM ${cfg.table} WHERE slug = ?`).get(slug)) {
    return res.status(409).json({ message: 'slug 已存在' })
  }
  const maxSort = db.prepare(`SELECT COALESCE(MAX(sort), -1) AS m FROM ${cfg.table}`).get().m
  const tx = db.transaction(() => {
    const id = db.prepare(`INSERT INTO ${cfg.table} (slug, sort, visible, ${cfg.mediaKey}, video, video_autoplay) VALUES (?, ?, 1, ?, ?, ?)`)
      .run(slug, maxSort + 1, media ?? null, video ?? null, videoAutoplay ? 1 : 0).lastInsertRowid
    const stmt = db.prepare(`INSERT INTO ${cfg.i18nTable} (${cfg.idCol}, locale, payload) VALUES (?, ?, ?)`)
    for (const loc of LOCALES) stmt.run(id, loc, JSON.stringify(i18n?.[loc] ?? {}))
    return id
  })
  res.status(201).json(adminGet(cfg, tx()))
})

adminRouter.get('/collections/:coll/:id', (req, res) => {
  const cfg = collOf(req)
  const item = cfg && adminGet(cfg, req.params.id)
  item ? res.json(item) : res.status(404).json({ message: '不存在' })
})

adminRouter.put('/collections/:coll/:id', (req, res) => {
  const cfg = collOf(req)
  if (!cfg) return res.status(404).json({ message: '未知集合' })
  const row = db.prepare(`SELECT * FROM ${cfg.table} WHERE id = ?`).get(req.params.id)
  if (!row) return res.status(404).json({ message: '不存在' })
  const { slug, media, video, videoAutoplay, i18n } = req.body ?? {}
  if (slug != null && !SLUG_RE.test(String(slug))) return res.status(400).json({ message: 'slug 仅限字母数字中划线' })
  if (slug && slug !== row.slug && db.prepare(`SELECT 1 FROM ${cfg.table} WHERE slug = ?`).get(slug)) {
    return res.status(409).json({ message: 'slug 已存在' })
  }
  const tx = db.transaction(() => {
    db.prepare(`UPDATE ${cfg.table} SET slug = ?, ${cfg.mediaKey} = ?, video = ?, video_autoplay = ? WHERE id = ?`)
      .run(slug ?? row.slug, media ?? row[cfg.mediaKey], video ?? row.video ?? null, videoAutoplay ? 1 : (videoAutoplay === false ? 0 : row.video_autoplay), row.id)
    const stmt = db.prepare(`INSERT INTO ${cfg.i18nTable} (${cfg.idCol}, locale, payload) VALUES (?, ?, ?) ON CONFLICT(${cfg.idCol}, locale) DO UPDATE SET payload = excluded.payload`)
    for (const loc of LOCALES) {
      if (i18n?.[loc] != null) stmt.run(row.id, loc, JSON.stringify(i18n[loc]))
    }
  })
  tx()
  res.json(adminGet(cfg, row.id))
})

adminRouter.delete('/collections/:coll/:id', (req, res) => {
  const cfg = collOf(req)
  if (!cfg) return res.status(404).json({ message: '未知集合' })
  const info = db.prepare(`DELETE FROM ${cfg.table} WHERE id = ?`).run(req.params.id)
  info.changes ? res.json({ ok: true }) : res.status(404).json({ message: '不存在' })
})

adminRouter.patch('/collections/:coll/:id/visibility', (req, res) => {
  const cfg = collOf(req)
  if (!cfg) return res.status(404).json({ message: '未知集合' })
  const info = db.prepare(`UPDATE ${cfg.table} SET visible = ? WHERE id = ?`).run(req.body?.visible ? 1 : 0, req.params.id)
  info.changes ? res.json({ ok: true }) : res.status(404).json({ message: '不存在' })
})

adminRouter.put('/collections/:coll/order', (req, res) => {
  const cfg = collOf(req)
  if (!cfg) return res.status(404).json({ message: '未知集合' })
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : []
  const stmt = db.prepare(`UPDATE ${cfg.table} SET sort = ? WHERE id = ?`)
  db.transaction(() => ids.forEach((id, i) => stmt.run(i, id)))()
  res.json({ ok: true })
})

// ---- 单实例 ----

const SINGLETON_KEYS = ['home', 'about.profile', 'about.organization', 'about.history', 'site', 'seo.pages']

function normalizeSharedSiteFields(body) {
  const zhCompany = body?.zh?.company ?? {}
  const enCompany = body?.en?.company ?? {}
  const hasZhLogo = Object.prototype.hasOwnProperty.call(zhCompany, 'logo')
  const hasEnLogo = Object.prototype.hasOwnProperty.call(enCompany, 'logo')
  if (!hasZhLogo && !hasEnLogo) return body
  const logo = hasZhLogo ? zhCompany.logo : enCompany.logo
  return {
    ...body,
    zh: { ...(body.zh ?? {}), company: { ...zhCompany, logo: logo || null } },
    en: { ...(body.en ?? {}), company: { ...enCompany, logo: logo || null } },
  }
}

adminRouter.get('/singletons/:key', (req, res) => {
  if (!SINGLETON_KEYS.includes(req.params.key)) return res.status(404).json({ message: '未知单实例' })
  const rows = db.prepare('SELECT locale, payload FROM singletons_i18n WHERE key = ?').all(req.params.key)
  res.json(Object.fromEntries(rows.map((r) => [r.locale, JSON.parse(r.payload)])))
})

adminRouter.put('/singletons/:key', (req, res) => {
  if (!SINGLETON_KEYS.includes(req.params.key)) return res.status(404).json({ message: '未知单实例' })
  const body = req.params.key === 'site' ? normalizeSharedSiteFields(req.body ?? {}) : (req.body ?? {})
  db.prepare('INSERT OR IGNORE INTO singletons (key) VALUES (?)').run(req.params.key)
  const stmt = db.prepare('INSERT INTO singletons_i18n (key, locale, payload) VALUES (?, ?, ?) ON CONFLICT(key, locale) DO UPDATE SET payload = excluded.payload')
  const tx = db.transaction(() => {
    for (const loc of LOCALES) {
      if (body[loc] != null) stmt.run(req.params.key, loc, JSON.stringify(body[loc]))
    }
  })
  tx()
  res.json({ ok: true })
})

// ---- 导航 ----

function navTree() {
  const itemRows = db.prepare('SELECT * FROM nav_items ORDER BY sort, id').all()
  const labelRows = db.prepare('SELECT * FROM nav_items_i18n').all()
  const labels = new Map()
  for (const l of labelRows) {
    if (!labels.has(l.nav_item_id)) labels.set(l.nav_item_id, {})
    labels.get(l.nav_item_id)[l.locale] = l.label
  }
  const nodeOf = (r) => ({
    id: r.id, path: r.path, visible: !!r.visible, autoSource: r.auto_source ?? null,
    labels: labels.get(r.id) ?? {}, children: [],
  })
  const byId = new Map(itemRows.map((r) => [r.id, nodeOf(r)]))
  const tree = []
  for (const r of itemRows) {
    const node = byId.get(r.id)
    r.parent_id && byId.has(r.parent_id) ? byId.get(r.parent_id).children.push(node) : tree.push(node)
  }
  return tree
}

adminRouter.get('/nav', (req, res) => res.json(navTree()))

adminRouter.put('/nav', (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : []
  const insertItem = db.prepare('INSERT INTO nav_items (parent_id, path, sort, visible, auto_source) VALUES (?, ?, ?, ?, ?)')
  const insertLabel = db.prepare('INSERT INTO nav_items_i18n (nav_item_id, locale, label) VALUES (?, ?, ?)')
  const tx = db.transaction(() => {
    db.prepare('DELETE FROM nav_items').run()
    const walk = (nodes, parentId) => {
      nodes.forEach((n, i) => {
        const auto = ['business', 'services'].includes(n.autoSource) ? n.autoSource : null
        const id = insertItem.run(parentId, String(n.path ?? ''), i, n.visible === false ? 0 : 1, auto).lastInsertRowid
        for (const loc of LOCALES) insertLabel.run(id, loc, String(n.labels?.[loc] ?? ''))
        if (Array.isArray(n.children)) walk(n.children, id)
      })
    }
    walk(items, null)
  })
  tx()
  res.json(navTree())
})

// ---- 板块显隐 ----

adminRouter.get('/visibility', (req, res) => {
  const rows = db.prepare('SELECT key, visible FROM visibility').all()
  res.json(Object.fromEntries(rows.map((r) => [r.key, !!r.visible])))
})

adminRouter.put('/visibility', (req, res) => {
  const entries = Object.entries(req.body ?? {})
  const stmt = db.prepare('INSERT INTO visibility (key, visible) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET visible = excluded.visible')
  db.transaction(() => {
    for (const [k, v] of entries) stmt.run(k, v ? 1 : 0)
  })()
  res.json({ ok: true })
})

// ---- 线索 ----

adminRouter.get('/leads', (req, res) => {
  const { q, handled, from, to } = req.query
  const conds = []
  const params = []
  if (q && String(q).trim()) {
    const kw = `%${String(q).trim().replace(/[%_\\]/g, (c) => `\\${c}`)}%`
    conds.push("(name LIKE ? ESCAPE '\\' OR contact LIKE ? ESCAPE '\\' OR content LIKE ? ESCAPE '\\')")
    params.push(kw, kw, kw)
  }
  if (handled === 'true' || handled === 'false') {
    conds.push('handled = ?')
    params.push(handled === 'true' ? 1 : 0)
  }
  if (from && !Number.isNaN(Date.parse(from))) {
    conds.push('created_at >= ?')
    params.push(new Date(from).toISOString())
  }
  if (to && !Number.isNaN(Date.parse(to))) {
    conds.push('created_at <= ?')
    params.push(new Date(to).toISOString())
  }
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 500, 1), 10000)
  const sql = `SELECT * FROM leads ${conds.length ? `WHERE ${conds.join(' AND ')} ` : ''}ORDER BY handled, id DESC LIMIT ?`
  const rows = db.prepare(sql).all(...params, limit)
  res.json(rows.map((r) => ({ ...r, handled: !!r.handled })))
})

adminRouter.patch('/leads/:id', (req, res) => {
  const info = db.prepare('UPDATE leads SET handled = ? WHERE id = ?').run(req.body?.handled ? 1 : 0, req.params.id)
  info.changes ? res.json({ ok: true }) : res.status(404).json({ message: '不存在' })
})

adminRouter.delete('/leads/:id', (req, res) => {
  const info = db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id)
  info.changes ? res.json({ ok: true }) : res.status(404).json({ message: '不存在' })
})

// ---- 系统设置 ----

adminRouter.get('/settings/cos', (req, res) => res.json(getCosConfig({ mask: true })))
adminRouter.put('/settings/cos', (req, res) => res.json(saveCosConfig(req.body ?? {})))

adminRouter.get('/settings/locales', (req, res) => {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'enabledLocales'").get()
  res.json({ enabledLocales: JSON.parse(row?.value ?? '["zh","en"]') })
})
adminRouter.put('/settings/locales', (req, res) => {
  const list = Array.isArray(req.body?.enabledLocales) ? req.body.enabledLocales.filter((l) => LOCALES.includes(l)) : []
  if (!list.includes(DEFAULT_LOCALE)) list.unshift(DEFAULT_LOCALE)
  db.prepare("INSERT INTO settings (key, value) VALUES ('enabledLocales', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
    .run(JSON.stringify(list))
  res.json({ enabledLocales: list })
})

// ---- 上传（前端直传 COS：后端发预签名 URL，前端 PUT 到 COS，后端只存 URL）----

const MAX_UPLOAD_SIZE = 1024 * 1024 * 1024 // 1GB

adminRouter.post('/upload/sign', (req, res) => {
  const { filename, contentType, size } = req.body || {}
  if (!filename || !contentType) {
    return res.status(400).json({ message: '缺少 filename 或 contentType' })
  }
  if (!/^(image|video)\//.test(contentType)) {
    return res.status(400).json({ message: '仅支持图片或视频文件' })
  }
  if (typeof size === 'number' && size > MAX_UPLOAD_SIZE) {
    return res.status(400).json({ message: '文件大小不能超过 1GB' })
  }
  try {
    const key = buildUploadKey(filename)
    const { uploadUrl, publicUrl } = getSignedUploadUrl({ key, contentType })
    res.json({ uploadUrl, publicUrl, key })
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})
