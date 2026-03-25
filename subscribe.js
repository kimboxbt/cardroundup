// api/subscribe.js
// Saves email signups to Resend
// Auto-finds your audience ID — no manual lookup needed
//
// ONLY THING YOU NEED:
// Vercel → Settings → Environment Variables → Add:
// RESEND_API_KEY = your re_ key from resend.com/api-keys

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, cards } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log('[CardRoundup] Email signup (Resend not configured yet):', email);
    return res.status(200).json({ success: true });
  }

  try {
    // Auto-fetch audience ID
    let audienceId = null;
    const audiencesRes = await fetch('https://api.resend.com/audiences', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    if (audiencesRes.ok) {
      const audiencesData = await audiencesRes.json();
      if (audiencesData.data && audiencesData.data.length > 0) {
        audienceId = audiencesData.data[0].id;
      }
    }

    // If no audience exists, create one automatically
    if (!audienceId) {
      const createRes = await fetch('https://api.resend.com/audiences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Card Roundup Subscribers' }),
      });
      if (createRes.ok) {
        const created = await createRes.json();
        audienceId = created.data?.id || created.id;
      }
    }

    if (!audienceId) {
      console.error('[CardRoundup] Could not get or create audience');
      return res.status(200).json({ success: true });
    }

    // Add contact to audience
    await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });

    console.log('[CardRoundup] Email saved:', email);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('[CardRoundup] Subscribe error:', error);
    return res.status(200).json({ success: true });
  }
}
