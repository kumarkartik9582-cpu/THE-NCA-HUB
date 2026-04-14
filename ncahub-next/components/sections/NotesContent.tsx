'use client'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

const SUBJECTS = [
  {
    code: 'ADM',
    title: 'Administrative Law',
    href: '/notes/administrative-law/',
    pages: '74',
    topics: ['Vavilov reasonableness standard', 'Baker procedural fairness', 'Dunsmuir correctness', 'Fettering discretion', 'Legitimate expectations'],
    desc: 'The most tested NCA subject. Built around the Vavilov framework and procedural fairness — the two pillars every question is built on.',
  },
  {
    code: 'CON',
    title: 'Constitutional Law',
    href: '/notes/constitutional-law/',
    pages: '78',
    topics: ['Division of powers (POGG, trade, property)', 'Charter s.1 Oakes test', 'Aboriginal rights s.35', 'Notwithstanding clause', 'Remedies under s.24'],
    desc: 'Complex but predictable. The notes map every major framework — Charter, division of powers, s.35 — with exam-ready templates.',
  },
  {
    code: 'CRM',
    title: 'Criminal Law',
    href: '/notes/criminal-law/',
    pages: '68',
    topics: ['Actus reus / mens rea breakdown', 'Section 229 murder elements', 'Manslaughter vs murder', 'Defence frameworks (duress, necessity)', 'Sentencing principles'],
    desc: 'Framework-heavy. Every question follows a predictable structure — the notes give you those structures so you never stare at a blank page.',
  },
  {
    code: 'FCL',
    title: 'Foundations of Canadian Law',
    href: '/notes/foundations-of-canadian-law/',
    pages: '52',
    topics: ['Sources of Canadian law', 'Common law vs civil law system', 'Constitutional supremacy', 'Stare decisis and precedent', 'Role of Parliament and courts'],
    desc: 'Conceptual, not case-heavy. The shortest notes because this subject rewards clear thinking over memorization.',
  },
  {
    code: 'PR',
    title: 'Professional Responsibility',
    href: '/notes/professional-responsibility/',
    pages: '58',
    topics: ['Duty of loyalty and confidentiality', 'Conflicts of interest (actual vs potential)', 'Competence requirements', 'Trust accounting rules', 'Duty to withdraw'],
    desc: 'Rules-based and predictable. High scorers memorize the conflict rules and trust accounting framework cold.',
  },
]

export default function NotesContent() {
  const heroRef = useRef<HTMLElement>(null)
  const heroInView = useInView(heroRef, { once: true })
  const listRef = useRef<HTMLElement>(null)
  const listInView = useInView(listRef, { once: true, margin: '0px' })
  const bundleRef = useRef<HTMLDivElement>(null)
  const bundleInView = useInView(bundleRef, { once: true, margin: '0px' })

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
            Study Notes
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 44 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 400, lineHeight: 1.05, marginBottom: 16 }}
          >
            Complete coverage.<br /><em>Zero filler.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.35 }}
            style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 560, marginBottom: 40 }}
          >
            Each set of notes is built from the exam up — structured around what the NCA actually tests, under 80 pages, with answer templates included.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <Link href="#pricing" className="bp"><span>Get All 5 Subjects →</span></Link>
          </motion.div>
        </div>
      </section>

      {/* Subject rows — staggered slide from left */}
      <section ref={listRef} style={{ background: 'var(--abyss)', padding: '80px 0 140px', borderTop: '1px solid rgba(201,168,76,.06)' }}>
        <div className="w">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SUBJECTS.map((s, i) => (
              <motion.div
                key={s.code}
                initial={{ opacity: 0, x: -48 }}
                animate={listInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                whileHover={{ x: 6, transition: { duration: 0.25 } }}
              >
                <Link href={s.href} className="notes-row">
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '2.5rem', color: 'rgba(201,168,76,.5)', fontWeight: 300, lineHeight: 1, width: 80, flexShrink: 0 }}>
                    {s.code}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--cream)', marginBottom: 8 }}>{s.title}</h2>
                    <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65, marginBottom: 16, maxWidth: 560 }}>{s.desc}</p>
                    <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
                      {s.topics.map((t) => (
                        <li key={t} style={{ fontSize: '.72rem', color: 'var(--dim)' }}>· {t}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    <div style={{ fontSize: 'var(--nano)', color: 'var(--dim)', marginBottom: 8 }}>{s.pages} pages</div>
                    <div style={{ fontSize: 'var(--nano)', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--g1)' }}>View Notes →</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Bundle CTA */}
          <motion.div
            ref={bundleRef}
            initial={{ opacity: 0, y: 28 }}
            animate={bundleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: EASE }}
            style={{ marginTop: 48, padding: '32px', background: 'rgba(201,168,76,.04)', border: '1px solid rgba(201,168,76,.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}
          >
            <div>
              <p style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', color: 'var(--cream)', marginBottom: 6 }}>Complete Bundle — All 5 Subjects</p>
              <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)' }}>330+ pages total · Answer templates · Lifetime access · Instant PDF download</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--nano)', color: 'var(--dim)', textDecoration: 'line-through' }}>CA$245</div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', color: 'var(--g0)' }}>CA$199</div>
              </div>
              <Link href="https://payhip.com/b/ncahub-bundle" className="bp" target="_blank" rel="noopener noreferrer">
                <span>Get Bundle →</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .notes-row{display:flex;align-items:flex-start;gap:32px;padding:32px 28px;background:rgba(201,168,76,.02);border:1px solid rgba(201,168,76,.08);transition:border-color .3s,background .3s;text-decoration:none}
        .notes-row:hover{border-color:rgba(201,168,76,.2);background:rgba(201,168,76,.04)}
        @media(max-width:768px){.notes-row{flex-direction:column;gap:20px}.notes-row>div:last-child{text-align:left!important}}
      `}</style>
    </main>
  )
}
