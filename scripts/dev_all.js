// scripts/dev_all.js
// Orchestrates local development: PocketBase (Docker/Native Fallback) + Astro Dev + Local Proxy

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('=== STARTING LOCAL DEVELOPMENT ENVIRONMENT ===');

// Check if Docker is available and active
let useDocker = false;
try {
  execSync('docker info', { stdio: 'ignore' });
  useDocker = true;
  console.log('[System] Docker terdeteksi aktif. Menggunakan Docker Compose untuk PocketBase.');
} catch (e) {
  console.log('[System] Docker tidak aktif atau tidak terinstal. Menggunakan native binary PocketBase sebagai fallback.');
}

if (useDocker) {
  // Ensure docker network 'coolify' exists
  console.log('Checking docker network "coolify"...');
  try {
    execSync('docker network inspect coolify', { stdio: 'ignore' });
    console.log('Docker network "coolify" already exists.');
  } catch (e) {
    console.log('Creating docker network "coolify" locally...');
    try {
      execSync('docker network create coolify');
    } catch (err) {
      console.warn('Warning: Gagal membuat docker network "coolify":', err.message);
    }
  }
}

const processes = [];

function startProcess(name, command, args, cwd) {
  console.log(`[System] Menjalankan ${name}...`);
  const proc = spawn(command, args, { 
    cwd: cwd || process.cwd(),
    shell: true,
    stdio: 'inherit'
  });
  
  proc.on('error', (err) => {
    console.error(`[System] Error pada ${name}:`, err.message);
  });
  
  processes.push({ name, proc });
  return proc;
}

// 2. Start PocketBase
if (useDocker) {
  console.log('[System] Menjalankan PocketBase container via Docker Compose...');
  try {
    execSync('docker compose -f pocketbase/docker-compose.yml up -d', { stdio: 'inherit' });
    console.log('[System] PocketBase berhasil dijalankan di background.');
  } catch (err) {
    console.error('[System] Gagal menjalankan PocketBase via docker compose:', err.message);
  }
} else {
  // Check if native pocketbase binary exists
  const pbPath = path.join(__dirname, '..', 'pocketbase', 'pocketbase');
  if (fs.existsSync(pbPath)) {
    startProcess('PocketBase CMS', pbPath, ['serve', '--http=127.0.0.1:8095'], path.join(__dirname, '..', 'pocketbase'));
  } else {
    console.error('[System] ERROR: Binary PocketBase tidak ditemukan di ./pocketbase/pocketbase.');
    console.error('Silakan jalankan setup atau download manual terlebih dahulu.');
  }
}

// 3. Start Astro Dev Server
startProcess('Astro Dev Server', 'npm', ['run', 'dev']);

// 4. Start Local Subdomain Proxy
startProcess('Local Subdomain Proxy', 'node', ['scripts/local_proxy.js']);

// Handle clean shutdown
let isShuttingDown = false;
function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log('\n[System] Menghentikan semua proses local development...');
  
  // Kill spawned processes
  for (const { name, proc } of processes) {
    console.log(`[System] Menghentikan ${name}...`);
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' });
      } else {
        proc.kill('SIGINT');
      }
    } catch (e) {}
  }
  
  // Stop docker compose if used
  if (useDocker) {
    console.log('[System] Menghentikan PocketBase container...');
    try {
      execSync('docker compose -f pocketbase/docker-compose.yml down', { stdio: 'ignore' });
      console.log('[System] PocketBase container dihentikan.');
    } catch (e) {}
  }
  
  console.log('=== ENVIRONMENT CLEANED AND SHUT DOWN ===');
  process.exit(0);
}

// Register exit handlers
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('SIGHUP', shutdown);
