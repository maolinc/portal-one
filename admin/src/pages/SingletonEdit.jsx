import { useEffect, useState } from 'react'
import { App, Button, Tabs } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { api } from '../api.js'
import { SINGLETONS } from '../schemas.js'
import SchemaFields from '../components/SchemaFields.jsx'
import ImageUpload from '../components/ImageUpload.jsx'
import { PageEmpty, PageHeader, PageLoading, SaveStatus } from '../components/AdminUI.jsx'

export default function SingletonEdit() {
  const { key } = useParams()
  const cfg = SINGLETONS[key]
  const { message } = App.useApp()
  const [data, setData] = useState(null)
  const [savedSnapshot, setSavedSnapshot] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setData(null)
    api.get(`/singletons/${key}`).then((result) => {
      const next = { zh: result.zh ?? {}, en: result.en ?? {} }
      setData(next)
      setSavedSnapshot(JSON.stringify(next))
    }).catch((e) => message.error(e.message))
  }, [key, message])

  const dirty = !!data && JSON.stringify(data) !== savedSnapshot
  const sharedLogo = data?.zh?.company?.logo || data?.en?.company?.logo || null

  const setSharedLogo = (logo) => {
    setData({
      ...data,
      zh: { ...data.zh, company: { ...(data.zh?.company ?? {}), logo } },
      en: { ...data.en, company: { ...(data.en?.company ?? {}), logo } },
    })
  }

  useEffect(() => {
    const warn = (event) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  if (!cfg) return <PageEmpty title="未找到页面配置" description="请从左侧导航重新选择页面。" />
  if (!data) return <PageLoading rows={8} />

  const save = async () => {
    setSaving(true)
    try {
      await api.put(`/singletons/${key}`, data)
      setSavedSnapshot(JSON.stringify(data))
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
        title={cfg.label}
        description="编辑页面级内容与搜索信息。中文为默认语言，英文空字段会自动回退中文。"
        status={<SaveStatus dirty={dirty} saving={saving} />}
        actions={(
          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={save}>
            保存修改
          </Button>
        )}
      />
      {key === 'site' ? (
        <section className="surface site-branding">
          <div className="surface__header">
            <div>
              <h2>品牌 Logo</h2>
              <p>用于前台顶部导航与底栏，一次上传后中英文站共用。</p>
            </div>
          </div>
          <div className="surface__body brand-logo-editor">
            <ImageUpload
              value={sharedLogo}
              onChange={setSharedLogo}
              variant="logo"
              alt="当前品牌 Logo"
            />
            <div className="brand-logo-guidance">
              <strong>文件建议</strong>
              <p>优先使用正方形图标版本，透明背景效果最佳。导航栏会将图片完整缩放到图标区域，不会裁切。</p>
              <p>未上传或图片无法加载时，前台会根据当前品牌名称自动生成文字标识。</p>
            </div>
          </div>
        </section>
      ) : null}
      <section className="surface editor-singleton">
        <div className="surface__header">
          <div>
            <h2>页面内容</h2>
            <p>按照前台页面结构分组维护，重复内容可直接排序。</p>
          </div>
        </div>
        <div className="editor-main__tabs">
          <Tabs
            items={[
              {
                key: 'zh',
                label: '中文内容',
                children: (
                  <div className="language-panel">
                    <p className="language-panel__note">这是前台默认展示内容。</p>
                    <SchemaFields schema={cfg.schema} value={data.zh} onChange={(value) => setData({ ...data, zh: value })} />
                  </div>
                ),
              },
              {
                key: 'en',
                label: 'English',
                children: (
                  <div className="language-panel">
                    <p className="language-panel__note">未填写的字段会在英文站回退显示中文内容。</p>
                    <SchemaFields schema={cfg.schema} value={data.en} onChange={(value) => setData({ ...data, en: value })} />
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>
    </>
  )
}
