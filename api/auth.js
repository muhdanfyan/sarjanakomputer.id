// Vercel Serverless — Decap CMS Auth Proxy
// Decap CMS calls this endpoint via XHR (not popup) to authenticate.
// Returns the GitHub PAT as JSON so the CMS can use it directly.

const TOKEN = process.env.DECAP_CMS_TOKEN;

export default async function handler(req, res) {
  const { type } = req.query;

  if (!TOKEN) {
    return res.status(500).json({ error: 'DECAP_CMS_TOKEN not configured' });
  }

  // Handle both: XHR (no type) and popup/redirect (?type=login) flows
  if (!type || type === 'login') {
    // Set CORS headers so the browser accepts the response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json({
      token: TOKEN
    });
  }

  res.status(400).json({ error: 'Invalid type parameter. Use ?type=login' });
}
