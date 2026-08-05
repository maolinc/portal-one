import { useT } from '../../i18n/LangProvider.jsx'
import { useApi } from '../../hooks/useApi.js'
import { useSeo } from '../../hooks/useSeo.js'
import { getAbout } from '../../api/index.js'
import Reveal from '../../components/common/Reveal.jsx'
import { PageLoading, PageError } from '../../components/common/States.jsx'

// 纯 CSS 组织架构图：后续可整体替换为图片（PRD 建议）
export default function Organization() {
  const t = useT()
  const { data, loading, error, reload } = useApi(() => getAbout('organization'))

  useSeo(data?.seo || {})

  if (loading) return <PageLoading />
  if (error) return <PageError error={error} onRetry={reload} />

  return (
    <>
      <section className="section">
        <div className="container-x max-w-4xl">
          <Reveal className="flex flex-col items-center">
            <div className="rounded-lg bg-brand-950 px-10 py-4 text-lg font-semibold text-white">
              {data.root}
            </div>
            <div className="h-10 w-px bg-slate-300" />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.departments.map((d, i) => (
              <Reveal key={d.name} delay={i * 0.05}>
                <div className="relative pt-6">
                  <div className="absolute left-1/2 top-0 h-6 w-px bg-slate-300" />
                  <div className="card h-full p-6 text-center hover:-translate-y-0">
                    <h3 className="font-semibold text-brand-950">{d.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{d.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-slate-500">
            {t('about.orgNote')}
          </p>
        </div>
      </section>
    </>
  )
}
