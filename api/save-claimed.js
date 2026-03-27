// /api/save-claimed.js
// Saves per-credit claimed state to Resend contact properties
// Called debounced when user checks/unchecks a credit

const RESEND_BASE = 'https://api.resend.com';

function headers(apiKey) {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'User-Agent': 'CardRoundup/1.0',
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, claimed } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ success: true });
  }

  try {
    // claimed is already cleaned (expired keys removed client-side)
    const claimedStr = JSON.stringify(claimed || {});

    const r = await fetch(`${RESEND_BASE}/contacts`, {
      method: 'POST',
      headers: headers(apiKey),
      body: JSON.stringify({
        email,
        unsubscribed: false,
        properties: { claimed: claimedStr },
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      console.error('[CardRoundup] save-claimed error:', r.status, err);
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('[CardRoundup] save-claimed exception:', e);
    return res.status(200).json({ success: true });
  }
}
