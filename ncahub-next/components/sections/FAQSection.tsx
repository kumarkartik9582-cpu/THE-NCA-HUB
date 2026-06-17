'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'I only have 2–3 weeks before my NCA exam. Is this enough time?',
    a: 'Yes. That\'s what these materials were built for. The notes are under 80 pages per subject — you can read them in 2–3 days. The answer templates give you the exact structure for every question type so you\'re not constructing on the spot. The founder passed his first exam in 7 days using this exact system.',
  },
  {
    q: 'How is this different from NCA Tutor, NCA Mentor, or NCA Notes?',
    a: 'Their notes run 169–304 pages per subject. Ours are under 80. We also include answer templates — pre-built response structures for every question type — which no other NCA prep provider offers. The difference isn\'t price. It\'s what you\'re getting: a system designed around what examiners actually reward, not a compressed textbook.',
  },
  {
    q: 'What if I only need one subject?',
    a: 'Each subject is available individually for CA$175. You get the same notes, answer templates, and practice questions — just for that one subject. If you end up needing more subjects later, you can buy them individually or get the complete bundle.',
  },
  {
    q: 'What format are the materials? How do I access them?',
    a: 'Instant PDF download via Payhip. You get access immediately after purchase — no account needed, no waiting, no subscription. The files are yours forever. Works on any device.',
  },
]

const EASE = [0.16, 1, 0.3, 1] as const

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(201,168,76,.08)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', textAlign: 'left',
          padding: '22px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20,
          cursor: 'pointer', background: 'none', border: 'none', color: 'var(--cream)',
        }}
      >
        <span style={{
          fontFamily: 'var(--fd)', fontSize: '1.05rem', lineHeight: 1.4, fontWeight: 400,
          color: open ? 'var(--g1)' : 'var(--cream)',
          transition: 'color 0.25s ease',
        }}>
          {faq.q}
        </span>
        <span style={{
          color: 'var(--g1)', fontSize: '1.2rem', flexShrink: 0, lineHeight: 1,
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
          transition: 'transform .3s cubic-bezier(.16,1,.3,1)',
          display: 'block', marginTop: 3,
        }}>
          +
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              paddingBottom: 22, paddingLeft: 16,
              borderLeft: '2px solid rgba(201,168,76,0.2)',
              marginLeft: 4,
            }}>
              <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.8 }}>
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section
      className="sec"
      id="faq"
      aria-label="Frequently asked questions"
      ref={ref}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div className="glow-line" style={{ position: 'absolute', top: 0, left: '20%', right: '20%', zIndex: 5 }} />

      <div className="w" style={{ position: 'relative', zIndex: 2 }}>
        <div className="faq-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 80, alignItems: 'start' }}>

          {/* Left: label + CTA */}
          <div>
            <motion.span
              className="ey"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              FAQ
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              style={{
                fontFamily: 'var(--fd)', fontSize: 'clamp(2rem,4vw,3.2rem)',
                fontWeight: 400, lineHeight: 1.15,
              }}
            >
              Still have<br /><em className="gradient-text">questions?</em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ fontSize: 'var(--sm)', color: 'var(--dim)', marginTop: 20, lineHeight: 1.75 }}
            >
              Email{' '}
              <a
                href="mailto:thencahub@gmail.com"
                style={{ color: 'var(--g1)', textDecoration: 'underline', textDecorationColor: 'rgba(201,168,76,0.35)', textUnderlineOffset: 3 }}
              >
                thencahub@gmail.com
              </a>{' '}
              and you&apos;ll get a reply.
            </motion.p>

            {/* Final CTA in FAQ col */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
              style={{ marginTop: 40 }}
            >
              <a
                href="https://payhip.com/THENCAHUB"
                target="_blank" rel="noopener noreferrer"
                className="bp"
                style={{ borderRadius: 4, display: 'inline-flex' }}
              >
                <span>Get the Notes →</span>
              </a>
              <p style={{ fontSize: 'var(--nano)', color: 'var(--dim)', marginTop: 12 }}>
                CA$175/subject · CA$199 bundle · Instant PDF
              </p>
            </motion.div>
          </div>

          {/* Right: accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            style={{
              padding: '8px 32px',
              background: 'rgba(201,168,76,0.02)',
              border: '1px solid rgba(201,168,76,0.08)',
              borderRadius: 10,
            }}
          >
            {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} />)}
          </motion.div>

        </div>
      </div>

      <style>{`@media(max-width:768px){#faq .faq-layout{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </section>
  )
}
