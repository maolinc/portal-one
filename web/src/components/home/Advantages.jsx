import { useT } from '../../i18n/LangProvider.jsx'
import SectionHead from '../common/SectionHead.jsx'
import Reveal from '../common/Reveal.jsx'
import DynIcon from '../common/DynIcon.jsx'

// 首页区块 4：实力与优势 + 服务流程（PRD「网页中间栏」；两部分可被后台显隐开关分别移除）
export default function Advantages({ advantages, process }) {
  const t = useT()
  const hasAdvantages = advantages?.length > 0
  const hasProcess = process?.length > 0
  if (!hasAdvantages && !hasProcess) return null
  return (
    <section className="section bg-slate-50">
      <div className="container-x">
        {hasAdvantages && (
        <>
        <SectionHead
          center
          title={t('home.advantages.title')}
          desc={t('home.advantages.desc')}
        />
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06}>
              <div className="grid size-12 place-items-center rounded-lg border border-brand-100 bg-white text-accent-600">
                <DynIcon name={a.icon} className="size-6" />
              </div>
              <h3 className="mt-4 font-semibold text-brand-950">{a.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{a.text}</p>
            </Reveal>
          ))}
        </div>
        </>
        )}

        {hasProcess && (
        <div className={hasAdvantages ? 'mt-16 border-t border-slate-200 pt-12' : ''}>
          <h3 className="text-center text-xl font-semibold text-brand-950">{t('common.process')}</h3>
          <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <li key={p.name}>
                <Reveal delay={i * 0.06}>
                  <div className="h-1 w-10 rounded-full bg-accent-600" />
                  <div className="mt-4 flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-lg bg-accent-50 text-accent-600">
                      <DynIcon name={p.icon} className="size-5" />
                    </span>
                    <span className="font-semibold text-brand-950">{p.name}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{p.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
        )}
      </div>
    </section>
  )
}
