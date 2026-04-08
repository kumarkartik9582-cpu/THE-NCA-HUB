'use client'
/**
 * TiltCard — 3D mouse-tracking perspective card.
 *
 * Hover to see the card tilt toward your cursor with holographic
 * lighting and depth parallax. Uses vanilla JS for max perf.
 */
import { useEffect, useRef, useCallback } from 'react'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** Max tilt angle in degrees (default: 8) */
  maxTilt?: number
  /** Glare intensity 0–1 (default: 0.15) */
  glare?: number
  /** Scale on hover (default: 1.02) */
  scale?: number
  /** Perspective distance (default: 1000) */
  perspective?: number
}

export default function TiltCard({
  children,
  className = '',
  style,
  maxTilt = 8,
  glare = 0.15,
  scale = 1.02,
  perspective = 1000,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null!)
  const glareRef = useRef<HTMLDivElement>(null!)
  const rafId = useRef<number>(0)
  const current = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  const lerp = useCallback((start: number, end: number, factor: number) =>
    start + (end - start) * factor, [])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      current.current.targetX = (y - 0.5) * maxTilt * -2
      current.current.targetY = (x - 0.5) * maxTilt * 2

      // Update glare position
      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(
          600px circle at ${x * 100}% ${y * 100}%,
          rgba(240,216,120,${glare}) 0%,
          rgba(201,168,76,${glare * 0.3}) 40%,
          transparent 70%
        )`
        glareRef.current.style.opacity = '1'
      }
    }

    const onLeave = () => {
      current.current.targetX = 0
      current.current.targetY = 0
      if (glareRef.current) glareRef.current.style.opacity = '0'
      card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`
    }

    const animate = () => {
      const c = current.current
      c.x = lerp(c.x, c.targetX, 0.08)
      c.y = lerp(c.y, c.targetY, 0.08)

      if (Math.abs(c.targetX) > 0.01 || Math.abs(c.targetY) > 0.01 ||
          Math.abs(c.x) > 0.01 || Math.abs(c.y) > 0.01) {
        card.style.transform = `perspective(${perspective}px) rotateX(${c.x}deg) rotateY(${c.y}deg) scale3d(${scale},${scale},${scale})`
      }

      rafId.current = requestAnimationFrame(animate)
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    rafId.current = requestAnimationFrame(animate)

    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafId.current)
    }
  }, [maxTilt, glare, scale, perspective, lerp])

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: 'transform 0.15s ease-out',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}
      {/* Holographic glare overlay */}
      <div
        ref={glareRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.4s ease',
          borderRadius: 'inherit',
          zIndex: 2,
        }}
      />
    </div>
  )
}
