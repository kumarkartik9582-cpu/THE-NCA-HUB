'use client'
/**
 * Preloader — cinematic split-screen reveal with loading progress.
 *
 * Sequence:
 * 1. Two halves cover the screen (top + bottom, dark void)
 * 2. Gold line draws across center
 * 3. Status messages rotate ("Initializing" → "Building frameworks" → "Almost ready")
 * 4. Percentage counter fills
 * 5. Halves slide apart revealing the page beneath
 * 6. Component unmounts after reveal
 *
 * Restored from original index.html preloader pattern.
 */
import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

const STATUS_MESSAGES = [
  'Initializing',
  'Loading materials',
  'Building frameworks',
  'Preparing exam strategy',
  'Almost ready',
]

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null!)
  const topRef = useRef<HTMLDivElement>(null!)
  const bottomRef = useRef<HTMLDivElement>(null!)
  const lineRef = useRef<HTMLDivElement>(null!)
  const percentRef = useRef<HTMLSpanElement>(null!)
  const statusRef = useRef<HTMLSpanElement>(null!)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false)
        onComplete()
      },
    })

    // Animate percentage counter
    const counter = { val: 0 }
    let statusIdx = 0

    tl
      // 1. Gold line draws across center (0→0.4s)
      .fromTo(lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: 'power2.inOut' },
        0
      )
      // 2. Percentage counts up (0→1.8s)
      .to(counter, {
        val: 100,
        duration: 1.8,
        ease: 'power1.inOut',
        onUpdate: () => {
          if (percentRef.current) percentRef.current.textContent = Math.round(counter.val) + '%'
          // Rotate status messages at thresholds
          const newIdx = Math.min(Math.floor(counter.val / 22), STATUS_MESSAGES.length - 1)
          if (newIdx !== statusIdx && statusRef.current) {
            statusIdx = newIdx
            gsap.to(statusRef.current, {
              opacity: 0, y: -8, duration: 0.15,
              onComplete: () => {
                if (statusRef.current) {
                  statusRef.current.textContent = STATUS_MESSAGES[statusIdx]
                  gsap.to(statusRef.current, { opacity: 1, y: 0, duration: 0.15 })
                }
              },
            })
          }
        },
      }, 0.2)
      // 3. Brief hold at 100% (1.8→2.1s)
      .to({}, { duration: 0.3 })
      // 4. Gold line fades
      .to(lineRef.current, { opacity: 0, duration: 0.2 }, '+=0')
      // 5. Halves slide apart (reveal) (2.3→3.0s)
      .to(topRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
      }, '-=0.1')
      .to(bottomRef.current, {
        yPercent: 100,
        duration: 0.8,
        ease: 'power4.inOut',
      }, '<')

    // Safety timeout — force-reveal after 4 seconds even if GSAP fails
    const safetyTimeout = setTimeout(() => {
      tl.progress(1)
    }, 4000)

    return () => {
      clearTimeout(safetyTimeout)
      tl.kill()
    }
  }, [onComplete])

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        pointerEvents: 'all',
      }}
    >
      {/* Top half */}
      <div
        ref={topRef}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, height: '50%',
          background: 'var(--void)',
          zIndex: 2,
        }}
      />
      {/* Bottom half */}
      <div
        ref={bottomRef}
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0, height: '50%',
          background: 'var(--void)',
          zIndex: 2,
        }}
      />
      {/* Center content */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: 'var(--fd)',
          fontSize: '1.4rem',
          fontWeight: 500,
          color: 'var(--g1)',
          letterSpacing: '.06em',
          marginBottom: 8,
        }}>
          THE NCA HUB
        </div>
        {/* Gold line */}
        <div
          ref={lineRef}
          style={{
            width: 120,
            height: 1,
            background: 'linear-gradient(90deg, transparent, var(--g1), transparent)',
            transformOrigin: 'center',
            boxShadow: '0 0 12px rgba(201,168,76,0.3)',
          }}
        />
        {/* Percentage */}
        <span
          ref={percentRef}
          style={{
            fontFamily: 'var(--fb)',
            fontSize: 'var(--nano)',
            letterSpacing: '.3em',
            color: 'var(--g2)',
            fontWeight: 600,
          }}
        >
          0%
        </span>
        {/* Status message */}
        <span
          ref={statusRef}
          style={{
            fontFamily: 'var(--fb)',
            fontSize: 'var(--nano)',
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: 'var(--dim)',
          }}
        >
          {STATUS_MESSAGES[0]}
        </span>
      </div>
    </div>
  )
}
