import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import FloatingToolbar from './FloatingToolbar.jsx'
import { useApi } from '../../hooks/useApi.js'
import { getSiteConfig } from '../../api/index.js'

export default function Layout() {
  const { data: site } = useApi(getSiteConfig)
  const { pathname, search, hash } = useLocation()

  // 语言总开关：英文站关闭时 /en/* 重定向到对应中文路径
  if (site && !site.enabledLocales?.includes('en') && (pathname === '/en' || pathname.startsWith('/en/'))) {
    return <Navigate to={`${pathname.replace(/^\/en/, '') || '/'}${search}${hash}`} replace />
  }

  return (
    <div className="min-h-dvh-fallback flex flex-col">
      <Header site={site} />
      {/* 移动端底部悬浮条占位，避免遮挡正文 */}
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet context={{ site }} />
      </main>
      <Footer site={site} />
      <FloatingToolbar site={site} />
    </div>
  )
}
