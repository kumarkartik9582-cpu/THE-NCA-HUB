'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const EXPO = [0.16, 1, 0.3, 1] as const

export default function NotFound() {
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
        {/* 404 — dramatic scale entrance */}
        <motion.div
          className="text-depth"
          initial={{ opacity: 0, scale: 1.15, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.0, ease: EXPO }}
          style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(6rem, 15vw, 12rem)',
            fontWeight: 300,
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          <span className="gradient-text">404</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2, ease: EXPO }}
          style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 400,
            color: 'var(--cream)',
            marginBottom: 16,
            lineHeight: 1.2,
          }}
        >
          Page not found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.65, delay: 0.38 }}
          style={{
            fontSize: 'var(--sm)',
            color: 'var(--fog)',
            lineHeight: 1.75,
            marginBottom: 40,
          }}
        >
          The page you are looking for does not exist or has been moved.
          Let us help you find what you need.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.52, ease: EXPO }}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link href="/" className="bp" style={{ borderRadius: 4 }}>
            <span>Back to Home →</span>
          </Link>
          <Link href="/notes/" className="nc" style={{ borderRadius: 4 }}>
            <span>View Notes</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
