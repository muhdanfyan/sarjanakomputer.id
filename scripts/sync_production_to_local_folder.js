import fs from 'fs';
import path from 'path';

// Configuration
const REMOTE_PB_URL = 'https://cms.sarjanakomputer.id';
const LOCAL_PB_URL = 'http://127.0.0.1:8095'; // Assuming local PB is running or will be run for this folder
const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Skomindo2026Admin';

const COLLECTIONS = ['news', 'profiles', 'courses', 'classes'];

async function syncAll() {
  console.log(`=== SYNCING ALL COLLECTIONS: ${REMOTE_PB_URL} -> ${LOCAL_PB_URL} ===`);
  
  try {
    // 1. Login to Local PB
    console.log('Logging into local PocketBase...');
    const loginRes = await fetch(`${LOCAL_PB_URL}/api/collections/_superusers/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: EMAIL, password: PASS })
    });

    if (!loginRes.ok) {
      console.error('Local login failed. Please ensure PocketBase is running on 8095 with the target data folder.');
      return;
    }
    const { token } = await loginRes.json();
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    for (const collName of COLLECTIONS) {
      console.log(`\n--- Syncing Collection: ${collName} ---`);
      
      // 2. Fetch from Remote
      const remoteRes = await fetch(`${REMOTE_PB_URL}/api/collections/${collName}/records?perPage=100`);
      if (!remoteRes.ok) {
        console.error(`Failed to fetch ${collName} from remote: ${remoteRes.statusText}`);
        continue;
      }
      const remoteData = await remoteRes.json();
      const items = remoteData.items || [];
      console.log(`Found ${items.length} items on remote.`);

      // 3. Upsert to Local
      for (const item of items) {
        // Unique identifier logic
        let filter = '';
        if (collName === 'news' || collName === 'courses') {
          filter = `(slug='${item.slug}')`;
        } else if (collName === 'profiles') {
          filter = `(companyName='${item.companyName}')`;
        } else {
          filter = `(id='${item.id}')`;
        }

        const checkRes = await fetch(`${LOCAL_PB_URL}/api/collections/${collName}/records?filter=${encodeURIComponent(filter)}`, { headers });
        const checkData = await checkRes.json();
        
        // Prepare clean record (remove system fields)
        const record = { ...item };
        delete record.id;
        delete record.created;
        delete record.updated;
        delete record.collectionId;
        delete record.collectionName;

        if (checkData.items && checkData.items.length > 0) {
          const existing = checkData.items[0];
          console.log(`Updating ${collName}: ${item.slug || item.title || item.id}`);
          await fetch(`${LOCAL_PB_URL}/api/collections/${collName}/records/${existing.id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(record)
          });
        } else {
          console.log(`Creating ${collName}: ${item.slug || item.title || item.id}`);
          await fetch(`${LOCAL_PB_URL}/api/collections/${collName}/records`, {
            method: 'POST',
            headers,
            body: JSON.stringify(record)
          });
        }
      }
    }

    console.log('\n=== ALL SYNC TASKS COMPLETE! ===');
  } catch (err) {
    console.error('Sync Error:', err.message);
  }
}

syncAll();
