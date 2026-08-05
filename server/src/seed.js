// 种子脚本：把 web/src/mock/{zh,en} 与 locales 的列表页 SEO 灌入 SQLite
// 用法：npm run seed（幂等，重复执行先清空业务表）
import { db } from './db.js'
import { hashPassword } from './lib/passwords.js'
import * as zh from '../../web/src/mock/zh/index.js'
import * as en from '../../web/src/mock/en/index.js'
import localesZh from '../../web/src/locales/zh.js'
import localesEn from '../../web/src/locales/en.js'

const LOCALES = ['zh', 'en']

const VISIBILITY_KEYS = [
  'home.hero', 'home.stats', 'home.aboutTeaser', 'home.advantages', 'home.process',
  'home.businessEntry', 'home.servicesHome', 'home.casesHome',
  'footer.nav', 'footer.contact', 'footer.friendLinks',
  'channel.phone', 'channel.wechat', 'channel.qq', 'channel.kf', 'channel.message',
]

const username = process.env.ADMIN_USER?.trim()
const password = process.env.ADMIN_PASSWORD
if (!username || !password) {
  throw new Error('初始化需要 ADMIN_USER 和 ADMIN_PASSWORD 环境变量')
}

function seedCollection(table, i18nTable, idCol, zhList, enList, mainKey) {
  const insertMain = db.prepare(`INSERT INTO ${table} (slug, sort, visible, ${mainKey}, video, video_autoplay) VALUES (?, ?, 1, ?, ?, ?)`)
  const insertI18n = db.prepare(`INSERT INTO ${i18nTable} (${idCol}, locale, payload) VALUES (?, ?, ?)`)
  const enBySlug = new Map(enList.map((it) => [it.slug, it]))
  zhList.forEach((item, i) => {
    const { slug, kind, [mainKey]: media, video, videoAutoplay, ...payloadZh } = item
    const id = insertMain.run(slug, i, media ?? null, video ?? null, videoAutoplay ? 1 : 0).lastInsertRowid
    insertI18n.run(id, 'zh', JSON.stringify(payloadZh))
    const enItem = enBySlug.get(slug)
    if (enItem) {
      const { slug: _s, kind: _k, [mainKey]: _m, video: _v, videoAutoplay: _va, ...payloadEn } = enItem
      insertI18n.run(id, 'en', JSON.stringify(payloadEn))
    }
  })
}

function seedSingleton(key, payloadByLocale) {
  db.prepare('INSERT INTO singletons (key) VALUES (?)').run(key)
  const stmt = db.prepare('INSERT INTO singletons_i18n (key, locale, payload) VALUES (?, ?, ?)')
  for (const loc of LOCALES) {
    if (payloadByLocale[loc] != null) stmt.run(key, loc, JSON.stringify(payloadByLocale[loc]))
  }
}

function pickPageSeo(t) {
  const pick = (p) => ({
    title: t[`page.${p}.seoTitle`] ?? '',
    description: t[`page.${p}.seoDesc`] ?? '',
    keywords: t[`page.${p}.seoKeywords`] ?? '',
  })
  return { business: pick('business'), services: pick('services'), cases: pick('cases'), contact: pick('contact') }
}

function seedNav() {
  const enFlat = new Map()
  for (const item of en.siteConfig.nav) {
    enFlat.set(item.path, item.label)
    for (const c of item.children ?? []) enFlat.set(c.path, c.label)
  }
  const insertItem = db.prepare('INSERT INTO nav_items (parent_id, path, sort, visible, auto_source) VALUES (?, ?, ?, 1, ?)')
  const insertLabel = db.prepare('INSERT INTO nav_items_i18n (nav_item_id, locale, label) VALUES (?, ?, ?)')
  const addRow = (parentId, item, sort, autoSource) => {
    const id = insertItem.run(parentId, item.path, sort, autoSource).lastInsertRowid
    insertLabel.run(id, 'zh', item.label)
    insertLabel.run(id, 'en', enFlat.get(item.path) ?? item.label)
    return id
  }
  zh.siteConfig.nav.forEach((item, i) => {
    const auto = item.path === '/business' ? 'business' : item.path === '/services' ? 'services' : null
    const id = addRow(null, item, i, auto)
    if (!auto) {
      for (const [j, c] of (item.children ?? []).entries()) addRow(id, c, j, null)
    }
  })
}

const wipe = db.transaction(() => {
  for (const t of [
    'sessions', 'leads', 'admin_users',
    'businesses_i18n', 'businesses', 'services_i18n', 'services', 'cases_i18n', 'cases',
    'singletons_i18n', 'singletons', 'nav_items_i18n', 'nav_items', 'visibility', 'settings',
  ]) db.prepare(`DELETE FROM ${t}`).run()

  seedCollection('businesses', 'businesses_i18n', 'business_id', zh.businessList, en.businessList, 'image')
  seedCollection('services', 'services_i18n', 'service_id', zh.servicesList, en.servicesList, 'image')
  seedCollection('cases', 'cases_i18n', 'case_id', zh.casesList, en.casesList, 'cover')

  seedSingleton('home', { zh: zh.homeData, en: en.homeData })
  seedSingleton('about.profile', { zh: zh.aboutData.profile, en: en.aboutData.profile })
  seedSingleton('about.organization', { zh: zh.aboutData.organization, en: en.aboutData.organization })
  seedSingleton('about.history', { zh: zh.aboutData.history, en: en.aboutData.history })
  seedSingleton('site', {
    zh: { company: zh.siteConfig.company, friendLinks: zh.siteConfig.friendLinks },
    en: { company: en.siteConfig.company, friendLinks: en.siteConfig.friendLinks },
  })
  seedSingleton('seo.pages', { zh: pickPageSeo(localesZh), en: pickPageSeo(localesEn) })

  seedNav()

  const vis = db.prepare('INSERT INTO visibility (key, visible) VALUES (?, 1)')
  for (const k of VISIBILITY_KEYS) vis.run(k)

  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('enabledLocales', JSON.stringify(['zh', 'en']))
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run(username, hashPassword(password))
})

wipe()

const count = (t) => db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get().n
console.log('[seed] 完成', {
  businesses: count('businesses'),
  services: count('services'),
  cases: count('cases'),
  singletons: count('singletons'),
  navItems: count('nav_items'),
  visibilityKeys: count('visibility'),
})
