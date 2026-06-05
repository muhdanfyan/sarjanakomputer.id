import fs from 'fs';
import path from 'path';

// Remote (Source)
const REMOTE_PB_URL = 'https://cms.sarjanakomputer.id';

// Local (Destination)
const LOCAL_PB_URL = 'http://127.0.0.1:8095';
const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Skomindo2026Admin';

async function sync() {
  console.log(`=== SYNCING NEWS: ${REMOTE_PB_URL} -> ${LOCAL_PB_URL} ===`);

  try {
    // 1. Get News from Remote
    console.log('Fetching news from remote CMS...');
    const remoteRes = await fetch(`${REMOTE_PB_URL}/api/collections/news/records?sort=-date&perPage=50`);
    if (!remoteRes.ok) throw new Error(`Remote fetch failed: ${remoteRes.statusText}`);
    const remoteData = await remoteRes.json();
    const remoteNews = remoteData.items || [];
    console.log(`Found ${remoteNews.length} items on remote.`);

    // 2. Login to Local PB
    console.log('Logging into local PocketBase...');
    const loginRes = await fetch(`${LOCAL_PB_URL}/api/collections/_superusers/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: EMAIL, password: PASS })
    });

    if (!loginRes.ok) {
      console.error('Local login failed. Is PocketBase running on 8095?');
      return;
    }
    const { token } = await loginRes.json();
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 3. Upsert to Local
    for (const item of remoteNews) {
      // Check if exists locally by slug
      const checkRes = await fetch(`${LOCAL_PB_URL}/api/collections/news/records?filter=(slug='${item.slug}')`, { headers });
      const checkData = await checkRes.json();
      
      const record = {
        title: item.title,
        slug: item.slug,
        date: item.date,
        category: item.category,
        image: item.image || item.imageUrl || '',
        description: item.description,
        content: item.content,
        author: item.author || 'Admin',
        tags: item.tags || []
      };

      if (checkData.items && checkData.items.length > 0) {
        const existing = checkData.items[0];
        console.log(`Updating local news: ${item.slug}`);
        await fetch(`${LOCAL_PB_URL}/api/collections/news/records/${existing.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(record)
        });
      } else {
        console.log(`Creating local news: ${item.slug}`);
        await fetch(`${LOCAL_PB_URL}/api/collections/news/records`, {
          method: 'POST',
          headers,
          body: JSON.stringify(record)
        });
      }
    }

    console.log('\nSync complete! Local PocketBase is now up to date with remote news.');
  } catch (err) {
    console.error('Sync Error:', err.message);
  }
}

sync();
