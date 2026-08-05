import { LocaleLink as Link } from '../../i18n/LocaleLink.jsx'
import { useT } from '../../i18n/LangProvider.jsx'
import SectionHead from '../common/SectionHead.jsx'
import CaseCard from '../common/CaseCard.jsx'

// 首页区块 6：案例展示（横向滚动）
export default function CasesHome({ items }) {
  const t = useT()
  return (
    <section className="bg-slate-50 py-12 md:py-16">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <SectionHead
            eyebrow={t('home.cases.eyebrow')}
            title={t('home.cases.title')}
            desc={t('home.cases.desc')}
          />
          <Link to="/cases" className="btn-outline hidden shrink-0 sm:inline-flex">
            {t('common.viewAllCases')}
          </Link>
        </div>
        <div className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {items.map((c) => (
            <CaseCard
              key={c.slug}
              item={c}
              className="w-[300px] shrink-0 snap-start sm:w-[340px]"
            />
          ))}
        </div>
        <Link to="/cases" className="btn-outline mt-6 w-full sm:hidden">
          {t('common.viewAllCases')}
        </Link>
      </div>
    </section>
  )
}
