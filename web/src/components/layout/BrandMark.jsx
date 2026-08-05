import { useEffect, useState } from 'react'

function fallbackMark(company) {
  const name = String(company?.shortName || company?.nameEn || company?.name || '').trim()
  const words = name.match(/[A-Za-z0-9]+/g)
  if (words?.length) return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase()
  return [...name.replace(/\s/g, '')].slice(0, 2).join('')
}

export default function BrandMark({ company, className = 'size-10' }) {
  const [failed, setFailed] = useState(false)
  const logo = company?.logo
  const label = company?.shortName || company?.name || company?.nameEn || ''

  useEffect(() => {
    setFailed(false)
  }, [logo])

  if (!company) {
    return <span className={`shrink-0 animate-pulse rounded-lg bg-slate-200/80 ${className}`} aria-hidden="true" />
  }

  if (logo && !failed) {
    return (
      <span className={`grid shrink-0 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200/70 ${className}`}>
        <img
          src={logo}
          alt={`${label} Logo`}
          className="size-full object-contain p-1"
          loading="eager"
          onError={() => setFailed(true)}
        />
      </span>
    )
  }

  return (
    <span className={`grid shrink-0 place-items-center rounded-lg bg-accent-600 font-display text-lg font-bold tracking-wide text-white ${className}`}>
      {fallbackMark(company)}
    </span>
  )
}
