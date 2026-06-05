import fs from 'fs';

const target = process.argv[2] || 'local';
const LOCAL_PB_URL = 'http://127.0.0.1:8095';
const REMOTE_PB_URL = 'https://cms.sarjanakomputer.id';

const PB_URL = target === 'remote' ? REMOTE_PB_URL : LOCAL_PB_URL;
const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Piblajar2020';

async function setupAcademy() {
  console.log(`=== SETTING UP ACADEMY (COURSES & CLASSES) ON ${target.toUpperCase()} ===`);

  try {
    // 1. Login
    const loginRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: EMAIL, password: PASS })
    });
    if (!loginRes.ok) throw new Error(`Login failed: ${await loginRes.text()}`);
    const { token } = await loginRes.json();
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    // 2. Update/Create Courses Collection
    console.log('Ensuring "courses" collection is up to date...');
    const coursesCollRes = await fetch(`${PB_URL}/api/collections/courses`, { headers });
    const coursesData = await coursesCollRes.json();

    const courseFields = [
      { name: 'title', type: 'text', required: true },
      { name: 'slug', type: 'text', required: true, unique: true },
      { name: 'description', type: 'text', required: true },
      { name: 'content', type: 'editor' },
      { name: 'price', type: 'number', required: true },
      { 
        name: 'image', 
        type: 'file', 
        maxSelect: 1, 
        options: { maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'] } 
      },
      { name: 'level', type: 'select', required: true, values: ["Beginner", "Intermediate", "Advanced"], maxSelect: 1 },
      { name: 'category', type: 'text', required: true },
      { name: 'duration', type: 'text' },
      { name: 'modules', type: 'json' }
    ];

    if (coursesCollRes.ok) {
      // Update existing
      console.log('Updating "courses" schema...');
      await fetch(`${PB_URL}/api/collections/${coursesData.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ fields: courseFields })
      });
    } else {
      // Create new
      console.log('Creating "courses" collection...');
      await fetch(`${PB_URL}/api/collections`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: 'courses', type: 'base', listRule: '', viewRule: '', fields: courseFields })
      });
    }

    // 3. Update/Create Classes Collection
    console.log('Ensuring "classes" collection is up to date...');
    const classesCollRes = await fetch(`${PB_URL}/api/collections/classes`, { headers });
    const classesData = await classesCollRes.json();

    const classFields = [
      { name: 'name', type: 'text', required: true },
      { name: 'slug', type: 'text', required: true },
      { name: 'course', type: 'text', required: true }, // Simple text for now to match current usage
      { name: 'mentor', type: 'text', required: true },
      { name: 'startDate', type: 'date', required: true },
      { name: 'endDate', type: 'date' },
      { name: 'status', type: 'select', required: true, values: ["Open", "Ongoing", "Closed"], maxSelect: 1 },
      { name: 'capacity', type: 'number' },
      { name: 'registrationLink', type: 'url' }
    ];

    if (classesCollRes.ok) {
      console.log('Updating "classes" schema...');
      await fetch(`${PB_URL}/api/collections/${classesData.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ fields: classFields })
      });
    } else {
      console.log('Creating "classes" collection...');
      await fetch(`${PB_URL}/api/collections`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: 'classes', type: 'base', listRule: '', viewRule: '', fields: classFields })
      });
    }

    // 4. Seeding Sample Data
    console.log('\nSeeding sample data...');

    const sampleCourses = [
      {
        title: "Full-stack Web Development (Astro + PocketBase)",
        slug: "fullstack-web-dev",
        description: "Belajar membangun web modern yang super cepat dengan Astro, Tailwind CSS, dan PocketBase sebagai backend.",
        price: 2500000,
        level: "Beginner",
        category: "Programming",
        duration: "12 Minggu",
        modules: [
          { title: "Dasar Web (HTML/CSS)", topics: ["Semantic HTML", "Flexbox/Grid", "Tailwind CSS"] },
          { title: "JavaScript Modern", topics: ["ES6+", "Async/Await", "DOM Manipulation"] },
          { title: "Astro Fundamentals", topics: ["Static Site Generation", "Islands Architecture", "Content Collections"] },
          { title: "Backend with PocketBase", topics: ["Auth", "Database Schema", "Realtime Update"] }
        ]
      },
      {
        title: "Bimbingan Skripsi & TA (Teknik Informatika)",
        slug: "bimbingan-skripsi",
        description: "Pendampingan intensif dari penentuan judul, pengerjaan aplikasi, hingga simulasi sidang skripsi.",
        price: 3500000,
        level: "Advanced",
        category: "Academic",
        duration: "Sampai Lulus",
        modules: [
          { title: "Analisis & Perancangan", topics: ["UML", "DFD", "ERD", "Metode Penelitian"] },
          { title: "Implementasi Sistem", topics: ["Coding Support", "Database Design", "API Development"] },
          { title: "Penulisan Laporan", topics: ["Bab 1-5", "Daftar Pustaka", "Abstrak"] }
        ]
      }
    ];

    for (const c of sampleCourses) {
      const checkRes = await fetch(`${PB_URL}/api/collections/courses/records?filter=(slug='${c.slug}')`, { headers });
      const checkData = await checkRes.json();
      if (checkData.items.length === 0) {
        console.log(`Seeding course: ${c.title}`);
        await fetch(`${PB_URL}/api/collections/courses/records`, {
          method: 'POST',
          headers,
          body: JSON.stringify(c)
        });
      }
    }

    const sampleClasses = [
      {
        name: "Batch 1 2026",
        slug: "batch-1-2026",
        course: "Full-stack Web Development (Astro + PocketBase)",
        mentor: "Muhdan Fyan",
        startDate: "2026-07-01",
        status: "Open",
        capacity: 20,
        registrationLink: "https://wa.me/6283134086899"
      },
      {
        name: "Reguler Bimbingan Skripsi",
        slug: "reguler-bimbingan",
        course: "Bimbingan Skripsi & TA (Teknik Informatika)",
        mentor: "Arif Rizal",
        startDate: "2026-06-15",
        status: "Ongoing",
        capacity: 10
      }
    ];

    for (const cl of sampleClasses) {
      const checkRes = await fetch(`${PB_URL}/api/collections/classes/records?filter=(slug='${cl.slug}')`, { headers });
      const checkData = await checkRes.json();
      if (checkData.items.length === 0) {
        console.log(`Seeding class: ${cl.name}`);
        await fetch(`${PB_URL}/api/collections/classes/records`, {
          method: 'POST',
          headers,
          body: JSON.stringify(cl)
        });
      }
    }

    console.log('\nAcademy setup and seeding complete!');

  } catch (err) {
    console.error('Error:', err.message);
  }
}

setupAcademy();
