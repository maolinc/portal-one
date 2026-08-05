import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { LocaleLink as Link, LocaleNavLink as NavLink } from '../../i18n/LocaleLink.jsx'
import { useT } from '../../i18n/LangProvider.jsx'
import { AnimatePresence, motion } from 'motion/react'
import { X, CaretDown, Phone } from '@phosphor-icons/react'
import LocaleSwitcher from './LocaleSwitcher.jsx'
import BrandMark from './BrandMark.jsx'

function DrawerGroup({ item, onClose }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-100">
      <div className="flex items-center">
        <NavLink
          to={item.path}
          onClick={onClose}
          className={({ isActive }) =>
            `flex-1 py-4 text-base ${isActive ? 'font-medium text-accent-600' : 'text-slate-800'}`
          }
        >
          {item.label}
        </NavLink>
        <button
          type="button"
          aria-label={t('header.expandSubmenu', { label: item.label })}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid size-11 place-items-center text-slate-500"
        >
          <CaretDown className={`size-4 transition duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-4">
              {item.children.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block border-l-2 py-2.5 pl-4 text-[15px] ${
                      isActive
                        ? 'border-accent-600 font-medium text-accent-600'
                        : 'border-slate-200 text-slate-600'
                    }`
                  }
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function MobileDrawer({ site, open, onClose }) {
  const t = useT()
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const nav = site?.nav || []

  // 注意：必须 portal 到 body。Header 的 backdrop-blur 会成为 fixed 后代的包含块，抽屉会被压进 72px 高的 header 里
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-drawer"
          initial={{ pointerEvents: 'auto' }}
          animate={{ pointerEvents: 'auto' }}
          exit={{ pointerEvents: 'none' }}
          className="fixed inset-0 z-[60] lg:hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 z-0 bg-brand-950/60"
            onClick={onClose}
          />
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-0 z-10 flex h-full w-80 max-w-[86vw] flex-col bg-white"
            role="dialog"
            aria-label={t('header.mobileNav')}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <BrandMark company={site?.company} className="size-9" />
                <span className="truncate text-lg font-semibold text-brand-950">
                  {site?.company?.shortName || site?.company?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {site?.enabledLocales?.includes('en') && <LocaleSwitcher variant="light" />}
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    onClose()
                  }}
                  aria-label={t('common.closeMenu')}
                  className="grid size-11 touch-manipulation place-items-center text-slate-600"
                >
                  <X className="size-6" />
                </button>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-5" aria-label={t('header.mobileMainNav')}>
              {nav.map((item) =>
                item.children ? (
                  <DrawerGroup key={item.path} item={item} onClose={onClose} />
                ) : (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block border-b border-slate-100 py-4 text-base ${
                        isActive ? 'font-medium text-accent-600' : 'text-slate-800'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ),
              )}
            </nav>

            <div className="border-t border-slate-100 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              {site && (
                <a
                  href={`tel:${site.company.phoneRaw}`}
                  className="btn-outline mb-3 w-full"
                >
                  <Phone className="size-4" weight="fill" />
                  {site.company.phone}
                </a>
              )}
              <Link to="/contact#form" onClick={onClose} className="btn-primary w-full">
                {t('common.consult')}
              </Link>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
