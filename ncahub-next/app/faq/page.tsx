'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

const FAQ_GROUPS = [
  {
    group: 'The NCA Process',
    items: [
      {
        q: 'Who needs to go through the NCA process?',
        a: 'Any lawyer who qualified outside Canada and wishes to practice law in a Canadian common law province must go through the NCA process. This includes lawyers from India, the UK, Nigeria, Pakistan, the Philippines, the US, and all other countries.',
      },
      {
        q: 'How many NCA subjects will I be assigned?',
        a: 'This depends on your home jurisdiction and your law degree. Most internationally trained lawyers from civil law or mixed jurisdictions are assigned all five subjects. Lawyers from common law countries (UK, Nigeria, Jamaica) may receive partial exemptions. The NCA assessment letter specifies exactly which subjects you must pass.',
      },
      {
        q: 'How often are NCA exams offered?',
        a: 'The NCA offers exam sittings twice a year — typically in April/May and October/November. You can take as many or as few subjects as you want per sitting, subject to your overall assessment.',
      },
      {
        q: 'Can I take the NCA exams from outside Canada?',
        a: 'NCA exams must be written in person at designated exam centres in Canada. You do not need to be living in Canada to prepare, but you must be in Canada on exam day.',
      },
    ],
  },
  {
    group: 'The Notes',
    items: [
      {
        q: 'How are The NCA Hub notes different from NCA Tutor or NCA Notes?',
        a: 'NCA Tutor notes run 169–304 pages per subject. NCA Notes run 222–304 pages per subject. The NCA Hub delivers under 80 pages per subject — exam-targeted, with answer templates and practice questions built in. No filler, no textbook summaries. Only what the NCA actually tests.',
      },
      {
        q: 'Do the notes cover all 5 NCA subjects?',
        a: 'Yes. All five subjects are covered: Administrative Law, Constitutional Law, Criminal Law, Foundations of Canadian Law, and Professional Responsibility. Each is sold separately (CA$49) or as a complete bundle (CA$199).',
      },
      {
        q: 'Are the notes updated when the NCA changes its syllabus?',
        a: 'Yes. All purchasers receive updated notes at no additional cost whenever the NCA updates the prescribed materials or syllabus.',
      },
      {
        q: 'What format are the notes in?',
        a: 'The notes are delivered as a PDF immediately after purchase via Payhip. They are formatted for on-screen reading and print equally well for candidates who prefer physical materials.',
      },
      {
        q: 'Can I use the notes as my only study material?',
        a: 'Yes — the notes are designed to be sufficient on their own. They include case summaries, legal frameworks, answer templates, and practice questions. You do not need to purchase textbooks or additional materials.',
      },
    ],
  },
  {
    group: 'Exam Strategy',
    items: [
      {
        q: 'I only have 2–3 weeks before my NCA exam. Is it too late?',
        a: 'No. Short timelines are exactly what The NCA Hub was designed for. The founder prepared his first NCA exam in 7 days and passed. Under 80 pages per subject means focused, efficient preparation is possible in a very short time. Three weeks of deliberate preparation is sufficient for most subjects.',
      },
      {
        q: 'Is the NCA exam open book?',
        a: 'Yes. All NCA exams are open book — you can bring any physical materials you want. This sounds easier than it is. The exam is timed, and candidates who have not internalized the key frameworks before entering the room spend their time flipping pages rather than writing. Preparation is still essential.',
      },
      {
        q: 'Should I take multiple NCA subjects at once?',
        a: 'It depends on your bandwidth. Taking two subjects simultaneously is manageable for most working candidates with 6–8 weeks of preparation time. Three or more simultaneously is high risk. Sequential preparation — one subject per sitting — produces better pass rates.',
      },
    ],
  },
  {
    group: 'Purchasing & Payments',
    items: [
      {
        q: 'Can I pay in installments?',
        a: 'Yes. Email thencahub@gmail.com before purchasing and a payment schedule can be arranged. Payment plans are available on all subject bundles.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'The notes are digital products — once downloaded, refunds are not available. We strongly recommend getting the free chapter for your subject before purchasing to confirm the notes are the right fit for you.',
      },
      {
        q: 'Do I get access to video lectures?',
        a: 'A video lecture series is currently in production. All Complete Bundle purchasers will receive access automatically when videos go live — at no additional cost.',
      },
    ],
  },
]

function FAQItem({ q, a, groupInView, delay }: { q: string; a: string; groupInView: boolean; delay: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={groupInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: EASE }}
      style={{ borderBottom: '1px solid rgba(201,168,76,.08)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', textAlign: 'left', padding: '22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, background: 'none', border: 'none', color: 'var(--cream)', cursor: 'pointer' }}
      >
        <span style={{
          fontFamily: 'var(--fd)', fontSize: '1.05rem', lineHeight: 1.4, fontWeight: 400,
          transition: 'color .3s ease',
          color: open ? 'var(--g1)' : 'var(--cream)',
        }}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          style={{
            color: 'var(--g1)', fontSize: '1.3rem', flexShrink: 0, lineHeight: 1,
            display: 'block', marginTop: 2,
          }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.8, paddingBottom: 22, paddingLeft: 16, borderLeft: '2px solid rgba(201,168,76,.2)' }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FAQGroup({ group, items, index }: { group: string; items: { q: string; a: string }[]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <div
      ref={ref}
      id={group.replace(/\s+/g, '-').toLowerCase()}
      style={{ marginBottom: 64, scrollMarginTop: 100 }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ fontFamily: 'var(--fd)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--cream)', marginBottom: 8, paddingBottom: 20, borderBottom: '1px solid rgba(201,168,76,.1)' }}
      >
        {group}
      </motion.h2>
      {items.map((item, i) => (
        <FAQItem key={item.q} q={item.q} a={item.a} groupInView={inView} delay={0.08 + i * 0.07} />
      ))}
    </div>
  )
}

export default function FAQPage() {
  const heroRef = useRef<HTMLElement>(null)
  const heroInView = useInView(heroRef, { once: true })
  const ctaRef = useRef<HTMLDivElement>(null)
  const ctaInView = useInView(ctaRef, { once: true, margin: '-8%' })

  return (
    <main>
      {/* Hero */}
      <section ref={heroRef} style={{ background: 'var(--void)', padding: '160px 0 80px', borderBottom: '1px solid rgba(201,168,76,.07)' }}>
        <div className="w">
          <motion.span
            className="ey"
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            FAQ
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 44 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 400, lineHeight: 1.05, marginBottom: 20 }}
          >
            Every question,<br /><em>answered.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.38 }}
            style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 520, lineHeight: 1.8 }}
          >
            Still have a question not listed here?{' '}
            <Link href="/contact/" style={{ color: 'var(--g1)', borderBottom: '1px solid rgba(201,168,76,.3)' }}>Email us</Link> — we respond within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* FAQ body */}
      <section style={{ background: 'var(--void)', padding: '80px 0 140px' }}>
        <div className="w">
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 80, alignItems: 'start' }}>
            {/* Sidebar nav */}
            <nav style={{ position: 'sticky', top: 100 }}>
              {FAQ_GROUPS.map((g, i) => (
                <motion.a
                  key={g.group}
                  href={`#${g.group.replace(/\s+/g, '-').toLowerCase()}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: EASE }}
                  style={{ display: 'block', fontSize: 'var(--sm)', color: 'var(--dim)', padding: '8px 0', borderLeft: '2px solid rgba(201,168,76,.12)', paddingLeft: 16, marginBottom: 4, transition: 'color .2s, border-color .2s', textDecoration: 'none' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--g1)'; e.currentTarget.style.borderLeftColor = 'var(--g1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--dim)'; e.currentTarget.style.borderLeftColor = 'rgba(201,168,76,.12)' }}
                >
                  {g.group}
                </motion.a>
              ))}
            </nav>

            {/* FAQ groups — each self-contained with its own inView */}
            <div>
              {FAQ_GROUPS.map((g, i) => (
                <FAQGroup key={g.group} group={g.group} items={g.items} index={i} />
              ))}

              {/* Bottom CTA */}
              <motion.div
                ref={ctaRef}
                initial={{ opacity: 0, y: 28 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, ease: EASE }}
                style={{ marginTop: 48, padding: '32px', background: 'rgba(201,168,76,.04)', border: '1px solid rgba(201,168,76,.15)' }}
              >
                <p style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', color: 'var(--cream)', marginBottom: 12 }}>Still not sure? Get a free chapter first.</p>
                <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', marginBottom: 24, lineHeight: 1.65 }}>
                  Download a free chapter from any subject before committing. No credit card required.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link href="/#free-chapter" className="bp"><span>Get Free Chapter →</span></Link>
                  <Link href="/contact/" className="nc"><span>Email Us</span></Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <style>{`@media(max-width:768px){section > div > div[style*="240px 1fr"]{grid-template-columns:1fr!important}nav{display:none!important}}`}</style>
    </main>
  )
}
