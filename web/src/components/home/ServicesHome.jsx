import { LocaleLink as Link } from '../../i18n/LocaleLink.jsx'
import { useT } from '../../i18n/LangProvider.jsx'
import { ArrowRight } from '@phosphor-icons/react'
import SectionHead from '../common/SectionHead.jsx'
import Reveal from '../common/Reveal.jsx'
import MediaImage from '../common/MediaImage.jsx'

// 首页区块 5：服务项目（2 张大卡，左右交错）
export default function ServicesHome({ items }) {
  const t = useT()
  return (
    <section className="section">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <SectionHead
            eyebrow={t('home.services.eyebrow')}
            title={t('home.services.title')}
            desc={t('home.services.desc')}
          />
          <Link to="/services" className="btn-outline hidden shrink-0 sm:inline-flex">
            {t('common.viewAllServices')}
          </Link>
        </div>
        <div className="mt-10 space-y-8">
          {items.map((s, i) => (
            <Reveal key={s.slug}>
              <div className="card grid items-stretch overflow-hidden lg:grid-cols-2">
                <div className={`relative ${i % 2 ? 'lg:order-2' : ''}`}>
                  <MediaImage
                    src={s.image}
                    alt={s.name}
                    video={s.video}
                    videoAutoplay={s.videoAutoplay}
                    variant="inline"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="h-64 w-full object-cover lg:h-full"
                  />
                </div>
                <div className="p-8 lg:p-12">
                  <p className="font-display text-xs font-semibold tracking-[0.2em] text-slate-500">
                    {s.nameEn}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-brand-950 md:text-2xl">
                    {s.name}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">{s.tagline}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.scope.slice(0, 4).map((sc) => (
                      <li
                        key={sc.name}
                        className="rounded-md bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
                      >
                        {sc.name}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/services/${s.slug}`}
                    className="mt-6 inline-flex items-center gap-1.5 font-medium text-accent-600 transition hover:gap-2.5"
                  >
                    {t('common.viewDetails')}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Link to="/services" className="btn-outline mt-8 w-full sm:hidden">
          {t('common.viewAllServices')}
        </Link>
      </div>
    </section>
  )
}
