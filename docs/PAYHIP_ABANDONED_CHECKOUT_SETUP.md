# Payhip Abandoned Checkout Email — Setup Guide

**Time required:** 10 minutes
**Expected revenue impact:** ~$1,050/month (15% recovery of 70 monthly abandonments at $100 avg)

---

## Step-by-Step Setup

### 1. Log in to Payhip
- Go to [payhip.com](https://payhip.com) and log in with the THENCAHUB account

### 2. Navigate to Marketing Automation
- Click **Dashboard** → **Marketing** (left sidebar)
- Look for **Abandoned Checkout** or **Abandoned Cart Emails**
- Toggle it **ON**

### 3. Set the Timing
- Set delay to: **1 hour** after abandonment
- This catches people while they're still in "study mode" but gives them time to reconsider

### 4. Write the Email

**Subject line:**
```
You left your NCA notes behind — your exam is coming up
```

**Email body (paste this exactly):**

---

Hi {customer_name},

You were just looking at NCA study notes on The NCA Hub — and you didn't finish checking out.

Here's why that matters: a single failed NCA resit costs $500 and delays you by 3 months. The notes you were looking at cost $100 and are designed specifically for the open-book, 3-hour exam format.

The math is simple: $100 now vs $500 + 3 months later.

Every set of notes is:
- Under 80 pages (designed for speed, not bulk)
- Built around answer templates for the exact exam format
- Includes free updated resit notes if you don't pass

**Complete your purchase:** {checkout_link}

You can also pay in 2 instalments at checkout.

— The NCA Hub

P.S. If you have questions about the notes before buying, reply to this email. Kartik (the founder) reads every reply.

---

### 5. Save and Activate
- Click **Save** / **Activate**
- Send yourself a test email to verify formatting

### 6. Verify It's Working
- Open an incognito window
- Go to any notes product page on Payhip
- Add to cart, enter an email, then abandon
- Check that the email arrives after 1 hour

---

## Notes
- Payhip uses `{customer_name}` and `{checkout_link}` as dynamic variables — verify exact syntax in their editor
- If Payhip doesn't support dynamic variables, use this generic version without `{customer_name}`:
  - Subject: "You left your NCA notes behind — your exam is coming up"
  - Opening: "You were just looking at NCA study notes..."
- Do NOT add a discount code. The value proposition is resit economics, not a price cut.
