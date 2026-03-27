// /api/get-wallet.js
// Returns a user's saved cards + claimed credit state from Resend

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
    return res.status(200).json({ cards: '', claimed: {}, found: false });
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

    if (!r.ok) {
      return res.status(200).json({ cards: '', claimed: {}, found: false });
    }

    const data = await r.json();

    // Resend returns custom properties as {value: "...", type: "string"}
    const cardsRaw = data.properties?.cards;
    const cards = (cardsRaw && typeof cardsRaw === 'object')
      ? (cardsRaw.value || '')
      : (cardsRaw || '');

    const claimedRaw = data.properties?.claimed;
    const claimedStr = (claimedRaw && typeof claimedRaw === 'object')
      ? (claimedRaw.value || '{}')
      : (claimedRaw || '{}');

    let claimed = {};
    try { claimed = JSON.parse(claimedStr); } catch(e) {}

    console.log('[CardRoundup] get-wallet:', email, '→ cards:', cards, '→ claimed keys:', Object.keys(claimed).length);
    return res.status(200).json({ cards, claimed, found: true });

  } catch (e) {
    console.error('[CardRoundup] get-wallet error:', e);
    return res.status(200).json({ cards: '', claimed: {}, found: false });
  }
}
