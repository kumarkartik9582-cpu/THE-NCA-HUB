import Link from 'next/link'

export default function NotFound() {
  return (
    <section style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(80px, 12vh, 140px) clamp(24px, 5vw, 72px)',
      position: 'relative',
      zIndex: 2,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 560 }}>
        {/* Large 404 with depth */}
        <div className="text-depth" style={{
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(6rem, 15vw, 12rem)',
          fontWeight: 300,
          lineHeight: 1,
          marginBottom: 24,
        }}>
          <span className="gradient-text">404</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontWeight: 400,
          color: 'var(--cream)',
          marginBottom: 16,
          lineHeight: 1.2,
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: 'var(--sm)',
          color: 'var(--fog)',
          lineHeight: 1.75,
          marginBottom: 40,
        }}>
          The page you are looking for does not exist or has been moved.
          Let us help you find what you need.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="bp" style={{ borderRadius: 4 }}>
            <span>Back to Home →</span>
          </Link>
          <Link href="/notes/" className="nc" style={{ borderRadius: 4 }}>
            <span>View Notes</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
