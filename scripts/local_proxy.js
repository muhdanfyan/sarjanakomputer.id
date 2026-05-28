// scripts/local_proxy.js
// Lightweight Node.js reverse proxy for local subdomain development

const http = require('http');

const PORT = 8080;
const ASTRO_PORT = 4321;
const POCKETBASE_PORT = 8095;

const server = http.createServer((req, res) => {
  const hostHeader = req.headers.host || '';
  const host = hostHeader.split(':')[0]; // remove port if present
  
  let targetPort = ASTRO_PORT;
  let targetPath = req.url;

  if (host === 'cms.sarjanakomputer.local') {
    targetPort = POCKETBASE_PORT;
  } else if (host.endsWith('.sarjanakomputer.local')) {
    const subdomain = host.replace('.sarjanakomputer.local', '');
    const validSubdomains = ['news', 'academy', 'profil', 'aplikasi', 'automasi'];
    
    if (validSubdomains.includes(subdomain)) {
      // Parse pathname
      const urlParts = req.url.split('?');
      const pathname = urlParts[0];
      const query = urlParts[1] ? '?' + urlParts[1] : '';

      // We should NOT rewrite static assets or Vite internal HMR endpoints
      const isAsset = pathname.startsWith('/_astro/') || 
                      pathname.startsWith('/images/') || 
                      pathname.startsWith('/css/') || 
                      pathname.startsWith('/fonts/') ||
                      pathname.startsWith('/@vite/') || 
                      pathname.startsWith('/@fs/') ||
                      pathname.startsWith('/node_modules/') ||
                      pathname === '/favicon.ico' ||
                      pathname === '/manifest.json' ||
                      pathname === '/sw.js' ||
                      pathname.includes('.'); // has file extension (e.g. png, css, js)

      if (!isAsset) {
        // Rewrite internally: e.g. / -> /news/
        // If it already starts with the subdomain, do not double-prepend
        if (!pathname.startsWith(`/${subdomain}/`) && pathname !== `/${subdomain}`) {
          targetPath = `/${subdomain}${pathname}${query}`;
        }
      }
    }
  }

  // Set up proxy request headers
  const headers = { ...req.headers };
  headers.host = `127.0.0.1:${targetPort}`;
  headers['x-forwarded-host'] = hostHeader;
  headers['x-forwarded-proto'] = 'http';

  const options = {
    hostname: '127.0.0.1',
    port: targetPort,
    path: targetPath,
    method: req.method,
    headers: headers
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error(`Proxy error forwarding ${req.method} ${hostHeader}${req.url} to 127.0.0.1:${targetPort}:`, err.message);
    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Bad Gateway: Gagal menghubungi service lokal pada port ${targetPort}. Apakah service tersebut sudah berjalan?`);
  });

  req.pipe(proxyReq, { end: true });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Local Subdomain Proxy berjalan pada http://localhost:${PORT}`);
  console.log(`Pastikan Anda telah menambahkan domain-domain berikut di /etc/hosts:`);
  console.log(`127.0.0.1 sarjanakomputer.local news.sarjanakomputer.local academy.sarjanakomputer.local profil.sarjanakomputer.local aplikasi.sarjanakomputer.local automasi.sarjanakomputer.local cms.sarjanakomputer.local`);
  console.log(`======================================================\n`);
});
