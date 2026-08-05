import { useCallback, useEffect, useState } from 'react'
import { App, Button, DatePicker, Input, Popconfirm, Segmented, Switch, Table, Tooltip } from 'antd'
import { DeleteOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { api } from '../api.js'
import { PageEmpty, PageHeader } from '../components/AdminUI.jsx'

function csvCell(value) {
  const text = String(value ?? '')
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text
  return `"${safe.replaceAll('"', '""')}"`
}

export default function Leads() {
  const { message } = App.useApp()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('all')
  const [range, setRange] = useState(null)

  const buildQuery = useCallback((extra = {}) => {
    const params = new URLSearchParams()
    if (keyword.trim()) params.set('q', keyword.trim())
    if (status === 'pending') params.set('handled', 'false')
    if (status === 'handled') params.set('handled', 'true')
    if (range?.[0]) params.set('from', range[0].startOf('day').toDate().toISOString())
    if (range?.[1]) params.set('to', range[1].endOf('day').toDate().toISOString())
    for (const [k, v] of Object.entries(extra)) params.set(k, v)
    const s = params.toString()
    return s ? `?${s}` : ''
  }, [keyword, status, range])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setLeads(await api.get(`/leads${buildQuery()}`))
    } catch (e) {
      message.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [buildQuery, message])

  useEffect(() => { load() }, [load])

  const handleExport = async () => {
    setExporting(true)
    try {
      const rows = await api.get(`/leads${buildQuery({ limit: 10000 })}`)
      if (!rows.length) {
        message.warning('当前筛选条件下没有可导出的线索')
        return
      }
      const data = rows.map((r) => [
        r.handled ? '已处理' : '待跟进',
        r.name || '',
        r.contact || '',
        r.content || '',
        new Date(r.created_at).toLocaleString('zh-CN'),
      ])
      const csv = '\uFEFF' + [
        ['状态', '称呼', '联系方式', '留言内容', '提交时间'],
        ...data,
      ].map((row) => row.map(csvCell).join(',')).join('\r\n')
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `线索导出-${dayjs().format('YYYYMMDD-HHmm')}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      message.error(e.message)
    } finally {
      setExporting(false)
    }
  }

  const columns = [
    {
      title: '状态', dataIndex: 'handled', width: 110,
      render: (value) => <span className={`status-badge ${value ? 'is-done' : 'is-pending'}`}>{value ? '已处理' : '待跟进'}</span>,
    },
    { title: '称呼', dataIndex: 'name', width: 140, render: (value) => value || '未填写' },
    { title: '联系方式', dataIndex: 'contact', width: 190 },
    { title: '留言内容', dataIndex: 'content', ellipsis: true },
    {
      title: '提交时间', dataIndex: 'created_at', width: 190,
      render: (value) => <span className="tabular-text">{new Date(value).toLocaleString('zh-CN')}</span>,
    },
    {
      title: '处理标记', width: 110,
      render: (_, record) => (
        <span className="status-control">
          <Switch
            size="small"
            checked={record.handled}
            onChange={async (checked) => {
              try {
                await api.patch(`/leads/${record.id}`, { handled: checked })
                setLeads((prev) => prev.map((item) => (item.id === record.id ? { ...item, handled: checked } : item)))
              } catch (e) { message.error(e.message) }
            }}
          />
          {record.handled ? '完成' : '跟进'}
        </span>
      ),
    },
    {
      title: '操作', width: 72,
      render: (_, record) => (
        <Popconfirm
          title="确认删除这条线索？"
          description="删除后无法恢复。"
          okText="删除"
          cancelText="取消"
          okButtonProps={{ danger: true }}
          onConfirm={async () => {
            try {
              await api.del(`/leads/${record.id}`)
              setLeads((prev) => prev.filter((item) => item.id !== record.id))
              message.success('线索已删除')
            } catch (e) { message.error(e.message) }
          }}
        >
          <Tooltip title="删除线索">
            <Button type="text" size="small" danger icon={<DeleteOutlined />} aria-label="删除线索" />
          </Tooltip>
        </Popconfirm>
      ),
    },
  ]

  const pendingCount = leads.filter((lead) => !lead.handled).length

  return (
    <>
      <PageHeader
        title="线索管理"
        description="查看访客从联系页提交的咨询信息，并标记后续跟进状态。展开行可阅读完整留言。"
        actions={(
          <>
            <Button icon={<DownloadOutlined />} loading={exporting} onClick={handleExport}>导出 CSV</Button>
            <Button icon={<ReloadOutlined />} loading={loading} onClick={load}>刷新数据</Button>
          </>
        )}
      />
      <section className="surface table-surface">
        <div className="table-toolbar">
          <div className="table-summary">
            <span><strong>{leads.length}</strong>条匹配</span>
            <span><strong>{pendingCount}</strong>条待跟进</span>
          </div>
          <div className="table-filters">
            <Input.Search
              allowClear
              placeholder="搜索称呼 / 联系方式 / 留言"
              style={{ width: 240 }}
              onSearch={(value) => setKeyword(value)}
              onChange={(e) => { if (!e.target.value) setKeyword('') }}
            />
            <Segmented
              value={status}
              onChange={setStatus}
              options={[
                { label: '全部', value: 'all' },
                { label: '待跟进', value: 'pending' },
                { label: '已处理', value: 'handled' },
              ]}
            />
            <DatePicker.RangePicker value={range} onChange={setRange} placeholder={['开始日期', '结束日期']} />
          </div>
        </div>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={leads}
          pagination={{ pageSize: 20, showSizeChanger: false }}
          scroll={{ x: 1010 }}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <strong>完整留言</strong>
                <p className="lead-message">{record.content || '未填写留言内容'}</p>
              </div>
            ),
            rowExpandable: (record) => !!record.content,
          }}
          locale={{
            emptyText: <PageEmpty title="暂无咨询线索" description="访客提交联系表单后，线索会显示在这里。" />,
          }}
        />
      </section>
    </>
  )
}
