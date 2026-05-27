// pb_hooks/custom_admin.pb.js
// Intercepts the Admin UI path to dynamically inject Sarjana Komputer branding

routerUse((e) => {
  const path = e.request.url.path;

  // Intercept the Admin UI main page
  if (path === '/_/') {
    // Check if the request is from our own http client call to avoid infinite recursion
    const isFromHook = e.request.header.get('X-From-Hook');
    if (isFromHook === 'true') {
      return e.next(); // Proceed to default handler which serves the original HTML
    }

    let originalHtml = '';
    try {
      // Fetch the original index.html from PocketBase local port with bypass header
      const res = $http.send({
        url: 'http://127.0.0.1:8090/_/',
        method: 'GET',
        headers: {
          'X-From-Hook': 'true'
        }
      });
      
      if (res.statusCode === 200) {
        originalHtml = res.raw;
      } else {
        console.log('Failed to fetch default admin index in middleware: ' + res.statusCode);
      }
    } catch (err) {
      console.log('Error fetching default admin index in middleware: ' + err);
    }

    if (originalHtml) {
      const brandLogoUrl = "https://sarjanakomputer.id/images/logo.png";
      
      // Inject script to dynamically swap logo and favicon in DOM
      const injectScript = `
      <script>
        (function() {
          const brandLogoUrl = "https://sarjanakomputer.id/images/logo.png";
          
          function setFavicon() {
            let link = document.querySelector("link[rel*='icon']");
            if (!link) {
              link = document.createElement('link');
              link.type = 'image/png';
              link.rel = 'shortcut icon';
              document.head.appendChild(link);
            }
            if (link.href !== brandLogoUrl) {
              link.href = brandLogoUrl;
            }
          }

          function replaceLogos() {
            // A. Target main logo class (header brand logo)
            const mainLogos = document.querySelectorAll('.main-logo');
            mainLogos.forEach(logo => {
              if (logo.tagName === 'IMG') {
                if (logo.src !== brandLogoUrl) logo.src = brandLogoUrl;
              } else if (logo.tagName === 'SVG' || logo.tagName === 'svg') {
                const img = document.createElement('img');
                img.className = logo.className.baseVal || logo.className || 'main-logo';
                img.src = brandLogoUrl;
                img.style.maxHeight = '30px';
                img.style.width = 'auto';
                img.style.objectFit = 'contain';
                logo.replaceWith(img);
              }
            });

            // B. Target PocketBase landing logo (e.g. login screen SVG logo inside pocketbase.io links)
            const links = document.querySelectorAll('a[href*="pocketbase.io"]');
            links.forEach(link => {
              if (link.href.includes('/docs')) return; // skip docs links
              
              const svg = link.querySelector('svg');
              const img = link.querySelector('img');
              
              if (svg) {
                const newImg = document.createElement('img');
                newImg.src = brandLogoUrl;
                newImg.style.maxHeight = '72px';
                newImg.style.width = 'auto';
                newImg.style.objectFit = 'contain';
                svg.replaceWith(newImg);
              } else if (img && img.src !== brandLogoUrl) {
                img.src = brandLogoUrl;
                img.style.maxHeight = '72px';
                img.style.width = 'auto';
              }
            });

            // C. Replace document Title
            if (document.title === 'PocketBase' || document.title.includes('PocketBase')) {
              document.title = document.title.replace('PocketBase', 'CMS Sarjana Komputer');
            }
          }

          // Initial execution
          setFavicon();
          replaceLogos();

          // Monitor DOM changes for dynamic rendering (Single Page Application transitions)
          const observer = new MutationObserver(() => {
            replaceLogos();
            setFavicon();
          });
          
          observer.observe(document.documentElement, {
            childList: true,
            subtree: true
          });

          // Absolute safety interval check
          setInterval(() => {
            replaceLogos();
            setFavicon();
          }, 500);
        })();
      </script>
      `;

      // Modify HTML by adding script before body closing
      const modifiedHtml = originalHtml
        .replace('</head>', `<link rel="shortcut icon" href="${brandLogoUrl}" type="image/png"></head>`)
        .replace('</body>', injectScript + '</body>');

      return e.html(200, modifiedHtml);
    }
  }

  return e.next();
});
