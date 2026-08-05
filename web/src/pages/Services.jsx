import { useT } from '../i18n/LangProvider.jsx'
import { useApi } from '../hooks/useApi.js'
import { useSeo } from '../hooks/useSeo.js'
import { getServicesList, getPageSeo } from '../api/index.js'
import PageBanner from '../components/common/PageBanner.jsx'
import EntryList from '../components/EntryList.jsx'
import { PageLoading, PageError } from '../components/common/States.jsx'
import { img } from '../mock/helpers.js'

export default function Services() {
  const t = useT()
  const { data, loading, error, reload } = useApi(getServicesList)
  const { data: pageSeo } = useApi(() => getPageSeo('services'))
  useSeo(pageSeo ?? {
    title: t('page.services.seoTitle'),
    description: t('page.services.seoDesc'),
    keywords: t('page.services.seoKeywords'),
  })

  if (loading) return <PageLoading />
  if (error) return <PageError error={error} onRetry={reload} />

  return (
    <>
      <PageBanner
        title={t('nav.services')}
        image={img('services-banner-warehouse', 1600, 500)}
        crumbs={[{ label: t('nav.services') }]}
      />
      <EntryList items={data} basePath="/services" />
    </>
  )
}
