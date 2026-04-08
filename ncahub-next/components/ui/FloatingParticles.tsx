'use client'
/**
 * FloatingParticles — CSS-only ambient particle field.
 *
 * Renders deterministic floating gold particles that rise upward,
 * adding depth and atmosphere to any section. No JS animation loop.
 */
import { useMemo } from 'react'

interface FloatingParticlesProps {
  /** Number of particles (default: 20) */
  count?: number
  /** Base color (default: gold) */
  color?: string
  /** Overall opacity multiplier (default: 1) */
  opacity?: number
  className?: string
}

export default function FloatingParticles({
  count = 20,
  color = 'rgba(201,168,76,0.4)',
  opacity = 1,
  className = '',
}: FloatingParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = (i * 7919 + 1) % 100 // deterministic pseudo-random
      return {
        left: `${(seed * 37) % 100}%`,
        delay: `${(seed * 0.13) % 8}s`,
        duration: `${10 + (seed % 15)}s`,
        size: 1 + (seed % 3),
        opacity: 0.2 + (seed % 5) * 0.12,
      }
    })
  }, [count])

  return (
    <div className={`particles ${className}`} aria-hidden="true" style={{ opacity }}>
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
            background: color,
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
          }}
        />
      ))}
    </div>
  )
}
