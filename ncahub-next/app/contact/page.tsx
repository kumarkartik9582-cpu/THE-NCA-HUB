'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

const TOPICS = [
  'Question about a subject',
  'Payment / purchasing',
  'Payment plan request',
  'Technical issue',
  'Partnership / media',
  'Other',
]

const QUICK_FAQS = [
  { q: 'Can I pay in installments?', a: 'Yes — email before purchasing and a payment schedule can be arranged.' },
  { q: 'Do you offer a refund?', a: 'Notes are digital products — no refunds after download. Get the free chapter first.' },
  { q: 'Will I get updates?', a: 'Yes. Purchasers receive updated notes when the NCA changes the syllabus.' },
]

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' })

  const heroRef = useRef<HTMLElement>(null)
  const heroInView = useInView(heroRef, { once: true })
  const bodyRef = useRef<HTMLElement>(null)
  const bodyInView = useInView(bodyRef, { once: true, margin: '-5%' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://formspree.io/f/thencahub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', topic: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

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
            Contact
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 44 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 400, lineHeight: 1.05, marginBottom: 20 }}
          >
            Get in touch.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.38 }}
            style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 500, lineHeight: 1.8 }}
          >
            Questions about the notes, payment plans, or anything else — email works fastest.
          </motion.p>
        </div>
      </section>

      {/* Body — two-column slide-in */}
      <section ref={bodyRef} style={{ background: 'var(--void)', padding: '80px 0 140px' }}>
        <div className="w">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 80 }}>

            {/* Left: info slides from left */}
            <motion.div
              initial={{ opacity: 0, x: -48 }}
              animate={bodyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.85, ease: EASE }}
            >
              <div style={{ marginBottom: 48 }}>
                <div style={{ fontSize: 'var(--nano)', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--g1)', marginBottom: 12, fontWeight: 600 }}>Email</div>
                <a href="mailto:thencahub@gmail.com" style={{ fontSize: '1rem', color: 'var(--cream)' }}>thencahub@gmail.com</a>
                <p style={{ fontSize: 'var(--sm)', color: 'var(--dim)', marginTop: 8, lineHeight: 1.65 }}>Response within 24 hours, usually faster.</p>
              </div>

              <div style={{ marginBottom: 48 }}>
                <div style={{ fontSize: 'var(--nano)', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--g1)', marginBottom: 16, fontWeight: 600 }}>Common Questions</div>
                {QUICK_FAQS.map((item, i) => (
                  <motion.div
                    key={item.q}
                    initial={{ opacity: 0, x: -24 }}
                    animate={bodyInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: EASE }}
                    style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(201,168,76,.08)' }}
                  >
                    <div style={{ fontSize: 'var(--sm)', color: 'var(--cream)', marginBottom: 6 }}>{item.q}</div>
                    <div style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65 }}>{item.a}</div>
                  </motion.div>
                ))}
                <Link href="/faq/" style={{ fontSize: 'var(--nano)', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--g1)' }}>
                  All FAQs →
                </Link>
              </div>
            </motion.div>

            {/* Right: form slides from right */}
            <motion.div
              initial={{ opacity: 0, x: 48 }}
              animate={bodyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
            >
              <AnimatePresence mode="wait">
                {status === 'sent' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    style={{ padding: '48px 32px', background: 'rgba(201,168,76,.05)', border: '1px solid rgba(201,168,76,.2)', textAlign: 'center' }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
                      style={{ fontFamily: 'var(--fd)', fontSize: '2rem', color: 'var(--g1)', marginBottom: 16 }}
                    >
                      Message received.
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.75 }}
                    >
                      We&apos;ll reply to <strong style={{ color: 'var(--cream)' }}>{form.email || 'your email'}</strong> within 24 hours.
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                  >
                    {/* Name + Email row — staggered */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={bodyInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
                      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
                    >
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 8 }}>Name</label>
                        <input
                          required
                          value={form.name}
                          onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                          style={{ width: '100%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(201,168,76,.15)', padding: '12px 16px', color: 'var(--cream)', fontSize: 'var(--sm)', fontFamily: 'var(--fb)', outline: 'none', borderRadius: 2 }}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 8 }}>Email</label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                          style={{ width: '100%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(201,168,76,.15)', padding: '12px 16px', color: 'var(--cream)', fontSize: 'var(--sm)', fontFamily: 'var(--fb)', outline: 'none', borderRadius: 2 }}
                          placeholder="you@example.com"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={bodyInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                    >
                      <label style={{ display: 'block', fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 8 }}>Topic</label>
                      <select
                        value={form.topic}
                        onChange={(e) => setForm(f => ({ ...f, topic: e.target.value }))}
                        style={{ width: '100%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(201,168,76,.15)', padding: '12px 16px', color: form.topic ? 'var(--cream)' : 'var(--dim)', fontSize: 'var(--sm)', fontFamily: 'var(--fb)', outline: 'none', borderRadius: 2, cursor: 'pointer' }}
                      >
                        <option value="" style={{ background: '#0D0D18' }}>Select a topic</option>
                        {TOPICS.map((t) => <option key={t} value={t} style={{ background: '#0D0D18' }}>{t}</option>)}
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={bodyInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
                    >
                      <label style={{ display: 'block', fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 8 }}>Message</label>
                      <textarea
                        required
                        rows={6}
                        value={form.message}
                        onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                        style={{ width: '100%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(201,168,76,.15)', padding: '12px 16px', color: 'var(--cream)', fontSize: 'var(--sm)', fontFamily: 'var(--fb)', outline: 'none', resize: 'vertical', borderRadius: 2, lineHeight: 1.75 }}
                        placeholder="What can we help with?"
                      />
                    </motion.div>

                    <AnimatePresence>
                      {status === 'error' && (
                        <motion.p
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          style={{ fontSize: 'var(--sm)', color: '#e07070' }}
                        >
                          Something went wrong. Email thencahub@gmail.com directly.
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={bodyInView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.55 }}
                    >
                      <button type="submit" className="bp" disabled={status === 'sending'} style={{ alignSelf: 'flex-start' }}>
                        <span>{status === 'sending' ? 'Sending…' : 'Send Message →'}</span>
                      </button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      <style>{`
        input:focus,textarea:focus,select:focus{border-color:rgba(201,168,76,.4)!important}
        @media(max-width:768px){
          section > div > div[style*="1fr 1.5fr"]{grid-template-columns:1fr!important;gap:48px!important}
          form > div[style*="1fr 1fr"]{grid-template-columns:1fr!important}
        }
      `}</style>
    </main>
  )
}
