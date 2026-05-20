export default function handler(req, res) {
  const token = process.env.DECAP_CMS_TOKEN;
  res.json({
    hasToken: !!token,
    tokenPrefix: token ? token.substring(0, 5) + '...' : null,
    tokenLength: token ? token.length : 0,
    nodeEnv: process.env.NODE_ENV
  });
}
