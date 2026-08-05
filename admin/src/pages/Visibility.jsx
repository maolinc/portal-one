import { useEffect, useState } from 'react'
import { App, Button, Switch } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { api } from '../api.js'
import { PageHeader, PageLoading } from '../components/AdminUI.jsx'

const GROUPS = [
  {
    title: '首页区块',
    description: '控制首页各内容区块是否出现在前台。',
    keys: [
      ['home.hero', 'Hero 轮播'], ['home.stats', '数据统计带'], ['home.aboutTeaser', '公司简介预告'],
      ['home.advantages', '核心优势'], ['home.process', '服务流程'],
      ['home.businessEntry', '主营业务入口'], ['home.servicesHome', '服务项目入口'], ['home.casesHome', '案例入口'],
    ],
  },
  {
    title: '底栏',
    description: '控制全站底栏中的信息模块。',
    keys: [['footer.nav', '快捷导航'], ['footer.contact', '联系方式'], ['footer.friendLinks', '友情链接']],
  },
  {
    title: '联系渠道',
    description: '关闭后，前台对应渠道的所有入口会统一隐藏。',
    keys: [
      ['channel.phone', '电话'], ['channel.wechat', '微信'], ['channel.qq', 'QQ'],
      ['channel.kf', '在线客服'], ['channel.message', '在线留言'],
    ],
  },
]

export default function Visibility() {
  const { message } = App.useApp()
  const [vis, setVis] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/visibility').then(setVis).catch((e) => message.error(e.message))
  }, [message])

  if (!vis) return <PageLoading rows={6} />

  const save = async () => {
    setSaving(true)
    try {
      await api.put('/visibility', vis)
      message.success('已保存，前台缓存最多 5 分钟生效')
    } catch (e) {
      message.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        title="板块显隐"
        description="统一控制前台区块和联系渠道。隐藏只影响展示，不会删除已经维护的内容。"
        actions={(
          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={save}>
            保存修改
          </Button>
        )}
      />
      <div className="visibility-grid">
        {GROUPS.map((group) => (
          <section className="surface visibility-group" key={group.title}>
            <div className="surface__header">
              <div>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
              </div>
            </div>
            <div className="surface__body visibility-list">
              {group.keys.map(([key, label]) => (
                <div className="visibility-item" key={key}>
                  <span>{label}</span>
                  <Switch checked={vis[key] !== false} onChange={(value) => setVis({ ...vis, [key]: value })} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
