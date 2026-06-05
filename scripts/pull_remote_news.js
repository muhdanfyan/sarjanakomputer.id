import fs from 'fs';
import path from 'path';

const REMOTE_PB_URL = 'https://cms.sarjanakomputer.id';
const NEWS_DIR = './src/content/news';

async function pullNews() {
  console.log(`Connecting to ${REMOTE_PB_URL}...`);
  try {
    const res = await fetch(`${REMOTE_PB_URL}/api/collections/news/records?sort=-date&perPage=20`);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }
    const data = await res.json();
    const items = data.items || [];

    if (!fs.existsSync(NEWS_DIR)) {
      fs.mkdirSync(NEWS_DIR, { recursive: true });
    }

    console.log(`Found ${items.length} news items. Saving to ${NEWS_DIR}...`);

    for (const item of items) {
      const slug = item.slug || item.id;
      const filePath = path.join(NEWS_DIR, `${slug}.md`);
      
      const frontmatter = [
        '---',
        `title: "${item.title.replace(/"/g, '\\"')}"`,
        `date: "${item.date.split(' ')[0]}"`,
        `category: "${item.category}"`,
        `author: "${item.author || 'Admin'}"`,
        `description: "${(item.description || '').replace(/"/g, '\\"').replace(/\n/g, ' ')}"`,
        `image: "${item.image || item.imageUrl || ''}"`,
        `tags: ${JSON.stringify(item.tags || [])}`,
        '---',
        '',
        item.content || ''
      ].join('\n');

      fs.writeFileSync(filePath, frontmatter);
      console.log(`Saved: ${slug}.md`);
    }

    console.log('\nSuccess! Remote news pulled and saved locally.');
  } catch (err) {
    console.error('Error pulling news:', err.message);
  }
}

pullNews();
