'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'I only have 2–3 weeks before my NCA exam. Is The NCA Hub still useful?',
    a: 'Yes. Short timelines are exactly what these materials were designed for. The notes are under 80 pages per subject, and answer templates pre-build your response structure. The founder prepared his first NCA exam in one week using this exact system and passed.',
  },
  {
    q: 'How is The NCA Hub different from NCA Tutor or NCA Notes?',
    a: 'NCA Tutor notes run 169–304 pages per subject. NCA Notes run 222–304 pages per subject. The NCA Hub delivers under 80 pages per subject — strategic, exam-targeted, with no filler. The NCA Hub also offers the only Readiness Assessment in the NCA prep market.',
  },
  {
    q: 'Do you cover Professional Responsibility and LRW?',
    a: 'Yes to both. Professional Responsibility is covered as a full NCA exam subject with notes, answer templates, and practice questions. Legal Research and Writing (LRW) is a mandatory CPLED course and The NCA Hub guides you through it.',
  },
  {
    q: 'Do I need to be in Canada to use The NCA Hub?',
    a: 'No. Everything is fully digital and accessible from anywhere. The NCA Hub is used by candidates in 12+ countries including India, UK, Nigeria, Pakistan, the Philippines, and Jamaica.',
  },
  {
    q: 'When will video lectures be available?',
    a: 'The video lecture series is currently in production. Anyone who purchases a Complete Bundle receives access automatically when videos go live — at no additional cost.',
  },
  {
    q: 'Can I pay in installments?',
    a: 'Yes. Email thencahub@gmail.com before purchasing and a payment schedule can be arranged. Payment plans are available on all subject bundles.',
  },
]

function FAQItem({ faq, idx }: { faq: { q: string; a: string }; idx: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="faq-item"
      style={{
        borderBottom: '1px solid rgba(201,168,76,.06)',
        padding: '0',
        transition: 'all 0.3s ease',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', textAlign: 'left', padding: '24px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20,
          cursor: 'pointer', background: 'none', border: 'none', color: 'var(--cream)',
        }}
      >
        <motion.span
          animate={{ color: open ? 'var(--g1)' : 'var(--cream)' }}
          transition={{ duration: 0.25 }}
          style={{ fontFamily: 'var(--fd)', fontSize: '1.05rem', lineHeight: 1.4, fontWeight: 400 }}
        >
          {faq.q}
        </motion.span>
        <motion.span
          animate={{
            rotate: open ? 45 : 0,
            textShadow: open ? '0 0 10px rgba(201,168,76,0.5)' : '0 0 0px rgba(201,168,76,0)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          style={{ color: 'var(--g1)', fontSize: '1.2rem', flexShrink: 0, lineHeight: 1, display: 'block', marginTop: 4 }}
        >+</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              paddingBottom: 24, paddingLeft: 16,
              borderLeft: '2px solid rgba(201,168,76,0.15)',
              marginLeft: 4,
            }}>
              <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.75 }}>
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
    <section className="sec" id="faq" aria-label="Frequently asked questions" ref={ref}
      style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Glow line at top */}
      <div className="glow-line" style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', zIndex: 5,
      }} />

      <div className="w" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start' }}>
          <div>
            <motion.span className="ey"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}>
              FAQ
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, lineHeight: 1.15 }}>
              Questions<br /><em className="gradient-text">answered.</em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ fontSize: 'var(--sm)', color: 'var(--dim)', marginTop: 20, lineHeight: 1.75 }}>
              Still have questions?{' '}
              <a href="mailto:thencahub@gmail.com" style={{ color: 'var(--g1)', textDecoration: 'underline', textDecorationColor: 'rgba(201,168,76,0.3)', textUnderlineOffset: '3px' }}>Email us</a>.
            </motion.p>

          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="holo-card"
            style={{ padding: '8px 32px', borderRadius: '12px' }}
          >
            {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} idx={i} />)}
          </motion.div>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){#faq .w > div{grid-template-columns:1fr!important;gap:40px!important}}
        .faq-item:hover { background: rgba(201,168,76,0.02) }
      `}</style>
    </section>
  )
}
