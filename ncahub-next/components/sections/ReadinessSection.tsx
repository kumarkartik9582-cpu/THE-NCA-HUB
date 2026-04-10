'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'

const EXPO = [0.16, 1, 0.3, 1] as const

const QUESTIONS = [
  {
    q: 'How many days until your exam?',
    options: [
      { label: 'Less than 14 days', pts: 0 },
      { label: '14–30 days', pts: 5 },
      { label: '30–60 days', pts: 10 },
      { label: 'More than 60 days', pts: 15 },
    ],
  },
  {
    q: 'Have you read the NCA syllabus for your subject?',
    options: [
      { label: 'No', pts: 0 },
      { label: 'Skimmed it', pts: 5 },
      { label: 'Read it carefully', pts: 10 },
      { label: 'Know it well', pts: 15 },
    ],
  },
  {
    q: 'Have you done any timed practice answers?',
    options: [
      { label: 'None', pts: 0 },
      { label: 'One or two', pts: 5 },
      { label: '3–5 timed answers', pts: 15 },
      { label: 'More than 5', pts: 20 },
    ],
  },
  {
    q: 'Do you know the key legal frameworks for your subject?',
    options: [
      { label: 'Not yet', pts: 0 },
      { label: 'Some of them', pts: 5 },
      { label: 'Most of them', pts: 12 },
      { label: 'All of them', pts: 20 },
    ],
  },
  {
    q: 'Have you reviewed past exam questions or guides?',
    options: [
      { label: 'No', pts: 0 },
      { label: 'Looked at a few', pts: 5 },
      { label: 'Reviewed several carefully', pts: 15 },
    ],
  },
  {
    q: 'How confident are you about your answer structure?',
    options: [
      { label: 'Not confident', pts: 0 },
      { label: 'Somewhat confident', pts: 8 },
      { label: 'Confident', pts: 15 },
      { label: 'Very confident', pts: 20 },
    ],
  },
]

function getResult(score: number) {
  if (score >= 80) return { label: 'Exam Ready', color: '#4ade80', msg: 'You are in a strong position. Focus on your weakest framework and do one final timed practice answer the day before.' }
  if (score >= 55) return { label: 'Approaching Ready', color: 'var(--g1)', msg: 'Good foundation. Complete 2–3 more timed practice answers and review any frameworks you are uncertain about.' }
  if (score >= 30) return { label: 'Building Momentum', color: '#fb923c', msg: 'You have time. Focus on understanding the key legal frameworks and start timed practice answers now.' }
  return { label: 'Early Stage', color: '#f87171', msg: 'Begin with the core frameworks for your subject. The NCA Hub notes will give you the exam-targeted structure you need.' }
}

/** Animated count-up for the final score */
function ScoreDisplay({ pct, result }: { pct: number; result: ReturnType<typeof getResult> }) {
  const motionVal = useMotionValue(0)
  const display = useTransform(motionVal, (v) => Math.round(v).toString())

  useEffect(() => {
    const controls = animate(motionVal, pct, { duration: 1.2, ease: 'easeOut', delay: 0.3 })
    return controls.stop
  }, [pct, motionVal])

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
      <motion.span style={{
        fontFamily: 'var(--fd)', fontSize: '4rem', fontWeight: 300,
        color: result.color, lineHeight: 1,
      }}>
        {display}
      </motion.span>
      <span style={{ fontSize: 'var(--sm)', color: 'var(--fog)' }}>/ 100</span>
    </div>
  )
}

export default function ReadinessSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [answers, setAnswers] = useState<number[]>([])
  const [complete, setComplete] = useState(false)

  const current = answers.length
  const score = answers.reduce((sum, a, i) => sum + (QUESTIONS[i].options[a]?.pts ?? 0), 0)
  const maxScore = QUESTIONS.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.pts)), 0)
  const pct = Math.round((score / maxScore) * 100)

  const handleAnswer = (idx: number) => {
    const next = [...answers, idx]
    setAnswers(next)
    if (next.length === QUESTIONS.length) setComplete(true)
  }

  const result = getResult(pct)

  return (
    <section className="sec" id="readiness" aria-label="Readiness Assessment" ref={ref}>
      <div className="w">
        <motion.span
          className="ey"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          The Readiness Score
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EXPO }}
          style={{ fontFamily: 'var(--fd)', fontSize: 'var(--h1)', fontWeight: 400, lineHeight: 1.1, marginBottom: 16 }}
        >
          Know exactly where you stand.<br /><em>Before you sit.</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 600, marginBottom: 48 }}
        >
          Six questions built on real exam criteria. Your score reflects whether you are ready to sit, not whether you&apos;ve studied long enough.
        </motion.p>

        <AnimatePresence mode="wait">
          {!complete ? (
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              style={{ maxWidth: 640 }}
            >
              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
                {QUESTIONS.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      background: i < current
                        ? 'var(--g1)'
                        : i === current
                          ? 'rgba(201,168,76,.4)'
                          : 'rgba(255,255,255,.06)',
                      scaleX: i === current ? 1.15 : 1,
                    }}
                    transition={{ duration: 0.35 }}
                    style={{ flex: 1, height: 2 }}
                  />
                ))}
              </div>

              <div style={{ fontSize: 'var(--nano)', color: 'var(--g1)', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 16 }}>
                Question {current + 1} of {QUESTIONS.length}
              </div>
              <p style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', color: 'var(--cream)', marginBottom: 28 }}>
                {QUESTIONS[current].q}
              </p>

              {/* Answer options — staggered */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {QUESTIONS[current].options.map((opt, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: EXPO }}
                    whileHover={{ x: 4, borderColor: 'rgba(201,168,76,.4)', background: 'rgba(201,168,76,.08)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(i)}
                    style={{
                      padding: '16px 20px', textAlign: 'left', cursor: 'pointer',
                      background: 'rgba(201,168,76,.04)', border: '1px solid rgba(201,168,76,.15)',
                      color: 'var(--cream)', fontFamily: 'var(--fb)', fontSize: 'var(--sm)',
                      transition: 'background .2s, border-color .2s', borderRadius: 3,
                    }}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ maxWidth: 640 }}
            >
              {/* Animated score count-up */}
              <ScoreDisplay pct={pct} result={result} />

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: EXPO }}
                style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', color: 'var(--cream)', marginBottom: 16 }}
              >
                {result.label}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.75, marginBottom: 28 }}
              >
                {result.msg}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.85, ease: EXPO }}
                style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
              >
                <a href="https://payhip.com/THENCAHUB" target="_blank" rel="noopener noreferrer" className="bp">
                  <span>Get Study Notes →</span>
                </a>
                <button className="nc" onClick={() => { setAnswers([]); setComplete(false) }}>
                  <span>Retake</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
