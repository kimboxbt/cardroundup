// /api/get-wallet.js
// Returns a user's saved card list from Resend by email
// Called after Google Sign-In on a new device to restore their wallet

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
    return res.status(200).json({ cards: '' });
  }

  try {
    const r = await fetch(
      `${RESEND_BASE}/contacts/${encodeURIComponent(email)}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'User-Agent': 'CardRoundup/1.0',
        },
      }
    );

    if (!r.ok) {
      // Contact not found — new user, empty wallet
      return res.status(200).json({ cards: '', found: false });
    }

    const data = await r.json();
    const cards = data.properties?.cards || '';
    return res.status(200).json({ cards, found: true });

  } catch (e) {
    console.error('[CardRoundup] get-wallet error:', e);
    return res.status(200).json({ cards: '', found: false });
  }
}
