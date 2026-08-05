import { useT } from '../i18n/LangProvider.jsx'
import { useApi } from '../hooks/useApi.js'
import { useSeo } from '../hooks/useSeo.js'
import { getCases, getPageSeo } from '../api/index.js'
import PageBanner from '../components/common/PageBanner.jsx'
import CaseCard from '../components/common/CaseCard.jsx'
import { PageLoading, PageError } from '../components/common/States.jsx'
import { img } from '../mock/helpers.js'

export default function Cases() {
  const t = useT()
  const { data, loading, error, reload } = useApi(getCases)
  const { data: pageSeo } = useApi(() => getPageSeo('cases'))
  useSeo(pageSeo ?? {
    title: t('page.cases.seoTitle'),
    description: t('page.cases.seoDesc'),
    keywords: t('page.cases.seoKeywords'),
  })

  if (loading) return <PageLoading />
  if (error) return <PageError error={error} onRetry={reload} />

  return (
    <>
      <PageBanner
        title={t('nav.cases')}
        image={img('cases-banner-containers', 1600, 500)}
        crumbs={[{ label: t('nav.cases') }]}
      />
      <div className="container-x section">
        <p className="text-sm text-slate-500">{t('page.cases.note')}</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((c) => (
            <CaseCard key={c.slug} item={c} />
          ))}
        </div>
      </div>
    </>
  )
}
