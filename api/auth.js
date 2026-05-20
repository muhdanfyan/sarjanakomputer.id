// Vercel Serverless — Decap CMS Auth Proxy
// Decap CMS calls this endpoint to authenticate via implicit grant flow.
// It opens a popup to this URL, and we redirect with the access token in the URL fragment.

const TOKEN = process.env.DECAP_CMS_TOKEN;

export default async function handler(req, res) {
  const { type } = req.query;

  if (!TOKEN) {
    return res.status(500).json({ error: 'DECAP_CMS_TOKEN not configured' });
  }

  // Decap CMS opens popup to /api/auth (with or without ?type=login).
  // We redirect immediately to the CMS admin page with the access token in the hash.
  if (type === 'login' || !type) {
    const redirectUrl = `/news/admin/#access_token=${TOKEN}`;
    res.writeHead(302, { Location: redirectUrl });
    return res.end();
  }

  res.status(400).json({ error: 'Invalid type parameter. Use ?type=login' });
}