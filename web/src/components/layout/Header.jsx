import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { LocaleLink as Link, LocaleNavLink as NavLink } from '../../i18n/LocaleLink.jsx'
import { useT } from '../../i18n/LangProvider.jsx'
import { List, CaretDown } from '@phosphor-icons/react'
import MobileDrawer from './MobileDrawer.jsx'
import LocaleSwitcher from './LocaleSwitcher.jsx'
import BrandMark from './BrandMark.jsx'

function Logo({ site }) {
  const t = useT()
  const company = site?.company

  if (!company) {
    return (
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="size-10 shrink-0 animate-pulse rounded-lg bg-slate-200/80" />
        <span className="space-y-2">
          <span className="block h-4 w-28 animate-pulse rounded bg-slate-200/80" />
          <span className="block h-2.5 w-36 animate-pulse rounded bg-slate-200/70" />
        </span>
      </div>
    )
  }

  return (
    <Link to="/" className="flex items-center gap-3" aria-label={t('header.backHome')}>
      <BrandMark company={company} />
      <span className="leading-tight">
        <span className="block text-[17px] font-semibold text-brand-950">
          {company.shortName || company.name}
        </span>
        {company.nameEn && (
          <span className="block font-display text-[10px] font-medium tracking-[0.18em] text-slate-500">
            {company.nameEn}
          </span>
        )}
      </span>
    </Link>
  )
}

function NavItem({ item }) {
  const base =
    'relative flex h-full items-center gap-1 px-4 text-[15px] transition-colors duration-200'
  const activeStyle = ({ isActive }) =>
    `${base} ${isActive ? 'font-medium text-brand-950 after:absolute after:inset-x-4 after:bottom-3 after:h-0.5 after:rounded-full after:bg-accent-500' : 'text-slate-600 hover:text-brand-950'}`

  if (!item.children) {
    return (
      <NavLink to={item.path} className={activeStyle} end={item.path === '/'}>
        {item.label}
      </NavLink>
    )
  }
  return (
    <div className="group relative h-full">
      <NavLink to={item.path} className={activeStyle}>
        {item.label}
        <CaretDown className="size-3.5 transition duration-200 group-hover:rotate-180" />
      </NavLink>
      <div className="invisible absolute left-1/2 top-full z-50 w-44 -translate-x-1/2 pt-2 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white py-2 shadow-xl shadow-brand-950/10">
          {item.children.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                `block px-5 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-accent-50 font-medium text-accent-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-accent-600'
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Header({ site }) {
  const t = useT()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { pathname } = useLocation()
  const nav = site?.nav || []
  const siteReady = Boolean(site?.company)

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  const closeDrawer = () => {
    flushSync(() => setDrawerOpen(false))
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_1px_12px_rgb(10_29_51/0.05)] backdrop-blur">
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Logo site={site} />

        <nav aria-label={t('header.nav')} className="hidden h-full items-stretch lg:flex">
          {nav.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        {site?.enabledLocales?.includes('en') && (
          <div className="hidden items-center lg:flex">
            <LocaleSwitcher variant="light" />
          </div>
        )}

        {siteReady ? (
          <button
            type="button"
            className="grid size-11 place-items-center text-brand-950 lg:hidden"
            aria-label={t('common.openMenu')}
            onClick={() => setDrawerOpen(true)}
          >
            <List className="size-7" />
          </button>
        ) : (
          <span className="size-11 lg:hidden" aria-hidden="true" />
        )}
      </div>

      <MobileDrawer site={site} open={siteReady && drawerOpen} onClose={closeDrawer} />
    </header>
  )
}
