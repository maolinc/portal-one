import { useT } from '../../i18n/LangProvider.jsx'
import { WarningCircle, ArrowClockwise } from '@phosphor-icons/react'

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />
}

export function PageLoading() {
  return (
    <div className="container-x section space-y-8">
      <Skeleton className="h-9 w-56" />
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

export function PageError({ error, onRetry }) {
  const t = useT()
  return (
    <div className="container-x section flex flex-col items-center py-24 text-center">
      <WarningCircle className="size-12 text-accent-600" />
      <h2 className="mt-4 text-xl font-semibold text-brand-950">{t('states.errorTitle')}</h2>
      <p className="mt-2 text-sm text-slate-500">{error?.message || t('states.networkError')}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-outline mt-6">
          <ArrowClockwise className="size-4" />
          {t('states.retry')}
        </button>
      )}
    </div>
  )
}
