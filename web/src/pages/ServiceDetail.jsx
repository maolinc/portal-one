import { useParams, useOutletContext } from 'react-router-dom'
import { LocaleLink as Link } from '../i18n/LocaleLink.jsx'
import { useT } from '../i18n/LangProvider.jsx'
import { Phone } from '@phosphor-icons/react'
import { useApi } from '../hooks/useApi.js'
import { useSeo } from '../hooks/useSeo.js'
import { getBusiness, getService } from '../api/index.js'
import PageBanner from '../components/common/PageBanner.jsx'
import Accordion from '../components/common/Accordion.jsx'
import DynIcon from '../components/common/DynIcon.jsx'
import Reveal from '../components/common/Reveal.jsx'
import MediaImage from '../components/common/MediaImage.jsx'
import { PageLoading, PageError } from '../components/common/States.jsx'
import NotFound from './NotFound.jsx'

function H2({ children }) {
  return (
    <h2 className="flex items-center gap-3 text-xl font-semibold text-brand-950 md:text-2xl">
      <span className="h-6 w-1 rounded-full bg-accent-600" />
      {children}
    </h2>
  )
}

export default function ServiceDetail({ kind }) {
  const t = useT()
  const { slug } = useParams()
  const { site } = useOutletContext()
  const { data, loading, error, reload } = useApi(
    () => (kind === 'business' ? getBusiness(slug) : getService(slug)),
    [slug, kind],
  )

  useSeo(data?.seo || {})

  if (loading) return <PageLoading />
  if (error?.status === 404) return <NotFound />
  if (error) return <PageError error={error} onRetry={reload} />

  const baseLabel = kind === 'business' ? t('nav.business') : t('nav.services')
  const basePath = kind === 'business' ? '/business' : '/services'

  const anchors = [
    { id: 'overview', label: t('service.overview') },
    { id: 'scope', label: t('service.scope') },
    { id: 'process', label: t('service.process') },
    { id: 'advantages', label: t('service.advantages') },
    { id: 'faq', label: t('service.faq') },
  ]

  return (
    <>
      <PageBanner
        title={data.name}
        image={data.image}
        crumbs={[{ label: baseLabel, to: basePath }, { label: data.name }]}
      />

      <div className="container-x section grid gap-12 lg:grid-cols-[220px_1fr]">
        {/* 锚点导航（PC） */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-1">
            {anchors.map((a) => (
              <a
                key={a.id}
                href={`#${a.id}`}
                className="block rounded-lg px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-accent-600"
              >
                {a.label}
              </a>
            ))}
            {site && (
              <div className="mt-6 rounded-lg bg-brand-950 p-5 text-white">
                <p className="text-sm text-white/70">{t('toolbar.businessConsult')}</p>
                <a
                  href={`tel:${site.company.phoneRaw}`}
                  className="mt-1 flex items-center gap-2 font-display text-lg font-semibold hover:text-accent-300"
                >
                  <Phone className="size-4 text-accent-400" weight="fill" />
                  {site.company.phone}
                </a>
                <Link to="/contact#form" className="btn-primary mt-4 h-9 w-full text-sm">
                  {t('common.consult')}
                </Link>
              </div>
            )}
          </div>
        </aside>

        <article className="min-w-0 space-y-16">
          <section id="overview" className="scroll-mt-28">
            <H2>{t('service.overview')}</H2>
            <div className="mt-6 space-y-5 leading-8 text-slate-600">
              {data.overview.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <Reveal className="relative mt-8">
              <MediaImage
                src={data.image}
                alt={data.name}
                video={data.video}
                videoAutoplay={data.videoAutoplay}
                variant="inline"
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="aspect-[16/8] w-full rounded-lg object-cover"
              />
            </Reveal>
          </section>

          <section id="scope" className="scroll-mt-28">
            <H2>{t('service.scope')}</H2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {data.scope.map((s) => (
                <div key={s.name} className="rounded-lg border border-slate-200 p-5 transition hover:border-brand-200 hover:bg-brand-50/40">
                  <h3 className="font-semibold text-brand-950">{s.name}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">{s.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="process" className="scroll-mt-28">
            <H2>{t('service.process')}</H2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.process.map((p, i) => (
                <li key={p.name} className="rounded-lg bg-slate-50 p-5">
                  <span className="font-display text-2xl font-bold text-brand-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 font-semibold text-brand-950">{p.name}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">{p.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="advantages" className="scroll-mt-28">
            <H2>{t('service.advantages')}</H2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {data.advantages.map((a) => (
                <div key={a.title} className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-accent-50 text-accent-600">
                    <DynIcon name={a.icon} className="size-6" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-brand-950">{a.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-500">{a.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="faq" className="scroll-mt-28">
            <H2>{t('service.faq')}</H2>
            <div className="mt-6">
              <Accordion items={data.faqs} />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
