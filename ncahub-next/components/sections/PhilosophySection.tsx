'use client'
/**
 * PhilosophySection — full-viewport "big statement" panel.
 * ONE animation: word-by-word SplitText reveal. Nothing else competing.
 */
import SplitText from '@/components/ui/SplitText'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function PhilosophySection() {
  return (
    <section
      id="philosophy"
      aria-label="Our belief"
      className="sec-divider"
      style={{
        padding: 'clamp(120px, 18vh, 200px) clamp(24px, 5vw, 72px)',
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '70vh',
        overflow: 'hidden',
        borderTop: '1px solid rgba(201,168,76,.06)',
      }}
    >
      <div style={{ maxWidth: 900, position: 'relative', textAlign: 'center', zIndex: 2 }}>
        {/* Glow line divider */}
        <ScrollReveal variant="line" duration={0.9} style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <div className="glow-line" style={{ width: 80 }} />
        </ScrollReveal>

        {/* Main statement — word-by-word reveal (THE signature animation) */}
        <div className="text-depth" style={{
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

        {/* Bottom glow line */}
        <ScrollReveal variant="line" delay={1.0} duration={1.2} style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
          <div className="glow-line" style={{ width: 120 }} />
        </ScrollReveal>
      </div>
    </section>
  )
}
