// api/subscribe.js
// Receives email signups from cardroundup.com
// Saves them to Resend audience so you can email them later
//
// SETUP:
// 1. Create account at resend.com
// 2. Go to API Keys → Create API Key → copy it
// 3. Go to Audiences → Create Audience → name it "Card Roundup" → copy the Audience ID
// 4. In Vercel dashboard → your project → Settings → Environment Variables:
//    Add: RESEND_API_KEY = your API key
//    Add: RESEND_AUDIENCE_ID = your audience ID
// 5. Redeploy (push any change to GitHub)

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, cards } = req.body;

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  // If not configured yet, just log and return success
  // This way the site works even before Resend is set up
  if (!apiKey || apiKey === 'YOUR_RESEND_API_KEY') {
    console.log('[CardRoundup] Email signup (Resend not configured yet):', email);
    return res.status(200).json({ success: true });
  }

  try {
    // Add contact to Resend audience
    const response = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
          // Store their card stack so we can personalize reminder emails
          data: { cards: cards || '' }
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('[CardRoundup] Resend error:', err);
      // Still return success to user — don't show errors on the frontend
      return res.status(200).json({ success: true });
    }

    console.log('[CardRoundup] Email saved to Resend:', email);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('[CardRoundup] Subscribe error:', error);
    // Still return success — never show backend errors to users
    return res.status(200).json({ success: true });
  }
}
