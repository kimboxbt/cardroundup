// api/send-digest.js
// Sends monthly reminder emails to all Card Roundup subscribers
// Triggered automatically on the 25th of every month via Vercel Cron
// Can also be triggered manually by visiting /api/send-digest (for testing)
//
// SETUP: Same as subscribe.js — needs RESEND_API_KEY and RESEND_AUDIENCE_ID
// Also needs: RESEND_FROM_EMAIL = "Card Roundup <reminders@cardroundup.com>"
// Set up email domain in Resend dashboard → Domains → Add Domain

// Which credits reset when
const CADENCES = {
  monthly: 'resets on the 1st of every month',
  quarterly: 'resets quarterly (Jan/Apr/Jul/Oct)',
  semiannual: 'resets twice a year (Jan/Jul)',
  annual: 'resets January 1st',
};

// Cards with high-value monthly credits — personalized messaging
const HIGH_VALUE_MONTHLY = {
  amexp: ['Uber Cash ($15–$35)', 'Digital entertainment ($25)', 'Walmart+ ($12.95)'],
  amexg: ['Dining credit ($10)', 'Uber Cash ($10)', 'Dunkin\' ($7)'],
  csr: ['Lyft rides ($10)', 'DoorDash promos ($25)', 'Peloton ($10)'],
  brilliant: ['Dining credit ($25)'],
  amexbp: ['Wireless credit ($10)'],
  amexbg: ['Dining & wireless ($20)'],
  altconn: ['Streaming credit ($15/qtr)'],
  amexbcp: ['Disney Bundle ($7)'],
  chaseaero: ['DoorDash credit ($5)'],
};

function getDaysUntilReset() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return Math.ceil((nextMonth - now) / (1000 * 60 * 60 * 24));
}

function buildEmailHTML(email, cards) {
  const daysLeft = getDaysUntilReset();
  const cardList = cards ? cards.split(',').filter(Boolean) : [];

  // Build personalized credit list
  let creditLines = '';
  if (cardList.length > 0) {
    cardList.forEach(cardId => {
      const credits = HIGH_VALUE_MONTHLY[cardId];
      if (credits) {
        creditLines += credits.map(c => `<li style="margin:4px 0;color:#9898AD;">${c}</li>`).join('');
      }
    });
  }

  const creditSection = creditLines
    ? `<ul style="margin:12px 0;padding-left:20px;">${creditLines}</ul>`
    : `<p style="color:#9898AD;">Log in to see your expiring credits.</p>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0B0B0F;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="margin-bottom:32px;">
      <div style="font-size:22px;font-weight:700;color:#E4E4EF;letter-spacing:-0.02em;">Card Roundup</div>
      <div style="font-size:12px;color:#58586A;margin-top:4px;letter-spacing:0.08em;text-transform:uppercase;">Monthly Reminder</div>
    </div>

    <!-- Main message -->
    <div style="background:#141419;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:24px;margin-bottom:20px;">
      <div style="font-size:28px;font-weight:700;color:#FF7A3C;font-variant-numeric:tabular-nums;margin-bottom:8px;">
        ${daysLeft} day${daysLeft === 1 ? '' : 's'} left
      </div>
      <div style="font-size:16px;color:#E4E4EF;font-weight:500;margin-bottom:6px;">
        Your monthly credits reset soon
      </div>
      <div style="font-size:13px;color:#9898AD;line-height:1.6;">
        Credits that reset on the 1st don't roll over. Use them or lose them.
      </div>
    </div>

    <!-- Credits list -->
    <div style="background:#141419;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:24px;margin-bottom:20px;">
      <div style="font-size:13px;font-weight:600;color:#E4E4EF;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.08em;">Your expiring credits</div>
      ${creditSection}
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="https://cardroundup.com" style="display:inline-block;padding:12px 28px;background:#E4E4EF;color:#0B0B0F;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">
        View all my credits →
      </a>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;text-align:center;">
      <div style="font-size:11px;color:#58586A;line-height:1.7;">
        You're receiving this because you signed up at cardroundup.com<br>
        <a href="https://cardroundup.com/unsubscribe?email=${encodeURIComponent(email)}" style="color:#58586A;">Unsubscribe</a>
      </div>
    </div>

  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Card Roundup <reminders@cardroundup.com>';

  if (!apiKey || apiKey === 'YOUR_RESEND_API_KEY') {
    return res.status(200).json({ message: 'Resend not configured yet. Add RESEND_API_KEY to Vercel environment variables.' });
  }

  try {
    // Fetch all contacts from Resend audience
    const contactsRes = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      { headers: { 'Authorization': `Bearer ${apiKey}` } }
    );

    if (!contactsRes.ok) {
      throw new Error('Failed to fetch contacts');
    }

    const { data: contacts } = await contactsRes.json();
    const activeContacts = contacts.filter(c => !c.unsubscribed);

    console.log(`[CardRoundup] Sending digest to ${activeContacts.length} subscribers`);

    let sent = 0;
    let failed = 0;

    // Send email to each subscriber
    for (const contact of activeContacts) {
      try {
        const cards = contact.data?.cards || '';
        const html = buildEmailHTML(contact.email, cards);

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

        if (emailRes.ok) {
          sent++;
        } else {
          failed++;
          console.error('[CardRoundup] Failed to send to:', contact.email);
        }

        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 100));

      } catch (err) {
        failed++;
        console.error('[CardRoundup] Error sending to:', contact.email, err);
      }
    }

    console.log(`[CardRoundup] Digest complete. Sent: ${sent}, Failed: ${failed}`);
    return res.status(200).json({ success: true, sent, failed, total: activeContacts.length });

  } catch (error) {
    console.error('[CardRoundup] Digest error:', error);
    return res.status(500).json({ error: error.message });
  }
}
