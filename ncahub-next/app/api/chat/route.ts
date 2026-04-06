import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const SYSTEM_PROMPT = `You are an NCA exam prep assistant for The NCA Hub. You help internationally trained lawyers prepare for the NCA (National Committee on Accreditation) exams to qualify as Canadian lawyers.

You know about:
- The 5 NCA subjects: Administrative Law, Constitutional Law, Criminal Law, Foundations of Canadian Law, Professional Responsibility
- The NCA process for Indian, UK, Nigerian, Pakistani, Philippine, and Jamaican lawyers
- Exam strategy: open-book format, time management, answer templates
- Key cases: Vavilov, Baker, Dunsmuir (Admin), Oakes (Charter), section 35 Aboriginal rights
- Pricing: Single subject CA$49, Complete bundle CA$199

Keep answers concise and practical. Suggest the free chapter or notes where relevant.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Chat not configured' }, { status: 503 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-6), // last 6 turns for context window efficiency
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'AI error' }, { status: 502 })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text ?? ''

    return NextResponse.json({ text })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
