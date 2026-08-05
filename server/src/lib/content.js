// 内容读取共享层：本地化解析（zh 回退）、显隐、导航树、单实例
import { db, DEFAULT_LOCALE } from '../db.js'

function hasContent(v) {
  if (v == null) return false
  if (Array.isArray(v)) return v.length > 0
  if (typeof v === 'object') return Object.keys(v).length > 0
  return true
}

function parsePayload(rows) {
  return rows.map((r) => ({ locale: r.locale, payload: JSON.parse(r.payload) }))
}

export function resolveLocalized(rows, locale) {
  const byLoc = new Map(parsePayload(rows).map((r) => [r.locale, r.payload]))
  const localized = byLoc.get(locale)
  if (hasContent(localized)) return localized
  if (locale !== DEFAULT_LOCALE) {
    const fallback = byLoc.get(DEFAULT_LOCALE)
    if (hasContent(fallback)) return fallback
  }
  return localized ?? null
}

export const COLLECTIONS = {
  business: { table: 'businesses', i18nTable: 'businesses_i18n', idCol: 'business_id', mediaKey: 'image', kind: 'business', urlBase: '/business' },
  services: { table: 'services', i18nTable: 'services_i18n', idCol: 'service_id', mediaKey: 'image', kind: 'services', urlBase: '/services' },
  cases: { table: 'cases', i18nTable: 'cases_i18n', idCol: 'case_id', mediaKey: 'cover', kind: null, urlBase: '/cases' },
}

export function listCollection(cfg, locale, { includeHidden = false } = {}) {
  const items = db.prepare(`SELECT * FROM ${cfg.table} ${includeHidden ? '' : 'WHERE visible = 1'} ORDER BY sort, id`).all()
  const stmt = db.prepare(`SELECT locale, payload FROM ${cfg.i18nTable} WHERE ${cfg.idCol} = ?`)
  return items
    .map((it) => {
      const payload = resolveLocalized(stmt.all(it.id), locale)
      if (!payload) return null
      const merged = {
        slug: it.slug,
        ...payload,
        [cfg.mediaKey]: it[cfg.mediaKey] ?? null,
        video: it.video ?? null,
        videoAutoplay: !!it.video_autoplay,
      }
      if (cfg.kind) merged.kind = cfg.kind
      if (includeHidden) {
        merged.id = it.id
        merged.visible = !!it.visible
        merged.sort = it.sort
      }
      return merged
    })
    .filter(Boolean)
}

export function getCollectionItem(cfg, slug, locale, { includeHidden = false } = {}) {
  const row = db.prepare(`SELECT * FROM ${cfg.table} WHERE slug = ? ${includeHidden ? '' : 'AND visible = 1'}`).get(slug)
  if (!row) return null
  const rows = db.prepare(`SELECT locale, payload FROM ${cfg.i18nTable} WHERE ${cfg.idCol} = ?`).all(row.id)
  const payload = resolveLocalized(rows, locale)
  if (!payload) return null
  const merged = {
    slug: row.slug,
    ...payload,
    [cfg.mediaKey]: row[cfg.mediaKey] ?? null,
    video: row.video ?? null,
    videoAutoplay: !!row.video_autoplay,
  }
  if (cfg.kind) merged.kind = cfg.kind
  return merged
}

export function getSingleton(key, locale) {
  const rows = db.prepare('SELECT locale, payload FROM singletons_i18n WHERE key = ?').all(key)
  return resolveLocalized(rows, locale)
}

export function visibilityMap() {
  const rows = db.prepare('SELECT key, visible FROM visibility').all()
  return Object.fromEntries(rows.map((r) => [r.key, !!r.visible]))
}

export function enabledLocales() {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'enabledLocales'").get()
  try {
    const v = JSON.parse(row?.value ?? '["zh","en"]')
    return Array.isArray(v) && v.length ? v : [DEFAULT_LOCALE]
  } catch {
    return [DEFAULT_LOCALE]
  }
}

const CHANNEL_FIELDS = {
  'channel.phone': ['phone', 'phoneRaw'],
  'channel.wechat': ['wechat'],
  'channel.qq': ['qq'],
}

export function applyChannelVisibility(company, vis) {
  const out = { ...company }
  for (const [key, fields] of Object.entries(CHANNEL_FIELDS)) {
    if (vis[key] === false) for (const f of fields) delete out[f]
  }
  return out
}

function localizedLabel(itemId, locale) {
  const rows = db.prepare('SELECT locale, label FROM nav_items_i18n WHERE nav_item_id = ?').all(itemId)
  const byLoc = new Map(rows.map((r) => [r.locale, r.label]))
  return byLoc.get(locale) || byLoc.get(DEFAULT_LOCALE) || ''
}

export function publicNav(locale) {
  const tops = db.prepare('SELECT * FROM nav_items WHERE parent_id IS NULL AND visible = 1 ORDER BY sort, id').all()
  const childStmt = db.prepare('SELECT * FROM nav_items WHERE parent_id = ? AND visible = 1 ORDER BY sort, id')
  return tops.map((t) => {
    const node = { label: localizedLabel(t.id, locale), path: t.path }
    if (t.auto_source) {
      const cfg = COLLECTIONS[t.auto_source]
      const items = listCollection(cfg, locale)
      node.children = items.map((it) => ({ label: it.name ?? it.title ?? '', path: `${cfg.urlBase}/${it.slug}` }))
    } else {
      const children = childStmt.all(t.id)
      if (children.length) {
        node.children = children.map((c) => ({ label: localizedLabel(c.id, locale), path: c.path }))
      }
    }
    return node
  })
}

export const HOME_SECTION_KEYS = ['hero', 'stats', 'aboutTeaser', 'advantages', 'process']

export function publicSiteConfig(locale) {
  const site = getSingleton('site', locale) ?? {}
  const defaultSite = locale === DEFAULT_LOCALE ? site : (getSingleton('site', DEFAULT_LOCALE) ?? {})
  const logo = site.company?.logo || defaultSite.company?.logo || null
  const vis = visibilityMap()
  return {
    ...site,
    company: applyChannelVisibility({ ...(site.company ?? {}), logo }, vis),
    nav: publicNav(locale),
    enabledLocales: enabledLocales(),
    visibility: vis,
  }
}

export function publicHome(locale) {
  const home = getSingleton('home', locale)
  if (!home) return null
  const vis = visibilityMap()
  const out = { ...home }
  for (const k of HOME_SECTION_KEYS) {
    if (vis[`home.${k}`] === false) delete out[k]
  }
  return out
}
