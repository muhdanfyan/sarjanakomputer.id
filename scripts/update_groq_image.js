import fs from 'fs';

const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Piblajar2020';
const PB_URL = 'https://cms.sarjanakomputer.id';
const TARGET_ID = 'rf8102083ff527d'; // Groq
const IMAGE_PATH = '/Users/pondokit/.gemini/antigravity-ide/brain/8bed539f-a3d8-4eb2-9cc1-8cdfe1951c26/media__1780127630265.jpg';

async function updateGroqImage() {
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
  console.log('Login successful! Uploading local image...');

  try {
    const buffer = fs.readFileSync(IMAGE_PATH);
    const form = new FormData();
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    form.append('image', blob, `groq.jpg`);

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

updateGroqImage();
