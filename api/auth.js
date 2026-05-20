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

  // Navigate to the dedicated auth_popup page (not the main admin page).
  // auth_popup.html reads the token from URL hash and sends it to the
  // main Decap CMS window via window.opener.postMessage, then closes.
  // This avoids React Router's hash history corrupting the #access_token param.
  const redirectUrl = `/news/admin/auth_popup.html#access_token=${TOKEN}`;
  res.writeHead(302, { Location: redirectUrl });
  return res.end();
}
