'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EXPO = [0.16, 1, 0.3, 1] as const

const BUNDLE_FEATURES = [
  'Notes for all 5 NCA subjects (330+ pages)',
  'Answer templates for every question type',
  'Practice questions per subject',
  'Instant PDF download',
  'Lifetime access — no subscription',
  'Video lectures at no extra cost when released',
]

const SINGLE_FEATURES = [
  'Notes for one NCA subject (under 80 pages)',
  'Answer templates for that subject',
  'Practice questions',
  'Instant PDF download',
  'Lifetime access',
]

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
      <path
        d="M2 7 L5.5 10.5 L12 3.5"
        stroke="var(--g1)" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

export default function PricingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section
      className="sec"
      id="pricing"
      aria-label="Pricing"
      ref={ref}
      style={{
        background: 'var(--dark)',
        borderTop: '1px solid rgba(201,168,76,.06)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div className="glow-line" style={{ position: 'absolute', top: 0, left: '20%', right: '20%', zIndex: 5 }} />

      <div className="w" style={{ position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <motion.span
          className="ey"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Pricing
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EXPO }}
          style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(2rem,4vw,3.2rem)',
            fontWeight: 400, lineHeight: 1.1, marginBottom: 12,
          }}
        >
          Pay once.<br /><em className="gradient-text">Own it forever.</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 520, marginBottom: 56 }}
        >
          Failing one NCA exam costs CA$500+ to resit — plus another 3 months of your life.
          The complete bundle is CA$199.
        </motion.p>

        {/* Plans */}
        <div className="pricing-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr 1.3fr',
          gap: 20, maxWidth: 880,
        }}>

          {/* Single subject */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: EXPO }}
            style={{
              padding: '36px 32px',
              background: 'rgba(201,168,76,0.02)',
              border: '1px solid rgba(201,168,76,0.1)',
              borderRadius: 10,
            }}
          >
            <div style={{
              fontSize: 'var(--nano)', letterSpacing: '.3em',
              textTransform: 'uppercase', color: 'var(--g2)',
              fontWeight: 600, marginBottom: 16,
            }}>
              Single Subject
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span className="gradient-text" style={{
                fontFamily: 'var(--fd)', fontSize: '2.8rem', fontWeight: 300, lineHeight: 1,
              }}>
                CA$175
              </span>
              <span style={{ fontSize: 'var(--sm)', color: 'var(--dim)' }}>per subject</span>
            </div>
            <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65, marginBottom: 28 }}>
              Everything for one NCA subject. Notes, answer templates, and practice questions.
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {SINGLE_FEATURES.map((f, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, fontSize: 'var(--sm)', color: 'var(--fog)', alignItems: 'flex-start' }}>
                  <Check />{f}
                </li>
              ))}
            </ul>
            <a
              href="https://payhip.com/THENCAHUB"
              target="_blank" rel="noopener noreferrer"
              className="nc"
              style={{ width: '100%', justifyContent: 'center', display: 'flex', borderRadius: 4 }}
            >
              <span>Choose a Subject →</span>
            </a>
          </motion.div>

          {/* Bundle */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease: EXPO }}
            style={{
              padding: '36px 32px',
              background: 'linear-gradient(145deg, rgba(201,168,76,0.08) 0%, rgba(8,8,16,0.9) 50%, rgba(201,168,76,0.04) 100%)',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: 10, position: 'relative',
            }}
          >
            {/* Badge */}
            <div style={{
              position: 'absolute', top: -1, right: 28,
              background: 'linear-gradient(135deg, var(--g0), var(--g1))',
              color: 'var(--void)',
              fontSize: 'var(--nano)', letterSpacing: '.2em',
              textTransform: 'uppercase', fontWeight: 700,
              padding: '5px 14px', borderRadius: '0 0 6px 6px',
              boxShadow: '0 4px 12px rgba(201,168,76,0.3)',
            }}>
              Best Value
            </div>

            <div style={{
              fontSize: 'var(--nano)', letterSpacing: '.3em',
              textTransform: 'uppercase', color: 'var(--g2)',
              fontWeight: 600, marginBottom: 16,
            }}>
              Complete Bundle
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span className="gradient-text" style={{
                fontFamily: 'var(--fd)', fontSize: '2.8rem', fontWeight: 300, lineHeight: 1,
              }}>
                CA$199
              </span>
              <span style={{ fontSize: 'var(--sm)', color: 'var(--dim)' }}>all 5 subjects</span>
            </div>
            <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65, marginBottom: 28 }}>
              Every NCA subject covered. Notes, answer templates, and practice questions for all five.
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {BUNDLE_FEATURES.map((f, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, fontSize: 'var(--sm)', color: 'var(--fog)', alignItems: 'flex-start' }}>
                  <Check />{f}
                </li>
              ))}
            </ul>
            <a
              href="https://payhip.com/THENCAHUB"
              target="_blank" rel="noopener noreferrer"
              className="bp"
              style={{ width: '100%', justifyContent: 'center', display: 'flex', borderRadius: 4 }}
            >
              <span>Get All 5 Subjects — CA$199 →</span>
            </a>
          </motion.div>

        </div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          style={{ fontSize: 'var(--sm)', color: 'var(--dim)', marginTop: 24, maxWidth: 880 }}
        >
          Payment plans available — email{' '}
          <a href="mailto:thencahub@gmail.com" style={{ color: 'var(--g2)', textDecoration: 'underline', textDecorationColor: 'rgba(201,168,76,0.3)', textUnderlineOffset: 3 }}>
            thencahub@gmail.com
          </a>{' '}
          before purchasing to arrange a schedule.
        </motion.p>

      </div>

      <style>{`@media(max-width:700px){#pricing .pricing-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
