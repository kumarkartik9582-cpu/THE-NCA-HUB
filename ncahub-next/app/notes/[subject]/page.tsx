import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const SUBJECTS: Record<string, {
  code: string
  title: string
  pages: string
  price: string
  payhipUrl: string
  description: string
  whatYouGet: string[]
  keyCases: { name: string; point: string }[]
  frameworks: { name: string; elements: string[] }[]
  topics: string[]
}> = {
  'administrative-law': {
    code: 'ADM',
    title: 'Administrative Law',
    pages: '74',
    price: 'CA$49',
    payhipUrl: 'https://payhip.com/b/ncahub-admin',
    description: 'The most tested and most failed NCA subject. Built entirely around the post-Vavilov framework and the Baker procedural fairness analysis — the two pillars every exam question rests on.',
    whatYouGet: [
      '74 pages of exam-targeted notes (no textbook filler)',
      'Complete Vavilov standard of review flowchart',
      'Baker procedural fairness checklist',
      'Answer templates for standard-of-review questions',
      'Answer templates for procedural fairness questions',
      '12 practice questions with model answers',
      'Key case summaries (Vavilov, Baker, Dunsmuir, Doré, Pham)',
    ],
    keyCases: [
      { name: 'Canada v. Vavilov [2019] SCC 65', point: 'Establishes the current standard of review framework — reasonableness is the default; correctness applies in defined categories only.' },
      { name: 'Baker v. Canada [1999] 2 SCR 817', point: 'The leading case on procedural fairness. Sets out the five Baker factors for determining what process is owed.' },
      { name: 'Dunsmuir v. New Brunswick [2008] SCC 9', point: 'Pre-Vavilov framework — still occasionally tested for historical context. Vavilov replaced most of its analysis.' },
      { name: 'Doré v. Barreau du Québec [2012] SCC 12', point: 'Charter values in administrative decisions. Reasonableness review applies when admin decisions engage Charter values.' },
      { name: 'Pham v. Secretary of State [2015]', point: 'Contextual reasonableness — proportionality can inform reasonableness review in appropriate cases.' },
    ],
    frameworks: [
      {
        name: 'Vavilov Standard of Review Framework',
        elements: [
          'Step 1: Is there a legislated standard? (correctness or deferential)',
          'Step 2: If not, is the question one that attracts correctness? (constitutional questions, questions of central importance, jurisdictional disputes between tribunals)',
          'Step 3: If not, apply reasonableness review',
          'Reasonableness asks: Is the decision justified, transparent, and intelligible? Is it responsive to the submissions and evidence?',
        ],
      },
      {
        name: 'Baker Procedural Fairness Analysis',
        elements: [
          'Factor 1: Nature of the decision and process followed in making it',
          'Factor 2: Nature of the statutory scheme and terms of the statute',
          'Factor 3: Importance of the decision to the individual affected',
          'Factor 4: Legitimate expectations of the person challenging',
          'Factor 5: Choices of procedure made by the agency itself',
        ],
      },
    ],
    topics: ['Standard of review (Vavilov)', 'Reasonableness and correctness', 'Procedural fairness (Baker)', 'Duty to give reasons', 'Legitimate expectations', 'Fettering discretion', 'Bias and institutional independence', 'Remedies on judicial review'],
  },
  'constitutional-law': {
    code: 'CON',
    title: 'Constitutional Law',
    pages: '78',
    price: 'CA$49',
    payhipUrl: 'https://payhip.com/b/ncahub-con',
    description: 'The most framework-heavy NCA subject. The notes map every major constitutional doctrine — Charter, division of powers, s.35 Aboriginal rights — with exam-ready answer templates for each.',
    whatYouGet: [
      '78 pages of exam-targeted notes',
      'Division of powers flowchart (POGG, trade and commerce, property and civil rights)',
      'Complete Oakes test template with contextual application notes',
      'Section 35 Aboriginal rights framework',
      'Answer templates for Charter challenges (s.2, s.7, s.15)',
      '15 practice questions with model answers',
      'Key case summaries (Oakes, Doré, Sparrow, Van der Peet, Hunter v. Southam)',
    ],
    keyCases: [
      { name: 'R v. Oakes [1986] 1 SCR 103', point: 'The Oakes test — defines when a Charter infringement is justified under s.1. Pressing and substantial objective + proportionality (rational connection, minimal impairment, proportionality of effects).' },
      { name: 'R v. Sparrow [1990] 1 SCR 1075', point: 'First case to interpret s.35 Aboriginal rights. Establishes the Sparrow test for infringement and justification.' },
      { name: 'R v. Van der Peet [1996] 2 SCR 507', point: 'Defines what constitutes an "existing Aboriginal right" under s.35 — the integral to distinctive culture test.' },
      { name: 'Hunter v. Southam [1984] 2 SCR 145', point: 'Establishes the purposive approach to Charter interpretation — rights must be interpreted generously.' },
      { name: 'Reference re Secession of Quebec [1998] 2 SCR 217', point: 'Four unwritten constitutional principles: federalism, democracy, constitutionalism/rule of law, protection of minorities.' },
    ],
    frameworks: [
      {
        name: 'Charter Challenge Analysis',
        elements: [
          'Step 1: Does the Charter apply? (government action, s.32)',
          'Step 2: Is there a right or freedom at stake? (identify the right)',
          'Step 3: Is the right infringed? (purposive interpretation)',
          'Step 4: Is the infringement justified under s.1? (Oakes test)',
          'Step 5: What remedy is available? (s.24(1) or s.52)',
        ],
      },
      {
        name: 'Division of Powers (Pith and Substance)',
        elements: [
          'Step 1: Characterize the law — what is its pith and substance?',
          'Step 2: Classify the head of power — which list does it fall under? (ss.91, 92)',
          'Step 3: Apply double aspect doctrine if applicable',
          'Step 4: Paramountcy — if both levels can validly legislate, federal law prevails on conflict',
        ],
      },
    ],
    topics: ['Division of powers', 'POGG doctrine', 'Charter rights (ss.2, 7, 8, 15)', 'Section 1 Oakes test', 'Section 35 Aboriginal rights', 'Sparrow justification test', 'Unwritten constitutional principles', 'Remedies under s.24 and s.52'],
  },
  'criminal-law': {
    code: 'CRM',
    title: 'Criminal Law',
    pages: '68',
    price: 'CA$49',
    payhipUrl: 'https://payhip.com/b/ncahub-crim',
    description: 'Framework-heavy and predictable. The notes give you the exact structure the NCA expects for every type of question — from murder to defences to sentencing.',
    whatYouGet: [
      '68 pages of exam-targeted notes',
      'Complete actus reus / mens rea analysis framework',
      'Murder vs. manslaughter decision tree',
      'Defences framework (duress, necessity, self-defence, provocation)',
      'Sentencing principles template (Gladue, Nur)',
      '10 practice questions with model answers',
      'Key case summaries (Sault Ste. Marie, Creighton, Martineau, Lavallee)',
    ],
    keyCases: [
      { name: 'R v. Sault Ste. Marie [1978] 2 SCR 1299', point: 'Establishes the three categories of offences: full mens rea, strict liability, and absolute liability.' },
      { name: 'R v. Creighton [1993] 3 SCR 3', point: 'The objective standard for criminal negligence and manslaughter — assessed against a reasonable person, not the accused\'s personal capacities.' },
      { name: 'R v. Martineau [1990] 2 SCR 633', point: 'Murder requires subjective foresight of death — constructive murder provisions struck down under s.7 of the Charter.' },
      { name: 'R v. Lavallee [1990] 1 SCR 852', point: 'Battered woman syndrome as a defence — expert evidence admissible to explain why a woman might reasonably fear death.' },
      { name: 'R v. Gladue [1999] 1 SCR 688', point: 'Section 718.2(e) requires courts to consider systemic factors affecting Indigenous offenders at sentencing.' },
    ],
    frameworks: [
      {
        name: 'Criminal Liability Analysis',
        elements: [
          'Step 1: Identify the offence and classify it (full mens rea / strict / absolute)',
          'Step 2: Actus reus — voluntary act, causing the prohibited consequence',
          'Step 3: Mens rea — intention, knowledge, recklessness, wilful blindness (subjective) OR negligence (objective)',
          'Step 4: Defences available? (mistake of fact, duress, necessity, self-defence)',
          'Step 5: Conviction and sentence — apply sentencing principles',
        ],
      },
      {
        name: 'Murder vs. Manslaughter',
        elements: [
          'First degree murder: s.214 — planned and deliberate, or listed circumstances (s.214(5))',
          'Second degree murder: s.229 — subjective intent to cause death or bodily harm knowing death likely',
          'Manslaughter: unlawful act causing death (objective foreseeability) or criminal negligence',
          'Key distinction: Murder requires subjective foresight of death (Martineau)',
        ],
      },
    ],
    topics: ['Actus reus and mens rea', 'Strict and absolute liability', 'Murder and manslaughter', 'Criminal negligence', 'Defences (duress, necessity, self-defence)', 'Party liability', 'Inchoate offences', 'Sentencing (Gladue, Nur)'],
  },
  'foundations-of-canadian-law': {
    code: 'FCL',
    title: 'Foundations of Canadian Law',
    pages: '52',
    price: 'CA$49',
    payhipUrl: 'https://payhip.com/b/ncahub-fcl',
    description: 'The shortest and most conceptual NCA subject. Rewards clear thinking over memorization — the notes give you the conceptual scaffolding to answer any question on sources of law, constitutional structure, and the common law vs. civil law distinction.',
    whatYouGet: [
      '52 pages of exam-targeted notes (shortest subject — reflects actual scope)',
      'Sources of Canadian law hierarchy diagram',
      'Common law vs. civil law comparison table',
      'Stare decisis and precedent analysis framework',
      '8 practice questions with model answers',
      'Parliamentary supremacy vs. constitutional supremacy analysis',
    ],
    keyCases: [
      { name: 'Reference re Secession of Quebec [1998] 2 SCR 217', point: 'Four unwritten constitutional principles — federalism, democracy, constitutionalism/rule of law, protection of minorities.' },
      { name: 'Roncarelli v. Duplessis [1959] SCR 121', point: 'Rule of law — even the Premier is bound by law. No arbitrary exercise of public power.' },
      { name: 'R v. Salituro [1991] 3 SCR 654', point: 'Common law can evolve incrementally to reflect changing social values — courts develop common law principles.' },
      { name: 'Donoghue v. Stevenson [1932] AC 562', point: 'Foundation of negligence law — neighbour principle in common law systems.' },
    ],
    frameworks: [
      {
        name: 'Sources of Canadian Law (Hierarchy)',
        elements: [
          '1. Constitution Act, 1867 and Constitution Act, 1982 (supreme law)',
          '2. Federal and provincial statutes (must conform to constitutional requirements)',
          '3. Subordinate legislation (regulations, orders) — must be authorized by statute',
          '4. Common law (judge-made law, precedent-based)',
          '5. Custom (rarely applied in Canadian courts)',
        ],
      },
      {
        name: 'Stare Decisis Framework',
        elements: [
          'Binding precedent: decisions of courts higher in the hierarchy',
          'Persuasive precedent: courts at same level, other jurisdictions',
          'Ratio decidendi (binding) vs. obiter dicta (persuasive)',
          'Distinguishing a precedent: material facts differ',
          'Overruling: higher court reverses earlier decision',
        ],
      },
    ],
    topics: ['Sources of Canadian law', 'Common law and civil law systems', 'Constitutional supremacy', 'Parliamentary sovereignty', 'Stare decisis and precedent', 'Statutory interpretation', 'Role of courts and Parliament', 'Indigenous legal traditions'],
  },
  'professional-responsibility': {
    code: 'PR',
    title: 'Professional Responsibility',
    pages: '58',
    price: 'CA$49',
    payhipUrl: 'https://payhip.com/b/ncahub-pr',
    description: 'Rules-based and predictable. The most high-scoring NCA subject for prepared candidates — because the rules are clear and the exam tests whether you can apply them, not whether you can theorize about them.',
    whatYouGet: [
      '58 pages of exam-targeted notes',
      'Duty of loyalty and confidentiality checklist',
      'Conflicts of interest decision tree (actual vs. potential vs. prohibited)',
      'Trust accounting rules summary',
      'Duty to withdraw / right to withdraw analysis framework',
      '10 practice questions with model answers',
      'Model Rules of Professional Conduct cross-references',
    ],
    keyCases: [
      { name: 'R v. Neil [2002] 3 SCR 631', point: 'Duty of loyalty to current clients — bright-line rule against acting against current clients in any matter.' },
      { name: 'Strother v. 3464920 Canada Inc. [2007] SCC 24', point: 'Fiduciary duty and conflicts of interest — lawyer cannot exploit confidential information for personal gain.' },
      { name: 'MacDonald Estate v. Martin [1990] 3 SCR 1235', point: 'Transfers of lawyers between firms — when confidential information is presumed to have been shared and disqualification follows.' },
      { name: 'Descôteaux v. Mierzwinski [1982] 1 SCR 860', point: 'Solicitor-client privilege is a substantive rule, not merely an evidentiary rule — it applies broadly.' },
    ],
    frameworks: [
      {
        name: 'Conflict of Interest Analysis',
        elements: [
          'Step 1: Is there a current client conflict? (Neil bright-line rule — never act against current client)',
          'Step 2: Is there a former client conflict? (MacDonald Estate — is confidential information at risk?)',
          'Step 3: Can the conflict be cured by consent? (informed consent after disclosure)',
          'Step 4: Are there prohibited conflicts that cannot be consented to?',
          'Step 5: Screened firm — was the lawyer screened and is the screen adequate?',
        ],
      },
      {
        name: 'Trust Accounting Rules',
        elements: [
          'Client funds must be held in trust — not commingled with general funds',
          'Disbursement only authorized by the client or by the applicable rules',
          'Full accounting to client on request',
          'Shortfalls in trust: professional misconduct regardless of intent',
          'Bookkeeping requirements: contemporaneous, accurate records',
        ],
      },
    ],
    topics: ['Duty of loyalty', 'Duty of confidentiality', 'Solicitor-client privilege', 'Conflicts of interest (current clients)', 'Conflicts of interest (former clients)', 'Duty of competence', 'Trust accounting', 'Duty to withdraw', 'Fees and billing'],
  },
}

export async function generateStaticParams() {
  return Object.keys(SUBJECTS).map((subject) => ({ subject }))
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const { subject } = await params
  const s = SUBJECTS[subject]
  if (!s) return { title: 'Not Found' }
  return {
    title: `${s.title} NCA Notes | The NCA Hub`,
    description: s.description,
    alternates: { canonical: `https://www.thencahub.com/notes/${subject}/` },
  }
}

export default async function SubjectNotesPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params
  const s = SUBJECTS[subject]
  if (!s) notFound()

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--void)', padding: '160px 0 80px', borderBottom: '1px solid rgba(201,168,76,.07)' }}>
        <div className="w">
          <div style={{ marginBottom: 16 }}>
            <Link href="/notes/" style={{ fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dim)' }}>← All Subjects</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'start' }}>
            <div>
              <div style={{ fontFamily: 'var(--fd)', fontSize: '4rem', color: 'rgba(201,168,76,.25)', lineHeight: 1, marginBottom: 16 }}>{s.code}</div>
              <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1.05, color: 'var(--cream)', marginBottom: 20 }}>
                {s.title}<br /><em>Study Notes</em>
              </h1>
              <p style={{ fontSize: 'var(--lead)', color: 'var(--fog)', lineHeight: 1.75, maxWidth: 600, marginBottom: 32 }}>{s.description}</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href={s.payhipUrl} className="bp" target="_blank" rel="noopener noreferrer">
                  <span>Buy {s.price} →</span>
                </Link>
                <Link href="/#free-chapter" className="nc"><span>Get Free Chapter First</span></Link>
              </div>
            </div>
            <div className="glass" style={{ padding: '28px 32px', minWidth: 220, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--fd)', fontSize: '3rem', color: 'var(--g1)', lineHeight: 1 }}>{s.pages}</div>
              <div style={{ fontSize: 'var(--nano)', color: 'var(--dim)', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 24 }}>pages</div>
              <div style={{ fontSize: 'var(--nano)', color: 'var(--fog)', lineHeight: 1.75 }}>
                Answer templates<br />Practice questions<br />Key case summaries<br />Instant PDF download
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section style={{ background: 'var(--abyss)', padding: '80px 0', borderBottom: '1px solid rgba(201,168,76,.06)' }}>
        <div className="w">
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--cream)', marginBottom: 32 }}>What&apos;s included</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {s.whatYouGet.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 18px', background: 'rgba(201,168,76,.03)', border: '1px solid rgba(201,168,76,.08)' }}>
                <span style={{ color: 'var(--g1)', flexShrink: 0, fontWeight: 600 }}>✓</span>
                <span style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Cases */}
      <section style={{ background: 'var(--void)', padding: '80px 0', borderBottom: '1px solid rgba(201,168,76,.06)' }}>
        <div className="w">
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--cream)', marginBottom: 32 }}>Key Cases Covered</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {s.keyCases.map((c, i) => (
              <div key={i} style={{ padding: '20px 24px', background: 'rgba(201,168,76,.02)', border: '1px solid rgba(201,168,76,.07)', borderLeft: '2px solid rgba(201,168,76,.4)' }}>
                <div style={{ fontSize: 'var(--sm)', color: 'var(--cream)', fontFamily: 'var(--fd)', fontStyle: 'italic', marginBottom: 6 }}>{c.name}</div>
                <div style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65 }}>{c.point}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frameworks */}
      <section style={{ background: 'var(--abyss)', padding: '80px 0', borderBottom: '1px solid rgba(201,168,76,.06)' }}>
        <div className="w">
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--cream)', marginBottom: 32 }}>Core Frameworks</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {s.frameworks.map((f, i) => (
              <div key={i} style={{ padding: 28, background: 'rgba(201,168,76,.03)', border: '1px solid rgba(201,168,76,.1)' }}>
                <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--g1)', letterSpacing: '.1em', marginBottom: 20 }}>{f.name}</div>
                <ol style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {f.elements.map((el, j) => (
                    <li key={j} style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65, display: 'flex', gap: 12 }}>
                      <span style={{ color: 'var(--g2)', flexShrink: 0, fontWeight: 600, fontFamily: 'var(--fd)' }}>{j + 1}.</span>
                      <span>{el}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics + CTA */}
      <section style={{ background: 'var(--void)', padding: '80px 0 120px' }}>
        <div className="w">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--cream)', marginBottom: 24 }}>All Topics Covered</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {s.topics.map((t, i) => (
                  <span key={i} style={{ padding: '6px 14px', border: '1px solid rgba(201,168,76,.15)', fontSize: 'var(--nano)', letterSpacing: '.12em', color: 'var(--fog)', textTransform: 'uppercase' }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ padding: 32, background: 'rgba(201,168,76,.04)', border: '1px solid rgba(201,168,76,.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'var(--fd)', fontSize: '2.2rem', color: 'var(--g0)', marginBottom: 8 }}>{s.price}</div>
              <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', marginBottom: 8 }}>{s.pages} pages · Answer templates · Practice questions · Instant PDF</p>
              <p style={{ fontSize: 'var(--nano)', color: 'var(--dim)', marginBottom: 24 }}>Or get all 5 subjects for CA$199 — save CA$46</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href={s.payhipUrl} className="bp" target="_blank" rel="noopener noreferrer"><span>Buy {s.title} Notes →</span></Link>
                <Link href="/notes/" className="nc"><span>All Subjects</span></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:768px){
          section > div > div[style*="grid-template-columns: 1fr auto"]{grid-template-columns:1fr!important}
          section > div > div[style*="repeat(2, 1fr)"]{grid-template-columns:1fr!important}
        }
      `}</style>
    </main>
  )
}
