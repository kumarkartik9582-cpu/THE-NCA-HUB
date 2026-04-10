'use client'
/**
 * Preloader — cinematic split-screen reveal with Framer Motion.
 *
 * Sequence:
 * 1. Character-by-character logo reveal in the top panel
 * 2. Gold progress line grows left-to-right in the center seam
 * 3. Percentage counter climbs 0→100% in the bottom panel
 * 4. Status messages cycle with AnimatePresence fade
 * 5. Both panels slide apart (top: y -100%, bottom: y +100%) with expo ease
 * 6. Component unmounts after reveal
 */
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'

const CHARS = [...'THE NCA HUB']

const STATUS = [
  'Initializing',
  'Loading materials',
  'Building frameworks',
  'Preparing exam strategy',
  'Almost ready',
]

const EXPO = [0.16, 1, 0.3, 1] as const
const EXIT_EASE = [0.76, 0, 0.24, 1] as const

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false)
  const [done, setDone] = useState(false)
  const [statusIdx, setStatusIdx] = useState(0)
  const progress = useMotionValue(0)
  const pct = useTransform(progress, (v) => `${Math.round(v)}%`)
  const lineScale = useTransform(progress, [0, 100], [0, 1])

  useEffect(() => {
    const controls = animate(progress, 100, {
      duration: 1.8,
      ease: 'easeInOut',
      delay: 0.5,
      onUpdate: (v) => {
        setStatusIdx(Math.min(Math.floor(v / 22), STATUS.length - 1))
      },
      onComplete: () => {
        setTimeout(() => {
          setExiting(true)
          setTimeout(() => {
            setDone(true)
            onComplete()
          }, 900)
        }, 450)
      },
    })

    // Safety fallback — force reveal after 4.5s if anything hangs
    const safety = setTimeout(() => {
      controls.stop()
      setExiting(true)
      setTimeout(() => { setDone(true); onComplete() }, 900)
    }, 4500)

    return () => {
      controls.stop()
      clearTimeout(safety)
    }
  }, [onComplete, progress])

  if (done) return null

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'all' }}
    >
      {/* ── TOP PANEL ── logo letter-by-letter ── */}
      <motion.div
        animate={exiting ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 0.85, ease: EXIT_EASE }}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, height: '50%',
          background: 'var(--void)', zIndex: 2,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 40,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'var(--fd)',
            fontSize: '1.5rem',
            fontWeight: 500,
            letterSpacing: '.10em',
            color: 'var(--g1)',
          }}
        >
          {CHARS.map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 + i * 0.045, ease: EXPO }}
              style={{ display: 'inline-block' }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* ── CENTER SEAM ── gold progress line ── */}
      <div
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            width: 200, height: 1,
            background: 'rgba(201,168,76,.12)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0, bottom: 0, right: 0,
              background: 'linear-gradient(90deg, transparent, var(--g1), transparent)',
              boxShadow: '0 0 10px rgba(201,168,76,0.5)',
              scaleX: lineScale,
              transformOrigin: 'left',
            }}
          />
        </motion.div>
      </div>

      {/* ── BOTTOM PANEL ── percentage + status ── */}
      <motion.div
        animate={exiting ? { y: '100%' } : { y: 0 }}
        transition={{ duration: 0.85, ease: EXIT_EASE }}
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0, height: '50%',
          background: 'var(--void)', zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 40,
          gap: 14,
        }}
      >
        {/* Live percentage */}
        <motion.span
          style={{
            fontFamily: 'var(--fb)',
            fontSize: 'var(--nano)',
            letterSpacing: '.3em',
            color: 'var(--g2)',
            fontWeight: 600,
          }}
        >
          {pct}
        </motion.span>

        {/* Cycling status messages */}
        <AnimatePresence mode="wait">
          <motion.span
            key={statusIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            style={{
              fontFamily: 'var(--fb)',
              fontSize: 'var(--nano)',
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: 'var(--dim)',
            }}
          >
            {STATUS[statusIdx]}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
