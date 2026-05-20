// Vercel Serverless — Decap CMS Auth Proxy
// Decap CMS opens a popup to this URL.
// We redirect immediately to the CMS admin page with the access token in the URL hash.
// The popup page then detects the token and sends it to the main window via postMessage.

const TOKEN = process.env.DECAP_CMS_TOKEN;

export default async function handler(req, res) {
  if (!TOKEN) {
    return res.status(500).json({ error: 'DECAP_CMS_TOKEN not configured. Set DECAP_CMS_TOKEN env var.' });
  }

  // Redirect ALL requests (with or without ?type=login, ?provider, etc.)
  // to the admin page with the access token in the URL fragment.
  // This is the Netlify implicit grant flow — the popup reads the hash
  // and sends the token back to the main CMS window via postMessage.
  const redirectUrl = `/news/admin/#access_token=${TOKEN}`;
  res.writeHead(302, { Location: redirectUrl });
  return res.end();
}
