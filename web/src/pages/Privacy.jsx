import { useT } from '../i18n/LangProvider.jsx'
import { useSeo } from '../hooks/useSeo.js'
import PageBanner from '../components/common/PageBanner.jsx'

export default function Privacy() {
  const t = useT()
  useSeo({
    title: t('page.privacy.seoTitle'),
    description: t('page.privacy.seoDesc'),
  })

  const sections = [
    { title: t('privacy.s1.title'), text: t('privacy.s1.text') },
    { title: t('privacy.s2.title'), text: t('privacy.s2.text') },
    { title: t('privacy.s3.title'), text: t('privacy.s3.text') },
    { title: t('privacy.s4.title'), text: t('privacy.s4.text') },
    { title: t('privacy.s5.title'), text: t('privacy.s5.text') },
  ]

  return (
    <>
      <PageBanner title={t('privacy.title')} crumbs={[{ label: t('privacy.title') }]} />
      <div className="container-x section max-w-3xl">
        <p className="text-sm text-slate-500">{t('privacy.updated')}</p>
        <div className="mt-8 space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-semibold text-brand-950">{s.title}</h2>
              <p className="mt-3 leading-8 text-slate-600">{s.text}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
