'use client'
/**
 * SplitText — kinetic character/word reveal powered by GSAP.
 *
 * Usage:
 *   <SplitText text="Pass the NCA." by="chars" delay={0.4} />
 *   <SplitText text="This cycle." by="words" stagger={0.08} />
 *
 * Each char/word is wrapped in an overflow:hidden span so the
 * translateY reveal looks clean with no flicker.
 */
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

type SplitBy = 'chars' | 'words' | 'lines'

interface SplitTextProps {
  text: string
  by?: SplitBy
  /** Initial delay before stagger starts (seconds) */
  delay?: number
  /** Per-element stagger (seconds) */
  stagger?: number
  /** Duration per element (seconds) */
  duration?: number
  /** Fire on scroll (true) or immediately on mount (false) */
  scrollTrigger?: boolean
  /** Extra CSS class on the root element */
  className?: string
  style?: React.CSSProperties
  /** Forwarded element tag */
  as?: keyof JSX.IntrinsicElements
  /** Colour for each token — can include 'var(--g1)' etc. */
  tokenColor?: string
}

export default function SplitText({
  text,
  by = 'words',
  delay = 0,
  stagger = 0.04,
  duration = 0.9,
  scrollTrigger: useST = true,
  className,
  style,
  as: Tag = 'span',
  tokenColor,
}: SplitTextProps) {
  const rootRef = useRef<HTMLElement>(null!)
  const tokenRefs = useRef<HTMLSpanElement[]>([])

  // Tokenise
  const tokens = by === 'chars'
    ? text.split('')
    : by === 'words'
    ? text.split(/(\s+)/)
    : [text]

  useEffect(() => {
    const els = tokenRefs.current.filter(Boolean)
    if (!els.length) return

    const tl = gsap.timeline({
      paused: useST,
      ...(useST && {
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }),
    })

    tl.fromTo(
      els,
      { y: '115%', opacity: 0, rotateX: -20 },
      {
        y: '0%',
        opacity: 1,
        rotateX: 0,
        duration,
        ease: 'expo.out',
        stagger,
        delay,
      },
    )

    if (!useST) tl.play()

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === rootRef.current) st.kill()
      })
    }
  }, [text, useST, delay, stagger, duration])

  return (
    // @ts-ignore — dynamic tag
    <Tag ref={rootRef} className={className} style={{ ...style, display: 'block' }}>
      {tokens.map((token, i) => {
        // Whitespace-only tokens in word mode — render as-is
        if (by === 'words' && /^\s+$/.test(token)) {
          return <span key={i} aria-hidden="true">{token}</span>
        }
        return (
          <span
            key={i}
            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
          >
            <span
              ref={(el) => { if (el) tokenRefs.current[i] = el }}
              style={{
                display: 'inline-block',
                willChange: 'transform, opacity',
                color: tokenColor,
              }}
            >
              {token}
            </span>
          </span>
        )
      })}
    </Tag>
  )
}
