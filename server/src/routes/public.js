// 公开 API：与 web/src/api/client.js 的现有契约对齐（路径 + ?lang= + zh 回退）
import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { db, DEFAULT_LOCALE } from '../db.js'
import {
  COLLECTIONS, listCollection, getCollectionItem, getSingleton,
  publicSiteConfig, publicHome,
} from '../lib/content.js'

export const publicRouter = Router()

const localeOf = (req) => (req.query.lang === 'en' ? 'en' : DEFAULT_LOCALE)

const notFound = (res) => res.status(404).json({ message: '资源不存在' })

const contactRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res) => {
    const loc = localeOf(req)
    res.status(429).json({
      code: 2,
      message: loc === 'en'
        ? 'Too many submissions. Please try again in 10 minutes.'
        : '提交过于频繁，请 10 分钟后再试',
    })
  },
})

publicRouter.get('/site/config', (req, res) => {
  res.json(publicSiteConfig(localeOf(req)))
})

publicRouter.get('/home', (req, res) => {
  const data = publicHome(localeOf(req))
  data ? res.json(data) : notFound(res)
})

for (const [name, cfg] of Object.entries(COLLECTIONS)) {
  publicRouter.get(`/${name}`, (req, res) => {
    res.json(listCollection(cfg, localeOf(req)))
  })
  publicRouter.get(`/${name}/:slug`, (req, res) => {
    const item = getCollectionItem(cfg, req.params.slug, localeOf(req))
    item ? res.json(item) : notFound(res)
  })
}

publicRouter.get('/about/:section', (req, res) => {
  if (!['profile', 'organization', 'history'].includes(req.params.section)) return notFound(res)
  const data = getSingleton(`about.${req.params.section}`, localeOf(req))
  data ? res.json(data) : notFound(res)
})

publicRouter.get('/seo/:page', (req, res) => {
  const pages = getSingleton('seo.pages', localeOf(req))
  const seo = pages?.[req.params.page]
  seo ? res.json(seo) : notFound(res)
})

publicRouter.post('/contact/messages', contactRateLimit, (req, res) => {
  const loc = localeOf(req)
  const { name, contact, content } = req.body ?? {}
  if (!contact || !content) {
    return res.status(400).json({ code: 1, message: loc === 'en' ? 'Contact and message are required' : '请填写联系方式与留言内容' })
  }
  const info = db.prepare('INSERT INTO leads (name, contact, content, created_at) VALUES (?, ?, ?, ?)')
    .run(String(name ?? '').slice(0, 100), String(contact).slice(0, 200), String(content).slice(0, 5000), new Date().toISOString())
  res.json({
    code: 0,
    message: loc === 'en' ? 'Submitted successfully' : '提交成功',
    ticket: `P1${info.lastInsertRowid.toString().padStart(6, '0')}`,
  })
})
