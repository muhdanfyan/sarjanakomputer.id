// Vercel Serverless — Decap CMS Auth Proxy
// Setup: set DECAP_CMS_TOKEN di Vercel env vars (scope: repo)

const TOKEN = process.env.DECAP_CMS_TOKEN;

export default async function handler(req, res) {
  const { type } = req.query;

  if (type === 'login') {
    if (!TOKEN) {
      return res.status(500).json({ error: 'DECAP_CMS_TOKEN not configured' });
    }
    const redirectUrl = `/news/admin/#access_token=${TOKEN}`;
    res.writeHead(302, { Location: redirectUrl });
    return res.end();
  }

  res.status(400).json({ error: 'Missing type parameter. Use ?type=login' });
}
