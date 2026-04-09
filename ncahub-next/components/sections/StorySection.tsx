'use client'
/**
 * StorySection — 4-chapter cinematic founder narrative.
 * Ported from original index.html story section.
 * "Three UK law firms → Then nothing → One week to prepare →
 *  All five passed → Certificate of Qualification → The course that built itself"
 */
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SplitText from '@/components/ui/SplitText'
import ScrollReveal from '@/components/ui/ScrollReveal'

const CHAPTERS = [
  {
    num: '01',
    label: 'Chapter 01 / 04',
    eye: 'The Founder\'s Story',
    heading: ['Three UK law firms.', 'A Supreme Court judgment.', 'Then nothing.'],
    body: [
      'Kartik Kumar qualified as a lawyer in India and built his career at UK law firms: DWF, Eversheds Sutherland, and Keoghs. He was hired as a Legal Executive at a newly established law firm for motor finance undisclosed commission claims.',
      'A Supreme Court judgment (Hopcraft v Close Brothers) changed the motor finance landscape. The project wound down. Kartik was let go. No income, borrowed money from parents. He had already received his NCA assessment prior to the job loss.',
    ],
  },
  {
    num: '02',
    label: 'Chapter 02 / 04',
    eye: 'The Pivot',
    heading: ['Sit the NCA.', 'One week to prepare.'],
    body: [
      'He purchased the industry-standard materials. He found them too dense and too long, built for candidates with months to spare, not one week.',
      'So he built his own system: distilled notes, conversations with fellow candidates, and a strategic framework for every question type.',
    ],
  },
  {
    num: '03',
    label: 'Chapter 03 / 04',
    eye: 'The Method',
    heading: ['All five subjects passed.', 'Certificate of Qualification requested.'],
    body: [
      'Administrative Law (first exam, one week prep). Constitutional Law. Professional Responsibility. Criminal Law. All passed in under three months.',
      'Foundations of Canadian Law was disqualified due to a remote proctoring technical failure mid-session — not a knowledge failure. Retook at the first available sitting in January 2026. Passed. CPLED LRW completed early. Total: all 5 NCA subjects complete · LRW fulfilled · Certificate of Qualification requested.',
    ],
  },
  {
    num: '04',
    label: 'Chapter 04 / 04',
    eye: 'The Proof',
    heading: ['The course that', 'built itself.'],
    body: [
      'LRW completed early signals system efficiency. The NCA Hub was born from necessity — built for everyone in the same position.',
      'Anum had sat Constitutional Law three times before. On her 4th and final attempt, using The NCA Hub method, she passed.',
    ],
    quote: '"I passed on my 4th and final attempt. This is the only method that worked for me." — Anum',
    footer: 'The notes Kartik built to pass his own exams are the same notes you get. No revision, no dilution. The system that worked under pressure — available to every candidate in the same position.',
  },
]

function StoryChapter({ chapter, index }: { chapter: typeof CHAPTERS[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <div
      ref={ref}
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(80px, 12vh, 140px) 0',
        borderTop: index > 0 ? '1px solid rgba(201,168,76,0.06)' : 'none',
        position: 'relative',
      }}
    >
      {/* Ambient vertical lines */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, bottom: 0,
        left: '18%', width: 1,
        background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.04), transparent)',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, bottom: 0,
        right: '22%', width: 1,
        background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.04), transparent)',
      }} />

      <div className="w">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px, 6vw, 80px)',
          alignItems: 'start',
        }}>
          {/* Left — number + heading */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 0.06 } : {}}
              transition={{ duration: 1 }}
              style={{
                fontFamily: 'var(--fd)',
                fontSize: 'clamp(6rem, 12vw, 10rem)',
                fontWeight: 300,
                lineHeight: 1,
                color: 'var(--g1)',
                position: 'absolute',
                top: '10%',
              }}
            >
              {chapter.num}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase',
                color: 'var(--dim)', marginBottom: 8,
              }}
            >
              {chapter.label}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="ey"
              style={{ marginBottom: 20 }}
            >
              {chapter.eye}
            </motion.div>
            <div className="text-depth" style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: 'var(--cream)',
            }}>
              {chapter.heading.map((line, i) => (
                <SplitText
                  key={i}
                  text={line}
                  by="words"
                  stagger={0.06}
                  delay={0.3 + i * 0.2}
                  style={{
                    display: 'block',
                    color: i === chapter.heading.length - 1 ? 'var(--g1)' : 'var(--cream)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right — body text */}
          <div>
            {chapter.body.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 + i * 0.15 }}
                style={{
                  fontSize: 'var(--sm)', color: 'var(--fog)',
                  lineHeight: 1.8, marginBottom: 16,
                }}
              >
                {p}
              </motion.p>
            ))}

            {chapter.quote && (
              <motion.blockquote
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="holo-card"
                style={{
                  padding: '20px 24px',
                  marginTop: 24,
                  borderLeft: '2px solid var(--g1)',
                }}
              >
                <p style={{
                  fontFamily: 'var(--fd)', fontSize: '1rem',
                  fontStyle: 'italic', color: 'var(--cream)', lineHeight: 1.7,
                }}>
                  {chapter.quote}
                </p>
              </motion.blockquote>
            )}

            {chapter.footer && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.9 }}
                style={{
                  fontSize: 'var(--sm)', color: 'var(--cream)',
                  lineHeight: 1.8, marginTop: 24,
                  paddingTop: 24,
                  borderTop: '1px solid rgba(201,168,76,0.1)',
                }}
              >
                {chapter.footer}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StorySection() {
  return (
    <section
      id="story"
      aria-label="The founder's story"
      style={{
        background: 'var(--void)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <div className="w" style={{ paddingTop: 'clamp(80px, 12vh, 140px)' }}>
        <ScrollReveal variant="line" style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <div className="glow-line" style={{ width: 80 }} />
        </ScrollReveal>
      </div>

      {/* Chapters */}
      {CHAPTERS.map((ch, i) => (
        <StoryChapter key={ch.num} chapter={ch} index={i} />
      ))}

      <style>{`
        @media(max-width:768px){
          #story .w > div { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  )
}
