'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'motion/react'

const STATS = [
  { num: 12, suffix: '+', label: 'Countries', sub: 'Candidates from India, UK, Nigeria, Pakistan, Philippines, Jamaica, and more' },
  { num: 5, suffix: '', label: 'NCA Subjects', sub: 'Complete coverage: Admin, Con, Criminal, Foundations, Prof. Responsibility' },
  { num: 80, suffix: '<', label: 'Pages per subject', sub: 'Strategic, exam-targeted — no filler, no padding' },
  { num: 7, suffix: ' days', label: 'Shortest prep', sub: "The founder passed Administrative Law with 7 days of preparation" },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const dur = 2000
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setVal(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return (
    <span ref={ref}>
      {suffix === '<' ? suffix : ''}{val.toLocaleString()}{suffix !== '<' ? suffix : ''}
    </span>
  )
}

export default function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section
      id="scrub-section"
      aria-label="Key results"
      ref={ref}
      style={{
        padding: '100px 48px',
        background: 'var(--deep)',
        borderTop: '1px solid rgba(201,168,76,.06)',
        borderBottom: '1px solid rgba(201,168,76,.06)',
        position: 'relative', zIndex: 1,
      }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
          {STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                padding: '40px 32px',
                background: 'rgba(201,168,76,.03)',
                border: '1px solid rgba(201,168,76,.08)',
              }}>
              <div style={{ fontFamily: 'var(--fd)', fontSize: '3rem', fontWeight: 300, color: 'var(--g0)', lineHeight: 1, marginBottom: 8 }}>
                <Counter target={s.num} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 'var(--sm)', fontWeight: 600, color: 'var(--cream)', marginBottom: 10, letterSpacing: '.04em' }}>
                {s.label}
              </div>
              <p style={{ fontSize: 'var(--sm)', color: 'var(--dim)', lineHeight: 1.65 }}>{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){#scrub-section > div > div{grid-template-columns:1fr 1fr!important;gap:2px!important}}`}</style>
    </section>
  )
}
