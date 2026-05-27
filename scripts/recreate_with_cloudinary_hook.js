import fs from 'fs';
import path from 'path';

const PB_URL = 'http://103.126.117.20:8095';
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

  console.log('\n=== STEP 2: Recreate Collections (news & courses) with file image + imageUrl text fields ===');
  const collectionsRes = await fetch(`${PB_URL}/api/collections`, { headers });
  const collectionsData = await collectionsRes.json();
  const collections = collectionsData.items;

  const newsColl = collections.find(c => c.name === 'news');
  const coursesColl = collections.find(c => c.name === 'courses');

  if (newsColl) {
    console.log('Deleting news collection...');
    await fetch(`${PB_URL}/api/collections/${newsColl.id}`, { method: 'DELETE', headers });
  }
  
  console.log('Creating news collection...');
  const createNewsRes = await fetch(`${PB_URL}/api/collections`, {
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
        {"name": "image", "type": "file", "required": false, "options": {"maxSelect": 1, "maxSize": 5242880, "mimeTypes": ["image/jpeg","image/png","image/webp","image/gif","image/svg+xml"]}},
        {"name": "imageUrl", "type": "text", "required": false},
        {"name": "description", "type": "text", "required": true},
        {"name": "content", "type": "editor", "required": false},
        {"name": "author", "type": "text", "required": true},
        {"name": "tags", "type": "json", "required": false}
      ]
    })
  });
  if (createNewsRes.ok) console.log('Successfully created news collection.');
  else console.error('Failed to create news collection:', await createNewsRes.text());

  if (coursesColl) {
    console.log('Deleting courses collection...');
    await fetch(`${PB_URL}/api/collections/${coursesColl.id}`, { method: 'DELETE', headers });
  }

  console.log('Creating courses collection...');
  const createCoursesRes = await fetch(`${PB_URL}/api/collections`, {
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
        {"name": "image", "type": "file", "required": false, "options": {"maxSelect": 1, "maxSize": 5242880, "mimeTypes": ["image/jpeg","image/png","image/webp","image/gif","image/svg+xml"]}},
        {"name": "imageUrl", "type": "text", "required": false},
        {"name": "level", "type": "select", "required": true, "values": ["Beginner","Intermediate","Advanced"], "maxSelect": 1},
        {"name": "category", "type": "text", "required": true},
        {"name": "duration", "type": "text", "required": false}
      ]
    })
  });
  if (createCoursesRes.ok) console.log('Successfully created courses collection.');
  else console.error('Failed to create courses collection:', await createCoursesRes.text());

  console.log('\n=== STEP 3: Seeding News to new schema ===');
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
        image: '', // keep file field empty during seeding
        imageUrl: frontmatter.image || '', // put markdown image string path into imageUrl!
        description: frontmatter.description || '',
        content: body,
        author: frontmatter.author || 'Admin',
        tags: frontmatter.tags || []
      };

      const createRes = await fetch(`${PB_URL}/api/collections/news/records`, {
        method: 'POST',
        headers,
        body: JSON.stringify(record)
      });
      if (createRes.ok) console.log(`Successfully seeded news: ${record.title}`);
      else console.error(`Failed to seed news "${slug}":`, await createRes.text());
    }
  }

  console.log('\n=== STEP 4: Seeding Courses to new schema ===');
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
        image: '', // keep file field empty
        imageUrl: frontmatter.image || '', // put cloudinary URL into imageUrl!
        level: frontmatter.level || 'Beginner',
        category: frontmatter.category || 'Programming',
        duration: frontmatter.duration || ''
      };

      const createRes = await fetch(`${PB_URL}/api/collections/courses/records`, {
        method: 'POST',
        headers,
        body: JSON.stringify(record)
      });
      if (createRes.ok) console.log(`Successfully seeded course: ${record.title}`);
      else console.error(`Failed to seed course "${slug}":`, await createRes.text());
    }
  }

  console.log('\n=== ALL RECREATION AND SEEDING COMPLETE! ===');
}

run().catch(console.error);
