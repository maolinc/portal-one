import { useEffect, useState } from 'react'
import { App, Button, Input, Switch, Tabs } from 'antd'
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { COLLECTIONS } from '../schemas.js'
import SchemaFields, { VideoField } from '../components/SchemaFields.jsx'
import ImageUpload from '../components/ImageUpload.jsx'
import { FieldBlock, PageEmpty, PageHeader, PageLoading, SaveStatus } from '../components/AdminUI.jsx'

const emptyItem = { slug: '', media: null, video: null, videoAutoplay: false, visible: true, i18n: { zh: {}, en: {} } }

function editableSnapshot(value) {
  if (!value) return ''
  const { visible, ...editable } = value
  return JSON.stringify(editable)
}

export default function CollectionEdit() {
  const { coll, id } = useParams()
  const isNew = !id || id === 'new'
  const cfg = COLLECTIONS[coll]
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [item, setItem] = useState(null)
  const [savedSnapshot, setSavedSnapshot] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isNew) {
      const next = { ...emptyItem, i18n: { zh: {}, en: {} } }
      setItem(next)
      setSavedSnapshot(editableSnapshot(next))
      return
    }
    setItem(null)
    api.get(`/collections/${coll}/${id}`).then((data) => {
      setItem(data)
      setSavedSnapshot(editableSnapshot(data))
    }).catch((e) => message.error(e.message))
  }, [coll, id, isNew, message])

  const dirty = !!item && editableSnapshot(item) !== savedSnapshot

  useEffect(() => {
    const warn = (event) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  if (!cfg) return <PageEmpty title="未找到内容集合" description="请返回列表并重新选择内容类型。" />
  if (!item) return <PageLoading rows={7} />

  const save = async () => {
    if (!/^[\w-]{1,100}$/.test(item.slug)) return message.error('slug 必填，仅限字母、数字、下划线和中划线')
    if (!item.i18n?.zh || Object.keys(item.i18n.zh).length === 0) return message.error('中文内容不能为空')
    setSaving(true)
    try {
      const saved = isNew
        ? await api.post(`/collections/${coll}`, item)
        : await api.put(`/collections/${coll}/${id}`, item)
      setItem(saved)
      setSavedSnapshot(editableSnapshot(saved))
      message.success('已保存，前台缓存最多 5 分钟生效')
      if (isNew) navigate(`/collections/${coll}/${saved.id}`, { replace: true })
    } catch (e) {
      message.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const displayName = item.i18n?.zh?.name || item.i18n?.zh?.title || item.slug

  return (
    <>
      <PageHeader
        title={isNew ? `新增${cfg.label}` : displayName || `编辑${cfg.label}`}
        description={isNew ? `创建新的${cfg.label}内容，保存后可单独控制前台显隐。` : `编辑双语内容与共享媒体，当前页面标识为 ${item.slug}。`}
        status={<SaveStatus dirty={dirty} saving={saving} />}
        actions={(
          <>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/collections/${coll}`)}>
              返回列表
            </Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={save}>
              保存修改
            </Button>
          </>
        )}
      />

      <div className="editor-grid">
        <section className="surface editor-main">
          <div className="surface__header">
            <div>
              <h2>页面内容</h2>
              <p>中文为必填内容，英文留空时前台会回退显示中文。</p>
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
                      <SchemaFields
                        schema={cfg.schema}
                        value={item.i18n.zh ?? {}}
                        onChange={(value) => setItem({ ...item, i18n: { ...item.i18n, zh: value } })}
                      />
                    </div>
                  ),
                },
                {
                  key: 'en',
                  label: 'English',
                  children: (
                    <div className="language-panel">
                      <p className="language-panel__note">未填写的字段会在英文站回退显示中文内容。</p>
                      <SchemaFields
                        schema={cfg.schema}
                        value={item.i18n.en ?? {}}
                        onChange={(value) => setItem({ ...item, i18n: { ...item.i18n, en: value } })}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </section>

        <aside className="editor-aside">
          <section className="surface">
            <div className="surface__header">
              <div>
                <h3>发布设置</h3>
                <p>控制页面地址、展示状态和视频行为。</p>
              </div>
            </div>
            <div className="surface__body">
              <FieldBlock label="slug" help="URL 标识，例如 import-export">
                <Input
                  value={item.slug}
                  placeholder="import-export"
                  onChange={(e) => setItem({ ...item, slug: e.target.value.trim() })}
                />
              </FieldBlock>
              <div className="switch-row">
                <div className="switch-row__copy">
                  <strong>前台显示</strong>
                  <span>{isNew ? '首次保存后可单独切换' : '关闭后保留内容但不在前台展示'}</span>
                </div>
                <Switch
                  checked={item.visible}
                  disabled={isNew}
                  onChange={async (value) => {
                    try {
                      await api.patch(`/collections/${coll}/${id}/visibility`, { visible: value })
                      setItem({ ...item, visible: value })
                      message.success(value ? '已显示' : '已隐藏，前台约 5 分钟内生效')
                    } catch (e) { message.error(e.message) }
                  }}
                />
              </div>
              <div className="switch-row">
                <div className="switch-row__copy">
                  <strong>视频自动播放</strong>
                  <span>以前台静音循环方式播放共享视频</span>
                </div>
                <Switch
                  checked={!!item.videoAutoplay}
                  onChange={(value) => setItem({ ...item, videoAutoplay: value })}
                />
              </div>
            </div>
          </section>

          <section className="surface">
            <div className="surface__header">
              <div>
                <h3>共享媒体</h3>
                <p>图片与视频在中英文页面共用。</p>
              </div>
            </div>
            <div className="surface__body">
              <FieldBlock label={cfg.mediaLabel} help="用于列表封面和页面主视觉">
                <ImageUpload value={item.media} onChange={(value) => setItem({ ...item, media: value })} />
              </FieldBlock>
              <FieldBlock label="配图视频" help="可选，支持 mp4 直链或上传文件">
                <VideoField value={item.video} onChange={(value) => setItem({ ...item, video: value })} />
              </FieldBlock>
            </div>
          </section>
        </aside>
      </div>
    </>
  )
}
