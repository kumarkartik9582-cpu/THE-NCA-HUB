'use client'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import Link from 'next/link'

const PODS = [
  {
    id: 'admin',
    title: 'Administrative Law',
    tag: 'High-frequency',
    tagColor: 'rgba(201,168,76,.8)',
    points: ['Vavilov reasonableness standard', 'Baker procedural fairness', 'Dunsmuir correctness', 'Fettering discretion'],
    href: '/notes/administrative-law/',
  },
  {
    id: 'con',
    title: 'Constitutional Law',
    tag: 'Complex',
    tagColor: 'rgba(201,168,76,.6)',
    points: ['Division of powers (s.91/92)', 'Charter s.1 Oakes test', 'Aboriginal rights (s.35)', 'Notwithstanding clause'],
    href: '/notes/constitutional-law/',
  },
  {
    id: 'crim',
    title: 'Criminal Law',
    tag: 'Framework-heavy',
    tagColor: 'rgba(201,168,76,.5)',
    points: ['Actus reus / mens rea', 'Section 229 murder analysis', 'Defences (provocation, necessity)', 'Sentencing principles'],
    href: '/notes/criminal-law/',
  },
  {
    id: 'fcl',
    title: 'Foundations of Canadian Law',
    tag: 'Conceptual',
    tagColor: 'rgba(201,168,76,.45)',
    points: ['Sources of Canadian law', 'Common law vs civil law', 'Constitutional supremacy', 'Stare decisis'],
    href: '/notes/foundations-of-canadian-law/',
  },
  {
    id: 'pr',
    title: 'Professional Responsibility',
    tag: 'Rules-based',
    tagColor: 'rgba(201,168,76,.4)',
    points: ['Duty of loyalty / confidentiality', 'Conflicts of interest', 'Competence standard', 'Trust accounting'],
    href: '/notes/professional-responsibility/',
  },
]

export default function PodsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section className="sec" id="pods" aria-label="Performance Pods" ref={ref}>
      <div className="w">
        <motion.span className="ey"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}>
          Performance Pods
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: 'var(--fd)', fontSize: 'var(--h1)', fontWeight: 400, lineHeight: 1.1, marginBottom: 16 }}>
          Five subjects.<br /><em>One system.</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 600, marginBottom: 56 }}>
          Each Performance Pod is a self-contained preparation module — notes, templates, and practice questions built specifically for that subject.
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {PODS.map((pod, i) => (
            <motion.div key={pod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="pod-card"
              style={{
                padding: '32px 28px',
                background: 'rgba(201,168,76,.03)',
                border: '1px solid rgba(201,168,76,.1)',
                cursor: 'pointer',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.15rem', fontWeight: 500, color: 'var(--cream)', lineHeight: 1.3 }}>
                  {pod.title}
                </h3>
                <span style={{
                  fontSize: '.52rem', letterSpacing: '.15em', textTransform: 'uppercase',
                  color: pod.tagColor, background: 'rgba(201,168,76,.06)',
                  padding: '3px 8px', borderRadius: 2, whiteSpace: 'nowrap', marginLeft: 12,
                }}>
                  {pod.tag}
                </span>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {pod.points.map((pt) => (
                  <li key={pt} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--sm)', color: 'var(--fog)' }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--g2)', flexShrink: 0 }} />
                    {pt}
                  </li>
                ))}
              </ul>
              <Link href={pod.href}
                style={{ fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--g1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                View Notes <span style={{ fontSize: '1em' }}>→</span>
              </Link>
            </motion.div>
          ))}
          {/* CTA pod */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              padding: '32px 28px', gridColumn: 'span 1',
              background: 'rgba(201,168,76,.06)',
              border: '1px solid rgba(201,168,76,.2)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16,
            }}>
            <div style={{ fontFamily: 'var(--fd)', fontSize: '1.15rem', color: 'var(--cream)', lineHeight: 1.4 }}>
              Get all five pods in the Complete Bundle
            </div>
            <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.7 }}>
              Notes + templates + practice questions for every NCA subject.
            </p>
            <Link href="#pricing" className="bp" style={{ alignSelf: 'flex-start' }}>
              <span>See Pricing →</span>
            </Link>
          </motion.div>
        </div>
      </div>
      <style>{`@media(max-width:768px){#pods .w > div:last-child{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
