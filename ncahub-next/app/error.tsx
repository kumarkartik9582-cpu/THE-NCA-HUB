'use client'
import { motion } from 'framer-motion'

const EXPO = [0.16, 1, 0.3, 1] as const

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(80px, 12vh, 140px) clamp(24px, 5vw, 72px)',
      position: 'relative',
      zIndex: 2,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 560 }}>
        <motion.div
          className="text-depth"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, ease: EXPO }}
          style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 300,
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          <span className="gradient-text">Oops</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: EXPO }}
          style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 400,
            color: 'var(--cream)',
            marginBottom: 16,
          }}
        >
          Something went wrong
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          style={{
            fontSize: 'var(--sm)',
            color: 'var(--fog)',
            lineHeight: 1.75,
            marginBottom: 40,
          }}
        >
          An unexpected error occurred. Please try again.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.44, ease: EXPO }}
        >
          <button onClick={reset} className="bp" style={{ borderRadius: 4 }}>
            <span>Try Again →</span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
