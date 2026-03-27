// /api/subscribe.js
// Saves email + card list to Resend and sends an immediate welcome email

const RESEND_BASE = 'https://api.resend.com';
const UA = 'CardRoundup/1.0';

function headers(apiKey) {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'User-Agent': UA,
  };
}

async function ensureProperties(apiKey) {
  const props = [
    { key: 'cards',    type: 'string', fallbackValue: '' },
    { key: 'welcomed', type: 'string', fallbackValue: 'false' },
    { key: 'claimed',  type: 'string', fallbackValue: '{}' },
  ];
  for (const prop of props) {
    try {
      await fetch(`${RESEND_BASE}/contact-properties`, {
        method: 'POST',
        headers: headers(apiKey),
        body: JSON.stringify(prop),
      });
    } catch {}
  }
}

function buildWelcomeEmail(cards) {
  const cardNames = cards && cards.trim()
    ? cards.split(',').filter(Boolean).map(id => CARD_NAMES[id]).filter(Boolean)
    : [];

  const cardRows = cardNames.length > 0
    ? cardNames.map(n =>
        `<div style="font-size:13px;color:#9898AD;margin:5px 0;padding-left:12px;
              border-left:2px solid rgba(255,255,255,0.08);">
           ${n}
         </div>`
      ).join('')
    : `<div style="font-size:13px;color:#9898AD;line-height:1.65;">
         <a href="https://cardroundup.com" style="color:#E4E4EF;text-decoration:none;">
           Visit cardroundup.com
         </a> and click <strong style="color:#E4E4EF;">+ Add my cards</strong> 
         to set up your wallet. Takes 30 seconds.
       </div>`;

  const walletSection = cardNames.length > 0
    ? `<div style="background:#141419;border:1px solid rgba(255,255,255,0.07);
            border-left:3px solid #24B870;border-radius:0 10px 10px 0;
            padding:20px 24px;margin-bottom:14px;">
         <div style="font-size:15px;font-weight:600;color:#E4E4EF;margin-bottom:12px;">
           Your wallet — ${cardNames.length} card${cardNames.length !== 1 ? 's' : ''}
         </div>
         ${cardRows}
         <div style="font-size:12px;color:#58586A;margin-top:12px;line-height:1.6;">
           We'll send you a reminder on the 25th of each month before any credits expire.
         </div>
       </div>`
    : `<div style="background:#141419;border:1px solid rgba(255,255,255,0.07);
            border-left:3px solid #24B870;border-radius:0 10px 10px 0;
            padding:20px 24px;margin-bottom:14px;">
         <div style="font-size:15px;font-weight:600;color:#E4E4EF;margin-bottom:12px;">
           Get started
         </div>
         ${cardRows}
       </div>`;

  const featuresSection = `
    <div style="margin-bottom:14px;">
      <div style="font-size:11px;font-weight:700;color:#58586A;letter-spacing:0.1em;
           text-transform:uppercase;margin-bottom:14px;">What Card Roundup does</div>

      <div style="display:table;width:100%;margin-bottom:10px;">
        <div style="display:table-row;">
          <div style="display:table-cell;width:28px;font-size:18px;vertical-align:top;padding-top:1px;">📅</div>
          <div style="display:table-cell;padding-left:10px;">
            <div style="font-size:13px;font-weight:600;color:#E4E4EF;margin-bottom:2px;">Monthly reminders</div>
            <div style="font-size:12px;color:#9898AD;line-height:1.5;">
              Email you on the 25th before monthly, quarterly, and annual credits reset.
            </div>
          </div>
        </div>
      </div>

      <div style="display:table;width:100%;margin-bottom:10px;">
        <div style="display:table-row;">
          <div style="display:table-cell;width:28px;font-size:18px;vertical-align:top;padding-top:1px;">✅</div>
          <div style="display:table-cell;padding-left:10px;">
            <div style="font-size:13px;font-weight:600;color:#E4E4EF;margin-bottom:2px;">Credit tracker</div>
            <div style="font-size:12px;color:#9898AD;line-height:1.5;">
              Check off credits as you use them. See exactly how much you've claimed vs. what's still available.
            </div>
          </div>
        </div>
      </div>

      <div style="display:table;width:100%;margin-bottom:10px;">
        <div style="display:table-row;">
          <div style="display:table-cell;width:28px;font-size:18px;vertical-align:top;padding-top:1px;">🔍</div>
          <div style="display:table-cell;padding-left:10px;">
            <div style="font-size:13px;font-weight:600;color:#E4E4EF;margin-bottom:2px;">46 cards tracked</div>
            <div style="font-size:12px;color:#9898AD;line-height:1.5;">
              Chase, Amex, Capital One, Citi, Bilt, U.S. Bank, BofA, and Barclays — all in one place.
            </div>
          </div>
        </div>
      </div>

      <div style="display:table;width:100%;">
        <div style="display:table-row;">
          <div style="display:table-cell;width:28px;font-size:18px;vertical-align:top;padding-top:1px;">🔄</div>
          <div style="display:table-cell;padding-left:10px;">
            <div style="font-size:13px;font-weight:600;color:#E4E4EF;margin-bottom:2px;">Syncs across devices</div>
            <div style="font-size:12px;color:#9898AD;line-height:1.5;">
              Sign in with Google to access your wallet from any device. Your progress saves automatically.
            </div>
          </div>
        </div>
      </div>
    </div>`;

  const html = `<!DOCTYPE html><html><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0B0B0F;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">

  <div style="margin-bottom:32px;">
    <div style="font-size:24px;font-weight:700;color:#E4E4EF;letter-spacing:-0.02em;">
      Card Roundup
    </div>
    <div style="font-size:11px;color:#58586A;margin-top:4px;letter-spacing:0.1em;text-transform:uppercase;">
      Never lose a credit again
    </div>
  </div>

  <div style="font-size:15px;font-weight:600;color:#E4E4EF;margin-bottom:8px;">
    You're in. 👋
  </div>
  <div style="font-size:13px;color:#9898AD;margin-bottom:28px;line-height:1.7;">
    Thanks for signing up to Card Roundup. We track every credit on your cards 
    and remind you before they expire — so you never leave money on the table 
    that you've already paid for.
  </div>

  ${walletSection}
  ${featuresSection}

  <div style="text-align:center;margin:32px 0;">
    <a href="https://cardroundup.com"
       style="display:inline-block;padding:14px 40px;background:#E4E4EF;color:#0B0B0F;
              border-radius:7px;text-decoration:none;font-weight:700;font-size:14px;
              letter-spacing:-0.01em;">
      Open my wallet →
    </a>
  </div>

  <div style="background:#141419;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
       padding:18px 22px;margin-bottom:28px;">
    <div style="font-size:12px;color:#58586A;line-height:1.8;">
      💡 <strong style="color:#9898AD;">Pro tip:</strong> Sign in with Google to sync your wallet 
      across devices and track which credits you've already used this month.
    </div>
  </div>

  <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;text-align:center;">
    <div style="font-size:11px;color:#58586A;line-height:2;">
      Card Roundup · <a href="https://cardroundup.com" style="color:#58586A;text-decoration:none;">cardroundup.com</a><br>
      You'll receive a reminder on the 25th of each month.<br>
      <a href="https://cardroundup.com" style="color:#58586A;text-decoration:underline;">Unsubscribe</a>
    </div>
  </div>
</div>
</body></html>`;

  return {
    subject: '👋 Welcome to Card Roundup — your credits are tracked',
    html,
  };
}

// Card ID → display name mapping
const CARD_NAMES = {
  csr:'Chase Sapphire Reserve', csp:'Chase Sapphire Preferred', cf:'Chase Freedom Flex',
  cfu:'Chase Freedom Unlimited', hyatt:'Chase World of Hyatt', unitedq:'Chase United Quest',
  swpri:'Chase Southwest Priority', ihg:'IHG Premier', marriottbon:'Chase Bonvoy Boundless',
  chaseaero:'Chase Aeroplan', ink:'Ink Business Preferred', amexp:'Amex Platinum Personal',
  amexbp:'Amex Biz Platinum', amexg:'Amex Gold Personal', amexbg:'Amex Business Gold',
  amexgrn:'Amex Green Card', amexbcp:'Amex Blue Cash Preferred', deltagrn:'Delta Gold Personal',
  deltag:'Delta Gold Biz', deltares:'Delta Reserve', aspire:'Hilton Aspire',
  hiltsurp:'Hilton Surpass', brilliant:'Marriott Bonvoy Brilliant', mariottbiz:'Amex Bonvoy Business',
  hiltbiz:'Hilton Business', venturex:'Capital One Venture X', venture:'Capital One Venture',
  sparkcash2:'Cap1 Spark Cash Plus', sparkmiles:'Cap1 Spark Miles', savor:'Capital One Savor',
  strata:'Citi Strata Premier', aaexec:'Citi AAdvantage Executive', aaplatpres:'Citi AA Platinum Select',
  doublecash:'Citi Double Cash', bilt:'Bilt Mastercard', wfauto:'WF Autograph Journey',
  altres:'USB Altitude Reserve', altconn:'USB Altitude Connect', boapre:'BofA Premium Rewards Elite',
  boatravel:'BofA Travel Rewards', aadvbiz:'Barclays Aviator Silver', jbtravel:'Barclays JetBlue Plus',
  aadvsel:'Barclays Aviator Red', amexbp2:'Amex Biz Platinum', amexbg2:'Amex Business Gold',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let email, cards;
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    ({ email, cards } = req.body);
  } else {
    try {
      const parsed = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
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
    return res.status(200).json({ success: true });
  }

  try {
    await ensureProperties(apiKey);

    // Check if contact already exists — preserve welcomed flag
    let alreadyWelcomed = 'false';
    let isNewContact = true;
    try {
      const existing = await fetch(
        `${RESEND_BASE}/contacts/${encodeURIComponent(email)}`,
        { headers: headers(apiKey) }
      );
      if (existing.ok) {
        const d = await existing.json();
        const wRaw = d.properties?.welcomed;
        alreadyWelcomed = (wRaw && typeof wRaw === 'object') ? (wRaw.value || 'false') : (wRaw || 'false');
        isNewContact = false;
      }
    } catch {}

    // Save contact with latest card list
    await fetch(`${RESEND_BASE}/contacts`, {
      method: 'POST',
      headers: headers(apiKey),
      body: JSON.stringify({
        email,
        unsubscribed: false,
        properties: {
          cards: cards || '',
          welcomed: alreadyWelcomed,
        },
      }),
    });

    // Send immediate welcome email to brand new subscribers
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Card Roundup <reminders@cardroundup.com>';
    if (alreadyWelcomed !== 'true') {
      const { subject, html } = buildWelcomeEmail(cards);
      const emailRes = await fetch(`${RESEND_BASE}/emails`, {
        method: 'POST',
        headers: headers(apiKey),
        body: JSON.stringify({ from: fromEmail, to: email, subject, html }),
      });

      if (emailRes.ok) {
        // Mark as welcomed so they don't get the welcome email again on the 25th
        await fetch(`${RESEND_BASE}/contacts/${encodeURIComponent(email)}`, {
          method: 'PATCH',
          headers: headers(apiKey),
          body: JSON.stringify({ properties: { welcomed: 'true' } }),
        });
        console.log('[CardRoundup] Welcome email sent to', email);
      } else {
        const err = await emailRes.text();
        console.error('[CardRoundup] Welcome email failed:', emailRes.status, err);
      }
    }

    console.log('[CardRoundup] Contact saved:', email, '| cards:', cards || '(none)');
    return res.status(200).json({ success: true });

  } catch (e) {
    console.error('[CardRoundup] subscribe error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
