import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react'

export function CountUp({ to, duration = 1.8 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString('en-US'))

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      mv.set(to)
      return
    }
    const controls = animate(mv, to, { duration, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [inView, to, reduce, duration, mv])

  return (
    <span ref={ref}>
      <motion.span>{text}</motion.span>
    </span>
  )
}

// 数据统计带：数字滚动动画，深底浅字全宽
export default function StatBand({ stats }) {
  return (
    <div className="bg-brand-950">
      <dl className="container-x grid grid-cols-2 gap-x-4 gap-y-10 py-12 md:grid-cols-4 md:py-14">
        {stats.map((s) => (
          <div key={s.label} className="text-center md:text-left">
            <dd className="font-display text-4xl font-bold tracking-wide text-white md:text-5xl">
              <CountUp to={s.value} />
              <span className="ml-1 text-2xl text-accent-400 md:text-3xl">{s.suffix}</span>
            </dd>
            <dt className="mt-2 text-sm text-white/75">{s.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  )
}
