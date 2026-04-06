'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/#method', label: 'Method' },
  { href: '/#pods', label: 'Pods' },
  { href: '/#subjects', label: 'Subjects' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/notes/', label: 'Notes', gold: true },
  { href: '/blog/', label: 'Articles' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <nav style={{
        position:'fixed',top:'28px',inset:'0 0 auto 0',zIndex:9040,
        padding:'20px 48px',display:'flex',alignItems:'center',justifyContent:'space-between',
        background:'rgba(2,2,4,0.85)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(201,168,76,0.06)',
      }}>
        <Link href="/" style={{display:'flex',flexDirection:'column',gap:1}}>
          <span style={{fontFamily:'var(--fd)',fontSize:'1.1rem',fontWeight:500,color:'var(--g1)',letterSpacing:'.04em'}}>THE NCA HUB</span>
          <span style={{fontSize:'.42rem',letterSpacing:'.35em',textTransform:'uppercase',color:'var(--dim)',fontFamily:'var(--fb)'}}>Canada · NCA Prep</span>
        </Link>
        <div className="nav-desktop" style={{display:'flex',alignItems:'center',gap:32}}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{fontSize:'.62rem',letterSpacing:'.2em',textTransform:'uppercase',fontFamily:'var(--fb)',fontWeight:500,color:l.gold?'var(--g1)':'var(--fog)'}}>
              {l.label}
            </Link>
          ))}
          <a href="https://payhip.com/THENCAHUB" target="_blank" rel="noopener noreferrer" className="bp" style={{padding:'10px 20px',fontSize:'.6rem'}}>
            <span>Get Notes →</span>
          </a>
        </div>
        <button onClick={() => setOpen(!open)} className="nav-burger" aria-label="Toggle menu" style={{display:'none',background:'none',border:'none',cursor:'pointer',padding:8,flexDirection:'column',gap:5}}>
          <span style={{display:'block',width:22,height:1,background:'var(--g1)'}} />
          <span style={{display:'block',width:22,height:1,background:'var(--g1)'}} />
          <span style={{display:'block',width:22,height:1,background:'var(--g1)'}} />
        </button>
      </nav>

      {open && (
        <div onClick={() => setOpen(false)} style={{position:'fixed',inset:0,zIndex:9035,background:'rgba(2,2,4,0.97)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:32}}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{fontFamily:'var(--fd)',fontSize:'2rem',color:'var(--cream)'}}>
              {l.label}
            </Link>
          ))}
          <a href="/#pricing" className="bp" style={{marginTop:16}}><span>Get Notes →</span></a>
        </div>
      )}

      <style>{`
        @media(max-width:768px){.nav-desktop{display:none!important}.nav-burger{display:flex!important}}
        @media(min-width:769px){.nav-burger{display:none!important}}
      `}</style>
    </>
  )
}
