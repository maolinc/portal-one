import { LocaleLink as Link } from '../../i18n/LocaleLink.jsx'
import { useT } from '../../i18n/LangProvider.jsx'
import { MapPin, Phone, Printer, EnvelopeSimple, Clock, ArrowUpRight } from '@phosphor-icons/react'
import BrandMark from './BrandMark.jsx'

function QrImage({ label, src }) {
  return (
    <div className="text-center">
      <img
        src={src}
        alt={label}
        loading="lazy"
        className="block size-24 rounded-lg bg-white p-1.5 object-contain"
      />
      <p className="mt-2 text-xs text-white/75">{label}</p>
    </div>
  )
}

export default function Footer({ site }) {
  const t = useT()
  if (!site) return null
  const { company, nav, friendLinks } = site
  const vis = site.visibility ?? {}
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-950 text-slate-300">
      <div className="container-x grid gap-x-12 gap-y-10 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.3fr_auto]">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark company={company} />
            <span className="text-lg font-semibold text-white">{company.shortName}</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/75">
            {t('footer.description')}
          </p>
          {company.phone && (
            <a
              href={`tel:${company.phoneRaw}`}
              className="mt-5 inline-flex items-center gap-2 font-display text-2xl font-semibold tracking-wide text-white transition hover:text-accent-300"
            >
              <Phone className="size-5 text-accent-400" weight="fill" />
              {company.phone}
            </a>
          )}
        </div>

        {vis['footer.nav'] !== false && (
        <nav aria-label={t('footer.bottomNav')}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">{t('footer.quickNav')}</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
            {nav.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="text-white/75 transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        )}

        {vis['footer.contact'] !== false && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">{t('footer.contact')}</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent-400" />
              {company.mapUrl ? (
                <a
                  href={company.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-baseline gap-1 transition hover:text-white"
                >
                  {company.address}
                  <ArrowUpRight className="size-3.5 shrink-0 text-accent-400" />
                </a>
              ) : (
                <Link to="/contact" className="transition hover:text-white">
                  {company.address}
                </Link>
              )}
            </li>
            {company.phone && (
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent-400" />
              <a href={`tel:${company.phoneRaw}`} className="transition hover:text-white">
                {company.phone}
              </a>
            </li>
            )}
            <li className="flex gap-2.5">
              <Printer className="mt-0.5 size-4 shrink-0 text-accent-400" />
              {t('footer.faxLabel', { value: company.fax })}
            </li>
            <li className="flex gap-2.5">
              <EnvelopeSimple className="mt-0.5 size-4 shrink-0 text-accent-400" />
              <a href={`mailto:${company.email}`} className="transition hover:text-white">
                {company.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-accent-400" />
              {company.hours}
            </li>
          </ul>
        </div>
        )}

        {(() => {
          const showWechat = vis['channel.wechat'] !== false && company.wechat?.qr
          const showQq = vis['channel.qq'] !== false && company.qq?.qr
          if (!showWechat && !showQq) return null
          return (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">{t('footer.followUs')}</h3>
              <div className="mt-4 flex gap-4">
                {showWechat && <QrImage label={t('toolbar.wechat')} src={company.wechat.qr} />}
                {showQq && <QrImage label={t('toolbar.qqService')} src={company.qq.qr} />}
              </div>
            </div>
          )
        })()}
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-white/70 md:flex-row md:flex-wrap md:items-center md:gap-x-6">
          <span>
            {t('footer.copyright', { year, name: company.name })}
          </span>
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white/80"
          >
            {company.icp}
          </a>
          <span>{company.policeIcp}</span>
          <Link to="/privacy" className="transition hover:text-white/80">
            {t('footer.privacy')}
          </Link>
          {vis['footer.friendLinks'] !== false && (
            <span className="flex gap-4">
              {friendLinks.map((f, i) => (
                <a key={i} href={f.href} className="transition hover:text-white/80">
                  {f.label}
                </a>
              ))}
            </span>
          )}
        </div>
      </div>
    </footer>
  )
}
