'use client'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const PLANS = [
  {
    name: 'Single Subject',
    price: 'CA$49',
    period: 'per subject',
    desc: 'Everything you need for one NCA subject.',
    features: [
      'Strategic notes (under 80 pages)',
      'Answer templates',
      'Practice questions',
      'Readiness Score access',
    ],
    cta: 'Get Single Subject',
    href: 'https://payhip.com/THENCAHUB',
    highlight: false,
  },
  {
    name: 'Complete Bundle',
    price: 'CA$199',
    period: 'all 5 subjects',
    desc: 'All five NCA subjects. One price. Video lectures included when released.',
    features: [
      'All 5 subject notes',
      'All answer templates',
      'All practice question sets',
      'Video lectures (when released)',
      'Priority support',
      'Readiness Score — all subjects',
    ],
    cta: 'Get Complete Bundle',
    href: 'https://payhip.com/THENCAHUB',
    highlight: true,
    badge: 'Most Popular',
  },
]

export default function PricingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section className="sec" id="pricing" aria-label="Pricing" ref={ref}
      style={{ background: 'var(--dark)', borderTop: '1px solid rgba(201,168,76,.06)' }}>
      <div className="w">
        <motion.span className="ey"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}>
          Pricing
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: 'var(--fd)', fontSize: 'var(--h1)', fontWeight: 400, lineHeight: 1.1, marginBottom: 16 }}>
          Simple pricing.<br /><em>No surprises.</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 560, marginBottom: 56 }}>
          Pay once. Study at your own pace. Payment plans available — email before purchasing.
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, maxWidth: 860 }}>
          {PLANS.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{
                padding: '40px 36px',
                background: plan.highlight ? 'rgba(201,168,76,.06)' : 'rgba(201,168,76,.02)',
                border: plan.highlight ? '1px solid rgba(201,168,76,.3)' : '1px solid rgba(201,168,76,.1)',
                position: 'relative',
              }}>
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: -1, right: 28,
                  background: 'var(--g1)', color: 'var(--void)',
                  fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase',
                  fontWeight: 700, padding: '4px 12px',
                }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 'var(--nano)', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--g2)', fontWeight: 600, marginBottom: 12 }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--fd)', fontSize: '2.8rem', fontWeight: 300, color: 'var(--g0)', lineHeight: 1 }}>{plan.price}</span>
                  <span style={{ fontSize: 'var(--sm)', color: 'var(--dim)' }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65 }}>{plan.desc}</p>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', gap: 10, fontSize: 'var(--sm)', color: 'var(--fog)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--g1)', flexShrink: 0, lineHeight: 1.5 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={plan.href} target="_blank" rel="noopener noreferrer"
                className={plan.highlight ? 'bp' : 'nc'}
                style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                <span>{plan.cta} →</span>
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          style={{ fontSize: 'var(--sm)', color: 'var(--dim)', marginTop: 28, maxWidth: 860 }}>
          Payment plans available. Email <a href="mailto:thencahub@gmail.com" style={{ color: 'var(--g2)' }}>thencahub@gmail.com</a> before purchasing to arrange a schedule.
        </motion.p>
      </div>
      <style>{`@media(max-width:640px){#pricing .w > div:nth-child(3){grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
