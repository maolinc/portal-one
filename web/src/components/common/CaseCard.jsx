import { LocaleLink as Link } from '../../i18n/LocaleLink.jsx'
import { useT } from '../../i18n/LangProvider.jsx'
import { ArrowRight } from '@phosphor-icons/react'
import MediaImage from './MediaImage.jsx'

export default function CaseCard({ item, className = '' }) {
  const t = useT()
  return (
    <Link to={`/cases/${item.slug}`} className={`card group block overflow-hidden ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <MediaImage
          src={item.cover}
          alt={item.title}
          video={item.video}
          videoAutoplay={item.videoAutoplay}
          variant="modal"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-medium tracking-wide text-accent-600">{item.industry}</p>
        <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-6 text-brand-950 transition group-hover:text-accent-700">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{item.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition group-hover:gap-2.5 group-hover:text-accent-600">
          {t('common.viewDetails')}
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  )
}
