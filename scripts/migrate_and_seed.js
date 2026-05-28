import fs from 'fs';
import path from 'path';

const isLocal = process.argv.includes('local');
const PB_URL = isLocal ? 'http://127.0.0.1:8095' : 'http://103.126.117.20:8095';
const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Skomindo2026Admin';

// YAML Frontmatter Parser
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: content.trim() };
  }
  const yamlBlock = match[1];
  const body = match[2].trim();
  const frontmatter = {};
  
  const lines = yamlBlock.split('\n');
  let currentKey = null;
  let currentArray = null;
  
  for (let line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    
    const matchIndent = line.match(/^(\s*)/);
    const indent = matchIndent ? matchIndent[1].length : 0;
    const trimmed = line.trim();
    
    if (trimmed.startsWith('-')) {
      const valStr = trimmed.slice(1).trim();
      if (valStr.includes(':')) {
        const colonIdx = valStr.indexOf(':');
        const k = valStr.slice(0, colonIdx).trim();
        const v = valStr.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        const newObj = {};
        newObj[k] = v;
        currentArray.push(newObj);
      } else {
        const val = valStr.replace(/^['"]|['"]$/g, '');
        currentArray.push(val);
      }
      continue;
    }
    
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex !== -1) {
      const key = trimmed.slice(0, colonIndex).trim();
      const val = trimmed.slice(colonIndex + 1).trim();
      
      if (indent >= 2 && currentArray && currentArray.length > 0 && typeof currentArray[currentArray.length - 1] === 'object') {
        let parsedVal = val.replace(/^['"]|['"]$/g, '').trim();
        if (parsedVal.toLowerCase() === 'true') parsedVal = true;
        else if (parsedVal.toLowerCase() === 'false') parsedVal = false;
        else if (!isNaN(parsedVal) && parsedVal !== '') parsedVal = Number(parsedVal);
        
        currentArray[currentArray.length - 1][key] = parsedVal;
      } else {
        if (val === '') {
          currentKey = key;
          currentArray = [];
          frontmatter[key] = currentArray;
        } else {
          currentKey = key;
          currentArray = null;
          
          let parsedVal = val.replace(/^['"]|['"]$/g, '').trim();
          if (parsedVal.toLowerCase() === 'true') parsedVal = true;
          else if (parsedVal.toLowerCase() === 'false') parsedVal = false;
          else if (!isNaN(parsedVal) && parsedVal !== '') parsedVal = Number(parsedVal);
          
          frontmatter[key] = parsedVal;
        }
      }
    }
  }
  
  return { frontmatter, body };
}

async function run() {
  console.log('=== STEP 1: Login to PocketBase ===');
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
  console.log('Login successful!');
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  console.log('\n=== STEP 1.5: Import Schema from pb_schema.json ===');
  const schemaPath = './pocketbase/pb_schema.json';
  if (fs.existsSync(schemaPath)) {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const importRes = await fetch(`${PB_URL}/api/collections/import`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        collections: schema.items,
        deleteMissing: false
      })
    });
    if (importRes.ok) {
      console.log('Successfully imported collections schema!');
    } else {
      console.error('Failed to import collections schema:', await importRes.text());
    }
  } else {
    console.warn('pb_schema.json not found, skipping schema import.');
  }

  console.log('\n=== STEP 2: Recreate Collections (news & courses) with text image fields ===');
  const collectionsRes = await fetch(`${PB_URL}/api/collections`, { headers });
  const collectionsData = await collectionsRes.json();
  const collections = collectionsData.items;

  const newsColl = collections.find(c => c.name === 'news');
  const coursesColl = collections.find(c => c.name === 'courses');

  if (newsColl) {
    const imgField = newsColl.fields.find(f => f.name === 'image');
    if (imgField && imgField.type === 'file') {
      console.log('Deleting news collection to change image field type...');
      const delRes = await fetch(`${PB_URL}/api/collections/${newsColl.id}`, {
        method: 'DELETE',
        headers
      });
      if (delRes.ok) console.log('Successfully deleted news collection.');
      else console.error('Failed to delete news collection:', await delRes.text());
      
      console.log('Creating news collection with text image field...');
      const createRes = await fetch(`${PB_URL}/api/collections`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'news',
          type: 'base',
          listRule: '',
          viewRule: '',
          fields: [
            {"name": "title", "type": "text", "required": true},
            {"name": "slug", "type": "text", "required": true},
            {"name": "date", "type": "date", "required": true},
            {"name": "category", "type": "text", "required": true},
            {"name": "image", "type": "text", "required": false},
            {"name": "description", "type": "text", "required": true},
            {"name": "content", "type": "editor", "required": false},
            {"name": "author", "type": "text", "required": true},
            {"name": "tags", "type": "json", "required": false}
          ]
        })
      });
      if (createRes.ok) console.log('Successfully recreated news collection.');
      else console.error('Failed to recreate news collection:', await createRes.text());
    }
  } else {
    // Recreate news if it doesn't exist
    console.log('News collection does not exist. Creating...');
    const createRes = await fetch(`${PB_URL}/api/collections`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'news',
        type: 'base',
        listRule: '',
        viewRule: '',
        fields: [
          {"name": "title", "type": "text", "required": true},
          {"name": "slug", "type": "text", "required": true},
          {"name": "date", "type": "date", "required": true},
          {"name": "category", "type": "text", "required": true},
          {"name": "image", "type": "text", "required": false},
          {"name": "description", "type": "text", "required": true},
          {"name": "content", "type": "editor", "required": false},
          {"name": "author", "type": "text", "required": true},
          {"name": "tags", "type": "json", "required": false}
        ]
      })
    });
    if (createRes.ok) console.log('Successfully created news collection.');
  }

  // Deleting courses if it is still a file type
  if (coursesColl) {
    const imgField = coursesColl.fields.find(f => f.name === 'image');
    if (imgField && imgField.type === 'file') {
      console.log('Deleting courses collection to change image field type...');
      const delRes = await fetch(`${PB_URL}/api/collections/${coursesColl.id}`, {
        method: 'DELETE',
        headers
      });
      if (delRes.ok) console.log('Successfully deleted courses collection.');
      else console.error('Failed to delete courses collection:', await delRes.text());
      
      console.log('Creating courses collection with text image field...');
      const createRes = await fetch(`${PB_URL}/api/collections`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'courses',
          type: 'base',
          listRule: '',
          viewRule: '',
          fields: [
            {"name": "title", "type": "text", "required": true},
            {"name": "slug", "type": "text", "required": true},
            {"name": "description", "type": "text", "required": true},
            {"name": "content", "type": "editor", "required": false},
            {"name": "price", "type": "number", "required": true},
            {"name": "image", "type": "text", "required": false},
            {"name": "level", "type": "select", "required": true, "values": ["Beginner","Intermediate","Advanced"], "maxSelect": 1},
            {"name": "category", "type": "text", "required": true},
            {"name": "duration", "type": "text", "required": false}
          ]
        })
      });
      if (createRes.ok) console.log('Successfully recreated courses collection.');
      else console.error('Failed to recreate courses collection:', await createRes.text());
    }
  } else {
    // Create courses since it doesn't exist
    console.log('Courses collection does not exist. Creating...');
    const createRes = await fetch(`${PB_URL}/api/collections`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'courses',
        type: 'base',
        listRule: '',
        viewRule: '',
        fields: [
          {"name": "title", "type": "text", "required": true},
          {"name": "slug", "type": "text", "required": true},
          {"name": "description", "type": "text", "required": true},
          {"name": "content", "type": "editor", "required": false},
          {"name": "price", "type": "number", "required": true},
          {"name": "image", "type": "text", "required": false},
          {"name": "level", "type": "select", "required": true, "values": ["Beginner","Intermediate","Advanced"], "maxSelect": 1},
          {"name": "category", "type": "text", "required": true},
          {"name": "duration", "type": "text", "required": false}
        ]
      })
    });
    if (createRes.ok) console.log('Successfully created courses collection.');
    else console.error('Failed to create courses collection:', await createRes.text());
  }

  console.log('\n=== STEP 3: Seeding Profiles ===');
  const profilesDir = './src/content/profiles';
  if (fs.existsSync(profilesDir)) {
    const files = fs.readdirSync(profilesDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const filePath = path.join(profilesDir, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { frontmatter, body } = parseFrontmatter(raw);
      
      const record = { ...frontmatter };
      if (record.email) {
        record.email_address = record.email;
        delete record.email;
      }
      
      const checkRes = await fetch(`${PB_URL}/api/collections/profiles/records?filter=(companyName='${record.companyName}')`, { headers });
      const checkData = await checkRes.json();
      
      if (checkData.items && checkData.items.length > 0) {
        const existing = checkData.items[0];
        console.log(`Profile for ${record.companyName} already exists. Updating...`);
        const updateRes = await fetch(`${PB_URL}/api/collections/profiles/records/${existing.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(record)
        });
        if (updateRes.ok) console.log('Successfully updated profile!');
        else console.error('Failed to update profile:', await updateRes.text());
      } else {
        console.log(`Creating new profile for ${record.companyName}...`);
        const createRes = await fetch(`${PB_URL}/api/collections/profiles/records`, {
          method: 'POST',
          headers,
          body: JSON.stringify(record)
        });
        if (createRes.ok) console.log('Successfully created profile!');
        else console.error('Failed to create profile:', await createRes.text());
      }
    }
  }

  console.log('\n=== STEP 4: Seeding News ===');
  const newsDir = './src/content/news';
  if (fs.existsSync(newsDir)) {
    const files = fs.readdirSync(newsDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const filePath = path.join(newsDir, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { frontmatter, body } = parseFrontmatter(raw);
      
      const slug = file.replace('.md', '');
      const record = {
        title: frontmatter.title,
        slug: slug,
        date: frontmatter.date ? new Date(frontmatter.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        category: frontmatter.category || 'Teknologi',
        image: frontmatter.image || '',
        description: frontmatter.description || '',
        content: body,
        author: frontmatter.author || 'Admin',
        tags: frontmatter.tags || []
      };

      const checkRes = await fetch(`${PB_URL}/api/collections/news/records?filter=(slug='${slug}')`, { headers });
      const checkData = await checkRes.json();

      if (checkData.items && checkData.items.length > 0) {
        const existing = checkData.items[0];
        console.log(`News with slug "${slug}" already exists. Updating...`);
        const updateRes = await fetch(`${PB_URL}/api/collections/news/records/${existing.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(record)
        });
        if (updateRes.ok) console.log(`Successfully updated news: ${record.title}`);
        else console.error(`Failed to update news "${slug}":`, await updateRes.text());
      } else {
        console.log(`Creating new news: ${record.title}...`);
        const createRes = await fetch(`${PB_URL}/api/collections/news/records`, {
          method: 'POST',
          headers,
          body: JSON.stringify(record)
        });
        if (createRes.ok) console.log(`Successfully created news: ${record.title}`);
        else console.error(`Failed to create news "${slug}":`, await createRes.text());
      }
    }
  }

  console.log('\n=== STEP 5: Seeding Courses ===');
  const coursesDir = './src/content/courses';
  if (fs.existsSync(coursesDir)) {
    const files = fs.readdirSync(coursesDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const filePath = path.join(coursesDir, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { frontmatter, body } = parseFrontmatter(raw);
      
      const slug = file.replace('.md', '');
      const record = {
        title: frontmatter.title,
        slug: slug,
        description: frontmatter.description || '',
        content: body,
        price: Number(frontmatter.price) || 0,
        image: frontmatter.image || '',
        level: frontmatter.level || 'Beginner',
        category: frontmatter.category || 'Programming',
        duration: frontmatter.duration || ''
      };

      const checkRes = await fetch(`${PB_URL}/api/collections/courses/records?filter=(slug='${slug}')`, { headers });
      const checkData = await checkRes.json();

      if (checkData.items && checkData.items.length > 0) {
        const existing = checkData.items[0];
        console.log(`Course with slug "${slug}" already exists. Updating...`);
        const updateRes = await fetch(`${PB_URL}/api/collections/courses/records/${existing.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(record)
        });
        if (updateRes.ok) console.log(`Successfully updated course: ${record.title}`);
        else console.error(`Failed to update course "${slug}":`, await updateRes.text());
      } else {
        console.log(`Creating new course: ${record.title}...`);
        const createRes = await fetch(`${PB_URL}/api/collections/courses/records`, {
          method: 'POST',
          headers,
          body: JSON.stringify(record)
        });
        if (createRes.ok) console.log(`Successfully created course: ${record.title}`);
        else console.error(`Failed to create course "${slug}":`, await createRes.text());
      }
    }
  }

  console.log('\n=== ALL SEEDING TASKS COMPLETE! ===');
}

run().catch(console.error);
