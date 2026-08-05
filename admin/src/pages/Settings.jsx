import { useEffect, useState } from 'react'
import { App, Button, Checkbox, Form, Input } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { api } from '../api.js'
import { PageHeader, PageLoading } from '../components/AdminUI.jsx'

export default function Settings() {
  const { message } = App.useApp()
  const [cos, setCos] = useState(null)
  const [locales, setLocales] = useState(null)
  const [savingCos, setSavingCos] = useState(false)
  const [savingLocales, setSavingLocales] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    api.get('/settings/cos').then((result) => {
      setCos(result)
      form.setFieldsValue(result)
    }).catch((e) => message.error(e.message))
    api.get('/settings/locales').then((result) => setLocales(result.enabledLocales)).catch((e) => message.error(e.message))
  }, [form, message])

  if (!cos || !locales) return <PageLoading rows={6} />
  const enEnabled = locales.includes('en')

  const saveCos = async (values) => {
    setSavingCos(true)
    try {
      const saved = await api.put('/settings/cos', values)
      setCos(saved)
      form.setFieldsValue(saved)
      message.success(saved.configured ? 'COS 已配置，上传将使用腾讯云' : '已保存，密钥未配齐时上传会回退本地磁盘')
    } catch (e) {
      message.error(e.message)
    } finally {
      setSavingCos(false)
    }
  }

  const toggleEn = async (checked) => {
    const next = checked ? ['zh', 'en'] : ['zh']
    setSavingLocales(true)
    try {
      const saved = await api.put('/settings/locales', { enabledLocales: next })
      setLocales(saved.enabledLocales)
      message.success(checked ? '英文站已开启' : '英文站已关闭，已翻译内容仍会保留')
    } catch (e) {
      message.error(e.message)
    } finally {
      setSavingLocales(false)
    }
  }

  return (
    <>
      <PageHeader
        title="系统设置"
        description="维护文件存储与语言版本。密钥只保存在服务端，管理端不会读取完整 SecretKey。"
      />
      <div className="settings-grid">
        <section className="surface">
          <div className="surface__header">
            <div>
              <h2>对象存储</h2>
              <p>配置腾讯云 COS 后，新上传的图片和视频会直接写入云存储。</p>
            </div>
          </div>
          <div className="surface__body">
            <div className="settings-status">
              <span className={`status-badge ${cos.configured ? 'is-done' : 'is-pending'}`}>
                {cos.configured ? '已配置' : '未配置'}
              </span>
              <span>{cos.configured ? '当前上传使用腾讯云 COS。' : '当前上传保存到本地服务器 /uploads。'}</span>
            </div>
            <Form form={form} layout="vertical" onFinish={saveCos} requiredMark={false}>
              <div className="settings-form-grid">
                <Form.Item name="SecretId" label="SecretId"><Input /></Form.Item>
                <Form.Item name="SecretKey" label="SecretKey">
                  <Input.Password autoComplete="new-password" placeholder="输入新值即替换，留空保持不变" />
                </Form.Item>
                <Form.Item name="Bucket" label="Bucket"><Input placeholder="portal-1250000000" /></Form.Item>
                <Form.Item name="Region" label="Region"><Input placeholder="ap-shanghai" /></Form.Item>
                <Form.Item className="settings-form-grid__wide" name="CdnDomain" label="CDN 加速域名">
                  <Input placeholder="可选，留空时使用 COS 默认域名" />
                </Form.Item>
              </div>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={savingCos}>
                保存存储设置
              </Button>
            </Form>
          </div>
        </section>

        <section className="surface">
          <div className="surface__header">
            <div>
              <h2>语言版本</h2>
              <p>控制前台可访问的语言入口。</p>
            </div>
          </div>
          <div className="surface__body">
            <div className="language-option">
              <Checkbox checked disabled>中文站</Checkbox>
              <p>默认语言，始终开启。</p>
            </div>
            <div className="language-option">
              <Checkbox checked={enEnabled} disabled={savingLocales} onChange={(e) => toggleEn(e.target.checked)}>
                英文站
              </Checkbox>
              <p>开启后可访问 /en 路径并显示语言切换器。关闭不会删除翻译内容。</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
