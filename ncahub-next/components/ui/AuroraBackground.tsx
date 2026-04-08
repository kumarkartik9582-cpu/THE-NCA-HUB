'use client'
/**
 * AuroraBackground — animated gradient mesh with morphing orbs.
 *
 * Creates a living, breathing background of soft gold light that
 * drifts and morphs. Pure CSS — no JS animation overhead.
 */

interface AuroraBackgroundProps {
  /** Intensity multiplier for opacity (default: 1) */
  intensity?: number
  /** Show extra mid-layer orb (default: false) */
  extraOrb?: boolean
  className?: string
}

export default function AuroraBackground({
  intensity = 1,
  extraOrb = false,
  className = '',
}: AuroraBackgroundProps) {
  return (
    <div className={`aurora-bg ${className}`} aria-hidden="true" style={{ opacity: intensity }}>
      {/* Primary orb — top-left, large, slow */}
      <div
        className="float-orb morph-blob"
        style={{
          width: 'clamp(350px, 55vw, 900px)',
          height: 'clamp(350px, 55vw, 900px)',
          top: '-15%',
          left: '-10%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.02) 40%, transparent 70%)',
        }}
      />
      {/* Secondary orb — bottom-right, smaller, offset timing */}
      <div
        className="float-orb morph-blob"
        style={{
          width: 'clamp(280px, 42vw, 750px)',
          height: 'clamp(280px, 42vw, 750px)',
          bottom: '-12%',
          right: '-8%',
          background: 'radial-gradient(circle, rgba(158,123,48,0.06) 0%, rgba(201,168,76,0.015) 45%, transparent 70%)',
          animationDelay: '-9s',
          animationDuration: '22s',
        }}
      />
      {extraOrb && (
        <div
          className="float-orb morph-blob"
          style={{
            width: 'clamp(200px, 30vw, 500px)',
            height: 'clamp(200px, 30vw, 500px)',
            top: '40%',
            left: '30%',
            background: 'radial-gradient(circle, rgba(240,216,120,0.04) 0%, transparent 60%)',
            animationDelay: '-4s',
            animationDuration: '15s',
          }}
        />
      )}
    </div>
  )
}
