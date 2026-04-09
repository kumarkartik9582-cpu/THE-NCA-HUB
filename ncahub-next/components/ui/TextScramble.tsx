'use client'
/**
 * TextScramble — characters cycle through random symbols before
 * settling on the real text. Creates a "decoding" effect.
 *
 * Restored from original index.html hero subtitle effect.
 */
import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*'

interface TextScrambleProps {
  text: string
  /** Delay before scramble starts (ms) */
  delay?: number
  /** Total duration of the scramble (ms) */
  duration?: number
  className?: string
  style?: React.CSSProperties
}

export default function TextScramble({
  text,
  delay = 0,
  duration = 1200,
  className,
  style,
}: TextScrambleProps) {
  const [display, setDisplay] = useState('')
  const rafRef = useRef(0)
  const startedRef = useRef(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (startedRef.current) return
      startedRef.current = true

      const chars = text.split('')
      const totalFrames = Math.round(duration / 16.67) // ~60fps
      let frame = 0
      const startTime = performance.now()

      const animate = () => {
        const elapsed = performance.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Characters resolve left-to-right based on progress
        const resolved = Math.floor(progress * chars.length)

        const output = chars.map((char, i) => {
          if (char === ' ') return ' '
          if (i < resolved) return char
          // Random character from CHARS
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')

        setDisplay(output)
        frame++

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate)
        } else {
          setDisplay(text)
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(rafRef.current)
    }
  }, [text, delay, duration])

  return (
    <span className={className} style={style}>
      {display || '\u00A0'}
    </span>
  )
}
