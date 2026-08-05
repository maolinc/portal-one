import { Link, NavLink } from 'react-router-dom'
import { useLang, DEFAULT_LOCALE, SUPPORTED_LOCALES } from './LangProvider.jsx'

const NON_DEFAULT_LOCALES = SUPPORTED_LOCALES.filter((l) => l !== DEFAULT_LOCALE)

function withLocalePrefix(to, locale) {
  if (typeof to !== 'string') return to
  if (to.startsWith('#')) return to
  for (const loc of NON_DEFAULT_LOCALES) {
    if (to === `/${loc}` || to.startsWith(`/${loc}/`)) return to
  }
  const clean = to.startsWith('/') ? to : `/${to}`
  if (locale === DEFAULT_LOCALE) return clean
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`
}

export function LocaleLink({ to, ...props }) {
  const { locale } = useLang()
  return <Link to={withLocalePrefix(to, locale)} {...props} />
}

export function LocaleNavLink({ to, ...props }) {
  const { locale } = useLang()
  return <NavLink to={withLocalePrefix(to, locale)} {...props} />
}
