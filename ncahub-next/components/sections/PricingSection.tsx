'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import TiltCard from '@/components/ui/TiltCard'

const EXPO = [0.16, 1, 0.3, 1] as const

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

/** Animated SVG checkmark that draws in when inView */
function AnimatedCheck({ delay, highlight }: { delay: number; highlight: boolean }) {
  return (
    <svg
      width="14" height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ flexShrink: 0, marginTop: 2 }}
    >
      <motion.path
        d="M2 7 L5.5 10.5 L12 3.5"
        stroke={highlight ? 'var(--g0)' : 'var(--g1)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      />
    </svg>
  )
}

export default function PricingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px' })

  return (
    <section className="sec" id="pricing" aria-label="Pricing" ref={ref}
      style={{
        background: 'var(--dark)',
        borderTop: '1px solid rgba(201,168,76,.06)',
        position: 'relative', overflow: 'hidden',
      }}>
      {/* Glow line at top */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: EXPO }}
        style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, zIndex: 5,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,.4), transparent)',
          transformOrigin: 'center',
        }}
      />

      <div className="w" style={{ position: 'relative', zIndex: 2 }}>
        <motion.span className="ey"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}>
          Pricing
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EXPO }}
          style={{ fontFamily: 'var(--fd)', fontSize: 'var(--h1)', fontWeight: 400, lineHeight: 1.1, marginBottom: 16 }}>
          Simple pricing.<br /><em className="gradient-text">No surprises.</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 560, marginBottom: 56 }}>
          Pay once. Study at your own pace. Payment plans available — email before purchasing.
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 860 }}>
          {PLANS.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.2 + i * 0.15, ease: EXPO }}
            >
              <TiltCard
                className={plan.highlight ? 'holo-card' : ''}
                maxTilt={plan.highlight ? 6 : 4}
                glare={plan.highlight ? 0.12 : 0.06}
                style={{
                  padding: '40px 36px',
                  background: plan.highlight
                    ? 'linear-gradient(145deg, rgba(201,168,76,0.08) 0%, rgba(8,8,16,0.9) 40%, rgba(201,168,76,0.04) 100%)'
                    : 'linear-gradient(145deg, rgba(201,168,76,0.03) 0%, rgba(8,8,16,0.8) 50%)',
                  border: plan.highlight
                    ? '1px solid rgba(201,168,76,.25)'
                    : '1px solid rgba(201,168,76,.08)',
                  borderRadius: '12px',
                  position: 'relative',
                  height: '100%',
                }}
              >
                {plan.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5, ease: EXPO }}
                    style={{
                      position: 'absolute', top: -1, right: 28,
                      background: 'linear-gradient(135deg, var(--g0), var(--g1))',
                      color: 'var(--void)',
                      fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase',
                      fontWeight: 700, padding: '5px 14px',
                      borderRadius: '0 0 6px 6px',
                      boxShadow: '0 4px 12px rgba(201,168,76,0.3)',
                    }}>
                    {plan.badge}
                  </motion.div>
                )}

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{
                      fontSize: 'var(--nano)', letterSpacing: '.3em', textTransform: 'uppercase',
                      color: 'var(--g2)', fontWeight: 600, marginBottom: 12,
                    }}>
                      {plan.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                      <span className={plan.highlight ? 'neon-text' : ''} style={{
                        fontFamily: 'var(--fd)', fontSize: '2.8rem', fontWeight: 300,
                        lineHeight: 1,
                      }}>
                        <span className="gradient-text">{plan.price}</span>
                      </span>
                      <span style={{ fontSize: 'var(--sm)', color: 'var(--dim)' }}>{plan.period}</span>
                    </div>
                    <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65 }}>{plan.desc}</p>
                  </div>

                  {/* Feature list with animated SVG checkmarks */}
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                    {plan.features.map((f, fi) => (
                      <motion.li
                        key={f}
                        initial={{ opacity: 0, x: -12 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.45, delay: 0.45 + i * 0.15 + fi * 0.07, ease: EXPO }}
                        style={{
                          display: 'flex', gap: 10, fontSize: 'var(--sm)',
                          color: 'var(--fog)', alignItems: 'flex-start',
                        }}
                      >
                        {inView && (
                          <AnimatedCheck
                            delay={0.5 + i * 0.15 + fi * 0.07}
                            highlight={plan.highlight}
                          />
                        )}
                        {f}
                      </motion.li>
                    ))}
                  </ul>

                  <a href={plan.href} target="_blank" rel="noopener noreferrer"
                    className={plan.highlight ? 'bp' : 'nc'}
                    style={{
                      width: '100%', justifyContent: 'center', display: 'flex',
                      borderRadius: '4px',
                    }}>
                    <span>{plan.cta} →</span>
                  </a>
                </div>
              </TiltCard>
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
