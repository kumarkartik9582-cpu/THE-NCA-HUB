'use client'
import dynamic from 'next/dynamic'

const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background:
          'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}
    />
  ),
})

export default function HeroSceneLoader() {
  return <HeroScene />
}
