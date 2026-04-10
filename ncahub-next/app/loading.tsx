'use client'
import { motion } from 'framer-motion'

const EXPO = [0.16, 1, 0.3, 1] as const

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
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        {/* Animated gold bar — breathing scaleX */}
        <motion.div
          animate={{
            scaleX: [0.3, 1, 0.3],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.8,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
          style={{
            width: 120,
            height: 1,
            background: 'linear-gradient(90deg, transparent, var(--g1), transparent)',
            boxShadow: '0 0 10px rgba(201,168,76,0.4)',
          }}
        />

        {/* Staggered letter reveal for "LOADING" */}
        <div style={{ display: 'flex', gap: 4 }}>
          {'LOADING'.split('').map((ch, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1.4,
                delay: i * 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                fontFamily: 'var(--fb)',
                fontSize: 'var(--nano)',
                letterSpacing: '.25em',
                color: 'var(--dim)',
                fontWeight: 500,
              }}
            >
              {ch}
            </motion.span>
          ))}
        </div>

        {/* Three dots pulsing */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.0,
                delay: i * 0.18,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                width: 4, height: 4,
                borderRadius: '50%',
                background: 'var(--g1)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
