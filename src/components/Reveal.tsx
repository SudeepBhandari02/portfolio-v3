import type { ReactNode } from 'react'
import { motion } from 'motion/react'

export const BASE_EASE = [0.22, 1, 0.36, 1] as const

// Scroll reveal (B7): rise 32px and fade in once, on the base curve.
// Reduced motion is handled globally by <MotionConfig reducedMotion="user"> (opacity only).
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay, ease: BASE_EASE }}
    >
      {children}
    </motion.div>
  )
}
