// Vercel Serverless — Decap CMS Auth Proxy
// Decap CMS opens a popup to this URL.
// We redirect to a lightweight popup page that extracts the access token
// from the URL hash and sends it to the main CMS window via postMessage.

const TOKEN = process.env.DECAP_CMS_TOKEN;

export default async function handler(req, res) {
  if (!TOKEN) {
    return res.status(500).json({ error: 'DECAP_CMS_TOKEN not configured. Set DECAP_CMS_TOKEN env var.' });
  }

  // Redirect ALL requests to the auth_popup.html with the token in the URL hash.
  // The popup page handles token extraction and postMessage back to main window.
  const redirectUrl = `/news/admin/auth_popup.html#access_token=${TOKEN}`;
  res.writeHead(302, { Location: redirectUrl });
  return res.end();
}
