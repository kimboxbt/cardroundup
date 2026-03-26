// /api/check-cards.js
// Runs every Monday 8am UTC (see vercel.json)
// Detects: annual fee changes on issuer pages + stale verified dates
// Sends one email digest via Resend API (raw https, zero npm dependencies)
// Protect with CRON_SECRET env var

const https = require('https');
const http  = require('http');
const crypto = require('crypto');

// ── Config (set these in Vercel dashboard → Settings → Environment Variables) ──
const RESEND_API_KEY  = process.env.RESEND_API_KEY;
const ALERT_EMAIL     = process.env.ALERT_EMAIL;       // your personal email
const FROM_EMAIL      = process.env.RESEND_FROM_EMAIL || 'alerts@cardroundup.com';
const CRON_SECRET     = process.env.CRON_SECRET;
const BASE_URL        = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

// Cards verified more than this many days ago get flagged as stale
const STALE_DEFAULT  = 90;   // days
const STALE_HIGH_FEE = 60;   // days — stricter for $400+ fee cards
const HIGH_FEE       = 400;

// ── Helpers ───────────────────────────────────────────────────────────────────

function get(url, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, {
      headers: { 'User-Agent': 'CardRoundupBot/1.0 (benefit-monitor)' },
      timeout: timeoutMs,
    }, (res) => {
      // Follow one redirect
      if ([301,302,303,307,308].includes(res.statusCode) && res.headers.location) {
        return get(res.headers.location, timeoutMs).then(resolve).catch(reject);
      }
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function postJson(url, data, apiKey) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const urlObj  = new URL(url);
    const req = https.request({
      hostname: urlObj.hostname,
      path:     urlObj.pathname,
      method:   'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(payload),
      },
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function extractFeeFromHtml(html) {
  // Matches: "$395 annual fee", "annual fee of $150", "annual fee: $95"
  const patterns = [
    /\$(\d{1,4})\s+annual\s+fee/i,
    /annual\s+fee[^$\d]{0,20}\$(\d{1,4})/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return parseInt(m[1], 10);
  }
  return null;
}

function daysSince(verifiedStr) {
  // verifiedStr = 'YYYY-MM'
  if (!verifiedStr) return 999;
  const [y, mo] = verifiedStr.split('-').map(Number);
  const ms = Date.now() - new Date(y, mo - 1, 1).getTime();
  return Math.floor(ms / 86400000);
}

// ── Main ──────────────────────────────────────────────────────────────────────

module.exports = async (req, res) => {

  // Verify cron secret
  if (CRON_SECRET) {
    const auth = req.headers['authorization'] || '';
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const t0     = Date.now();
  const flags  = [];   // cards that need review
  const errors = [];   // fetch failures etc

  // 1. Load card data from our own API
  let cards;
  try {
    const r = await get(`${BASE_URL}/api/cards`);
    cards = JSON.parse(r.body).cards;
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load /api/cards', detail: e.message });
  }

  // 2. Check each card — batches of 4 to avoid hammering issuers
  const BATCH = 4;
  for (let i = 0; i < cards.length; i += BATCH) {
    const batch = cards.slice(i, i + BATCH);
    await Promise.all(batch.map(async (card) => {
      const { id, name, fee, verified, sources } = card;
      const cardFlags = [];

      // ── Stale date check (no network needed) ──────────────────────────────
      const age     = daysSince(verified);
      const maxAge  = fee >= HIGH_FEE ? STALE_HIGH_FEE : STALE_DEFAULT;
      if (age >= maxAge) {
        cardFlags.push({
          type: 'STALE',
          priority: fee >= HIGH_FEE ? 'HIGH' : 'MEDIUM',
          detail: `Last verified ${age} days ago — threshold is ${maxAge} days`,
        });
      }

      // ── Fee check: fetch issuer page ───────────────────────────────────────
      if (sources?.primary) {
        try {
          const r = await get(sources.primary);
          if (r.status === 200) {
            const pageFee = extractFeeFromHtml(r.body);
            if (pageFee !== null && pageFee !== fee) {
              cardFlags.push({
                type: 'FEE_MISMATCH',
                priority: 'HIGH',
                detail: `cards.js says $${fee} — issuer page says $${pageFee}`,
              });
            }
          } else {
            errors.push(`${id}: HTTP ${r.status}`);
          }
        } catch (e) {
          errors.push(`${id}: ${e.message}`);
        }
      }

      if (cardFlags.length > 0) {
        flags.push({ id, name, fee, verified, sources, flags: cardFlags });
      }
    }));

    // Polite pause between batches
    if (i + BATCH < cards.length) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  // 3. Send email if there's anything to report
  if (flags.length > 0 && RESEND_API_KEY && ALERT_EMAIL) {
    const high   = flags.filter(f => f.flags.some(x => x.priority === 'HIGH'));
    const medium = flags.filter(f => f.flags.every(x => x.priority !== 'HIGH'));

    const cardHtml = (card) => {
      const rows = card.flags.map(f =>
        `<tr>
          <td style="padding:4px 8px;color:${f.priority==='HIGH'?'#c00':'#c60'};font-weight:600;white-space:nowrap">[${f.type}]</td>
          <td style="padding:4px 8px;color:#333">${f.detail}</td>
        </tr>`
      ).join('');
      return `
        <div style="border:1px solid #e0e0e0;border-radius:6px;padding:14px 16px;margin-bottom:12px;">
          <div style="font-weight:700;font-size:15px;margin-bottom:6px">${card.name}
            <span style="font-weight:400;color:#888;font-size:13px;margin-left:6px">$${card.fee}/yr · verified ${card.verified || 'unknown'}</span>
          </div>
          <table style="border-collapse:collapse;width:100%">${rows}</table>
          <div style="margin-top:10px;font-size:12px;color:#888">
            <a href="${card.sources?.primary||'#'}" style="color:#0066cc;margin-right:12px">Issuer page</a>
            <a href="${card.sources?.secondary||'#'}" style="color:#0066cc;margin-right:12px">TPG / NerdWallet</a>
            <a href="${card.sources?.tracker||'#'}" style="color:#0066cc">Doctor of Credit</a>
          </div>
        </div>`;
    };

    const emailHtml = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:660px;margin:0 auto;padding:24px;color:#111">
  <h2 style="margin:0 0 4px">CardRoundup — Weekly Card Check</h2>
  <p style="color:#888;font-size:13px;margin:0 0 24px">
    ${new Date().toDateString()} · ${cards.length} cards checked in ${elapsed}s · ${flags.length} flagged
  </p>

  ${high.length ? `
    <h3 style="color:#c00;margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:.5px">
      🔴 High Priority (${high.length})
    </h3>
    ${high.map(cardHtml).join('')}
  ` : ''}

  ${medium.length ? `
    <h3 style="color:#c60;margin:16px 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:.5px">
      🟡 Needs Review (${medium.length})
    </h3>
    ${medium.map(cardHtml).join('')}
  ` : ''}

  ${errors.length ? `
    <p style="font-size:12px;color:#aaa;margin-top:20px">
      Fetch errors (${errors.length}): ${errors.join(', ')}
    </p>
  ` : ''}

  <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
  <p style="font-size:11px;color:#bbb">
    To fix: open <code>cards.js</code> in GitHub, update the card object, push.
    The <code>verified</code> field resets to today automatically on deploy.
  </p>
</div>`;

    await postJson('https://api.resend.com/emails', {
      from:    FROM_EMAIL,
      to:      [ALERT_EMAIL],
      subject: `[CardRoundup] ${high.length > 0 ? '🔴' : '🟡'} ${flags.length} card${flags.length !== 1 ? 's' : ''} need attention`,
      html:    emailHtml,
    }, RESEND_API_KEY);
  }

  // 4. Return results
  return res.status(200).json({
    ok:           true,
    cardsChecked: cards.length,
    flagged:      flags.length,
    highPriority: flags.filter(f => f.flags.some(x => x.priority === 'HIGH')).length,
    fetchErrors:  errors.length,
    elapsedSec:   parseFloat(elapsed),
    results:      flags.map(f => ({ id: f.id, name: f.name, flags: f.flags })),
  });
};
