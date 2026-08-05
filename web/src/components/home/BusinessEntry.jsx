import { LocaleLink as Link } from '../../i18n/LocaleLink.jsx'
import { useT } from '../../i18n/LangProvider.jsx'
import { ArrowRight } from '@phosphor-icons/react'
import SectionHead from '../common/SectionHead.jsx'
import Reveal from '../common/Reveal.jsx'
import MediaImage from '../common/MediaImage.jsx'

// 首页区块 2：核心业务入口（3 条业务线卡片）
export default function BusinessEntry({ items }) {
  const t = useT()
  return (
    <section className="pb-8 pt-10 md:pb-10 md:pt-14">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <SectionHead
            eyebrow={t('home.business.eyebrow')}
            title={t('home.business.title')}
            desc={t('home.business.desc')}
          />
          <Link to="/business" className="btn-outline hidden shrink-0 sm:inline-flex">
            {t('common.viewAllBusiness')}
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((b, i) => (
            <Reveal key={b.slug} delay={i * 0.08} className="h-full">
              <Link to={`/business/${b.slug}`} className="card group block h-full overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <MediaImage
                    src={b.image}
                    alt={b.name}
                    video={b.video}
                    videoAutoplay={b.videoAutoplay}
                    variant="modal"
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-semibold text-brand-950">{b.name}</h3>
                    <span className="font-display text-xs font-medium tracking-[0.16em] text-slate-500">
                      {b.nameEn}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{b.intro}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 transition group-hover:gap-2.5">
                    {t('common.viewDetails')}
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Link to="/business" className="btn-outline mt-8 w-full sm:hidden">
          {t('common.viewAllBusiness')}
        </Link>
      </div>
    </section>
  )
}
