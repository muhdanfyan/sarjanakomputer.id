import fs from 'fs';

const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Piblajar2020';
const PB_URL = 'https://cms.sarjanakomputer.id';

async function fixCorruptedIds() {
  console.log('Logging in...');
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
  console.log('Login successful! Fetching news records...');

  const recordsRes = await fetch(`${PB_URL}/api/collections/news/records?perPage=500`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!recordsRes.ok) {
    console.error('Failed to fetch records:', await recordsRes.text());
    process.exit(1);
  }

  const data = await recordsRes.json();
  const records = data.items;
  
  console.log(`Found ${records.length} records. Analyzing IDs...`);

  // Regex to check valid PocketBase ID (15 chars, alphanumeric)
  const validIdRegex = /^[a-z0-9]{15}$/i;

  let fixedCount = 0;

  for (const record of records) {
    if (!validIdRegex.test(record.id)) {
      console.log(`\nFound corrupted ID: ${JSON.stringify(record.id)}`);
      console.log(`Record title: ${record.title}`);
      
      // Duplicate record
      const newRecordData = { ...record };
      delete newRecordData.id;
      delete newRecordData.created;
      delete newRecordData.updated;
      delete newRecordData.collectionId;
      delete newRecordData.collectionName;
      // Note: we can't easily duplicate the physical file via JSON API if we don't download it.
      // But we can preserve the imageUrl. PocketBase will just have an empty 'image' field for the new record.
      // If we MUST preserve the 'image' string, we can try to send it, but PocketBase ignores file names in JSON POST.
      // We will just send it as JSON. The frontend uses imageUrl anyway.

      console.log('Creating duplicate record with valid ID...');
      const createRes = await fetch(`${PB_URL}/api/collections/news/records`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRecordData)
      });

      if (!createRes.ok) {
        console.error('Failed to create new record:', await createRes.text());
        continue;
      }
      
      const newRecord = await createRes.json();
      console.log(`Success! New valid ID: ${newRecord.id}`);

      // Now delete the old corrupted record
      console.log(`Deleting old corrupted record...`);
      const deleteRes = await fetch(`${PB_URL}/api/collections/news/records/${encodeURIComponent(record.id)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (deleteRes.ok) {
        console.log(`Corrupted record deleted successfully.`);
        fixedCount++;
      } else {
        console.error(`Failed to delete corrupted record. You might need to delete it manually via SQLite. Error:`, await deleteRes.text());
      }
    }
  }

  console.log(`\nProcess completed. Fixed ${fixedCount} corrupted records.`);
}

fixCorruptedIds();
