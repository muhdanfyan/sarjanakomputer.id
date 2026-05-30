import fs from 'fs';
import path from 'path';

const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Piblajar2020';
const PB_URL = 'https://cms.sarjanakomputer.id';
const TARGET_ID = 'rb0d60a579e74aa'; // ID of the Bandung Banyuwangi article

async function run() {
  const loginRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: EMAIL, password: PASS })
  });
  
  if (!loginRes.ok) {
    console.error('Failed to login');
    process.exit(1);
  }
  const { token } = await loginRes.json();
  
  // Read the markdown file
  const contentStr = fs.readFileSync(path.join(process.cwd(), 'src/content/news/smart-city-bandung-banyuwangi.md'), 'utf-8');
  
  // Extract body by stripping frontmatter
  const match = contentStr.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const body = match ? match[2].trim() : contentStr;
  
  const title = "Bandung dan Banyuwangi Jadi Rujukan Smart City Indonesia — Inspirasi Digitalisasi Daerah";
  const description = "Bandung dan Banyuwangi dinobatkan sebagai rujukan smart city Indonesia. Pelajaran berharga untuk percepatan digitalisasi di berbagai daerah dan pelosok nusantara.";
  
  const res = await fetch(`${PB_URL}/api/collections/news/records/${TARGET_ID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: title,
      description: description,
      content: body
    })
  });
  
  if (res.ok) {
    console.log('Successfully updated article content on CMS.');
  } else {
    console.error('Failed to update article:', await res.text());
  }
}

run();
