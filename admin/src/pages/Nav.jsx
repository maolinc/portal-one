import { useEffect, useState } from 'react'
import { App, Button, Input, Switch, Tooltip } from 'antd'
import { SaveOutlined, PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { api } from '../api.js'
import { PageHeader, PageLoading } from '../components/AdminUI.jsx'

// 导航菜单：主营业务/服务项目下拉由对应集合自动生成，其余项手动维护
function NavRow({ node, depth, onChange, onRemove, onMove, index, count }) {
  const set = (patch) => onChange({ ...node, ...patch })
  const setLabel = (locale, value) => onChange({ ...node, labels: { ...node.labels, [locale]: value } })
  const title = node.labels?.zh || node.labels?.en || node.path || '未命名菜单'

  return (
    <div className={`nav-node-wrap depth-${depth}`}>
      <div className="nav-node">
        <div className="nav-node__header">
          <div className="nav-node__title">
            <Switch size="small" checked={node.visible !== false} onChange={(value) => set({ visible: value })} />
            <strong>{title}</strong>
            {node.autoSource ? (
              <span className="auto-source-tag">
                自动同步{node.autoSource === 'business' ? '主营业务' : '服务项目'}
              </span>
            ) : null}
          </div>
          <div className="icon-actions">
            <Tooltip title="上移">
              <Button type="text" size="small" icon={<ArrowUpOutlined />} aria-label="上移" disabled={index === 0} onClick={() => onMove(index, -1)} />
            </Tooltip>
            <Tooltip title="下移">
              <Button type="text" size="small" icon={<ArrowDownOutlined />} aria-label="下移" disabled={index === count - 1} onClick={() => onMove(index, 1)} />
            </Tooltip>
            <Tooltip title="删除">
              <Button type="text" size="small" danger icon={<DeleteOutlined />} aria-label="删除" onClick={onRemove} />
            </Tooltip>
          </div>
        </div>
        <div className="nav-node__fields">
          <div className="nav-node__field">
            <label>中文名称</label>
            <Input placeholder="中文名" value={node.labels?.zh ?? ''} onChange={(e) => setLabel('zh', e.target.value)} />
          </div>
          <div className="nav-node__field">
            <label>英文名称</label>
            <Input placeholder="English" value={node.labels?.en ?? ''} onChange={(e) => setLabel('en', e.target.value)} />
          </div>
          <div className="nav-node__field">
            <label>跳转路径</label>
            <Input placeholder="/about/profile" value={node.path ?? ''} onChange={(e) => set({ path: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  )
}

function moveItem(arr, i, dir) {
  const j = i + dir
  if (j < 0 || j >= arr.length) return arr
  const next = [...arr]
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

export default function Nav() {
  const { message } = App.useApp()
  const [tree, setTree] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/nav').then(setTree).catch((e) => message.error(e.message))
  }, [message])

  if (!tree) return <PageLoading rows={7} />

  const updateAt = (nodes, idx, patch) => nodes.map((node, i) => (i === idx ? patch : node))

  const renderLevel = (nodes, setNodes, depth) =>
    nodes.map((node, i) => (
      <div className="nav-branch" key={`${depth}-${i}`}>
        <NavRow
          node={node}
          depth={depth}
          index={i}
          count={nodes.length}
          onChange={(next) => setNodes(updateAt(nodes, i, next))}
          onRemove={() => setNodes(nodes.filter((_, j) => j !== i))}
          onMove={(idx, dir) => setNodes(moveItem(nodes, idx, dir))}
        />
        {!node.autoSource && node.children?.length
          ? renderLevel(node.children, (nextChildren) => setNodes(updateAt(nodes, i, { ...node, children: nextChildren })), depth + 1)
          : null}
        {!node.autoSource && depth === 0 ? (
          <Button
            className={`nav-child-action depth-${depth}`}
            size="small"
            type="text"
            icon={<PlusOutlined />}
            onClick={() => setNodes(updateAt(nodes, i, { ...node, children: [...(node.children ?? []), { path: '', visible: true, labels: {}, children: [] }] }))}
          >
            添加子菜单
          </Button>
        ) : null}
      </div>
    ))

  const save = async () => {
    setSaving(true)
    try {
      const saved = await api.put('/nav', { items: tree })
      setTree(saved)
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
        title="导航菜单"
        description="维护菜单名称、链接、显示状态和层级顺序。主营业务与服务项目的下拉内容会自动同步集合数据。"
        actions={(
          <>
            <Button icon={<PlusOutlined />} onClick={() => setTree([...tree, { path: '', visible: true, labels: {}, children: [] }])}>
              添加顶级菜单
            </Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={save}>
              保存修改
            </Button>
          </>
        )}
      />
      <section className="surface">
        <div className="surface__header">
          <div>
            <h2>菜单结构</h2>
            <p>开启状态、双语名称与跳转路径集中在同一个菜单块中。</p>
          </div>
        </div>
        <div className="surface__body nav-editor-list">
          {renderLevel(tree, setTree, 0)}
        </div>
      </section>
    </>
  )
}
