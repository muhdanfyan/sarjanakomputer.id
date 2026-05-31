import fs from 'fs';
import path from 'path';

const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Piblajar2020';
const PB_URL = 'https://cms.sarjanakomputer.id';

const searchText = process.argv[2];
const imagePath = process.argv[3];

if (!searchText || !imagePath) {
  console.error('Usage: node upload_news_image.js "<Search Title>" <path/to/image.png>');
  process.exit(1);
}

async function uploadImage() {
  const loginRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: EMAIL, password: PASS })
  });
  
  if (!loginRes.ok) {
    console.error('Failed to login:', await loginRes.text());
    process.exit(1);
  }
  
  const { token } = await loginRes.json();
  console.log(`Login successful! Finding article matching "${searchText}"...`);

  const recordsRes = await fetch(`${PB_URL}/api/collections/news/records?perPage=500`);
  const recordsData = await recordsRes.json();
  
  const article = recordsData.items.find(item => item.title.toLowerCase().includes(searchText.toLowerCase()));
  
  if (!article) {
    console.error('Could not find article matching search text.');
    process.exit(1);
  }

  const TARGET_ID = article.id;
  console.log(`Found article: "${article.title}" (ID: ${TARGET_ID})`);

  try {
    const buffer = fs.readFileSync(imagePath);
    const form = new FormData();
    const ext = path.extname(imagePath).toLowerCase();
    const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
    const blob = new Blob([buffer], { type: mimeType });
    form.append('image', blob, `uploaded_image${ext}`);

    const res = await fetch(`${PB_URL}/api/collections/news/records/${TARGET_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: form
    });
    if (res.ok) {
      console.log(`Updated ${TARGET_ID} with image successfully.`);
    } else {
      console.error(`Failed to update ${TARGET_ID}: ${await res.text()}`);
    }
  } catch (e) {
    console.error(`Error updating: ${e.message}`);
  }
}

uploadImage();
