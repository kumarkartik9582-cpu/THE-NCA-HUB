'use client'
/**
 * template.tsx — per-route page transition wrapper.
 * Unlike layout.tsx (persistent), Next.js re-mounts template on every navigation,
 * which triggers a fresh entrance animation on each route change.
 */
import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
