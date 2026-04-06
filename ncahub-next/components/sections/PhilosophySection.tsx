'use client'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

export default function PhilosophySection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })

  return (
    <section
      id="philosophy"
      aria-label="Our belief"
      ref={ref}
      style={{
        padding: '160px 48px',
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh',
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
      }}
    >
      {/* Decorative orbs */}
      <div style={{ position: 'absolute', top: '20%', left: '15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ textAlign: 'center', maxWidth: 800, position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: 40, height: 1, background: 'var(--g1)', margin: '0 auto 32px', transformOrigin: 'left' }}
        />
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 400, lineHeight: 1.2, color: 'var(--cream)',
          }}
        >
          The NCA is not testing<br />
          your legal knowledge.<br />
          <em style={{ color: 'var(--g1)' }}>It&apos;s testing your exam technique.</em>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ fontSize: 'var(--sm)', color: 'var(--dim)', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 32, fontFamily: 'var(--fb)' }}
        >
          The belief behind everything we build
        </motion.p>
      </div>
    </section>
  )
}
