# Mailchimp Integration — Setup Guide

**Time required:** 30–45 minutes
**Expected impact:** Automated email drip converts 8–12% of free chapter downloaders to buyers

---

## Step 1: Create a Mailchimp Account

1. Go to [mailchimp.com](https://mailchimp.com)
2. Sign up for the **Free plan** (500 contacts, 1,000 emails/month)
3. Complete the onboarding wizard

## Step 2: Create Your Audience

1. Go to **Audience** > **All contacts**
2. Click **Settings** > **Audience name and defaults**
3. Audience name: **NCA Hub Free Chapter Subscribers**
4. Default from name: **Kartik at The NCA Hub**
5. Default from email: **thencahub@gmail.com**
6. Reminder for how they signed up: "You downloaded a free NCA study chapter from thencahub.com"

## Step 3: Create Tags for Each Subject

1. Go to **Audience** > **Tags**
2. Create these tags:
   - `free-chapter` (all downloaders)
   - `administrative-law`
   - `constitutional-law`
   - `criminal-law`
   - `foundations-of-canadian-law`
   - `professional-responsibility`
   - `property`

## Step 4: Set Up the API Connection

The free chapter form currently sends to `/api/newsletter` (Cloudflare Function).

**Option A: Direct Mailchimp API (recommended)**

Update the `/api/newsletter` Cloudflare Function to call Mailchimp's API:

```javascript
// In functions/api/newsletter.js
export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const { email, tags } = body;

  // Add to Mailchimp audience
  const MAILCHIMP_API_KEY = env.MAILCHIMP_API_KEY; // Set in Cloudflare env vars
  const MAILCHIMP_SERVER = env.MAILCHIMP_SERVER;    // e.g., "us21"
  const MAILCHIMP_LIST_ID = env.MAILCHIMP_LIST_ID;  // Your audience ID

  const response = await fetch(
    `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        tags: tags || ['free-chapter'],
        merge_fields: {
          SUBJECT: tags.find(t => t !== 'free-chapter') || ''
        }
      })
    }
  );

  if (response.ok || response.status === 400) {
    // 400 = already subscribed, which is fine
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: 'Failed to subscribe' }), { status: 500 });
}
```

**Cloudflare Environment Variables to Set:**
1. Go to Cloudflare Dashboard > Pages > your project > Settings > Environment Variables
2. Add:
   - `MAILCHIMP_API_KEY` — Get from Mailchimp > Account > API Keys
   - `MAILCHIMP_SERVER` — The server prefix from your API key (e.g., `us21`)
   - `MAILCHIMP_LIST_ID` — Get from Audience > Settings > Audience ID

**Option B: Mailchimp Embedded Form (simpler but less integrated)**

1. In Mailchimp, go to **Audience** > **Signup Forms** > **Embedded Forms**
2. Copy the form action URL
3. Replace the `/api/newsletter` fetch in `free-chapter.html` with the Mailchimp form URL

## Step 5: Build the 7-Email Automation

1. Go to **Automations** > **Create** > **Customer Journey**
2. Starting point: **Tag added** > select `free-chapter`
3. Build the journey:

```
Tag added: "free-chapter"
    |
    v
Email 1 (immediately) — "Your free [Subject] chapter — how to use it"
    |
    v
Wait 2 days
    |
    v
Email 2 — "The #1 mistake NCA candidates make"
    |
    v
Wait 2 days
    |
    v
Email 3 — "Your [Subject] exam: [X] days away"
    |
    v
Wait 3 days
    |
    v
Email 4 — "The economics of an NCA resit"
    |
    v
Wait 3 days
    |
    v
Email 5 — "What Anum did differently on her 4th attempt"
    |
    v
Wait 4 days
    |
    v
Email 6 — "Open-book doesn't mean easy"
    |
    v
Wait 7 days
    |
    v
Email 7 — "Your exam is approaching — are you ready?"
```

4. For each email, copy the exact content from `/docs/EMAIL_DRIP_SEQUENCE.md`
5. Use Mailchimp merge tags:
   - `*|FNAME|*` for first name
   - `*|SUBJECT|*` for the subject they downloaded (requires merge field setup)

## Step 6: Set Up Merge Fields

1. Go to **Audience** > **Settings** > **Audience fields and *|MERGE|* tags**
2. Add a new field:
   - Field label: **Subject**
   - Merge tag: **SUBJECT**
   - Type: Text

## Step 7: Test the Flow

1. Subscribe yourself with a test email
2. Add the `free-chapter` and a subject tag manually
3. Verify Email 1 arrives immediately
4. Check merge tags are populated correctly
5. Verify all links point to the correct pages

## Step 8: Add Subject Field to Free Chapter Form

Update `free-chapter.html` to pass the subject to the API:

The form already sends `subject.toLowerCase().replace(/\s+/g, '-')` as a tag via:
```javascript
body: JSON.stringify({email: email, tags: ['free-chapter', subject.toLowerCase().replace(/\s+/g, '-')]})
```

This is already correct. Just ensure the `/api/newsletter` function forwards these tags to Mailchimp (see Step 4).

---

## Monitoring

After setup, check these metrics weekly:
- **Open rate** — target: 40%+ (NCA candidates are highly motivated)
- **Click rate** — target: 8%+
- **Conversion rate** — target: 8–12% of subscribers purchase within 21 days
- **Unsubscribe rate** — should be under 2% per email

If open rates drop below 30%, test new subject lines.
If click rates drop below 5%, test CTA button placement and copy.
