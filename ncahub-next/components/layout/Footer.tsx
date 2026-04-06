import Link from 'next/link'

const COLS = [
  { title:'Prepare', links:[
    {href:'/#method',label:'The Method'},{href:'/#pods',label:'Pods'},{href:'/#subjects',label:'Subjects'},
    {href:'/#pricing',label:'Pricing'},{href:'/#sample',label:'Free Chapter'},{href:'/readiness/',label:'Readiness Score'},
  ]},
  { title:'Subjects', links:[
    {href:'/notes/administrative-law/',label:'Admin Law'},{href:'/notes/constitutional-law/',label:'Con Law'},
    {href:'/notes/criminal-law/',label:'Criminal Law'},{href:'/notes/foundations-of-canadian-law/',label:'Foundations'},
    {href:'/notes/professional-responsibility/',label:'Prof. Responsibility'},
  ]},
  { title:'Guides', links:[
    {href:'/nca-for-indian-lawyers/',label:'For Indian Lawyers'},{href:'/nca-for-uk-lawyers/',label:'For UK Lawyers'},
    {href:'/nca-for-nigerian-lawyers/',label:'For Nigerian Lawyers'},{href:'/nca-for-pakistani-lawyers/',label:'For Pakistani Lawyers'},
    {href:'/nca-for-philippine-lawyers/',label:'For Philippine Lawyers'},
  ]},
  { title:'Legal', links:[
    {href:'/about/',label:'About'},{href:'/contact/',label:'Contact'},
    {href:'/privacy.html',label:'Privacy'},{href:'/terms.html',label:'Terms'},{href:'/refund.html',label:'Refund'},
  ]},
]

export default function Footer() {
  return (
    <footer id="contact" style={{background:'var(--void)',borderTop:'1px solid rgba(201,168,76,.07)',padding:'80px 48px 52px',position:'relative',zIndex:1}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div className="footer-grid" style={{display:'grid',gridTemplateColumns:'1fr repeat(4,auto)',gap:48,marginBottom:64}}>
          <div>
            <Link href="/" style={{display:'block',marginBottom:16}}>
              <span style={{fontFamily:'var(--fd)',fontSize:'1.4rem',fontWeight:500,color:'var(--g1)'}}>THE NCA HUB</span>
            </Link>
            <p style={{fontSize:'var(--sm)',color:'var(--dim)',lineHeight:1.75,maxWidth:260}}>
              NCA exam prep for internationally trained lawyers qualifying in Canada.
            </p>
            <div style={{display:'flex',gap:16,marginTop:24}}>
              {[['https://www.linkedin.com/company/thencahub','LinkedIn'],['https://www.instagram.com/thencahub/','Instagram']].map(([href,label])=>(
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={{fontSize:'var(--nano)',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--dim)'}}>{label}</a>
              ))}
            </div>
          </div>
          {COLS.map(col => (
            <div key={col.title}>
              <div style={{fontSize:'var(--nano)',letterSpacing:'.3em',textTransform:'uppercase',color:'var(--g1)',fontWeight:600,marginBottom:20}}>{col.title}</div>
              <ul style={{display:'flex',flexDirection:'column',gap:10}}>
                {col.links.map(l=>(
                  <li key={l.href}><Link href={l.href} style={{fontSize:'var(--sm)',color:'var(--dim)',transition:'color .25s'}}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{borderTop:'1px solid rgba(201,168,76,.06)',paddingTop:32,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <p style={{fontSize:'var(--nano)',color:'var(--dim)',letterSpacing:'.1em'}}>© {new Date().getFullYear()} The NCA Hub. All rights reserved.</p>
          <p style={{fontSize:'var(--nano)',color:'var(--dim)',letterSpacing:'.08em'}}>Built by an internationally qualified lawyer who passed all 5 NCA subjects.</p>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){.footer-grid{grid-template-columns:1fr 1fr!important;gap:32px!important}}
        footer{padding:52px 24px!important}
        @media(min-width:769px){footer{padding:80px 48px 52px!important}}
      `}</style>
    </footer>
  )
}
