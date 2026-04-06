'use client'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const STEPS = [
  {
    num: '01',
    title: 'Strategic Notes',
    body: 'Under 80 pages per subject. Every page earns its place. No filler, no textbook padding — only what the NCA examiner tests.',
  },
  {
    num: '02',
    title: 'Answer Templates',
    body: 'Pre-built response structures for every question type. Walk into the exam knowing exactly how to open, argue, and close each answer.',
  },
  {
    num: '03',
    title: 'Practice Questions',
    body: 'Subject-specific drills built on real exam patterns. Timed practice with the actual question types the NCA uses.',
  },
  {
    num: '04',
    title: 'Readiness Score',
    body: 'Six-question diagnostic built on real exam criteria. Know whether you are ready before you sit — not after.',
  },
]

export default function MethodSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section className="sec" id="method" aria-label="The method" ref={ref}
      style={{ background: 'var(--abyss)', borderTop: '1px solid rgba(201,168,76,.06)' }}>
      <div className="w">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          {/* Left */}
          <div>
            <motion.span className="ey"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}>
              The Method
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: 'var(--fd)', fontSize: 'var(--h1)', fontWeight: 400, lineHeight: 1.1, marginBottom: 24 }}>
              Four tools.<br /><em>One system.</em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ fontSize: 'var(--lead)', color: 'var(--fog)', lineHeight: 1.75, maxWidth: 440 }}>
              Every component of the NCA Hub was built around a single question:
              what does the examiner actually reward?
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              style={{ marginTop: 40, padding: '24px 28px', background: 'rgba(201,168,76,.04)', borderLeft: '2px solid var(--g1)' }}>
              <p style={{ fontFamily: 'var(--fd)', fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--cream)', lineHeight: 1.7 }}>
                "Passed Administrative Law on my first attempt with 10 days of prep. The Vavilov framework in the notes was clearer than any textbook I had read."
              </p>
              <div style={{ fontSize: 'var(--nano)', color: 'var(--dim)', marginTop: 14, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                Anum S. · Toronto · <strong style={{ color: 'var(--g1)' }}>Passed</strong>
              </div>
            </motion.div>
          </div>

          {/* Right: steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map((step, i) => (
              <motion.div key={step.num}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'grid', gridTemplateColumns: '56px 1fr', gap: 20,
                  padding: '28px 0',
                  borderBottom: i < STEPS.length - 1 ? '1px solid rgba(201,168,76,.08)' : 'none',
                }}>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', color: 'rgba(201,168,76,.3)', fontWeight: 300, lineHeight: 1 }}>
                  {step.num}
                </div>
                <div>
                  <div style={{ fontSize: 'var(--sm)', fontWeight: 600, color: 'var(--cream)', letterSpacing: '.04em', marginBottom: 8 }}>
                    {step.title}
                  </div>
                  <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.7 }}>{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){#method .w > div{grid-template-columns:1fr!important;gap:48px!important}}`}</style>
    </section>
  )
}
