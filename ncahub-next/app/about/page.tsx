import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About | The NCA Hub',
  description: 'The NCA Hub was built by an India-qualified lawyer who passed all 5 NCA subjects. The system is designed for working candidates with limited time and real stakes.',
  alternates: { canonical: 'https://www.thencahub.com/about/' },
}

const STATS = [
  { value: '5', label: 'NCA subjects passed' },
  { value: '12+', label: 'Countries represented' },
  { value: '7', label: 'Days to prep for first exam' },
  { value: '<80', label: 'Pages per subject' },
]

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--void)', padding: '160px 0 80px', borderBottom: '1px solid rgba(201,168,76,.07)' }}>
        <div className="w">
          <span className="ey">Our Story</span>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 400, lineHeight: 1.05, marginBottom: 24 }}>
            Built from inside<br /><em>the process.</em>
          </h1>
          <p style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 600, lineHeight: 1.8 }}>
            The NCA Hub was not built by an institution or a prep company. It was built by an internationally trained lawyer who went through the NCA process, identified what actually worked, and built a system around it.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--abyss)', padding: '60px 0', borderBottom: '1px solid rgba(201,168,76,.06)' }}>
        <div className="w">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ padding: '32px 24px', background: 'rgba(201,168,76,.03)', border: '1px solid rgba(201,168,76,.08)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '3rem', color: 'var(--g1)', lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 'var(--nano)', color: 'var(--dim)', letterSpacing: '.15em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section style={{ background: 'var(--void)', padding: '100px 0', borderBottom: '1px solid rgba(201,168,76,.06)' }}>
        <div className="w">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: 32, color: 'var(--cream)' }}>
                The NCA is not a knowledge test.<br /><em>It is a technique test.</em>
              </h2>
              <p style={{ fontSize: '.95rem', color: 'var(--fog)', lineHeight: 1.85, marginBottom: 24 }}>
                The founder of The NCA Hub qualified as a lawyer in India. When he arrived in Canada and received his NCA assessment, he was assigned all five subjects. His first exam sitting was seven days after he decided to prepare for Administrative Law.
              </p>
              <p style={{ fontSize: '.95rem', color: 'var(--fog)', lineHeight: 1.85, marginBottom: 24 }}>
                He passed on the first attempt — not because he read more than other candidates, but because he identified what the NCA was actually testing. The exam is not asking you to demonstrate deep legal knowledge. It is asking you to apply a specific framework to a specific fact pattern within a time limit.
              </p>
              <p style={{ fontSize: '.95rem', color: 'var(--fog)', lineHeight: 1.85 }}>
                That insight became The NCA Hub. Under 80 pages per subject. Answer templates built from the exam up. A readiness assessment that tells you honestly where you stand before you sit. Everything else is cut.
              </p>
            </div>
            <div>
              <div style={{ background: 'rgba(201,168,76,.04)', border: '1px solid rgba(201,168,76,.12)', padding: 36, marginBottom: 24 }}>
                <div style={{ fontSize: 'var(--nano)', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--g1)', marginBottom: 20, fontWeight: 600 }}>
                  The Method
                </div>
                {[
                  { n: '01', t: 'Framework first', d: 'Every NCA question maps to one of a small set of legal frameworks. Identify which one applies before writing a word.' },
                  { n: '02', t: 'Under 80 pages', d: 'Not because depth was cut. Because everything else was. The NCA tests the same things repeatedly — those things are here.' },
                  { n: '03', t: 'Answer templates', d: 'Pre-built response structures for every question type. So you spend the exam applying, not constructing.' },
                  { n: '04', t: 'Readiness score', d: 'Know where you stand before exam day. Not a motivational tool — a diagnostic that tells you what to fix.' },
                ].map((item) => (
                  <div key={item.n} style={{ display: 'flex', gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(201,168,76,.07)' }}>
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', color: 'rgba(201,168,76,.3)', lineHeight: 1, flexShrink: 0, minWidth: 40 }}>{item.n}</div>
                    <div>
                      <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--cream)', marginBottom: 6 }}>{item.t}</div>
                      <div style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65 }}>{item.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who uses it */}
      <section style={{ background: 'var(--abyss)', padding: '80px 0', borderBottom: '1px solid rgba(201,168,76,.06)' }}>
        <div className="w">
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 400, marginBottom: 16, color: 'var(--cream)' }}>Who uses The NCA Hub</h2>
          <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', maxWidth: 600, marginBottom: 48, lineHeight: 1.75 }}>
            The NCA Hub is used by internationally trained lawyers from across the world, most of whom are working full-time while preparing for their exams.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {[
              { country: 'India 🇮🇳', desc: 'The largest group of NCA candidates. Typically hold an LLB from a 3- or 5-year program and are assigned all 5 subjects.' },
              { country: 'United Kingdom 🇬🇧', desc: 'Solicitors and barristers. Often receive partial exemptions but still face 3–4 subjects.' },
              { country: 'Nigeria 🇳🇬', desc: 'Call to the Nigerian bar followed by UK or Canadian LLM. Typically assigned all 5 NCA subjects.' },
              { country: 'Pakistan 🇵🇰', desc: 'Similar credential pathway to India. All 5 subjects typically assigned.' },
              { country: 'Philippines 🇵🇭', desc: 'Philippine bar qualification. All 5 NCA subjects typically assigned.' },
              { country: 'Jamaica 🇯🇲', desc: 'Caribbean bar. Common law background may result in some exemptions.' },
            ].map((c) => (
              <div key={c.country} style={{ padding: '24px 20px', background: 'rgba(201,168,76,.02)', border: '1px solid rgba(201,168,76,.07)' }}>
                <div style={{ fontSize: '.9rem', color: 'var(--cream)', fontWeight: 600, marginBottom: 10 }}>{c.country}</div>
                <div style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--void)', padding: '100px 0 140px', textAlign: 'center' }}>
        <div className="w">
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, color: 'var(--cream)', marginBottom: 16 }}>
            Ready to start?
          </h2>
          <p style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 480, margin: '0 auto 40px' }}>
            Get your readiness score first. Then pick the subject that matters most.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/#readiness" className="bp"><span>Get My Readiness Score →</span></Link>
            <Link href="/notes/" className="nc"><span>Browse Notes</span></Link>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:1024px){section > div > div[style*="repeat(4, 1fr)"]{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:768px){
          section > div > div[style*="repeat(3, 1fr)"]{grid-template-columns:1fr!important}
          section > div > div[style*="1fr 1fr"]{grid-template-columns:1fr!important;gap:48px!important}
        }
      `}</style>
    </main>
  )
}
