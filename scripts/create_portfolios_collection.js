import fs from 'fs';

const target = process.argv[2] || 'local'; // 'local' or 'remote'
const LOCAL_PB_URL = 'http://127.0.0.1:8095';
const REMOTE_PB_URL = 'https://cms.sarjanakomputer.id';

const PB_URL = target === 'remote' ? REMOTE_PB_URL : LOCAL_PB_URL;
const EMAIL = 'admin@sarjanakomputer.id';
// Use Piblajar2020 for local (as requested), Skomindo2026Admin for remote
const PASS = 'Piblajar2020';

async function createPortfolios() {
  console.log(`=== CREATING PORTFOLIOS COLLECTION ON ${target.toUpperCase()} (${PB_URL}) ===`);

  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: EMAIL, password: PASS })
    });

    if (!loginRes.ok) {
      throw new Error(`Login failed: ${await loginRes.text()}`);
    }
    const { token } = await loginRes.json();
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 2. Check if collection exists
    const checkRes = await fetch(`${PB_URL}/api/collections/portfolios`, { headers });
    if (checkRes.ok) {
      console.log('Collection "portfolios" already exists. Updating schema is not implemented in this script to prevent data loss.');
      // Optional: implement schema update if needed
      return;
    }

    // 3. Create Collection
    console.log('Creating "portfolios" collection...');
    const schema = {
      name: 'portfolios',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null, // Admin only by default
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'description', type: 'text' },
        { name: 'content', type: 'editor' },
        { 
          name: 'mainImage', 
          type: 'file', 
          required: true, 
          maxSelect: 1, 
          options: { maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'] } 
        },
        { 
          name: 'gallery', 
          type: 'file', 
          maxSelect: 10, 
          options: { maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'] } 
        },
        { name: 'clientName', type: 'text' },
        { 
          name: 'clientLogo', 
          type: 'file', 
          maxSelect: 1, 
          options: { maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'] } 
        },
        { name: 'clientDetails', type: 'text' },
        { name: 'completionDate', type: 'date' },
        { name: 'tags', type: 'json' }
      ]
    };

    const createRes = await fetch(`${PB_URL}/api/collections`, {
      method: 'POST',
      headers,
      body: JSON.stringify(schema)
    });

    if (createRes.ok) {
      console.log('Successfully created "portfolios" collection!');
    } else {
      throw new Error(`Failed to create collection: ${await createRes.text()}`);
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

createPortfolios();
