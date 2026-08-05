import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import { PageLoading } from './components/common/States.jsx'
import { trackPageview } from './analytics.js'

// 路由级代码分包：首屏只加载布局与当前页
const Home = lazy(() => import('./pages/Home.jsx'))
const AboutLayout = lazy(() => import('./pages/about/AboutLayout.jsx'))
const Profile = lazy(() => import('./pages/about/Profile.jsx'))
const Organization = lazy(() => import('./pages/about/Organization.jsx'))
const History = lazy(() => import('./pages/about/History.jsx'))
const Business = lazy(() => import('./pages/Business.jsx'))
const Services = lazy(() => import('./pages/Services.jsx'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail.jsx'))
const Cases = lazy(() => import('./pages/Cases.jsx'))
const CaseDetail = lazy(() => import('./pages/CaseDetail.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))
const News = lazy(() => import('./pages/News.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

// 路由配置：中英文共用 slug，仅前缀不同（中文无前缀 / 英文 /en）
const routeConfig = [
  { index: true, element: <Home /> },
  {
    path: 'about',
    element: <AboutLayout />,
    children: [
      { index: true, element: <Navigate to="profile" replace /> },
      { path: 'profile', element: <Profile /> },
      { path: 'organization', element: <Organization /> },
      { path: 'history', element: <History /> },
    ],
  },
  { path: 'business', element: <Business /> },
  { path: 'business/:slug', element: <ServiceDetail kind="business" /> },
  { path: 'services', element: <Services /> },
  { path: 'services/:slug', element: <ServiceDetail kind="services" /> },
  { path: 'cases', element: <Cases /> },
  { path: 'cases/:slug', element: <CaseDetail /> },
  { path: 'contact', element: <Contact /> },
  { path: 'privacy', element: <Privacy /> },
  { path: 'news', element: <News /> },
]

// prefix='' 渲染中文版（默认无前缀）；prefix='en' 渲染英文版
function renderLocaleRoutes(routes, prefix = '') {
  return routes.map((r, i) => {
    if (r.index) {
      if (prefix) {
        return <Route key={`${prefix}-idx`} path={prefix} element={r.element} />
      }
      return <Route key={`idx-${i}`} index element={r.element} />
    }
    const path = prefix ? `${prefix}/${r.path}` : r.path
    return (
      <Route key={path} path={path} element={r.element}>
        {r.children && renderLocaleRoutes(r.children, '')}
      </Route>
    )
  })
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    trackPageview(pathname)
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route element={<Layout />}>
            {renderLocaleRoutes(routeConfig)}
            {renderLocaleRoutes(routeConfig, 'en')}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
