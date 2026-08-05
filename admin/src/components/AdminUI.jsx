import { Button, Empty, Skeleton } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export function PageHeader({ title, description, actions, status }) {
  return (
    <header className="page-header">
      <div className="page-header__copy">
        <div className="page-header__title-row">
          <h1>{title}</h1>
          {status}
        </div>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="page-header__actions">{actions}</div> : null}
    </header>
  )
}

export function SaveStatus({ dirty, saving }) {
  const label = saving ? '正在保存' : dirty ? '有未保存修改' : '已保存'
  return <span className={`save-status ${dirty ? 'is-dirty' : ''}`}>{label}</span>
}

export function PageLoading({ rows = 4 }) {
  return (
    <div className="page-loading" aria-label="正在加载">
      <Skeleton active title={{ width: '32%' }} paragraph={{ rows: 1, width: ['58%'] }} />
      <div className="surface page-loading__surface">
        <Skeleton active title={false} paragraph={{ rows }} />
      </div>
    </div>
  )
}

export function PageEmpty({ title, description, actionLabel, onAction }) {
  return (
    <div className="page-empty">
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={null}>
        <h3>{title}</h3>
        <p>{description}</p>
        {actionLabel ? (
          <Button type="primary" icon={<PlusOutlined />} onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </Empty>
    </div>
  )
}

export function FieldBlock({ label, help, children, className = '' }) {
  return (
    <div className={`field-block ${className}`.trim()}>
      <div className="field-block__label">{label}</div>
      {help ? <div className="field-block__help">{help}</div> : null}
      <div className="field-block__control">{children}</div>
    </div>
  )
}
