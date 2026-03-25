// api/send-digest.js
// Sends monthly reminder emails to all Card Roundup subscribers
// Auto-runs on 25th of every month via Vercel Cron
//
// NEEDS IN VERCEL ENVIRONMENT VARIABLES:
// RESEND_API_KEY = your re_ key
// RESEND_FROM_EMAIL = Card Roundup <reminders@cardroundup.com>

const HIGH_VALUE_MONTHLY = {
  amexp: ['Uber Cash ($15–$35/mo)', 'Digital entertainment (up to $25/mo)', 'Walmart+ ($12.95/mo)'],
  amexg: ['Dining credit ($10/mo)', 'Uber Cash ($10/mo)', "Dunkin' ($7/mo)"],
  csr: ['Lyft rides ($10/mo)', 'DoorDash promos ($25/mo)', 'Peloton (up to $10/mo)'],
  brilliant: ['Dining credit ($25/mo)'],
  amexbp: ['Wireless credit ($10/mo)'],
  amexbg: ['Dining & wireless (up to $20/mo)'],
  altconn: ['Streaming credit ($15/qtr)'],
  amexbcp: ['Disney Bundle ($7/mo)'],
  chaseaero: ['DoorDash credit ($5/mo)'],
};

function getDaysUntilReset() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return Math.ceil((nextMonth - now) / (1000 * 60 * 60 * 24));
}

function buildEmailHTML(email, cards) {
  const daysLeft = getDaysUntilReset();
  const cardList = cards ? cards.split(',').filter(Boolean) : [];

  let creditLines = '';
  cardList.forEach(cardId => {
    const credits = HIGH_VALUE_MONTHLY[cardId];
    if (credits) {
      creditLines += credits.map(c =>
        `<li style="margin:6px 0;color:#9898AD;font-size:13px;">${c}</li>`
      ).join('');
    }
  });

  const creditSection = creditLines
    ? `<ul style="margin:12px 0;padding-left:20px;">${creditLines}</ul>`
    : `<p style="color:#9898AD;font-size:13px;">Log in to see your expiring credits.</p>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0B0B0F;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="margin-bottom:32px;">
      <div style="font-size:22px;font-weight:700;color:#E4E4EF;letter-spacing:-0.02em;">Card Roundup</div>
      <div style="font-size:11px;color:#58586A;margin-top:4px;letter-spacing:0.1em;text-transform:uppercase;">Monthly Reminder</div>
    </div>
    <div style="background:#141419;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:24px;margin-bottom:16px;">
      <div style="font-size:32px;font-weight:700;color:#FF7A3C;margin-bottom:8px;">${daysLeft} day${daysLeft === 1 ? '' : 's'} left</div>
      <div style="font-size:16px;color:#E4E4EF;font-weight:500;margin-bottom:6px;">Your monthly credits reset soon</div>
      <div style="font-size:13px;color:#9898AD;line-height:1.6;">Credits that reset on the 1st don't roll over. Use them or lose them.</div>
    </div>
    <div style="background:#141419;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:24px;margin-bottom:20px;">
      <div style="font-size:11px;font-weight:600;color:#E4E4EF;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.1em;">Your expiring credits</div>
      ${creditSection}
    </div>
    <div style="text-align:center;margin-bottom:32px;">
      <a href="https://cardroundup.com" style="display:inline-block;padding:12px 32px;background:#E4E4EF;color:#0B0B0F;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">View all my credits →</a>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;text-align:center;">
      <div style="font-size:11px;color:#58586A;line-height:1.8;">
        You signed up at cardroundup.com<br>
        <a href="https://cardroundup.com" style="color:#58586A;text-decoration:underline;">Unsubscribe</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Card Roundup <reminders@cardroundup.com>';

  if (!apiKey) {
    return res.status(200).json({ message: 'RESEND_API_KEY not set in Vercel environment variables.' });
  }

  try {
    // Auto-fetch audience ID
    let audienceId = null;
    const audiencesRes = await fetch('https://api.resend.com/audiences', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (audiencesRes.ok) {
      const data = await audiencesRes.json();
      if (data.data && data.data.length > 0) audienceId = data.data[0].id;
    }

    if (!audienceId) {
      return res.status(200).json({ message: 'No audience found. Emails will start sending after first signup.' });
    }

    // Get all contacts
    const contactsRes = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      { headers: { 'Authorization': `Bearer ${apiKey}` } }
    );

    if (!contactsRes.ok) throw new Error('Failed to fetch contacts');

    const { data: contacts } = await contactsRes.json();
    const active = (contacts || []).filter(c => !c.unsubscribed);

    console.log(`[CardRoundup] Sending digest to ${active.length} subscribers`);

    let sent = 0, failed = 0;

    for (const contact of active) {
      try {
        const html = buildEmailHTML(contact.email, contact.data?.cards || '');
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: contact.email,
            subject: `⏰ Your credits reset in ${getDaysUntilReset()} days — don't lose them`,
            html,
          }),
        });
        if (emailRes.ok) sent++; else failed++;
        await new Promise(r => setTimeout(r, 100));
      } catch {
        failed++;
      }
    }

    return res.status(200).json({ success: true, sent, failed, total: active.length });

  } catch (error) {
    console.error('[CardRoundup] Digest error:', error);
    return res.status(500).json({ error: error.message });
  }
}
