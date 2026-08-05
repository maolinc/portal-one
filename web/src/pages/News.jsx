import { LocaleLink as Link } from '../i18n/LocaleLink.jsx'
import { useT } from '../i18n/LangProvider.jsx'
import { NewspaperClipping } from '@phosphor-icons/react'
import { useSeo } from '../hooks/useSeo.js'
import PageBanner from '../components/common/PageBanner.jsx'

// 新闻中心：一期仅预留路由，二期实现（PRD 决策-4）
export default function News() {
  const t = useT()
  useSeo({ title: t('page.news.seoTitle') })
  return (
    <>
      <PageBanner title={t('news.title')} crumbs={[{ label: t('news.title') }]} />
      <div className="container-x flex flex-col items-center py-24 text-center">
        <NewspaperClipping className="size-14 text-brand-300" />
        <h1 className="mt-6 text-xl font-semibold text-brand-950">{t('news.heading')}</h1>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          {t('news.body')}
        </p>
        <Link to="/" className="btn-primary mt-8">
          {t('common.backHome')}
        </Link>
      </div>
    </>
  )
}
