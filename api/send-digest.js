// api/send-digest.js
// Sends PERSONALIZED monthly reminder emails
// Uses Resend's Nov 2025+ global contacts API (no audience ID needed)
// Auto-runs on 25th of every month via Vercel Cron
//
// Email cases handled:
// 1. welcomed=false → warm welcome email (first email ever)
// 2. welcomed=true + has cards + expiring soon → personalized digest
// 3. welcomed=true + has cards + nothing expiring → "all caught up"
// 4. welcomed=true + no cards → "add your cards" nudge
//
// SETUP: Add to Vercel environment variables:
//   RESEND_API_KEY     = your re_ key from resend.com/api-keys
//   RESEND_FROM_EMAIL  = Card Roundup <reminders@cardroundup.com>

const RESEND_BASE = 'https://api.resend.com';
const UA = 'CardRoundup/1.0';

function headers(apiKey) {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'User-Agent': UA,
  };
}

// ─── CARD CREDITS DATA ───────────────────────────────────────────
const CARDS = {
  csr:        { name:'Chase Sapphire Reserve',    monthly:['Lyft rides — $10','DoorDash promos — $25','Peloton — up to $10'], semiannual:['The Edit hotel — $250','Exclusive Tables dining — $150','StubHub/Viagogo — $150'], annual:['Travel credit — $300 (anniversary-based ⚠ not Jan 1)','The Shops at Chase — up to $250'] },
  csp:        { name:'Chase Sapphire Preferred',  annual:['Hotel credit — up to $50','DashPass — complimentary'] },
  cf:         { name:'Chase Freedom Flex',         quarterly:['5% rotating categories — up to $75 cash back'] },
  hyatt:      { name:'Chase World of Hyatt',       annual:['Free Night Cert (Cat 1–4)','2nd Free Night at $15k spend'] },
  unitedq:    { name:'Chase United Quest',         annual:['United travel credit — $125','Anniversary miles — 5,000 (~$70)','2 United Club passes'] },
  swpri:      { name:'Chase Southwest Priority',   annual:['SW travel credit — $75','Anniversary pts — 7,500 (~$112)','Upgraded boardings — 4x'] },
  ihg:        { name:'IHG Premier',                annual:['Free Night Cert (≤40k pts)','4th Night Free on award stays'] },
  marriottbon:{ name:'Chase Bonvoy Boundless',     annual:['Free Night Award (≤35k pts)'] },
  chaseaero:  { name:'Chase Aeroplan',             monthly:['DoorDash credit — $5'], annual:['250 Status Qualifying Dollars'] },
  amexp:      { name:'Amex Platinum Personal',     monthly:['Uber Cash — $15/mo (Jan–Nov), $35 Dec ⚠ no rollover','Digital entertainment — up to $25','Walmart+ — $12.95'], quarterly:['Resy dining — up to $100 ⚠ no rollover','Lululemon — up to $75 ⚠ no rollover'], semiannual:['Fine Hotels + Resorts — $300'], annual:['Airline incidental fees — up to $200','CLEAR Plus — up to $209','OURA Ring — up to $200','Equinox — up to $300'] },
  amexbp:     { name:'Amex Biz Platinum',          monthly:['Wireless credit — up to $10'], quarterly:['Indeed — up to $90','Hilton via Hilton for Business — up to $50'], semiannual:['Fine Hotels + Resorts — $300'], annual:['Airline incidental fees — up to $200','CLEAR Plus — up to $209'] },
  amexg:      { name:'Amex Gold Personal',         monthly:['Dining credit — $10 ⚠ no rollover','Uber Cash — $10 ⚠ no rollover','Dunkin\' — $7 ⚠ no rollover'], annual:['Hotel Collection credit — up to $100/stay'] },
  amexbg:     { name:'Amex Business Gold',         monthly:['Dining & wireless — up to $20 ⚠ no rollover'] },
  amexgrn:    { name:'Amex Green Card',            annual:['CLEAR Plus — up to $189','LoungeBuddy — up to $100'] },
  amexbcp:    { name:'Amex Blue Cash Preferred',   monthly:['Disney Bundle — up to $7'] },
  deltagrn:   { name:'Delta SkyMiles Gold',        annual:['Delta travel credit — up to $200'] },
  deltag:     { name:'Delta SkyMiles Gold Biz',    annual:['Delta travel credit — up to $250'] },
  deltares:   { name:'Delta SkyMiles Reserve',     annual:['Domestic companion cert'] },
  aspire:     { name:'Hilton Honors Aspire',        quarterly:['Airline incidental credit — up to $50 ⚠ no rollover'], semiannual:['Hilton resort credit — $200'], annual:['Free Night Reward (≤150k pts)'] },
  hiltsurp:   { name:'Hilton Honors Surpass',      quarterly:['Hilton resort credit — up to $50 ⚠ no rollover'], annual:['Free Night Reward at $15k spend (≤85k pts)'] },
  brilliant:  { name:'Marriott Bonvoy Brilliant',  monthly:['Dining credit — up to $25'], annual:['Free Night Award (≤85k pts)'] },
  mariottbiz: { name:'Amex Bonvoy Business',       annual:['Free Night Award (≤35k pts)'] },
  hiltbiz:    { name:'Hilton Honors Business',     quarterly:['Hilton resort credit — up to $60 ⚠ no rollover'], annual:['Free Night Reward at $15k spend'] },
  venturex:   { name:'Capital One Venture X',      annual:['Travel credit (Cap1 portal) — $300','Anniversary miles — 10,000 (~$100)'] },
  sparkcash2: { name:'Cap1 Spark Cash Plus',       annual:['Annual cash bonus — $200 at $200k spend'] },
  strata:     { name:'Citi Strata Premier',        annual:['Hotel credit — up to $100'] },
  aaexec:     { name:'Citi AAdvantage Executive',  annual:['Anniversary miles — 10,000'] },
  aaplatpres: { name:'Citi AA Platinum Select',    annual:['Companion cert at $30k spend'] },
  bilt:       { name:'Bilt Mastercard',            monthly:['Rent Day 2x points — 1st of month ONLY ⚠ one day'] },
  wfauto:     { name:'WF Autograph Journey',       annual:['Airline credit — $50','Hotel credit — $50'] },
  altres:     { name:'U.S. Bank Altitude Reserve', annual:['Travel & dining credit — up to $325'] },
  altconn:    { name:'U.S. Bank Altitude Connect', monthly:['Streaming credit — up to $15'] },
  boapre:     { name:'BofA Premium Rewards Elite', annual:['Travel credit — up to $300','Lifestyle credit — up to $150'] },
  aadvbiz:    { name:'Barclays Aviator Silver',    annual:['Companion cert at $20k spend'] },
  jbtravel:   { name:'Barclays JetBlue Plus',      annual:['Anniversary pts — 5,000 (~$70)','JetBlue credit — $100'] },
  aadvsel:    { name:'Barclays Aviator Red',       annual:['Companion cert at $20k spend'] },
};

// ─── DATE HELPERS ────────────────────────────────────────────────
function daysUntil(date) {
  const now = new Date(); now.setHours(0,0,0,0);
  const d = new Date(date); d.setHours(0,0,0,0);
  return Math.round((d - now) / 86400000);
}

function getUpcomingResets() {
  const now = new Date(), y = now.getFullYear(), m = now.getMonth();
  const quarters = [0,3,6,9];
  const nextQ = quarters.find(q => q > m) ?? 12;

  return [
    { cadence:'monthly',    label:'Monthly',     color:'#D44A00', threshold:14,
      days: daysUntil(new Date(y, m+1, 1)) },
    { cadence:'quarterly',  label:'Quarterly',   color:'#7744CC', threshold:30,
      days: daysUntil(new Date(y+(nextQ>=12?1:0), nextQ%12, 1)) },
    { cadence:'semiannual', label:'Semi-annual', color:'#1A8870', threshold:45,
      days: daysUntil(m<6 ? new Date(y,6,1) : new Date(y+1,0,1)) },
    { cadence:'annual',     label:'Annual',      color:'#2255AA', threshold:60,
      days: daysUntil(new Date(y+1, 0, 1)) },
  ].filter(r => r.days >= 0 && r.days <= r.threshold);
}

// ─── HTML HELPERS ─────────────────────────────────────────────────
function section({ color, title, days, rows }) {
  return `
    <div style="background:#F4F4F8;border-left:3px solid ${color};border-radius:0 8px 8px 0;
         padding:18px 20px;margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;
           margin-bottom:${rows ? '12px' : '0'};">
        <div style="font-size:14px;font-weight:700;color:#111122;">${title}</div>
        ${days ? `<div style="font-size:12px;font-weight:700;color:${color};">${days}</div>` : ''}
      </div>
      ${rows}
    </div>`;
}

function layout({ sub, intro, body, cta }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F0F0F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 16px;">

  <!-- Header -->
  <div style="background:#111122;border-radius:10px 10px 0 0;padding:24px 28px;">
    <div style="font-size:20px;font-weight:700;color:#FFFFFF;letter-spacing:-0.02em;">Card Roundup</div>
    <div style="font-size:11px;color:#6868A0;margin-top:3px;letter-spacing:0.08em;text-transform:uppercase;">${sub}</div>
  </div>

  <!-- Body -->
  <div style="background:#FFFFFF;border-radius:0 0 10px 10px;padding:28px 28px 32px;">
    <div style="font-size:15px;color:#444455;line-height:1.7;margin-bottom:22px;">${intro}</div>
    ${body}
    <div style="text-align:center;margin-top:28px;">
      <a href="https://cardroundup.com"
         style="display:inline-block;padding:14px 40px;background:#111122;color:#FFFFFF;
                border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;
                letter-spacing:-0.01em;">${cta}</a>
    </div>
  </div>

  <!-- Footer -->
  <div style="padding:20px 4px 0;text-align:center;">
    <div style="font-size:11px;color:#AAAABD;line-height:2;">
      Card Roundup · <a href="https://cardroundup.com" style="color:#AAAABD;text-decoration:none;">cardroundup.com</a><br>
      You signed up at cardroundup.com<br>
      <a href="https://cardroundup.com" style="color:#AAAABD;text-decoration:none;">
        Sign in with Google to keep your wallet in sync →
      </a><br>
      <a href="https://cardroundup.com" style="color:#AAAABD;text-decoration:underline;">Unsubscribe</a>
    </div>
  </div>

</div>
</body></html>`;
}

// ─── EMAIL BUILDERS ──────────────────────────────────────────────
function buildEmail(email, cardIds, welcomed) {
  const isWelcomed = welcomed === 'true';
  const hasCards = cardIds && cardIds.trim() !== '';

  // Case 1: First email ever → warm welcome
  if (!isWelcomed) {
    return buildWelcomeEmail(hasCards, cardIds);
  }

  // Case 4: Has been welcomed but no cards saved
  if (!hasCards) {
    return {
      subject: 'Add your cards to Card Roundup — get personalized reminders',
      html: layout({
        sub: 'Your wallet is empty',
        intro: "You're signed up for reminders but haven't added your cards yet.",
        body: section({
          color: '#24B870',
          title: 'Add your cards',
          days: null,
          rows: `<div style="font-size:14px;color:#555566;line-height:1.65;">
            Select which cards you carry at <a href="https://cardroundup.com"
            style="color:#24B870;font-weight:600;">cardroundup.com</a> and we'll track every
            credit expiry for you. We cover 46 cards across Chase, Amex,
            Capital One, Citi, Bilt, U.S. Bank, BofA, and Barclays.
          </div>`,
        }),
        cta: 'Add my cards →',
      })
    };
  }

  // Resolve card objects for this user
  const userCards = cardIds.split(',').filter(Boolean)
    .map(id => ({ id, data: CARDS[id] })).filter(c => c.data);

  const resets = getUpcomingResets();
  let sections = '';
  let hasExpiring = false;

  for (const reset of resets.sort((a,b) => a.days - b.days)) {
    const relevant = userCards.filter(c => c.data[reset.cadence]?.length > 0);
    if (!relevant.length) continue;
    hasExpiring = true;

    const daysText = reset.days === 0 ? '⚠️ Today!' :
                     reset.days === 1 ? '1 day left ⚠️' :
                     `${reset.days} days left`;

    const cardRows = relevant.map(({ data }) =>
      `<div style="margin-bottom:14px;">
        <div style="font-size:12px;font-weight:700;color:#111122;margin-bottom:5px;
             text-transform:uppercase;letter-spacing:0.06em;">${data.name}</div>
        ${data[reset.cadence].map(c =>
          `<div style="font-size:13px;color:#555566;margin:4px 0;padding-left:10px;border-left:2px solid #E8E8F0;">· ${c}</div>`
        ).join('')}
      </div>`
    ).join('');

    sections += section({ color: reset.color, title: `${reset.label} credits`, days: daysText, rows: cardRows });
  }

  // Case 3: Has cards but nothing expiring soon
  if (!hasExpiring) {
    sections = `
      <div style="background:#F4F4F8;border-radius:8px;padding:24px;text-align:center;margin-bottom:14px;">
        <div style="font-size:20px;margin-bottom:8px;">✓</div>
        <div style="font-size:15px;color:#111122;margin-bottom:8px;font-weight:600;">You're all caught up</div>
        <div style="font-size:13px;color:#666677;line-height:1.6;">No credits expiring in the next 60 days. We'll remind you when something's coming up.</div>
      </div>`;
  }

  // Build subject line
  const resets2 = getUpcomingResets();
  let subject = 'Your monthly Card Roundup check — all caught up ✓';
  if (resets2.length > 0 && hasExpiring) {
    const s = resets2.sort((a,b) => a.days - b.days)[0];
    if (s.days === 0)     subject = '⚠️ Your credits reset TODAY — last chance';
    else if (s.days <= 3) subject = `🔴 ${s.days} days left — credits about to expire`;
    else                  subject = `⏰ ${s.days} days: your ${s.label.toLowerCase()} credits reset soon`;
  }

  const cardCount = userCards.length;
  return {
    subject,
    html: layout({
      sub: `${cardCount} card${cardCount !== 1 ? 's' : ''} in your wallet`,
      intro: hasExpiring
        ? "Here's what's expiring from your wallet. Credits don't roll over — use them before they reset."
        : "A quick check on your wallet — nothing urgent this month.",
      body: sections,
      cta: 'View my full wallet →',
    })
  };
}

// Case 1: Welcome email (sent by digest if welcomed=false)
function buildWelcomeEmail(hasCards, cardIds) {
  const userCards = hasCards
    ? cardIds.split(',').filter(Boolean).map(id => CARDS[id]).filter(Boolean) : [];

  const cardList = userCards.length > 0
    ? `<div style="margin-top:10px;">
        ${userCards.map(c =>
          `<div style="font-size:14px;color:#333344;padding:5px 0;border-bottom:1px solid #EBEBF5;">${c.name}</div>`
        ).join('')}
        <div style="font-size:12px;color:#888899;margin-top:10px;">
          We'll remind you before any of these credits expire.
        </div>
      </div>`
    : `<div style="font-size:14px;color:#444455;line-height:1.65;margin-top:8px;">
        Add your cards at <a href="https://cardroundup.com" style="color:#24B870;font-weight:600;">cardroundup.com</a>
        to start getting personalized credit reminders. Takes 30 seconds.
      </div>`;

  return {
    subject: '👋 Welcome to Card Roundup — never lose a credit again',
    html: layout({
      sub: 'Welcome to Card Roundup',
      intro: "You're signed up. We track expiring credits across 46 premium cards so you never lose money you've already paid for.",
      body: section({
        color: '#24B870',
        title: userCards.length > 0
          ? `${userCards.length} card${userCards.length !== 1 ? 's' : ''} in your wallet`
          : 'Get started',
        days: null,
        rows: cardList,
      }),
      cta: userCards.length > 0 ? 'View my wallet →' : 'Add my cards →',
    })
  };
}

// ─── MARK WELCOMED ────────────────────────────────────────────────
async function markWelcomed(apiKey, contactId, cardIds) {
  try {
    await fetch(`${RESEND_BASE}/contacts/${contactId}`, {
      method: 'PATCH',
      headers: headers(apiKey),
      body: JSON.stringify({
        properties: { cards: cardIds || '', welcomed: 'true' }
      }),
    });
  } catch (e) {
    console.error('[CardRoundup] markWelcomed error:', e);
  }
}

// ─── MAIN HANDLER ────────────────────────────────────────────────
export default async function handler(req, res) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ||
    'Card Roundup <reminders@cardroundup.com>';

  if (!apiKey) {
    return res.status(200).json({ message: 'Add RESEND_API_KEY to Vercel env vars.' });
  }

  try {
    const contactsRes = await fetch(`${RESEND_BASE}/contacts`, {
      headers: headers(apiKey)
    });

    if (!contactsRes.ok) {
      const err = await contactsRes.text();
      throw new Error(`Failed to fetch contacts: ${contactsRes.status} ${err}`);
    }

    const contactsData = await contactsRes.json();
    const contacts = contactsData.data || contactsData.contacts || [];
    const active = contacts.filter(c => !c.unsubscribed);

    console.log(`[CardRoundup] Sending digest to ${active.length} active subscribers`);

    let sent = 0, failed = 0;

    for (const contact of active) {
      try {
        const cardsRaw    = contact.properties?.cards;
        const welcomedRaw = contact.properties?.welcomed;
        const cardIds  = (cardsRaw    && typeof cardsRaw    === 'object') ? (cardsRaw.value    || '') : (cardsRaw    || '');
        const welcomed = (welcomedRaw && typeof welcomedRaw === 'object') ? (welcomedRaw.value || 'false') : (welcomedRaw || 'false');

        const { html, subject } = buildEmail(contact.email, cardIds, welcomed);

        const emailRes = await fetch(`${RESEND_BASE}/emails`, {
          method: 'POST',
          headers: headers(apiKey),
          body: JSON.stringify({ from: fromEmail, to: contact.email, subject, html }),
        });

        if (emailRes.ok) {
          sent++;
          if (welcomed !== 'true') {
            await markWelcomed(apiKey, contact.id, cardIds);
          }
          console.log(`[CardRoundup] ✓ ${contact.email} | welcomed:${welcomed} | cards:${cardIds||'none'}`);
        } else {
          failed++;
          const errTxt = await emailRes.text();
          console.error(`[CardRoundup] ✗ ${contact.email}:`, errTxt);
        }

        await new Promise(r => setTimeout(r, 120));

      } catch (err) {
        failed++;
        console.error('[CardRoundup] Error sending to:', contact.email, err);
      }
    }

    console.log(`[CardRoundup] Done. Sent:${sent} Failed:${failed} Total:${active.length}`);
    return res.status(200).json({ success: true, sent, failed, total: active.length });

  } catch (error) {
    console.error('[CardRoundup] Digest error:', error);
    return res.status(500).json({ error: error.message });
  }
}
