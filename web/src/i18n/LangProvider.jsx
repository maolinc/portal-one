import { createContext, useContext, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import zh from '../locales/zh.js'
import en from '../locales/en.js'
import { setApiLocale } from '../api/client.js'

const messages = { zh, en }
export const SUPPORTED_LOCALES = ['zh', 'en']
export const DEFAULT_LOCALE = 'zh'
const NON_DEFAULT_LOCALES = SUPPORTED_LOCALES.filter((l) => l !== DEFAULT_LOCALE)

const LangContext = createContext({
  locale: DEFAULT_LOCALE,
  t: (key) => key,
})

export function detectLocaleFromPath(pathname) {
  const seg = pathname.split('/')[1]
  if (NON_DEFAULT_LOCALES.includes(seg)) return seg
  return DEFAULT_LOCALE
}

export function LangProvider({ children }) {
  const { pathname } = useLocation()
  const locale = detectLocaleFromPath(pathname)
  // 同步注入当前 locale 给 api()：必须在子组件 useEffect 之前完成
  // 子组件 useApi 的 fetcher() 会读 currentLocale，此处设置早于所有子组件的 effect
  setApiLocale(locale)

  const value = useMemo(() => {
    const dict = messages[locale] || messages[DEFAULT_LOCALE]
    const fallback = messages[DEFAULT_LOCALE]
    function t(key, vars) {
      const template = dict[key] ?? fallback[key] ?? key
      if (!vars) return template
      return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')
    }
    return { locale, t }
  }, [locale])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

export function useT() {
  return useLang().t
}

export function stripLocalePrefix(pathname) {
  const segs = pathname.split('/')
  if (NON_DEFAULT_LOCALES.includes(segs[1])) {
    const rest = '/' + segs.slice(2).join('/')
    return rest === '/' ? '/' : rest.replace(/\/$/, '') || '/'
  }
  return pathname
}

export function buildLocalePath(pathname, targetLocale) {
  const base = stripLocalePrefix(pathname)
  if (targetLocale === DEFAULT_LOCALE) return base === '/' ? '/' : base
  return base === '/' ? `/${targetLocale}` : `/${targetLocale}${base}`
}
