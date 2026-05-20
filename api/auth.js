// Vercel Serverless — Decap CMS Auth Proxy
// Decap CMS navigates the MAIN PAGE (not a popup) to this URL when
// the user clicks "Login with GitHub". We redirect back to the admin
// page with the token in the URL hash. The admin page handles the
// token before React Router initializes.

const TOKEN = process.env.DECAP_CMS_TOKEN;

export default async function handler(req, res) {
  if (!TOKEN) {
    return res.status(500).json({ error: 'DECAP_CMS_TOKEN not configured. Set DECAP_CMS_TOKEN env var.' });
  }

  const { json } = req.query;

  if (json === '1') {
    // XHR/fetch from admin page for pre-auth
    return res.status(200).json({ token: TOKEN });
  }

  // Navigate back to admin page with token in hash.
  // Admin page will read #access_token before React Router initializes.
  const redirectUrl = `/news/admin/#access_token=${TOKEN}`;
  res.writeHead(302, { Location: redirectUrl });
  return res.end();
}
