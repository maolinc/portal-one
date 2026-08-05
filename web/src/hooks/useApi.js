import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LangProvider.jsx'

// 统一的数据获取 Hook：loading / error / data + reload
// locale 变化时自动重新取数（api() 内部读 currentLocale）
export function useApi(fetcher, deps = []) {
  const { locale } = useLang()
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true, error: null }))
    fetcher()
      .then((data) => {
        if (alive) setState({ data, loading: false, error: null })
      })
      .catch((error) => {
        if (alive) setState({ data: null, loading: false, error })
      })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, locale, tick])

  return { ...state, reload: () => setTick((t) => t + 1) }
}
