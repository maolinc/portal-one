import { useLocation, useNavigate } from 'react-router-dom'
import { useLang, buildLocalePath } from '../../i18n/LangProvider.jsx'

export default function LocaleSwitcher({ variant = 'dark', className = '' }) {
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const { locale } = useLang()

  const switchTo = (target) => {
    const newPath = buildLocalePath(pathname, target)
    navigate(`${newPath}${search}${hash}`)
  }

  const activeCls = variant === 'dark' ? 'font-semibold text-white' : 'font-semibold text-brand-950'
  const idleCls = variant === 'dark' ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-brand-950'
  const sepCls = variant === 'dark' ? 'text-white/40' : 'text-slate-300'

  return (
    <div className={`flex items-center gap-1 text-sm ${className}`}>
      <button
        type="button"
        onClick={() => switchTo('zh')}
        className={`px-1.5 transition ${locale === 'zh' ? activeCls : idleCls}`}
        aria-pressed={locale === 'zh'}
      >
        中
      </button>
      <span className={sepCls}>/</span>
      <button
        type="button"
        onClick={() => switchTo('en')}
        className={`px-1.5 transition ${locale === 'en' ? activeCls : idleCls}`}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
    </div>
  )
}
