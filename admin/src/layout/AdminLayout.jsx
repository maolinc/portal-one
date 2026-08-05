import { useState } from 'react'
import { Layout, Menu, Button, App, Tooltip } from 'antd'
import {
  AppstoreOutlined, FileTextOutlined, GlobalOutlined, MenuOutlined,
  EyeOutlined, MessageOutlined, SettingOutlined, LogoutOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined,
} from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api.js'

const MENU = [
  {
    key: 'grp-coll', label: '内容管理', type: 'group',
    children: [
      { key: '/collections/business', icon: <AppstoreOutlined />, label: '主营业务' },
      { key: '/collections/services', icon: <AppstoreOutlined />, label: '服务项目' },
      { key: '/collections/cases', icon: <AppstoreOutlined />, label: '案例展示' },
    ],
  },
  {
    key: 'grp-pages', label: '页面配置', type: 'group',
    children: [
      { key: '/singletons/home', icon: <FileTextOutlined />, label: '首页内容' },
      { key: '/singletons/about.profile', icon: <FileTextOutlined />, label: '关于 · 公司简介' },
      { key: '/singletons/about.organization', icon: <FileTextOutlined />, label: '关于 · 组织架构' },
      { key: '/singletons/about.history', icon: <FileTextOutlined />, label: '关于 · 成长历程' },
      { key: '/singletons/site', icon: <GlobalOutlined />, label: '站点信息' },
      { key: '/singletons/seo.pages', icon: <FileTextOutlined />, label: '页面 SEO' },
    ],
  },
  {
    key: 'grp-site', label: '站点管理', type: 'group',
    children: [
      { key: '/nav', icon: <MenuOutlined />, label: '导航菜单' },
      { key: '/visibility', icon: <EyeOutlined />, label: '板块显隐' },
      { key: '/leads', icon: <MessageOutlined />, label: '线索管理' },
      { key: '/settings', icon: <SettingOutlined />, label: '系统设置' },
    ],
  },
]

const ROUTE_META = {
  '/collections/business': ['主营业务', '内容管理'],
  '/collections/services': ['服务项目', '内容管理'],
  '/collections/cases': ['案例展示', '内容管理'],
  '/singletons/home': ['首页内容', '页面配置'],
  '/singletons/about.profile': ['公司简介', '页面配置'],
  '/singletons/about.organization': ['组织架构', '页面配置'],
  '/singletons/about.history': ['成长历程', '页面配置'],
  '/singletons/site': ['站点信息', '页面配置'],
  '/singletons/seo.pages': ['页面 SEO', '页面配置'],
  '/nav': ['导航菜单', '站点管理'],
  '/visibility': ['板块显隐', '站点管理'],
  '/leads': ['线索管理', '站点管理'],
  '/settings': ['系统设置', '站点管理'],
}

function getRouteMeta(pathname) {
  const exact = ROUTE_META[pathname]
  if (exact) return exact
  const collectionMatch = pathname.match(/^\/collections\/(business|services|cases)\/(new|[^/]+)$/)
  if (collectionMatch) {
    const base = ROUTE_META[`/collections/${collectionMatch[1]}`]
    return [collectionMatch[2] === 'new' ? `新增${base[0]}` : `编辑${base[0]}`, base[1]]
  }
  return ['内容管理', 'Portal One']
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { message } = App.useApp()
  const [collapsed, setCollapsed] = useState(false)
  const [broken, setBroken] = useState(false)
  const [pageTitle, pageGroup] = getRouteMeta(location.pathname)

  return (
    <Layout className="admin-shell">
      <Layout.Sider
        width={252}
        breakpoint="lg"
        collapsedWidth={broken ? 0 : 72}
        collapsed={collapsed}
        trigger={null}
        className="admin-sider sider-no-scrollbar"
        onBreakpoint={(isBroken) => {
          setBroken(isBroken)
          setCollapsed(isBroken)
        }}
      >
        <div className="admin-brand">
          <span className="admin-brand__line" />
          {!collapsed ? (
            <div className="admin-brand__text">
              <div className="admin-brand__name">Portal One</div>
              <div className="admin-brand__caption">内容管理系统</div>
            </div>
          ) : null}
        </div>
        <Menu
          mode="inline"
          items={MENU}
          selectedKeys={[location.pathname]}
          onClick={({ key }) => {
            navigate(key)
            if (broken) setCollapsed(true)
          }}
        />
      </Layout.Sider>
      {broken && !collapsed ? (
        <button className="admin-sider-backdrop" aria-label="关闭导航" onClick={() => setCollapsed(true)} />
      ) : null}
      <Layout className="admin-main-layout">
        <Layout.Header className="admin-topbar">
          <div className="admin-topbar__left">
            <Tooltip title={collapsed ? '展开导航' : '收起导航'}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                aria-label={collapsed ? '展开导航' : '收起导航'}
                onClick={() => setCollapsed((value) => !value)}
              />
            </Tooltip>
            <div className="admin-topbar__section">
              <strong>{pageTitle}</strong>
              <span>{pageGroup}</span>
            </div>
          </div>
          <div className="admin-topbar__right">
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={async () => {
              await api.post('/logout').catch(() => {})
              message.success('已退出')
              navigate('/login')
            }}
          >
            退出登录
          </Button>
          </div>
        </Layout.Header>
        <Layout.Content className="admin-content">
          <main className="admin-content__inner">
            <Outlet />
          </main>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
