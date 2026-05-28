import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  const xForwardedHost = context.request.headers.get('x-forwarded-host');
  // Get hostname, remove port if present
  const hostHeader = xForwardedHost || url.hostname;
  const hostname = hostHeader.split(':')[0];
  const pathname = url.pathname;

  // List of subdomains we support
  const subdomains = ['news', 'academy', 'profil', 'aplikasi', 'automasi'];

  // Identify if there is a subdomain
  let subdomain = null;
  
  // For local development, check if it ends with .sarjanakomputer.local
  if (hostname.endsWith('.sarjanakomputer.local')) {
    subdomain = hostname.replace('.sarjanakomputer.local', '');
  } else if (hostname.endsWith('.sarjanakomputer.id')) {
    // For production, check if it ends with .sarjanakomputer.id
    subdomain = hostname.replace('.sarjanakomputer.id', '');
  }

  // If we have a valid subdomain
  if (subdomain && subdomains.includes(subdomain)) {
    // Check if it's a static asset, HMR endpoint, or has a file extension
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
                    pathname.includes('.');

    if (!isAsset) {
      // Rewrite internally: e.g. news.sarjanakomputer.id/ -> /news/
      // news.sarjanakomputer.id/slug -> /news/slug
      // If the path already starts with the subdomain, do not double rewrite
      if (!pathname.startsWith(`/${subdomain}/`) && pathname !== `/${subdomain}`) {
        const targetPath = `/${subdomain}${pathname}`;
        console.log(`[Middleware Rewrite] Hostname: ${hostname}, Subdomain: ${subdomain}, Path: ${pathname} -> ${targetPath}`);
        return context.rewrite(targetPath);
      }
    }
  }

  return next();
});
