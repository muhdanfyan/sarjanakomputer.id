import type { APIRoute } from 'astro';
import { PB_URL } from '../utils/config';

interface NewsItem {
  slug: string;
  date: string;
  title: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatLastmod(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  return new Date(dateStr).toISOString().split('T')[0];
}

export const GET: APIRoute = async () => {
  // Fetch all news from PocketBase
  let newsItems: NewsItem[] = [];
  try {
    const res = await fetch(
      `${PB_URL}/api/collections/news/records?sort=-date&perPage=200`,
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await res.json();
    newsItems = data.items || [];
  } catch (err) {
    console.error('Sitemap fetch error:', err);
  }

  const today = new Date().toISOString().split('T')[0];

  // Build XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // 1. Main domain pages
  const mainPages = [
    { loc: 'https://sarjanakomputer.id/', priority: '1.0', changefreq: 'weekly', lastmod: today },
    { loc: 'https://sarjanakomputer.id/about/', priority: '0.7', changefreq: 'monthly', lastmod: today },
    { loc: 'https://sarjanakomputer.id/contact/', priority: '0.6', changefreq: 'monthly', lastmod: today },
    { loc: 'https://sarjanakomputer.id/services/', priority: '0.7', changefreq: 'monthly', lastmod: today },
    { loc: 'https://sarjanakomputer.id/struktur-organisasi/', priority: '0.5', changefreq: 'yearly', lastmod: today },
  ];

  for (const page of mainPages) {
    xml += `  <url>
    <loc>${escapeXml(page.loc)}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  // 2. Subdomain root pages
  const subdomains = [
    { loc: 'https://profil.sarjanakomputer.id/', priority: '0.9', changefreq: 'monthly' },
    { loc: 'https://aplikasi.sarjanakomputer.id/', priority: '0.9', changefreq: 'monthly' },
    { loc: 'https://automasi.sarjanakomputer.id/', priority: '0.8', changefreq: 'monthly' },
    { loc: 'https://academy.sarjanakomputer.id/', priority: '0.9', changefreq: 'monthly' },
    { loc: 'https://news.sarjanakomputer.id/', priority: '0.9', changefreq: 'daily' },
  ];

  for (const sub of subdomains) {
    xml += `  <url>
    <loc>${escapeXml(sub.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${sub.changefreq}</changefreq>
    <priority>${sub.priority}</priority>
  </url>
`;
  }

  // 3. News category pages
  const categories = ['teknologi', 'pendidikan', 'bisnis', 'startup'];
  for (const cat of categories) {
    xml += `  <url>
    <loc>https://news.sarjanakomputer.id/kategori/${escapeXml(cat)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  // 4. Each news article from PocketBase
  for (const news of newsItems) {
    const slug = news.slug;
    if (!slug) continue;
    const lastmod = formatLastmod(news.date);
    xml += `  <url>
    <loc>https://news.sarjanakomputer.id/${escapeXml(slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
