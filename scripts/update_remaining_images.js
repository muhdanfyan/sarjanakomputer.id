import fs from 'fs';

const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Piblajar2020';
const PB_URL = 'https://cms.sarjanakomputer.id';

const uploads = [
  {
    id: 'rabbc9c59b72e8c', // Bumerang AI
    path: '/Users/pondokit/.gemini/antigravity-ide/brain/8bed539f-a3d8-4eb2-9cc1-8cdfe1951c26/media__1780127837799.png',
    filename: 'bumerang.png',
    mime: 'image/png'
  },
  {
    id: 'r0d814ff74a637d', // Robinhood
    path: '/Users/pondokit/.gemini/antigravity-ide/brain/8bed539f-a3d8-4eb2-9cc1-8cdfe1951c26/media__1780127912108.png',
    filename: 'robinhood.png',
    mime: 'image/png'
  }
];

async function updateImages() {
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
  console.log('Login successful! Uploading local images...');

  for (const item of uploads) {
    try {
      const buffer = fs.readFileSync(item.path);
      const form = new FormData();
      const blob = new Blob([buffer], { type: item.mime });
      form.append('image', blob, item.filename);

      const res = await fetch(`${PB_URL}/api/collections/news/records/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
      });
      if (res.ok) {
        console.log(`Updated ${item.id} with image successfully.`);
      } else {
        console.error(`Failed to update ${item.id}: ${await res.text()}`);
      }
    } catch (e) {
      console.error(`Error updating ${item.id}: ${e.message}`);
    }
  }
}

updateImages();
