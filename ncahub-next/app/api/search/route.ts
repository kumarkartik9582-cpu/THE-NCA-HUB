import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const CONTENT_INDEX = [
  { title: 'Administrative Law Notes', url: '/notes/administrative-law/', tags: ['admin', 'vavilov', 'baker', 'dunsmuir', 'judicial review'] },
  { title: 'Constitutional Law Notes', url: '/notes/constitutional-law/', tags: ['constitution', 'charter', 'oakes', 'division of powers', 's.35'] },
  { title: 'Criminal Law Notes', url: '/notes/criminal-law/', tags: ['criminal', 'actus reus', 'mens rea', 'murder', 'defences', 'sentencing'] },
  { title: 'Foundations of Canadian Law Notes', url: '/notes/foundations-of-canadian-law/', tags: ['foundations', 'sources of law', 'common law', 'civil law', 'stare decisis'] },
  { title: 'Professional Responsibility Notes', url: '/notes/professional-responsibility/', tags: ['professional', 'loyalty', 'conflicts', 'competence', 'trust accounting'] },
  { title: 'NCA Exam Format Explained', url: '/blog/article-a2-nca-exam-format/', tags: ['exam', 'format', 'strategy', 'open book', 'time management'] },
  { title: 'How to Tackle Constitutional Law', url: '/blog/article-b1-constitutional-law-nca/', tags: ['constitutional', 'charter', 'study', 'guide'] },
  { title: 'Failed the NCA Exam? What to Do Next', url: '/blog/article-c1-failed-nca-exam/', tags: ['failed', 'retry', 'recovery', 'appeal'] },
  { title: 'NCA Study Schedule While Working Full-Time', url: '/blog/article-e1-nca-study-schedule-working/', tags: ['schedule', 'working', 'part-time', 'planning'] },
  { title: 'NCA Prep for Indian Lawyers', url: '/nca-for-indian-lawyers/', tags: ['india', 'indian', 'llb', 'foreign trained'] },
  { title: 'NCA Prep for UK Lawyers', url: '/nca-for-uk-lawyers/', tags: ['uk', 'england', 'solicitor', 'barrister'] },
  { title: 'NCA Prep for Nigerian Lawyers', url: '/nca-for-nigerian-lawyers/', tags: ['nigeria', 'nigerian'] },
]

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.toLowerCase().trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const results = CONTENT_INDEX
    .filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.tags.some(tag => tag.includes(q))
    )
    .slice(0, 6)
    .map(({ title, url }) => ({ title, url }))

  return NextResponse.json({ results })
}
