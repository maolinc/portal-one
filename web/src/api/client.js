// API 客户端：默认走 mock；VITE_USE_MOCK=false 时接真实后端（VITE_API_BASE_URL 默认 /api）
// 所有页面只通过这里取数，接口路径即后端契约
// locale 由 LangProvider 在渲染时同步注入（setApiLocale），api() 默认读当前 locale
import * as zhMock from '../mock/zh/index.js'
import * as enMock from '../mock/en/index.js'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const LATENCY = 260
const DEFAULT_LOCALE = 'zh'

const mockByLocale = { zh: zhMock, en: enMock }

let currentLocale = DEFAULT_LOCALE
export function setApiLocale(locale) {
  currentLocale = locale
}
export function getApiLocale() {
  return currentLocale
}

const cache = new Map()
const CACHE_GET_MS = 5 * 60 * 1000

const clone = (v) => JSON.parse(JSON.stringify(v))
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

function hasContent(v) {
  if (v == null) return false
  if (Array.isArray(v)) return v.length > 0
  if (typeof v === 'object') return Object.keys(v).length > 0
  return true
}

function resolveField(locale, field) {
  const localized = mockByLocale[locale]?.[field]
  if (hasContent(localized)) return localized
  if (locale !== DEFAULT_LOCALE) {
    const fallback = mockByLocale[DEFAULT_LOCALE][field]
    if (hasContent(fallback)) return fallback
  }
  return localized
}

function bySlug(list, slug) {
  if (!Array.isArray(list)) return null
  return list.find((it) => it.slug === slug) || null
}

const mockRoutes = [
  { pattern: /^\/site\/config$/, resolve: (loc) => resolveField(loc, 'siteConfig') },
  { pattern: /^\/home$/, resolve: (loc) => resolveField(loc, 'homeData') },
  { pattern: /^\/business$/, resolve: (loc) => resolveField(loc, 'businessList') },
  { pattern: /^\/business\/([\w-]+)$/, resolve: (loc, m) => bySlug(resolveField(loc, 'businessList'), m[1]) },
  { pattern: /^\/services$/, resolve: (loc) => resolveField(loc, 'servicesList') },
  { pattern: /^\/services\/([\w-]+)$/, resolve: (loc, m) => bySlug(resolveField(loc, 'servicesList'), m[1]) },
  { pattern: /^\/cases$/, resolve: (loc) => resolveField(loc, 'casesList') },
  { pattern: /^\/cases\/([\w-]+)$/, resolve: (loc, m) => bySlug(resolveField(loc, 'casesList'), m[1]) },
  {
    pattern: /^\/about\/(profile|organization|history)$/,
    resolve: (loc, m) => {
      const about = resolveField(loc, 'aboutData')
      return about ? about[m[1]] : null
    },
  },
  {
    pattern: /^\/contact\/messages$/,
    method: 'POST',
    resolve: (loc, _m, body) => ({
      code: 0,
      message: loc === 'en' ? 'Submitted successfully' : '提交成功',
      ticket: `P1${Date.now().toString(36).toUpperCase()}`,
      received: body,
    }),
  },
]

async function mockFetch(path, { method = 'GET', body, locale } = {}) {
  const loc = locale || currentLocale
  await delay(LATENCY)
  for (const route of mockRoutes) {
    const m = path.match(route.pattern)
    if (m && (route.method || 'GET') === method) {
      const data = route.resolve(loc, m, body)
      if (data == null) {
        throw { status: 404, message: '资源不存在' }
      }
      return clone(data)
    }
  }
  throw { status: 404, message: '接口不存在' }
}

async function realFetch(path, { method = 'GET', body, locale } = {}) {
  const loc = locale || currentLocale
  const sep = path.includes('?') ? '&' : '?'
  const url = loc !== DEFAULT_LOCALE
    ? `${BASE_URL}${path}${sep}lang=${loc}`
    : `${BASE_URL}${path}`
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => null)
    throw { status: res.status, message: error?.message || `请求失败（${res.status}）` }
  }
  return res.json()
}

export async function api(path, options = {}) {
  const method = options.method || 'GET'
  const locale = options.locale || currentLocale
  const cacheKey = `${locale}:${method}:${path}`
  if (method === 'GET' && cache.has(cacheKey)) {
    const hit = cache.get(cacheKey)
    if (Date.now() - hit.time < CACHE_GET_MS) return clone(hit.data)
  }
  const data = USE_MOCK
    ? await mockFetch(path, { ...options, locale })
    : await realFetch(path, { ...options, locale })
  if (method === 'GET') cache.set(cacheKey, { data, time: Date.now() })
  return data
}
