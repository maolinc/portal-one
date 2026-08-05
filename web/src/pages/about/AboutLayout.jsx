import { Outlet, useOutletContext } from 'react-router-dom'
import { LocaleNavLink as NavLink } from '../../i18n/LocaleLink.jsx'
import { useT } from '../../i18n/LangProvider.jsx'
import PageBanner from '../../components/common/PageBanner.jsx'
import { img } from '../../mock/helpers.js'

export default function AboutLayout() {
  const t = useT()
  const { site } = useOutletContext()
  const tabs = [
    { label: t('nav.profile'), path: '/about/profile' },
    { label: t('nav.organization'), path: '/about/organization' },
    { label: t('nav.history'), path: '/about/history' },
  ]
  return (
    <>
      <PageBanner
        title={t('nav.about')}
        image={img('about-banner-office', 1600, 500)}
        crumbs={[{ label: t('nav.about') }]}
      />
      <div className="sticky top-[72px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="container-x flex gap-2 overflow-x-auto py-3">
          {tabs.map((tp) => (
            <NavLink
              key={tp.path}
              to={tp.path}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-5 py-2 text-sm transition ${
                  isActive
                    ? 'bg-brand-950 font-medium text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {tp.label}
            </NavLink>
          ))}
        </div>
      </div>
      <Outlet context={{ site }} />
    </>
  )
}
