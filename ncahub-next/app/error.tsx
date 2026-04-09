'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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
        <div className="text-depth" style={{
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 300,
          lineHeight: 1,
          marginBottom: 24,
        }}>
          <span className="gradient-text">Oops</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontWeight: 400,
          color: 'var(--cream)',
          marginBottom: 16,
        }}>
          Something went wrong
        </h1>

        <p style={{
          fontSize: 'var(--sm)',
          color: 'var(--fog)',
          lineHeight: 1.75,
          marginBottom: 40,
        }}>
          An unexpected error occurred. Please try again.
        </p>

        <button onClick={reset} className="bp" style={{ borderRadius: 4 }}>
          <span>Try Again →</span>
        </button>
      </div>
    </section>
  )
}
