import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, subject, source } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Log the signup (replace with actual email service integration)
    console.log(`Newsletter signup: ${email}, subject: ${subject}, source: ${source}`)

    // TODO: Integrate with Resend/Mailchimp/ConvertKit
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({ from: 'noreply@thencahub.com', to: email, subject: `Your free ${subject} chapter`, ... })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
