import { useApi } from '../../hooks/useApi.js'
import { useSeo } from '../../hooks/useSeo.js'
import { getAbout } from '../../api/index.js'
import Reveal from '../../components/common/Reveal.jsx'
import { PageLoading, PageError } from '../../components/common/States.jsx'

// 纵向时间轴：年份列 + 竖线 + 事件列
export default function History() {
  const { data, loading, error, reload } = useApi(() => getAbout('history'))

  useSeo(data?.seo || {})

  if (loading) return <PageLoading />
  if (error) return <PageError error={error} onRetry={reload} />

  return (
    <>
      <section className="section">
        <div className="container-x max-w-3xl">
          <ol>
            {data.events.map((e, i) => (
              <li key={e.year} className="grid grid-cols-[64px_1px_1fr] gap-x-5 md:grid-cols-[110px_1px_1fr] md:gap-x-8">
                <span className="pt-0.5 text-right font-display text-xl font-bold text-brand-800 md:text-2xl">
                  {e.year}
                </span>
                <span className="relative bg-brand-100">
                  <span className="absolute -left-[5px] top-2 size-2.5 rounded-full bg-accent-600 ring-4 ring-accent-50" />
                </span>
                <Reveal delay={i * 0.04}>
                  <p className="pb-10 leading-7 text-slate-600">{e.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
