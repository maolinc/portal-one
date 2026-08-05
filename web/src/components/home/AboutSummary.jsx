import { LocaleLink as Link } from '../../i18n/LocaleLink.jsx'
import { useT } from '../../i18n/LangProvider.jsx'
import { ArrowRight } from '@phosphor-icons/react'
import Reveal from '../common/Reveal.jsx'
import StatBand from '../common/StatBand.jsx'
import MediaImage from '../common/MediaImage.jsx'

// 首页区块 3：关于我们摘要 + 数据统计带（两部分可被后台显隐开关分别移除）
export default function AboutSummary({ teaser, stats }) {
  const t = useT()
  return (
    <>
      {teaser && (
      <section className="pb-16 pt-8 md:pb-24 md:pt-10">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative">
            <div className="relative overflow-hidden rounded-lg">
              <MediaImage
                src={teaser.image}
                alt={t('home.about.imageAlt')}
                video={teaser.video}
                videoAutoplay={teaser.videoAutoplay}
                variant="inline"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 right-4 rounded-lg bg-brand-950 px-6 py-4 text-white shadow-xl">
              <p className="font-display text-3xl font-bold text-accent-400">2008</p>
              <p className="mt-0.5 text-xs text-white/70">{t('home.about.founded')}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-2xl font-semibold leading-snug text-brand-950 md:text-4xl">
              {t('home.about.heading')}
            </h2>
            <p className="mt-5 leading-8 text-slate-600">{teaser.text}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/about/profile" className="btn-primary">
                {t('home.about.enterAbout')}
                <ArrowRight className="size-4" />
              </Link>
              <Link to="/cases" className="btn-outline">
                {t('common.viewAllCases')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      )}
      {stats?.length > 0 && <StatBand stats={stats} />}
    </>
  )
}
