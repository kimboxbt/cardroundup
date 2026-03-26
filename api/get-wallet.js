// /api/get-wallet.js
// Returns a user's saved card list from Resend by email

const RESEND_BASE = 'https://api.resend.com';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.query;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ cards: '', found: false });
  }

  try {
    const r = await fetch(
      `${RESEND_BASE}/contacts/${encodeURIComponent(email)}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'CardRoundup/1.0',
        },
      }
    );

    console.log('[CardRoundup] get-wallet status:', r.status, 'for', email);

    if (!r.ok) {
      return res.status(200).json({ cards: '', found: false });
    }

    const data = await r.json();
    console.log('[CardRoundup] get-wallet data:', JSON.stringify(data));

    const cards = data.properties?.cards || data.cards || '';
    const found = true;
    console.log('[CardRoundup] returning cards:', cards);

    return res.status(200).json({ cards, found });

  } catch (e) {
    console.error('[CardRoundup] get-wallet error:', e);
    return res.status(200).json({ cards: '', found: false });
  }
}
