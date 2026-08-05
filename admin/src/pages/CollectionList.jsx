import { useCallback, useEffect, useState } from 'react'
import { App, Button, Popconfirm, Switch, Table, Tooltip } from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined, ArrowUpOutlined,
  ArrowDownOutlined, PictureOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { COLLECTIONS } from '../schemas.js'
import { PageEmpty, PageHeader } from '../components/AdminUI.jsx'

function ContentThumbnail({ src, alt }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <PictureOutlined />
  return <img src={src} alt={alt} onError={() => setFailed(true)} />
}

export default function CollectionList() {
  const { coll } = useParams()
  const cfg = COLLECTIONS[coll]
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await api.get(`/collections/${coll}`))
    } catch (e) {
      message.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [coll, message])

  useEffect(() => { load() }, [load])

  if (!cfg) return <PageEmpty title="未找到内容集合" description="请从左侧导航重新选择内容类型。" />

  const saveOrder = async (next) => {
    setItems(next)
    try {
      await api.put(`/collections/${coll}/order`, { ids: next.map((it) => it.id) })
    } catch (e) {
      message.error(e.message)
      load()
    }
  }

  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    saveOrder(next)
  }

  const columns = [
    {
      title: '内容', dataIndex: 'name', width: 230,
      render: (value, record) => (
        <div className="content-cell">
          <div className="content-cell__media">
            <ContentThumbnail src={record.media} alt={`${value || record.title || record.slug}缩略图`} />
          </div>
          <div className="content-cell__copy">
            <strong>{value || record.title || record.slug}</strong>
            <code>/{record.slug}</code>
          </div>
        </div>
      ),
    },
    {
      title: '前台状态', dataIndex: 'visible', width: 130, responsive: ['md'],
      render: (value, record) => (
        <span className="status-control">
          <Switch
            size="small"
            checked={value}
            onChange={async (checked) => {
              try {
                await api.patch(`/collections/${coll}/${record.id}/visibility`, { visible: checked })
                setItems((prev) => prev.map((item) => (item.id === record.id ? { ...item, visible: checked } : item)))
                message.success(checked ? '已显示' : '已隐藏，前台约 5 分钟内生效')
              } catch (e) { message.error(e.message) }
            }}
          />
          {value ? '显示中' : '已隐藏'}
        </span>
      ),
    },
    {
      title: '排序', width: 110, responsive: ['lg'],
      render: (_, record, index) => (
        <div className="icon-actions">
          <Tooltip title="上移">
            <Button
              type="text"
              size="small"
              icon={<ArrowUpOutlined />}
              aria-label="上移"
              disabled={index === 0}
              onClick={() => move(index, -1)}
            />
          </Tooltip>
          <Tooltip title="下移">
            <Button
              type="text"
              size="small"
              icon={<ArrowDownOutlined />}
              aria-label="下移"
              disabled={index === items.length - 1}
              onClick={() => move(index, 1)}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: '操作', width: 130,
      render: (_, record) => (
        <div className="icon-actions">
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => navigate(`/collections/${coll}/${record.id}`)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除？双语内容将一并删除"
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
            onConfirm={async () => {
              try {
                await api.del(`/collections/${coll}/${record.id}`)
                message.success('已删除')
                load()
              } catch (e) { message.error(e.message) }
            }}
          >
            <Tooltip title="删除">
              <Button type="text" size="small" danger icon={<DeleteOutlined />} aria-label="删除" />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ]

  const visibleCount = items.filter((item) => item.visible).length

  return (
    <>
      <PageHeader
        title={cfg.label}
        description="管理前台展示内容、发布状态与顺序。点击编辑进入双语内容和媒体设置。"
        actions={(
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/collections/${coll}/new`)}>
            新增内容
          </Button>
        )}
      />
      <section className="surface table-surface">
        <div className="table-toolbar">
          <div className="table-summary">
            <span><strong>{items.length}</strong>条内容</span>
            <span><strong>{visibleCount}</strong>条显示中</span>
          </div>
          <span className="editor-note">排序调整会立即保存</span>
        </div>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={items}
          pagination={false}
          scroll={{ x: 360 }}
          locale={{
            emptyText: (
              <PageEmpty
                title={`还没有${cfg.label}`}
                description="创建第一条内容后，可在这里管理显示状态和前台顺序。"
                actionLabel="新增内容"
                onAction={() => navigate(`/collections/${coll}/new`)}
              />
            ),
          }}
        />
      </section>
    </>
  )
}
