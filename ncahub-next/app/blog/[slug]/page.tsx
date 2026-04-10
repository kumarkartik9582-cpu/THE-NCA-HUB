import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPostContent from '@/components/sections/BlogPostContent'

const POSTS: Record<string, {
  title: string
  cat: string
  date: string
  readTime: string
  excerpt: string
  body: string[]
}> = {
  'article-a1-what-is-nca': {
    title: 'What Is the NCA? A Complete Guide for Foreign-Trained Lawyers',
    cat: 'Overview',
    date: 'April 2026',
    readTime: '8 min read',
    excerpt: 'Everything you need to know about the National Committee on Accreditation process — who it applies to, how long it takes, and what exams you will face.',
    body: [
      'The National Committee on Accreditation (NCA) is a body established by the Federation of Law Societies of Canada. Its function is straightforward: assess the legal education of internationally trained lawyers and determine what, if anything, they must do before being eligible for admission to a Canadian law society.',
      'If you completed your legal education outside Canada, you almost certainly need to go through the NCA process before you can be called to the bar in any Canadian province or territory.',
      '## Who Needs the NCA?',
      'The NCA process applies to: (1) lawyers who obtained their law degrees outside Canada, (2) lawyers who obtained a civil law degree from a Quebec institution but wish to practice common law, and (3) Canadian-trained lawyers whose degrees are not recognized for certain provinces.',
      '## The Assessment Process',
      'You begin by submitting your credentials to the NCA — your transcripts, degree certificates, and a completed application form. The NCA reviews your materials and issues a Certificate of Qualification (CoQ) assessment, which specifies which, if any, of the five NCA subjects you must pass.',
      'The five possible NCA exam subjects are: Administrative Law, Constitutional Law, Criminal Law, Foundations of Canadian Law, and Professional Responsibility. Most internationally trained lawyers are assigned all five. Some candidates with degrees from common law countries may receive partial exemptions.',
      '## The NCA Exams',
      'Each NCA exam is a three-hour, open-book examination. The open-book format is misleading to many candidates — it does not mean the exams are easy. The NCA is testing your ability to apply legal frameworks under significant time pressure. Candidates who treat it as a closed-book exam and memorize their notes typically perform better than those who rely on bringing everything they own.',
      '## Timeline',
      'From application to Certificate of Qualification, the NCA process typically takes between one and three years depending on how many subjects you are assigned, how you space your exams, and the exam windows available each year. The NCA offers exam sittings twice a year.',
      '## After the NCA',
      'Once you receive your Certificate of Qualification, you are eligible to apply to a Canadian law school\'s articling program or the Law Practice Program (LPP) in Ontario. After completing your articles and bar admission course (or equivalent), you can be called to the bar.',
    ],
  },
  'article-a2-nca-exam-format': {
    title: 'The NCA Exam Format Explained',
    cat: 'Exam Strategy',
    date: 'March 2026',
    readTime: '6 min read',
    excerpt: 'Open-book, time-pressured, and deeply framework-dependent. Learn exactly what the NCA exams look like and how to structure your answers.',
    body: [
      'The NCA exam is three hours long, open book, and typically consists of two to three essay-style questions. Each question presents a fact scenario and asks you to advise a client, analyze a constitutional challenge, or apply a standard of review.',
      '## What "Open Book" Actually Means',
      'You can bring any physical materials you want. Most candidates bring their notes, their textbooks, and case summaries. In practice, this creates a false sense of security. If you have not internalized the key frameworks before the exam, you will spend your three hours flipping through materials instead of writing coherent answers.',
      'The single most important thing you can do in NCA exam prep is reduce your reliance on your materials during the exam. Your notes should be a reference to confirm details, not a crutch for understanding.',
      '## Answer Structure',
      'NCA examiners are looking for structured, framework-driven answers. They want to see: (1) identification of the correct legal framework, (2) correct application of that framework to the facts, and (3) a conclusion. The weighting is roughly 30% identifying the right issue and framework, 60% applying it correctly, and 10% conclusion.',
      '## Time Management',
      'Three hours for two to three questions means 60 to 90 minutes per question. The most common mistake is spending too long on the first question and running out of time. Allocate your time before you begin writing and stick to it.',
      '## The Framework-First Approach',
      'Every NCA subject has a set of core frameworks that recur across questions. In Administrative Law, it is the Vavilov reasonableness standard and the Baker procedural fairness factors. In Constitutional Law, it is the Oakes test and the pith and substance doctrine. Knowing these frameworks cold is the difference between a pass and a fail.',
    ],
  },
  'article-b2-administrative-law-nca': {
    title: 'Administrative Law: The Vavilov Revolution',
    cat: 'Subject Guide',
    date: 'February 2026',
    readTime: '10 min read',
    excerpt: 'Since Vavilov (2019), the standard of review framework has fundamentally changed. This guide walks through what changed and how to apply it in exams.',
    body: [
      'Canada v. Vavilov [2019] SCC 65 fundamentally restructured Canadian administrative law. If you studied administrative law before 2019, or if your legal education was outside Canada, understanding what Vavilov changed is the single most important thing you can do for this NCA subject.',
      '## Before Vavilov: The Dunsmuir Framework',
      'Under Dunsmuir [2008] SCC 9, courts used a "standard of review analysis" to determine whether to apply correctness or reasonableness when reviewing an administrative decision. This involved weighing factors like the presence of a privative clause, the expertise of the decision-maker, and the nature of the question.',
      '## What Vavilov Changed',
      'Vavilov established a new presumptive framework. The default standard of review is now reasonableness. Correctness applies only in specific, defined circumstances: (1) when the legislature has indicated that correctness applies, (2) constitutional questions, (3) questions of central importance to the legal system, and (4) jurisdictional questions between administrative bodies.',
      '## Applying Reasonableness Under Vavilov',
      'Reasonableness review asks whether the decision is justified, transparent, and intelligible. The court looks at both the outcome AND the reasoning process. A decision can be unreasonable if the reasoning is internally incoherent, even if the outcome might have been defensible.',
      '## Procedural Fairness: Baker',
      'Baker v. Canada [1999] 2 SCR 817 remains the leading case on procedural fairness. The five Baker factors determine what process is owed: (1) nature of the decision and process, (2) role of the decision in the statutory scheme, (3) importance of the decision to the individual, (4) legitimate expectations, and (5) choices of procedure made by the agency.',
      '## Exam Application',
      'Most Administrative Law NCA questions ask you to: (1) identify the standard of review using the Vavilov framework, (2) apply that standard to the decision, and/or (3) assess whether procedural fairness was met using Baker. Know these two frameworks cold and you have covered 80% of what the exam tests.',
    ],
  },
  'article-c1-failed-nca-exam': {
    title: 'Failed the NCA Exam? What to Do Next',
    cat: 'Recovery',
    date: 'February 2026',
    readTime: '7 min read',
    excerpt: 'Failing an NCA exam is more common than people admit. Here is a practical guide to reviewing your performance, reapplying, and approaching the retake differently.',
    body: [
      'Failing an NCA exam feels devastating, especially when you have invested months preparing. But it is more common than the NCA prep industry acknowledges. Many candidates fail on their first attempt, and a significant number pass on their second.',
      '## Why Candidates Fail',
      'The most common reason is preparation strategy, not knowledge. Candidates who read extensively but do not practice applying frameworks under time pressure fail at a much higher rate than those who focus on structured application. The NCA is not testing whether you know the law — it is testing whether you can apply it under time pressure.',
      'The second most common reason is misidentifying what the NCA actually tests. The exam is not asking for a law school essay. It wants a structured, framework-driven answer. Candidates who write discursively without anchoring their answers to the correct legal test routinely fail even when their underlying knowledge is strong.',
      '## Reading Your Results',
      'The NCA provides subject-level results, not detailed feedback. If you failed, request your result breakdown as early as possible. This tells you which questions cost you marks. Look at whether your failures were spread evenly or concentrated — concentrated failures often point to a specific framework gap.',
      '## Retake Strategy',
      'Do not simply repeat the same preparation. Diagnose what went wrong, then change your approach. If you ran out of time, focus on timed practice and template-driven writing. If you missed frameworks, reduce your reading and increase structured drills. The answer is rarely "read more" — it is usually "apply more deliberately."',
      '## Timeline for Retake',
      'The NCA offers exam sittings twice a year. You can register for the next available sitting immediately after receiving your results. Give yourself at least 6 to 8 weeks of focused preparation with your revised strategy before attempting the retake.',
    ],
  },
  'article-e1-nca-study-schedule-working': {
    title: 'NCA Study Schedule While Working Full-Time',
    cat: 'Planning',
    date: 'January 2026',
    readTime: '8 min read',
    excerpt: 'Most NCA candidates are working while studying. This guide builds a realistic weekly schedule around a 40+ hour work week.',
    body: [
      'The NCA Hub was built specifically for working candidates. Most internationally trained lawyers preparing for NCA exams are simultaneously working full-time, raising families, and navigating immigration logistics. A preparation system that requires four hours per day is not realistic.',
      '## The Realistic Weekly Allocation',
      'For a single NCA subject with 8 weeks of preparation and a 40-hour work week, you need approximately 90 to 120 minutes per day on weekdays and 3 to 4 hours per day on weekends. That is roughly 12 to 16 hours per week. Anything more is a bonus. Anything less will leave gaps.',
      '## Week-by-Week Structure',
      'Weeks 1–2: Read your notes through once, slowly. Do not try to memorize. Build familiarity with the frameworks and key cases. Weeks 3–4: Begin applying. For each major framework (e.g., Vavilov, Oakes), write out the test from memory, then check it. Weeks 5–6: Practice questions under timed conditions. Write a full answer in 60–90 minutes, then review against model answers. Weeks 7–8: Consolidate. Review weak areas. Practice with your actual exam materials to simulate the open-book environment. Week 8: The last 3 days before the exam should be light review only — no new material.',
      '## Morning vs. Evening Studying',
      'Most working candidates find 45 to 60 minutes in the morning before work more effective than 2 hours in the evening. Evening studying competes with fatigue and family commitments. If you can commit to 6:00–7:00 AM plus a longer session on Saturday morning, you can pass the NCA while working full-time.',
      '## Taking Multiple Subjects',
      'If you have been assigned multiple NCA subjects, do not attempt more than two at once unless you have exceptional bandwidth. Sequential preparation — one subject per sitting — produces better pass rates than trying to split your attention across three or four subjects simultaneously.',
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = POSTS[slug]
  if (!post) return { title: 'Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://www.thencahub.com/blog/${slug}/` },
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS[slug]
  if (!post) notFound()

  return <BlogPostContent post={post} slug={slug} />
}
