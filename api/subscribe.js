// api/subscribe.js
// Saves email + card IDs to Resend using correct API (Nov 2025+)
// Contacts are now global in Resend — no audience ID needed
// Custom properties used to store cards and welcomed flag
//
// SETUP: Add RESEND_API_KEY to Vercel environment variables. That's it.

const RESEND_BASE = 'https://api.resend.com';
const UA = 'CardRoundup/1.0'; // Required by Resend — missing = 403

function headers(apiKey) {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'User-Agent': UA,
  };
}

// Ensures the 'cards' and 'welcomed' custom properties exist in Resend
// Idempotent — safe to call every time, won't fail if already exists
async function ensureProperties(apiKey) {
  const props = [
    { key: 'cards',    type: 'string',  fallbackValue: '' },
    { key: 'welcomed', type: 'string',  fallbackValue: 'false' },
    { key: 'claimed',  type: 'string',  fallbackValue: '{}' },
  ];
  for (const prop of props) {
    try {
      await fetch(`${RESEND_BASE}/contact-properties`, {
        method: 'POST',
        headers: headers(apiKey),
        body: JSON.stringify(prop),
      });
      // 409 Conflict = already exists — that's fine, we ignore it
    } catch {}
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // sendBeacon sends as text/plain — parse accordingly
  let email, cards;
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    ({ email, cards } = req.body);
  } else {
    // sendBeacon sends body as text — parse manually
    try {
      const parsed = typeof req.body === 'string'
        ? JSON.parse(req.body)
        : req.body;
      email = parsed.email;
      cards = parsed.cards;
    } catch {
      return res.status(400).json({ error: 'Invalid body' });
    }
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log('[CardRoundup] Signup (RESEND_API_KEY not set):', email);
    return res.status(200).json({ success: true });
  }

  try {
    // Ensure custom properties exist (idempotent)
    await ensureProperties(apiKey);

    // Check if contact already exists — preserve welcomed flag
    let alreadyWelcomed = 'false';
    try {
      const existing = await fetch(
        `${RESEND_BASE}/contacts/${encodeURIComponent(email)}`,
        { headers: headers(apiKey) }
      );
      if (existing.ok) {
        const d = await existing.json();
        const wRaw = d.properties?.welcomed;
        alreadyWelcomed = (wRaw && typeof wRaw === 'object') ? (wRaw.value || 'false') : (wRaw || 'false');
      }
    } catch {} // New contact — welcomed stays 'false'

    // Create or update contact with latest card list
    // POST to /contacts upserts by email
    const contactRes = await fetch(`${RESEND_BASE}/contacts`, {
      method: 'POST',
      headers: headers(apiKey),
      body: JSON.stringify({
        email,
        unsubscribed: false,
        properties: {
          cards: cards || '',         // e.g. "csr,amexp,venturex"
          welcomed: alreadyWelcomed,  // preserve — only set true by send-digest
        },
      }),
    });

    if (contactRes.ok) {
      console.log('[CardRoundup] Contact saved:', email,
        '| cards:', cards || '(none)', '| welcomed:', alreadyWelcomed);
    } else {
      const err = await contactRes.text();
      console.error('[CardRoundup] Contact save error:', contactRes.status, err);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('[CardRoundup] Subscribe error:', error);
    return res.status(200).json({ success: true }); // Always 200 to user
  }
}
