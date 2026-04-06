'use client'
import { useState } from 'react'
import Link from 'next/link'

const TOPICS = [
  'Question about a subject',
  'Payment / purchasing',
  'Payment plan request',
  'Technical issue',
  'Partnership / media',
  'Other',
]

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' })

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
      <section style={{ background: 'var(--void)', padding: '160px 0 80px', borderBottom: '1px solid rgba(201,168,76,.07)' }}>
        <div className="w">
          <span className="ey">Contact</span>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 400, lineHeight: 1.05, marginBottom: 20 }}>
            Get in touch.
          </h1>
          <p style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 500, lineHeight: 1.8 }}>
            Questions about the notes, payment plans, or anything else — email works fastest.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--void)', padding: '80px 0 140px' }}>
        <div className="w">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 80 }}>
            {/* Left: info */}
            <div>
              <div style={{ marginBottom: 48 }}>
                <div style={{ fontSize: 'var(--nano)', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--g1)', marginBottom: 12, fontWeight: 600 }}>Email</div>
                <a href="mailto:thencahub@gmail.com" style={{ fontSize: '1rem', color: 'var(--cream)' }}>thencahub@gmail.com</a>
                <p style={{ fontSize: 'var(--sm)', color: 'var(--dim)', marginTop: 8, lineHeight: 1.65 }}>Response within 24 hours, usually faster.</p>
              </div>

              <div style={{ marginBottom: 48 }}>
                <div style={{ fontSize: 'var(--nano)', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--g1)', marginBottom: 16, fontWeight: 600 }}>Common Questions</div>
                {[
                  { q: 'Can I pay in installments?', a: 'Yes — email before purchasing and a payment schedule can be arranged.' },
                  { q: 'Do you offer a refund?', a: 'Notes are digital products — no refunds after download. Get the free chapter first.' },
                  { q: 'Will I get updates?', a: 'Yes. Purchasers receive updated notes when the NCA changes the syllabus.' },
                ].map((item) => (
                  <div key={item.q} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(201,168,76,.08)' }}>
                    <div style={{ fontSize: 'var(--sm)', color: 'var(--cream)', marginBottom: 6 }}>{item.q}</div>
                    <div style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65 }}>{item.a}</div>
                  </div>
                ))}
                <Link href="/faq/" style={{ fontSize: 'var(--nano)', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--g1)' }}>
                  All FAQs →
                </Link>
              </div>
            </div>

            {/* Right: form */}
            <div>
              {status === 'sent' ? (
                <div style={{ padding: '48px 32px', background: 'rgba(201,168,76,.05)', border: '1px solid rgba(201,168,76,.2)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '2rem', color: 'var(--g1)', marginBottom: 16 }}>Message received.</div>
                  <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.75 }}>
                    We&apos;ll reply to <strong style={{ color: 'var(--cream)' }}>{form.email || 'your email'}</strong> within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 8 }}>Topic</label>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm(f => ({ ...f, topic: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(201,168,76,.15)', padding: '12px 16px', color: form.topic ? 'var(--cream)' : 'var(--dim)', fontSize: 'var(--sm)', fontFamily: 'var(--fb)', outline: 'none', borderRadius: 2, cursor: 'pointer' }}
                    >
                      <option value="" style={{ background: '#0D0D18' }}>Select a topic</option>
                      {TOPICS.map((t) => <option key={t} value={t} style={{ background: '#0D0D18' }}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 8 }}>Message</label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(201,168,76,.15)', padding: '12px 16px', color: 'var(--cream)', fontSize: 'var(--sm)', fontFamily: 'var(--fb)', outline: 'none', resize: 'vertical', borderRadius: 2, lineHeight: 1.75 }}
                      placeholder="What can we help with?"
                    />
                  </div>

                  {status === 'error' && (
                    <p style={{ fontSize: 'var(--sm)', color: '#e07070' }}>Something went wrong. Email thencahub@gmail.com directly.</p>
                  )}

                  <button type="submit" className="bp" disabled={status === 'sending'} style={{ alignSelf: 'flex-start' }}>
                    <span>{status === 'sending' ? 'Sending…' : 'Send Message →'}</span>
                  </button>
                </form>
              )}
            </div>
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
