// Vercel Serverless — Decap CMS Auth Proxy
//
// Protocol: Decap CMS GitHub backend opens a popup window to this endpoint
// with query params: ?provider=github&site_id=news.sarjanakomputer.id
//
// Instead of redirecting (which causes browser popup issues), we RETURN
// the auth popup HTML directly with a 200 status. The popup HTML implements
// the full Decap CMS OAuth handshake:
//   1. Send  "authorizing:github"                        → main window echoes back
//   2. Send  "authorization:github:success:{json}"        → main window completes auth
//   3. Close popup

const TOKEN = process.env.DECAP_CMS_TOKEN;

export default async function handler(req, res) {
  if (!TOKEN) {
    return res.status(500).json({ error: 'DECAP_CMS_TOKEN not configured.' });
  }

  const { json } = req.query;

  // JSON response for pre-auth fetch from admin page
  if (json === '1') {
    return res.status(200).json({ token: TOKEN });
  }

  // Return the auth popup HTML directly (no redirect).
  // The popup handles the Decap CMS OAuth handshake protocol.
  const popupHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><title>Authenticating...</title>
<style>
body{font-family:system-ui,sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#f5f5f5;color:#333}
.loader{text-align:center}
.spinner{border:3px solid #e0e0e0;border-top:3px solid #312E5F;border-radius:50%;width:30px;height:30px;animation:spin .8s linear infinite;margin:0 auto 12px}
@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
</style></head>
<body>
<div class="loader"><div class="spinner"></div><p>Authenticating...</p></div>
<script>
(function(){
  var P = "github";
  var T = "${TOKEN}";
  var A = window.opener;

  if (!A) { document.querySelector(".loader p").textContent = "No opener. Close tab."; return; }

  // Listen for handshake echo from main window
  window.addEventListener("message", function L(e) {
    if (e.data === "authorizing:" + P) {
      window.removeEventListener("message", L);
      A.postMessage("authorization:" + P + ":success:" + JSON.stringify({token:T,provider:P}), "*");
      setTimeout(function(){ window.close(); }, 200);
    }
  });

  // Initiate handshake
  A.postMessage("authorizing:" + P, "*");
})();
</script></body></html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(popupHtml);
}
