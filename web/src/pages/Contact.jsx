import { useOutletContext } from 'react-router-dom'
import { useT } from '../i18n/LangProvider.jsx'
import { MapPin, Phone, Printer, EnvelopeSimple, Clock, ArrowUpRight } from '@phosphor-icons/react'
import { useSeo } from '../hooks/useSeo.js'
import { useApi } from '../hooks/useApi.js'
import { getPageSeo } from '../api/index.js'
import PageBanner from '../components/common/PageBanner.jsx'
import ContactForm from '../components/common/ContactForm.jsx'
import { img } from '../mock/helpers.js'

// 可嵌入 iframe 的地图域名白名单；其余链接（map.baidu.com/@... 直链、amap.com/place/... 直链等
// 多数被 X-Frame-Options 拦截）退化为地址高亮卡片 + 跳转按钮
const EMBEDDABLE_HOSTS = [
  'api.map.baidu.com',
  'api.amap.com',
  'uri.amap.com',
  'apis.map.qq.com',
  'map.qq.com',
  'open.baidu.com',
  'www.google.com',
  'maps.google.com',
]
const isEmbeddable = (url) => {
  try {
    const u = new URL(url)
    return EMBEDDABLE_HOSTS.includes(u.hostname) || u.pathname.startsWith('/maps/embed')
  } catch {
    return false
  }
}

function MapBlock({ mapUrl, address, t }) {
  if (mapUrl && isEmbeddable(mapUrl)) {
    return (
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <iframe
          src={mapUrl}
          title={t('contact.mapPlaceholder')}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-[4/3] w-full"
        />
      </div>
    )
  }
  if (mapUrl) {
    return (
      <a
        href={mapUrl}
        target="_blank"
        rel="noreferrer"
        className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-accent-600 hover:bg-accent-50"
      >
        <div>
          <MapPin className="mx-auto size-8 text-accent-600" weight="fill" />
          <p className="mt-3 text-sm font-medium text-brand-800">{t('contact.mapViewExternal')}</p>
          <p className="mt-1 text-xs text-slate-500">{address}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent-600">
            {t('contact.mapOpenHint')}
            <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </a>
    )
  }
  return (
    <div className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <div>
        <MapPin className="mx-auto size-8 text-brand-300" />
        <p className="mt-3 text-sm font-medium text-slate-600">{t('contact.mapPlaceholder')}</p>
        <p className="mt-1 text-xs text-slate-500">{address}</p>
      </div>
    </div>
  )
}

export default function Contact() {
  const t = useT()
  const { site } = useOutletContext()
  const { data: pageSeo } = useApi(() => getPageSeo('contact'))
  useSeo(pageSeo ?? {
    title: t('page.contact.seoTitle'),
    description: t('page.contact.seoDesc'),
    keywords: t('page.contact.seoKeywords'),
  })

  const company = site?.company
  const vis = site?.visibility ?? {}

  return (
    <>
      <PageBanner
        title={t('nav.contact')}
        image={img('contact-banner-city', 1600, 500)}
        crumbs={[{ label: t('nav.contact') }]}
      />

      <div className="container-x section grid gap-10 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-2">
          <div>
            <h2 className="text-xl font-semibold text-brand-950">{t('common.companyFullName')}</h2>
            {company && (
              <ul className="mt-5 space-y-4 text-[15px] text-slate-600">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-accent-600" />
                  {company.address}
                </li>
                {company.phone && (
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-5 shrink-0 text-accent-600" />
                  <a href={`tel:${company.phoneRaw}`} className="font-medium text-brand-800 hover:text-accent-600">
                    {company.phone}
                  </a>
                </li>
                )}
                <li className="flex gap-3">
                  <Printer className="mt-0.5 size-5 shrink-0 text-accent-600" />
                  {t('contact.faxLabel', { value: company.fax })}
                </li>
                <li className="flex gap-3">
                  <EnvelopeSimple className="mt-0.5 size-5 shrink-0 text-accent-600" />
                  <a href={`mailto:${company.email}`} className="text-brand-800 hover:text-accent-600">
                    {company.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-5 shrink-0 text-accent-600" />
                  {company.hours}
                </li>
              </ul>
            )}
          </div>

          {/* 地图：后端填百度/高德分享链接。可嵌入 iframe 的（api.map.baidu.com / uri.amap.com 等）直接渲染；
              不能嵌入的（map.baidu.com 直链等）退化为地址高亮卡片，点击新窗口打开 */}
          <MapBlock mapUrl={company?.mapUrl} address={company?.address} t={t} />
        </div>

        <div id="form" className="scroll-mt-28 lg:col-span-3">
          <div className="card p-6 hover:-translate-y-0 hover:shadow-none md:p-8">
            <h2 className="text-xl font-semibold text-brand-950">{t('contact.formTitle')}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {t('contact.formDesc')}
            </p>
            <div className="mt-6">
              {vis['channel.message'] !== false ? (
                <ContactForm />
              ) : (
                <p className="py-10 text-center text-slate-500">{t('contact.formUnavailable')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
