import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useApi } from '../hooks/useApi.js'
import { useSeo } from '../hooks/useSeo.js'
import { getHome, getBusinessList, getServicesList, getCases } from '../api/index.js'
import Hero from '../components/home/Hero.jsx'
import BusinessEntry from '../components/home/BusinessEntry.jsx'
import AboutSummary from '../components/home/AboutSummary.jsx'
import Advantages from '../components/home/Advantages.jsx'
import ServicesHome from '../components/home/ServicesHome.jsx'
import CasesHome from '../components/home/CasesHome.jsx'
import { PageLoading, PageError } from '../components/common/States.jsx'

export default function Home() {
  const { site } = useOutletContext()
  const home = useApi(getHome)
  const business = useApi(getBusinessList)
  const services = useApi(getServicesList)
  const cases = useApi(getCases)

  useSeo(home.data?.seo || {})

  // LCP 优化：首屏第一张轮播图 preload
  const firstHero = home.data?.hero?.[0]?.image
  useEffect(() => {
    if (!firstHero) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = firstHero
    link.setAttribute('fetchpriority', 'high')
    document.head.appendChild(link)
    return () => link.remove()
  }, [firstHero])

  if (home.loading) return <PageLoading />
  if (home.error) return <PageError error={home.error} onRetry={home.reload} />

  const data = home.data
  const vis = site?.visibility ?? {}
  return (
    <>
      {data.hero?.length > 0 && <Hero slides={data.hero} />}
      {vis['home.businessEntry'] !== false && business.data && <BusinessEntry items={business.data} />}
      <AboutSummary teaser={data.aboutTeaser} stats={data.stats} />
      <Advantages advantages={data.advantages} process={data.process} />
      {vis['home.servicesHome'] !== false && services.data && <ServicesHome items={services.data} />}
      {vis['home.casesHome'] !== false && cases.data && <CasesHome items={cases.data} />}
    </>
  )
}
