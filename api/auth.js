// Vercel Serverless — Decap CMS Auth Proxy
// Two modes:
//   1. ?json=1 → return JSON token (for XHR/fetch from the admin page)
//   2. default  → 302 redirect to auth_popup.html (for popup/navigation)

const TOKEN = process.env.DECAP_CMS_TOKEN;

export default async function handler(req, res) {
  if (!TOKEN) {
    return res.status(500).json({ error: 'DECAP_CMS_TOKEN not configured. Set DECAP_CMS_TOKEN env var.' });
  }

  const { json } = req.query;

  if (json === '1') {
    // Admin page fetches this to pre-auth via localStorage
    return res.status(200).json({ token: TOKEN });
  }

  // Browser/popup navigation → redirect with token in URL hash
  const redirectUrl = `/news/admin/auth_popup.html#access_token=${TOKEN}`;
  res.writeHead(302, { Location: redirectUrl });
  return res.end();
}
