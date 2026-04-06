'use client'
/**
 * PhilosophySection — full-viewport "big statement" panel.
 * Text draws in word-by-word on scroll using SplitText.
 * Inspired by mokn.io / adeline.ai manifesto sections.
 */
import SplitText from '@/components/ui/SplitText'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function PhilosophySection() {
  return (
    <section
      id="philosophy"
      aria-label="Our belief"
      style={{
        padding: 'clamp(120px, 18vh, 200px) clamp(24px, 5vw, 72px)',
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '70vh',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow orbs */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '15%', left: '10%',
        width: 'clamp(200px, 30vw, 400px)', height: 'clamp(200px, 30vw, 400px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '15%', right: '10%',
        width: 'clamp(250px, 35vw, 500px)', height: 'clamp(250px, 35vw, 500px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 900, position: 'relative', textAlign: 'center' }}>
        {/* Eyebrow line */}
        <ScrollReveal variant="line" duration={0.9} style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <div style={{ width: 48, height: 1, background: 'var(--g1)' }} />
        </ScrollReveal>

        {/* Main statement — word-by-word reveal */}
        <div style={{
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(2.2rem, 5vw, 4.4rem)',
          fontWeight: 400, lineHeight: 1.2, color: 'var(--cream)',
        }}>
          <SplitText
            text="The NCA is not testing your legal knowledge."
            by="words"
            stagger={0.055}
            duration={0.9}
            style={{ display: 'block', marginBottom: '0.2em' }}
          />
          <SplitText
            text="It's testing your exam technique."
            by="words"
            stagger={0.065}
            delay={0.35}
            duration={1.0}
            style={{ display: 'block' }}
            tokenColor="var(--g1)"
          />
        </div>

        {/* Sub-caption */}
        <ScrollReveal variant="fade" delay={0.8} duration={0.9} style={{ marginTop: 40 }}>
          <p style={{
            fontSize: 'var(--sm)', color: 'var(--dim)',
            letterSpacing: '.14em', textTransform: 'uppercase', fontFamily: 'var(--fb)',
          }}>
            The belief behind everything we build
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
