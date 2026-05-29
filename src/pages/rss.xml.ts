import type { APIRoute } from 'astro';
import { PB_URL } from '../utils/config';

interface NewsItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  imageUrl?: string;
  image?: string;
  content: string;
}

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatPubDate(dateStr: string): string {
  if (!dateStr) return new Date().toUTCString();
  return new Date(dateStr).toUTCString();
}

function stripHtml(str: string): string {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

function truncate(str: string, maxLen: number): string {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen).replace(/\s+\S*$/, '') + '...';
}

export const GET: APIRoute = async () => {
  let newsItems: NewsItem[] = [];
  try {
    const res = await fetch(
      `${PB_URL}/api/collections/news/records?sort=-date&perPage=20`,
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await res.json();
    newsItems = data.items || [];
  } catch (err) {
    console.error('RSS fetch error:', err);
  }

  const siteUrl = 'https://sarjanakomputer.id';
  const newsUrl = 'https://news.sarjanakomputer.id';

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>SKI News — Portal Berita Teknologi</title>
    <link>${newsUrl}/</link>
    <description>Portal berita teknologi Indonesia dari Sarjana Komputer Indonesia. Update AI, web development, cybersecurity, cloud computing, startup, dan pendidikan IT.</description>
    <language>id</language>
    <lastBuildDate>${formatPubDate(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${newsUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <generator>Astro + PocketBase</generator>
    <image>
      <url>${siteUrl}/images/logo.png</url>
      <title>SKI News — Portal Berita Teknologi</title>
      <link>${newsUrl}/</link>
      <width>144</width>
      <height>144</height>
    </image>
`;

  for (const news of newsItems) {
    const slug = news.slug;
    if (!slug) continue;
    const articleUrl = `${newsUrl}/${slug}`;
    const pubDate = formatPubDate(news.date);
    const description = escapeXml(truncate(stripHtml(news.description || news.content || ''), 500));
    const title = escapeXml(news.title || '');
    const author = escapeXml(news.author || 'Tim SKI');
    const category = escapeXml(news.category || 'Teknologi');
    const imageUrl = news.imageUrl || `${siteUrl}/images/logo.png`;

    xml += `    <item>
      <title>${title}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      <dc:creator><![CDATA[${author}]]></dc:creator>
      <category>${category}</category>
      <media:content url="${escapeXml(imageUrl)}" medium="image"/>
    </item>
`;
  }

  xml += `  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
