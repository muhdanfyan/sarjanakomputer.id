import fs from 'fs';

const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Piblajar2020';
const PB_URL = 'https://cms.sarjanakomputer.id';

const newsImages = {
  "kk3esg0k2l9n0vi": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80&fit=crop", // Dampak AI
  "wgzo9uztzrhd5pc": "https://images.unsplash.com/photo-1523240795649-4754bba46c59?w=800&q=80&fit=crop", // Beasiswa
  "18rz1omojascdrz": "https://images.unsplash.com/photo-1554224155616-ee525048bc95?w=800&q=80&fit=crop", // Gaji
  "kmtnciohsj0ie41": "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&q=80&fit=crop", // Portofolio
  "6lnzyq2x0zf8p15": "https://images.unsplash.com/photo-1456324534001-1e54bc2d98c5?w=800&q=80&fit=crop", // Skripsi
  "vga277u6tkip2c2": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&fit=crop", // Portal Berita
  "2yvz38qscwgb8s9": "https://images.unsplash.com/photo-1507679782531-1e7a53c30663?w=800&q=80&fit=crop", // Sertifikasi
  "hgkjtvrwxw5lioz": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80&fit=crop", // Skill
  "33b3p6hzzgz0i93": "https://images.unsplash.com/photo-1497215458999-73e449cdb6ee?w=800&q=80&fit=crop", // Startup vs Besar
  "r1dd016mpkuloba": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&fit=crop", // Interview
  "r1dce6c475a0439": "https://images.unsplash.com/photo-1677442136019-21780868c03e?w=800&q=80&fit=crop", // Devin AI
  "r0d814ff74a637d": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80&fit=crop", // Trading Saham
  "r0cd28cc370c863": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80&fit=crop", // YouTube Label
  "r372bdcaea00afe": "https://images.unsplash.com/photo-1550751827438-fa04cb5622b7?w=800&q=80&fit=crop", // OpenRouter
  "rb0d60a579e74aa": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80&fit=crop", // Smart City
  "r4eb8552cc24586": "https://images.unsplash.com/photo-1573164713619-23cb7112003c?w=800&q=80&fit=crop", // CEO Devin
  "rf8102083ff527d": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&fit=crop", // Chip Groq
  "r083750aadef53f": "https://images.unsplash.com/photo-1592503254549-470f19c961e6?w=800&q=80&fit=crop", // XCENA Chip
  "rabbc9c59b72e8c": "https://images.unsplash.com/photo-1555949963916-dd59714ebbef?w=800&q=80&fit=crop", // Bumerang AI
  "rcce3ec81bd7797": "https://images.unsplash.com/photo-1633158829585-23ba8b7c80af?w=800&q=80&fit=crop"  // Opus
};

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
  console.log('Login successful! Downloading and uploading images...');

  const entries = Object.entries(newsImages);
  for (const [id, imageUrl] of entries) {
    try {
      const imgRes = await fetch(imageUrl);
      const buffer = await imgRes.arrayBuffer();
      
      const form = new FormData();
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      form.append('image', blob, `${id}.jpg`);

      const res = await fetch(`${PB_URL}/api/collections/news/records/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
      });
      if (res.ok) {
        console.log(`Updated ${id} with image successfully.`);
      } else {
        console.error(`Failed to update ${id}: ${await res.text()}`);
      }
    } catch (e) {
      console.error(`Error updating ${id}: ${e.message}`);
    }
  }
}

updateImages();
