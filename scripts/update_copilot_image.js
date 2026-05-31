import fs from 'fs';

const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Piblajar2020';
const PB_URL = 'https://cms.sarjanakomputer.id';
const TARGET_ID = 'r7a08cef880c574'; // GitHub Copilot
const IMAGE_PATH = '/Users/pondokit/.gemini/antigravity-ide/brain/2caf3b19-41d4-409b-8bfd-39adbcc37280/media__1780188078347.png';

async function updateCopilotImage() {
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
    const blob = new Blob([buffer], { type: 'image/png' });
    form.append('image', blob, `github-copilot.png`);

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

updateCopilotImage();
