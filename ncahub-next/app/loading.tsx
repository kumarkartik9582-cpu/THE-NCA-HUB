export default function Loading() {
  return (
    <section style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 2,
    }}>
      <div style={{ textAlign: 'center' }}>
        {/* Gold pulsing line */}
        <div style={{
          width: 120,
          height: 2,
          background: 'linear-gradient(90deg, transparent, var(--g1), transparent)',
          borderRadius: 2,
          animation: 'loadingPulse 1.5s ease-in-out infinite',
          margin: '0 auto 24px',
        }} />
        <div style={{
          fontSize: 'var(--nano)',
          letterSpacing: '.3em',
          textTransform: 'uppercase',
          color: 'var(--dim)',
          fontFamily: 'var(--fb)',
        }}>
          Loading
        </div>
        <style>{`
          @keyframes loadingPulse {
            0%, 100% { opacity: 0.3; transform: scaleX(0.5); }
            50% { opacity: 1; transform: scaleX(1); }
          }
        `}</style>
      </div>
    </section>
  )
}
