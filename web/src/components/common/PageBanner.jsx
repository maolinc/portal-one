import { LocaleLink as Link } from '../../i18n/LocaleLink.jsx'
import { useT } from '../../i18n/LangProvider.jsx'
import { CaretRight } from '@phosphor-icons/react'
import SiteImage from './SiteImage.jsx'

// 内页页头：横幅图 + 标题 + 面包屑
export default function PageBanner({ title, image, crumbs = [] }) {
  const t = useT()
  return (
    <section className="relative flex h-52 items-end overflow-hidden bg-brand-950 md:h-64">
      {image && (
        <SiteImage
          src={image}
          alt=""
          eager
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-brand-950/30" />
      <div className="container-x relative pb-8 md:pb-10">
        <h1 className="text-2xl font-semibold text-white md:text-4xl">{title}</h1>
        <nav aria-label={t('common.breadcrumb')} className="mt-3 flex flex-wrap items-center gap-1 text-sm text-white/70">
          <Link to="/" className="transition hover:text-white">
            {t('nav.home')}
          </Link>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              <CaretRight className="size-3.5" />
              {c.to ? (
                <Link to={c.to} className="transition hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white/90">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  )
}
