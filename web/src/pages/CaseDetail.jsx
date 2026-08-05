import { useParams } from 'react-router-dom'
import { useT } from '../i18n/LangProvider.jsx'
import { useApi } from '../hooks/useApi.js'
import { useSeo } from '../hooks/useSeo.js'
import { getCase, getCases } from '../api/index.js'
import PageBanner from '../components/common/PageBanner.jsx'
import CaseCard from '../components/common/CaseCard.jsx'
import { CountUp } from '../components/common/StatBand.jsx'
import Reveal from '../components/common/Reveal.jsx'
import { PageLoading, PageError } from '../components/common/States.jsx'
import NotFound from './NotFound.jsx'

function Block({ title, text }) {
  return (
    <section>
      <h2 className="flex items-center gap-3 text-xl font-semibold text-brand-950">
        <span className="h-6 w-1 rounded-full bg-accent-600" />
        {title}
      </h2>
      <p className="mt-4 leading-8 text-slate-600">{text}</p>
    </section>
  )
}

export default function CaseDetail() {
  const t = useT()
  const { slug } = useParams()
  const { data, loading, error, reload } = useApi(() => getCase(slug), [slug])
  const all = useApi(getCases)

  useSeo(data?.seo || {})

  if (loading) return <PageLoading />
  if (error?.status === 404) return <NotFound />
  if (error) return <PageError error={error} onRetry={reload} />

  const related = (all.data || []).filter((c) => c.slug !== slug).slice(0, 2)

  return (
    <>
      <PageBanner
        title={data.title}
        image={data.cover}
        crumbs={[{ label: t('nav.cases'), to: '/cases' }, { label: data.industry }]}
      />

      <div className="container-x section max-w-4xl space-y-14">
        <Block title={t('case.background')} text={data.background} />
        <Block title={t('case.challenge')} text={data.challenge} />
        <Block title={t('case.solution')} text={data.solution} />

        <section>
          <h2 className="flex items-center gap-3 text-xl font-semibold text-brand-950">
            <span className="h-6 w-1 rounded-full bg-accent-600" />
            {t('case.results')}
          </h2>
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 md:grid-cols-4">
            {data.results.map((r) => (
              <div key={r.label} className="bg-white px-4 py-8 text-center">
                <dd className="font-display text-3xl font-bold text-brand-950 md:text-4xl">
                  <CountUp to={r.value} />
                  <span className="ml-0.5 text-xl text-accent-600">{r.suffix}</span>
                </dd>
                <dt className="mt-2 text-sm text-slate-500">{r.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        {related.length > 0 && (
          <section>
            <h2 className="flex items-center gap-3 text-xl font-semibold text-brand-950">
              <span className="h-6 w-1 rounded-full bg-accent-600" />
              {t('case.related')}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {related.map((c) => (
                <Reveal key={c.slug}>
                  <CaseCard item={c} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
