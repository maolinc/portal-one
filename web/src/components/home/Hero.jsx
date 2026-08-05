import { useCallback, useEffect, useState } from 'react'
import { LocaleLink as Link } from '../../i18n/LocaleLink.jsx'
import { useT } from '../../i18n/LangProvider.jsx'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CaretLeft, CaretRight, ArrowRight } from '@phosphor-icons/react'
import MediaImage from '../common/MediaImage.jsx'

// 首页 Hero 轮播：自动播放 5s，悬停暂停，支持手势滑动
export default function Hero({ slides }) {
  const t = useT()
  const [[index, direction], setState] = useState([0, 0])
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const count = slides.length

  const paginate = useCallback(
    (dir) => setState(([i]) => [(i + dir + count) % count, dir]),
    [count],
  )

  useEffect(() => {
    if (reduce || paused || count < 2) return
    const t = setInterval(() => paginate(1), 5000)
    return () => clearInterval(t)
  }, [reduce, paused, paginate, count])

  const slide = slides[index]

  const variants = reduce
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: (dir) => ({ x: dir >= 0 ? '100%' : '-100%', opacity: 0.4 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir >= 0 ? '-100%' : '100%', opacity: 0.4 }),
      }

  return (
    <section
      className="hero-h relative max-h-[620px] min-h-[420px] overflow-hidden bg-brand-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription={t('hero.carousel')}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          drag={reduce ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_e, info) => {
            if (info.offset.x < -90) paginate(1)
            else if (info.offset.x > 90) paginate(-1)
          }}
          className="absolute inset-0"
        >
          <MediaImage
            src={slide.image}
            alt=""
            video={slide.video}
            videoAutoplay={slide.videoAutoplay}
            variant="inline"
            onPlay={() => setPaused(true)}
            sizes="100vw"
            eager={index === 0}
            draggable={false}
            fetchpriority={index === 0 ? 'high' : 'auto'}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-950/65 md:bg-gradient-to-r md:from-brand-950/90 md:via-brand-950/60 md:to-brand-950/20" />
          <div className="container-x relative z-10 flex h-full items-center">
            <div className="w-full max-w-xl text-white">
              <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl md:leading-tight">
                {slide.title}
              </h1>
              <p className="mt-4 max-w-full text-base leading-7 text-white/90 md:text-lg">{slide.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/contact#form" className="btn-primary">
                  {t('common.consult')}
                  <ArrowRight className="size-4" />
                </Link>
                <Link to={slide.link} className="btn-outline-light">
                  {t('common.viewDetails')}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={t('hero.goToSlide', { n: i + 1 })}
            onClick={() => setState(([cur]) => [i, i > cur ? 1 : -1])}
            className={`group flex h-7 items-center justify-center transition-all duration-300 ${
              i === index ? 'w-9' : 'w-6'
            }`}
          >
            <span
              className={`h-1.5 w-full rounded-full transition ${
                i === index ? 'bg-accent-500' : 'bg-white/40 group-hover:bg-white/70'
              }`}
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label={t('hero.prev')}
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 place-items-center rounded-full border border-white/30 p-3 text-white/80 transition hover:bg-white/10 hover:text-white md:grid"
      >
        <CaretLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label={t('hero.next')}
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 place-items-center rounded-full border border-white/30 p-3 text-white/80 transition hover:bg-white/10 hover:text-white md:grid"
      >
        <CaretRight className="size-5" />
      </button>
    </section>
  )
}
