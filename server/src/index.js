// 单进程统管：/api（公开）+ /api/admin（后台）+ web/dist + admin/dist + 上传回退目录（ADR-0003）
import express from 'express'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UPLOADS_DIR } from './db.js'
import { publicRouter } from './routes/public.js'
import { adminRouter } from './routes/admin.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const WEB_DIST = join(ROOT, 'web', 'dist')
const ADMIN_DIST = join(ROOT, 'admin', 'dist')
const PORT = Number(process.env.PORT || 3000)

const app = express()
app.set('trust proxy', 'loopback')
app.use(express.json({ limit: '2mb' }))

app.use('/api', publicRouter)
app.use('/api/admin', adminRouter)
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d', index: false }))

const spa = (dist) => (req, res, next) => {
  if (req.method !== 'GET') return next()
  const index = join(dist, 'index.html')
  existsSync(index)
    ? res.sendFile(index)
    : res.status(503).send('前端未构建：请先运行 npm run build')
}

if (existsSync(ADMIN_DIST)) app.use('/admin', express.static(ADMIN_DIST, { index: 'index.html' }))
app.get('/admin/*', spa(ADMIN_DIST))

if (existsSync(WEB_DIST)) app.use(express.static(WEB_DIST, { index: 'index.html' }))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) return next()
  spa(WEB_DIST)(req, res, next)
})

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err)
  const status = err.status || (err.type === 'entity.too.large' ? 413 : 500)
  res.status(status).json({ message: err.message || '服务器错误' })
})

app.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT}（/admin 为管理端）`)
})
