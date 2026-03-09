export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { first_name, last_name, email, phone, message } = req.body || {};
  if (!first_name || !last_name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pyzfilefqqyrmjhfdvgw.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
  const RESEND_KEY   = process.env.RESEND_API_KEY;

  // 1. Save to Supabase
  const supaRes = await fetch(SUPABASE_URL + '/rest/v1/contact_submissions', {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ first_name, last_name, email, phone: phone || null, message })
  });

  if (!supaRes.ok) {
    return res.status(500).json({ error: 'Failed to save submission' });
  }

  // 2. Send email notification
  if (RESEND_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + RESEND_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Code Design <noreply@codedesign.ro>',
          to: ['contact@codedesign.ro'],
          subject: 'Mesaj nou de la ' + first_name + ' ' + last_name,
          html: `
            <h2>Mesaj nou pe codedesign.ro</h2>
            <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
              <tr><td style="padding:8px 12px;font-weight:bold;color:#666">Nume</td><td style="padding:8px 12px">${first_name} ${last_name}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;color:#666">Email</td><td style="padding:8px 12px"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;color:#666">Telefon</td><td style="padding:8px 12px">${phone || '–'}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;color:#666;vertical-align:top">Mesaj</td><td style="padding:8px 12px;white-space:pre-wrap">${message}</td></tr>
            </table>
            <p style="margin-top:16px;font-size:12px;color:#999">Trimis prin formularul de contact codedesign.ro</p>
          `
        })
      });
    } catch (e) {
      // Email failure shouldn't block the submission
      console.error('Email send failed:', e);
    }
  }

  return res.status(200).json({ ok: true });
}
