'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

const SUBJECTS = [
  { id: 'admin', label: 'Administrative Law' },
  { id: 'con', label: 'Constitutional Law' },
  { id: 'crim', label: 'Criminal Law' },
  { id: 'fcl', label: 'Foundations of Canadian Law' },
  { id: 'pr', label: 'Professional Responsibility' },
]

export default function FreeChapterSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [step, setStep] = useState<'subject' | 'email' | 'done'>('subject')
  const [subject, setSubject] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, source: 'free_chapter' }),
      })
    } catch (_) {}
    setLoading(false)
    setStep('done')
  }

  return (
    <section className="sec" id="sample" aria-label="Get free chapter" ref={ref}
      style={{ background: 'var(--dark)', borderTop: '1px solid rgba(201,168,76,.06)' }}>
      <div className="w">
        <div style={{ maxWidth: 640 }}>
          <motion.span className="ey"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}>
            Free Chapter
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: 16 }}>
            Try a chapter<br /><em>before you commit.</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ fontSize: 'var(--lead)', color: 'var(--fog)', marginBottom: 40 }}>
            Get a free sample chapter from any subject. No card required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}>
            {step === 'subject' && (
              <div>
                <p style={{ fontSize: 'var(--nano)', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--g1)', marginBottom: 16 }}>
                  Choose your subject
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {SUBJECTS.map((s) => (
                    <button key={s.id} onClick={() => { setSubject(s.label); setStep('email') }}
                      style={{
                        padding: '14px 18px', textAlign: 'left', cursor: 'pointer',
                        background: 'rgba(201,168,76,.04)', border: '1px solid rgba(201,168,76,.15)',
                        color: 'var(--cream)', fontFamily: 'var(--fb)', fontSize: 'var(--sm)',
                        transition: 'all .2s', borderRadius: 3,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,.1)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,.4)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,.04)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,.15)' }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={handleSubmit}>
                <div style={{ padding: '10px 14px', background: 'rgba(201,168,76,.05)', borderLeft: '2px solid var(--g1)', marginBottom: 20 }}>
                  <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)' }}>
                    <strong style={{ color: 'var(--g1)' }}>Selected:</strong> {subject}
                  </p>
                </div>
                <label style={{ display: 'block', fontSize: 'var(--nano)', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--g1)', marginBottom: 10 }}>
                  Your email address
                </label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: '100%', padding: '14px 16px', marginBottom: 16,
                    background: 'rgba(255,255,255,.04)', border: '1px solid rgba(201,168,76,.2)',
                    color: 'var(--cream)', fontFamily: 'var(--fb)', fontSize: 'var(--sm)',
                    borderRadius: 3, outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="bp" disabled={loading}>
                    <span>{loading ? 'Sending…' : 'Send Free Chapter →'}</span>
                  </button>
                  <button type="button" className="nc" onClick={() => setStep('subject')}>
                    <span>Back</span>
                  </button>
                </div>
              </form>
            )}

            {step === 'done' && (
              <div style={{ padding: '28px', background: 'rgba(201,168,76,.06)', border: '1px solid rgba(201,168,76,.2)' }}>
                <p style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', color: 'var(--g0)', marginBottom: 10 }}>
                  Chapter sent ✓
                </p>
                <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)' }}>
                  Check your inbox for the free chapter from {subject}. Didn&apos;t arrive? Check spam, or email <a href="mailto:thencahub@gmail.com" style={{ color: 'var(--g1)' }}>thencahub@gmail.com</a>.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
