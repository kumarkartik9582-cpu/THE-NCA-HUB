import type { Metadata } from 'next'
import NotesContent from '@/components/sections/NotesContent'

export const metadata: Metadata = {
  title: 'NCA Study Notes | All 5 Subjects | The NCA Hub',
  description: 'Concise NCA study notes for all 5 subjects — Administrative Law, Constitutional Law, Criminal Law, Foundations of Canadian Law, and Professional Responsibility. Under 80 pages each.',
  alternates: { canonical: 'https://www.thencahub.com/notes/' },
}

export default function NotesPage() {
  return <NotesContent />
}
