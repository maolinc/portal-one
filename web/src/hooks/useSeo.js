import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang, buildLocalePath } from '../i18n/LangProvider.jsx'

const SITE_ORIGIN = typeof window !== 'undefined' ? window.location.origin : ''

function setMeta(name, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel, href, hreflang) {
  if (!href) return
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (hreflang) el.setAttribute('hreflang', hreflang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function removeAllLinks(rel) {
  document.head.querySelectorAll(`link[rel="${rel}"]`).forEach((el) => el.remove())
}

// 每页独立 TDK（FR-09）+ hreflang + html lang
export function useSeo({ title, description, keywords } = {}) {
  const { locale } = useLang()
  const { pathname } = useLocation()

  useEffect(() => {
    if (title) document.title = title
    setMeta('description', description)
    setMeta('keywords', keywords)
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'

    removeAllLinks('alternate')
    const zhUrl = SITE_ORIGIN + buildLocalePath(pathname, 'zh')
    const enUrl = SITE_ORIGIN + buildLocalePath(pathname, 'en')
    setLink('alternate', zhUrl, 'zh')
    setLink('alternate', enUrl, 'en')
    setLink('alternate', zhUrl, 'x-default')
  }, [title, description, keywords, locale, pathname])
}
