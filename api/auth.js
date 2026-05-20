// Vercel Serverless — OAuth proxy untuk Decap CMS
// Setup: buat GitHub OAuth App di https://github.com/settings/developers
// lalu set env vars di Vercel: GITHUB_CLIENT_ID + GITHUB_CLIENT_SECRET

const CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';

export default async function handler(req, res) {
  const { type, code } = req.query;

  if (type === 'login') {
    // Redirect ke GitHub OAuth
    const redirect = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${process.env.VERCEL_URL}/api/auth&scope=repo,user`;
    res.writeHead(302, { Location: redirect });
    return res.end();
  }

  if (code) {
    // Tukar code → access_token
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code })
    }).then(d => d.json());

    if (r.access_token) {
      // Redirect ke CMS dengan token
      res.writeHead(302, { Location: `/news/admin/#access_token=${r.access_token}` });
      return res.end();
    }
  }

  res.status(400).json({ error: 'Missing or invalid code' });
}
