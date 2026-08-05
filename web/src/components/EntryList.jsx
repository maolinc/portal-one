import { LocaleLink as Link } from '../i18n/LocaleLink.jsx'
import { useT } from '../i18n/LangProvider.jsx'
import { ArrowRight } from '@phosphor-icons/react'
import Reveal from './common/Reveal.jsx'
import MediaImage from './common/MediaImage.jsx'

// 主营业务 / 服务项目 列表页共用卡片行
export default function EntryList({ items, basePath }) {
  const t = useT()
  return (
    <div className="container-x section max-w-5xl space-y-10">
      {items.map((it, i) => (
        <Reveal key={it.slug}>
          <div className="card grid overflow-hidden md:grid-cols-5">
            <div className="relative md:col-span-2">
              <MediaImage
                src={it.image}
                alt={it.name}
                video={it.video}
                videoAutoplay={it.videoAutoplay}
                variant="inline"
                sizes="(min-width: 768px) 40vw, 100vw"
                className="h-56 w-full object-cover md:h-full"
              />
            </div>
            <div className="flex flex-col justify-center p-7 md:col-span-3 md:p-10">
              <div className="flex items-baseline gap-4">
                <h2 className="text-xl font-semibold text-brand-950 md:text-2xl">{it.name}</h2>
                <span className="font-display text-xs font-medium tracking-[0.18em] text-slate-500">
                  {it.nameEn}
                </span>
              </div>
              <p className="mt-3 leading-7 text-slate-600">{it.tagline}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {it.scope.slice(0, 3).map((sc) => (
                  <li
                    key={sc.name}
                    className="rounded-md bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
                  >
                    {sc.name}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link to={`${basePath}/${it.slug}`} className="btn-outline">
                  {t('common.viewDetails')}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
