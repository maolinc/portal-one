import { motion, useReducedMotion } from 'motion/react'

// 滚动入场动效（可降级：prefers-reduced-motion 时直接静态渲染）
export default function Reveal({ children, delay = 0, y = 24, className }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
