import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Play, X } from '@phosphor-icons/react'
import SiteImage from './SiteImage.jsx'
import { useT } from '../../i18n/LangProvider.jsx'

// 统一媒体展示：无视频时等同 SiteImage；有视频时叠加播放按钮；autoplay 时直接渲染视频
// 调用方父级需为定位元素（relative / absolute），以便播放按钮 absolute 定位正确
// 注意：播放按钮用 span[role=button] 而非 <button>，避免在 <Link>/<a> 内部形成无效嵌套（button inside a）
// 导致浏览器 DOM 修正破坏事件链、stopPropagation 失效
export default function MediaImage({
  src,
  alt = '',
  video,
  videoAutoplay = false,
  variant = 'inline',
  className,
  sizes = '100vw',
  eager = false,
  onPlay,
  onEnded,
  ...rest
}) {
  const t = useT()
  const [playing, setPlaying] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  if (!video) {
    return (
      <SiteImage src={src} alt={alt} className={className} sizes={sizes} eager={eager} {...rest} />
    )
  }

  if (videoAutoplay) {
    return (
      <video
        src={video}
        poster={src}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        className={className}
        onEnded={onEnded}
        {...rest}
      />
    )
  }

  const handleEnded = (e) => {
    onEnded?.(e)
    if (!src) return

    if (variant === 'modal') setModalOpen(false)
    else setPlaying(false)
  }

  if (playing && variant === 'inline') {
    return (
      <video
        src={video}
        poster={src}
        controls
        autoPlay
        playsInline
        preload="metadata"
        className={className}
        onEnded={handleEnded}
        {...rest}
      />
    )
  }

  const handlePlay = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (variant === 'modal') setModalOpen(true)
    else {
      setPlaying(true)
      onPlay?.()
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      handlePlay(e)
    }
  }

  return (
    <>
      <SiteImage src={src} alt={alt} className={`peer ${className ?? ''}`} sizes={sizes} eager={eager} {...rest} />
      <span
        role="button"
        tabIndex={0}
        data-play-button
        aria-label={t('common.playVideo')}
        onClick={handlePlay}
        onKeyDown={handleKey}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute left-1/2 top-1/2 z-10 grid size-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-black/25 text-white/85 backdrop-blur-sm transition hover:bg-black/55 peer-hover:bg-black/45"
      >
        <Play className="size-4 translate-x-px" weight="fill" />
      </span>
      {modalOpen && (
        <ModalVideo
          src={video}
          poster={src}
          alt={alt}
          onEnded={handleEnded}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}

function ModalVideo({ src, poster, alt, onEnded, onClose }) {
  const t = useT()
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  // portal 的 React 事件仍会沿组件树冒泡到外层 Link，必须拦截，否则关闭弹窗会触发跳转
  const handleClose = (e) => {
    e.stopPropagation()
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('common.playVideo')}
    >
      <button
        type="button"
        onClick={handleClose}
        aria-label={t('common.closeVideo')}
        className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <X className="size-5" />
      </button>
      <video
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        preload="metadata"
        title={alt}
        onEnded={onEnded}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-[92vw] rounded-lg bg-black"
      />
    </div>,
    document.body,
  )
}
