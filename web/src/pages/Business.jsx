import { useT } from '../i18n/LangProvider.jsx'
import { useApi } from '../hooks/useApi.js'
import { useSeo } from '../hooks/useSeo.js'
import { getBusinessList, getPageSeo } from '../api/index.js'
import PageBanner from '../components/common/PageBanner.jsx'
import EntryList from '../components/EntryList.jsx'
import { PageLoading, PageError } from '../components/common/States.jsx'
import { img } from '../mock/helpers.js'

export default function Business() {
  const t = useT()
  const { data, loading, error, reload } = useApi(getBusinessList)
  const { data: pageSeo } = useApi(() => getPageSeo('business'))
  useSeo(pageSeo ?? {
    title: t('page.business.seoTitle'),
    description: t('page.business.seoDesc'),
    keywords: t('page.business.seoKeywords'),
  })

  if (loading) return <PageLoading />
  if (error) return <PageError error={error} onRetry={reload} />

  return (
    <>
      <PageBanner
        title={t('nav.business')}
        image={img('business-banner-port', 1600, 500)}
        crumbs={[{ label: t('nav.business') }]}
      />
      <EntryList items={data} basePath="/business" />
    </>
  )
}
