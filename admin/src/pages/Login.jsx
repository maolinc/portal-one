import { useState } from 'react'
import { Button, Form, Input, App } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'

export default function Login() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const onFinish = async ({ username, password }) => {
    setSubmitting(true)
    try {
      await api.post('/login', { username, password })
      navigate('/collections/business', { replace: true })
    } catch (e) {
      message.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-story">
        <div className="login-story__brand">
          <span className="login-story__brand-line" />
          Portal One
        </div>
        <div className="login-story__copy">
          <h1>让内容清楚，让发布有序。</h1>
          <p>在一个工作区维护主营业务、案例、页面文案与站点设置，所有修改保持原有发布流程。</p>
        </div>
        <div className="login-story__footer">内容管理系统</div>
      </section>

      <section className="login-panel">
        <div className="login-form-wrap">
          <h2>登录管理端</h2>
          <p>使用管理员账号继续进入内容工作区。</p>
          <div className="login-form-surface">
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ username: 'admin' }} requiredMark={false}>
              <Form.Item name="username" label="账号" rules={[{ required: true, message: '请输入账号' }]}>
                <Input prefix={<UserOutlined />} autoFocus autoComplete="username" placeholder="管理员账号" />
              </Form.Item>
              <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password prefix={<LockOutlined />} autoComplete="current-password" placeholder="登录密码" />
              </Form.Item>
              <Button type="primary" htmlType="submit" block loading={submitting}>
                登录
              </Button>
            </Form>
          </div>
        </div>
      </section>
    </main>
  )
}
