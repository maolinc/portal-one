// SQLite 连接与 schema：主表存语言无关字段，翻译表按 (内容, 语言) 存整份 JSON 文档（ADR-0004）
import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const DEFAULT_DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'data')
export const DATA_DIR = process.env.PORTAL_DATA_DIR ? resolve(process.env.PORTAL_DATA_DIR) : DEFAULT_DATA_DIR
export const UPLOADS_DIR = join(DATA_DIR, 'uploads')
mkdirSync(DATA_DIR, { recursive: true })
mkdirSync(UPLOADS_DIR, { recursive: true })

export const db = new Database(join(DATA_DIR, 'portal.db'))
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
CREATE TABLE IF NOT EXISTS businesses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  sort INTEGER NOT NULL DEFAULT 0,
  visible INTEGER NOT NULL DEFAULT 1,
  image TEXT,
  video TEXT,
  video_autoplay INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS businesses_i18n (
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  payload TEXT NOT NULL,
  PRIMARY KEY (business_id, locale)
);
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  sort INTEGER NOT NULL DEFAULT 0,
  visible INTEGER NOT NULL DEFAULT 1,
  image TEXT,
  video TEXT,
  video_autoplay INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS services_i18n (
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  payload TEXT NOT NULL,
  PRIMARY KEY (service_id, locale)
);
CREATE TABLE IF NOT EXISTS cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  sort INTEGER NOT NULL DEFAULT 0,
  visible INTEGER NOT NULL DEFAULT 1,
  cover TEXT,
  video TEXT,
  video_autoplay INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS cases_i18n (
  case_id INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  payload TEXT NOT NULL,
  PRIMARY KEY (case_id, locale)
);
CREATE TABLE IF NOT EXISTS singletons (
  key TEXT PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS singletons_i18n (
  key TEXT NOT NULL REFERENCES singletons(key) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  payload TEXT NOT NULL,
  PRIMARY KEY (key, locale)
);
CREATE TABLE IF NOT EXISTS nav_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_id INTEGER REFERENCES nav_items(id) ON DELETE CASCADE,
  path TEXT NOT NULL DEFAULT '',
  sort INTEGER NOT NULL DEFAULT 0,
  visible INTEGER NOT NULL DEFAULT 1,
  auto_source TEXT
);
CREATE TABLE IF NOT EXISTS nav_items_i18n (
  nav_item_id INTEGER NOT NULL REFERENCES nav_items(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (nav_item_id, locale)
);
CREATE TABLE IF NOT EXISTS visibility (
  key TEXT PRIMARY KEY,
  visible INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  contact TEXT,
  content TEXT,
  handled INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL
);
`)

// 迁移：为已有库补 video / video_autoplay 列（CREATE TABLE IF NOT EXISTS 不会改已有表）
for (const t of ['businesses', 'services', 'cases']) {
  for (const [col, def] of [['video', 'TEXT'], ['video_autoplay', 'INTEGER NOT NULL DEFAULT 0']]) {
    try {
      db.exec(`ALTER TABLE ${t} ADD COLUMN ${col} ${def}`)
    } catch (e) {
      if (!String(e.message).includes('duplicate column')) throw e
    }
  }
}

export const LOCALES = ['zh', 'en']
export const DEFAULT_LOCALE = 'zh'
