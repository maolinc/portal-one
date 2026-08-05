import { useState } from 'react'
import { App, Button, Input, InputNumber, Switch, Tooltip, Upload } from 'antd'
import {
  PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined,
  UploadOutlined, LinkOutlined, VideoCameraOutlined,
} from '@ant-design/icons'
import { api } from '../api.js'
import { useUpload } from '../hooks/useUpload.js'
import ImageUpload from './ImageUpload.jsx'

// schema 驱动的受控表单渲染器：value 为纯 JSON 对象，onChange 回传新对象
// 字段类型：text | textarea | number | image | video | boolean | seo | group | list | objects

function Field({ def, value, onChange }) {
  switch (def.type ?? 'text') {
    case 'textarea':
      return <Input.TextArea rows={def.rows ?? 3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    case 'number':
      return <InputNumber className="schema-number-input" value={value ?? 0} onChange={(v) => onChange(v ?? 0)} />
    case 'image':
      return <ImageUpload value={value} onChange={onChange} />
    case 'video':
      return <VideoField value={value} onChange={onChange} />
    case 'boolean':
      return <Switch checked={!!value} onChange={onChange} />
    case 'seo':
      return <SeoField value={value ?? {}} onChange={onChange} />
    case 'group':
      return (
        <div className="schema-group">
          <SchemaFields schema={def.fields} value={value ?? {}} onChange={onChange} />
        </div>
      )
    case 'list':
      return <ListField def={def} value={Array.isArray(value) ? value : []} onChange={onChange} />
    case 'objects':
      return <ObjectsField def={def} value={Array.isArray(value) ? value : []} onChange={onChange} />
    default:
      return <Input value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
  }
}

function SeoField({ value, onChange }) {
  const title = value.title ?? ''
  const description = value.description ?? ''

  return (
    <div className="seo-editor-grid">
      <div className="seo-editor-fields">
        <Labeled label="Title">
          <Input value={title} onChange={(e) => onChange({ ...value, title: e.target.value })} />
          <div className="field-count">{title.length} 字符</div>
        </Labeled>
        <Labeled label="Description">
          <Input.TextArea rows={3} value={description} onChange={(e) => onChange({ ...value, description: e.target.value })} />
          <div className="field-count">{description.length} 字符</div>
        </Labeled>
        <Labeled label="Keywords">
          <Input value={value.keywords ?? ''} onChange={(e) => onChange({ ...value, keywords: e.target.value })} />
        </Labeled>
      </div>
      <aside className="seo-preview" aria-label="搜索结果预览">
        <div className="seo-preview__label">搜索结果预览</div>
        <div className="seo-preview__url">portal.example.com</div>
        <div className="seo-preview__title">{title || '页面标题将在这里显示'}</div>
        <div className="seo-preview__description">
          {description || '填写页面描述后，可在这里预览搜索结果中的标题与摘要层级。'}
        </div>
      </aside>
    </div>
  )
}

function move(arr, i, dir) {
  const j = i + dir
  if (j < 0 || j >= arr.length) return arr
  const next = [...arr]
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

function ListOps({ i, len, onChange, value, onRemove }) {
  return (
    <div className="icon-actions">
      <Tooltip title="上移">
        <Button
          type="text"
          size="small"
          icon={<ArrowUpOutlined />}
          aria-label="上移"
          disabled={i === 0}
          onClick={() => onChange(move(value, i, -1))}
        />
      </Tooltip>
      <Tooltip title="下移">
        <Button
          type="text"
          size="small"
          icon={<ArrowDownOutlined />}
          aria-label="下移"
          disabled={i === len - 1}
          onClick={() => onChange(move(value, i, 1))}
        />
      </Tooltip>
      <Tooltip title="删除">
        <Button type="text" size="small" danger icon={<DeleteOutlined />} aria-label="删除" onClick={onRemove} />
      </Tooltip>
    </div>
  )
}

function ListField({ def, value, onChange }) {
  const itemType = def.itemType ?? 'text'
  return (
    <div className="schema-repeater">
      {value.length === 0 ? <div className="list-empty">暂无内容，添加后可调整顺序</div> : null}
      {value.map((item, i) => (
        <div className="list-row" key={i}>
          <div className="list-row__number">{String(i + 1).padStart(2, '0')}</div>
          <Field
            def={{ type: itemType }}
            value={item}
            onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))}
          />
          <ListOps
            i={i}
            len={value.length}
            value={value}
            onChange={onChange}
            onRemove={() => onChange(value.filter((_, j) => j !== i))}
          />
        </div>
      ))}
      <Button className="repeater-add" icon={<PlusOutlined />} onClick={() => onChange([...value, ''])}>
        添加内容
      </Button>
    </div>
  )
}

function emptyValue(field) {
  if (field.type === 'number') return 0
  if (field.type === 'boolean') return false
  if (field.type === 'group' || field.type === 'seo') return {}
  if (field.type === 'list' || field.type === 'objects') return []
  return ''
}

function ObjectsField({ def, value, onChange }) {
  const empty = Object.fromEntries(def.fields.map((field) => [field.name, emptyValue(field)]))
  const itemLabel = def.itemLabel ?? '条目'

  return (
    <div className="schema-repeater">
      {value.length === 0 ? <div className="list-empty">暂无{itemLabel}，添加后可调整顺序</div> : null}
      {value.map((item, i) => {
        const summary = item?.title || item?.name || item?.q || `${itemLabel} ${i + 1}`
        return (
          <section className="repeater-item" key={i}>
            <div className="repeater-item__header">
              <div className="repeater-item__title">
                <span className="repeater-item__index">{String(i + 1).padStart(2, '0')}</span>
                <strong>{summary}</strong>
              </div>
              <ListOps
                i={i}
                len={value.length}
                value={value}
                onChange={onChange}
                onRemove={() => onChange(value.filter((_, j) => j !== i))}
              />
            </div>
            <div className="repeater-item__body">
              <SchemaFields
                schema={def.fields}
                value={item ?? {}}
                onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))}
              />
            </div>
          </section>
        )
      })}
      <Button className="repeater-add" icon={<PlusOutlined />} onClick={() => onChange([...value, { ...empty }])}>
        添加{itemLabel}
      </Button>
    </div>
  )
}

function Labeled({ label, children }) {
  return (
    <div className="schema-field">
      <label className="schema-field__label">{label}</label>
      {children}
    </div>
  )
}

// 视频：粘贴外链或上传文件，二者共用同一个 url 字符串
export function VideoField({ value, onChange }) {
  const { message } = App.useApp()
  const { uploading, progress, upload } = useUpload()
  const [signing, setSigning] = useState(false)
  const busy = uploading || signing

  const uploadFile = async ({ file, onSuccess, onError }) => {
    try {
      setSigning(true)
      const { uploadUrl, publicUrl } = await api.signUpload({
        filename: file.name,
        contentType: file.type,
        size: file.size,
      })
      setSigning(false)
      await upload(file, { uploadUrl, contentType: file.type })
      onChange(publicUrl)
      onSuccess(publicUrl)
    } catch (e) {
      setSigning(false)
      message.error(e.message)
      onError(e)
    }
  }

  return (
    <div className="video-field">
      {value ? (
        <div className="media-preview">
          <video src={value} controls />
        </div>
      ) : (
        <div className="media-empty">
          <VideoCameraOutlined />
          <strong>尚未添加视频</strong>
          <span>可粘贴 mp4 直链，也可以从本地上传视频文件</span>
        </div>
      )}
      <Input
        prefix={<LinkOutlined />}
        placeholder="粘贴视频直链"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        allowClear
        disabled={busy}
      />
      <div className="media-actions">
        <Upload accept="video/*" showUploadList={false} disabled={busy} customRequest={uploadFile}>
          <Button icon={<UploadOutlined />} loading={busy}>
            {busy ? (signing ? '正在准备' : `上传中 ${progress}%`) : value ? '替换视频' : '上传视频'}
          </Button>
        </Upload>
        {value && !busy ? (
          <Button danger type="text" icon={<DeleteOutlined />} onClick={() => onChange(null)}>
            移除
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export default function SchemaFields({ schema, value, onChange }) {
  return (
    <div className="schema-fields">
      {schema.map((def) => {
        const isBoolean = def.type === 'boolean'
        return (
          <div className={`schema-field ${isBoolean ? 'schema-field--boolean' : ''}`} key={def.name}>
            <label className="schema-field__label">{def.label}</label>
            <Field
              def={def}
              value={value?.[def.name]}
              onChange={(v) => onChange({ ...(value ?? {}), [def.name]: v })}
            />
          </div>
        )
      })}
    </div>
  )
}
