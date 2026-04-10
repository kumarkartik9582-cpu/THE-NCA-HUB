'use client'
/**
 * ScrollProgress — thin gold progress bar fixed at top of viewport.
 * Grows from left as the user scrolls down the page.
 * Drop into any page where reading progress matters (blog posts, notes pages).
 */
import { useScroll, useTransform, motion } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 2,
        background: 'linear-gradient(90deg, var(--g1), var(--g0), var(--g1))',
        scaleX,
        transformOrigin: 'left',
        zIndex: 9050,
        boxShadow: '0 0 10px rgba(201,168,76,0.55)',
        pointerEvents: 'none',
      }}
    />
  )
}
