// 素材存储：配置了腾讯云 COS 走前端直传（后端发预签名 URL），未配置不允许上传
import COS from 'cos-nodejs-sdk-v5'
import { extname } from 'node:path'
import { randomBytes } from 'node:crypto'
import { db } from '../db.js'

export function getCosConfig({ mask = false } = {}) {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'cos'").get()
  let cfg = {}
  try { cfg = JSON.parse(row?.value ?? '{}') } catch { cfg = {} }
  const configured = !!(cfg.SecretId && cfg.SecretKey && cfg.Bucket && cfg.Region)
  if (mask && cfg.SecretKey) cfg = { ...cfg, SecretKey: '******' }
  return { ...cfg, configured }
}

export function saveCosConfig(input) {
  const prev = getCosConfig()
  const next = {
    SecretId: String(input.SecretId ?? '').trim(),
    SecretKey: input.SecretKey === '******' || input.SecretKey == null ? prev.SecretKey ?? '' : String(input.SecretKey).trim(),
    Bucket: String(input.Bucket ?? '').trim(),
    Region: String(input.Region ?? '').trim(),
    CdnDomain: String(input.CdnDomain ?? '').trim().replace(/\/$/, ''),
  }
  db.prepare("INSERT INTO settings (key, value) VALUES ('cos', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
    .run(JSON.stringify(next))
  return getCosConfig({ mask: true })
}

// 生成对象 key：portal/<时间戳>-<随机后缀>.<扩展名>
export function buildUploadKey(originalName) {
  const ext = extname(originalName).toLowerCase().replace(/[^.\w]/g, '') || '.bin'
  return `portal/${Date.now()}-${randomBytes(4).toString('hex')}${ext}`
}

// 生成 PUT 预签名 URL（15 分钟过期）；前端 fetch PUT 时必须带同样的 Content-Type header
export function getSignedUploadUrl({ key, contentType }) {
  const cfg = getCosConfig()
  if (!cfg.configured) {
    throw new Error('未配置腾讯云 COS，请在后台「设置」中配置凭证后再上传')
  }
  const cos = new COS({ SecretId: cfg.SecretId, SecretKey: cfg.SecretKey })
  const uploadUrl = cos.getObjectUrl({
    Bucket: cfg.Bucket,
    Region: cfg.Region,
    Key: key,
    Method: 'PUT',
    Sign: true,
    Expires: 900,
    Headers: { 'Content-Type': contentType || 'application/octet-stream' },
  })
  const base = cfg.CdnDomain || `https://${cfg.Bucket}.cos.${cfg.Region}.myqcloud.com`
  return { uploadUrl, publicUrl: `${base}/${key}` }
}
