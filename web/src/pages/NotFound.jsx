import { LocaleLink as Link } from '../i18n/LocaleLink.jsx'
import { useT } from '../i18n/LangProvider.jsx'
import { Compass } from '@phosphor-icons/react'
import { useSeo } from '../hooks/useSeo.js'

export default function NotFound() {
  const t = useT()
  useSeo({ title: t('notFound.seoTitle') })

  const links = [
    { label: t('nav.business'), to: '/business' },
    { label: t('nav.services'), to: '/services' },
    { label: t('nav.cases'), to: '/cases' },
    { label: t('nav.contact'), to: '/contact' },
  ]

  return (
    <div className="container-x flex flex-col items-center py-24 text-center md:py-32">
      <Compass className="size-14 text-brand-300" />
      <p className="mt-6 font-display text-6xl font-bold text-brand-950">404</p>
      <h1 className="mt-3 text-xl font-semibold text-brand-950">{t('notFound.heading')}</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {t('notFound.hint')}
      </p>
      <Link to="/" className="btn-primary mt-8">
        {t('notFound.back')}
      </Link>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="btn-outline h-10 px-5 text-sm">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
