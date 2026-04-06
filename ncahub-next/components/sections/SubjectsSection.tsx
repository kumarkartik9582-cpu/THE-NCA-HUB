'use client'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import Link from 'next/link'

const SUBJECTS = [
  {
    code: 'ADM', title: 'Administrative Law',
    weight: 'High exam frequency', color: 'rgba(201,168,76,1)',
    topics: ['Vavilov reasonableness', 'Baker procedural fairness', 'Dunsmuir correctness', 'Fettering discretion'],
    href: '/notes/administrative-law/',
  },
  {
    code: 'CON', title: 'Constitutional Law',
    weight: 'Complex frameworks', color: 'rgba(201,168,76,.85)',
    topics: ['Division of powers', 'Charter s.1 Oakes', 'Aboriginal rights s.35', 'Notwithstanding clause'],
    href: '/notes/constitutional-law/',
  },
  {
    code: 'CRM', title: 'Criminal Law',
    weight: 'Framework-heavy', color: 'rgba(201,168,76,.7)',
    topics: ['Actus reus / mens rea', 'Section 229 murder', 'Defences', 'Sentencing principles'],
    href: '/notes/criminal-law/',
  },
  {
    code: 'FCL', title: 'Foundations of Canadian Law',
    weight: 'Conceptual', color: 'rgba(201,168,76,.55)',
    topics: ['Sources of law', 'Common law vs civil law', 'Constitutional supremacy', 'Stare decisis'],
    href: '/notes/foundations-of-canadian-law/',
  },
  {
    code: 'PR', title: 'Professional Responsibility',
    weight: 'Rules-based', color: 'rgba(201,168,76,.45)',
    topics: ['Duty of loyalty', 'Conflicts of interest', 'Competence', 'Trust accounting'],
    href: '/notes/professional-responsibility/',
  },
]

export default function SubjectsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section className="sec" id="subjects" aria-label="Subjects covered" ref={ref}
      style={{ background: 'var(--abyss)', borderTop: '1px solid rgba(201,168,76,.06)' }}>
      <div className="w">
        <motion.span className="ey"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}>
          All 5 NCA Subjects
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: 'var(--fd)', fontSize: 'var(--h1)', fontWeight: 400, lineHeight: 1.1, marginBottom: 16 }}>
          Complete coverage.<br /><em>Zero filler.</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 600, marginBottom: 56 }}>
          Each subject pod is built from the exam up — structured around what the NCA actually tests, not what law schools teach.
        </motion.p>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div id="HT" style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2,
          overflowX: 'auto', paddingBottom: 4,
        }}>
          {SUBJECTS.map((s, i) => (
            <motion.div key={s.code}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="sc2"
              style={{
                padding: '28px 24px', minWidth: 200,
                background: 'rgba(201,168,76,.03)',
                border: '1px solid rgba(201,168,76,.1)',
                cursor: 'pointer', position: 'relative',
              }}>
              {/* Subject code */}
              <div style={{
                fontFamily: 'var(--fd)', fontSize: '2rem', color: s.color,
                fontWeight: 300, lineHeight: 1, marginBottom: 12, opacity: 0.6,
              }}>{s.code}</div>
              <h3 style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--cream)', lineHeight: 1.3, marginBottom: 8 }}>
                {s.title}
              </h3>
              <div style={{ fontSize: 'var(--nano)', color: s.color, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16, opacity: 0.8 }}>
                {s.weight}
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                {s.topics.map((t) => (
                  <li key={t} style={{ fontSize: '.72rem', color: 'var(--dim)', lineHeight: 1.5 }}>
                    · {t}
                  </li>
                ))}
              </ul>
              <Link href={s.href}
                style={{ fontSize: 'var(--nano)', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--g2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                Notes →
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
          <Link href="#pricing" className="bp"><span>Get All 5 Subjects →</span></Link>
        </motion.div>
      </div>
      <style>{`
        @media(max-width:1024px){#HT{grid-template-columns:repeat(3,1fr)!important}}
        @media(max-width:640px){#HT{grid-template-columns:repeat(2,220px)!important;overflow-x:scroll}}
      `}</style>
    </section>
  )
}
