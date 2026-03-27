// /api/save-claimed.js
// Saves per-credit claimed state to Resend contact properties
// Called debounced (2s) when user checks/unchecks a credit

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
    // Step 1: Ensure 'claimed' property is registered in Resend.
    // Resend silently ignores property writes if the property key doesn't exist.
    // 409 = already exists — safe to ignore.
    await fetch(`${RESEND_BASE}/contact-properties`, {
      method: 'POST',
      headers: headers(apiKey),
      body: JSON.stringify({ key: 'claimed', type: 'string', fallbackValue: '{}' }),
    });

    // Step 2: PATCH the contact to update the claimed property.
    // Using PATCH by email so we update without overwriting other properties.
    const claimedStr = JSON.stringify(claimed || {});

    const r = await fetch(`${RESEND_BASE}/contacts/${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: headers(apiKey),
      body: JSON.stringify({
        properties: { claimed: claimedStr },
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      console.error('[CardRoundup] save-claimed PATCH error:', r.status, err);
    } else {
      console.log('[CardRoundup] save-claimed OK:', email, '- keys:', Object.keys(claimed || {}).length);
    }

    return res.status(200).json({ success: true });

  } catch (e) {
    console.error('[CardRoundup] save-claimed exception:', e);
    return res.status(200).json({ success: true });
  }
}
