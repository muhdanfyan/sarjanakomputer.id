---
title: "Cara Melindungi Website dari Serangan Siber untuk Pemula"
date: 2026-05-31
category: "Keamanan Web"
image: "/images/news/cara-lindungi-web-serangan-siber.png"
description: "Panduan keamanan web pemula: HTTPS, CSP, sanitasi input, CSRF token, rate limiting, backup. Lengkap dengan contoh kode langsung pakai."
author: "Aiman"
---

# Cara Melindungi Website dari Serangan Siber untuk Pemula

Halo, sobat keamanan! Aiman yakin, sebagian besar dari kita — termasuk Aiman dulu — lebih fokus bikin fitur daripada mikirin keamanan. "Ah, website kecil, nggak bakal ada yang nyerang." Sampai suatu hari, database tiba-tiba ilang atau website jadi lambat karena traffic bot. Barulah nyesel.

Di artikel ini, Aiman mau ngajak kamu belajar 6 lapisan pertahanan dasar yang WAJIB ada di setiap website. Dari HTTPS sampe backup — semuanya praktis, langsung bisa dipraktekkin.

## 1. HTTPS — Pondasi Keamanan

HTTPS itu kayak pintu pagar rumah. Semua data antara browser dan server dienkripsi. Kalau masih pake HTTP polos, data login, token, bahkan isi chat bisa dibaca siapa aja di jaringan yang sama.

### Cara Implementasi dengan Let's Encrypt (Gratis)

```bash
# Install Certbot di Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d namadomain.com -d www.namadomain.com

# Auto-renew (built-in, nggak perlu mikir)
sudo certbot renew --dry-run
```

**Tips:** Pake Cloudflare juga opsi bagus — SSL gratis, CDN, plus proteksi DDoS dasar.

## 2. Content Security Policy (CSP)

CSP adalah aturan yang bilang ke browser: "script mana yang boleh jalan, mana yang nggak." Ini penting banget buat cegah XSS (Cross-Site Scripting).

```nginx
# Di konfigurasi Nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';" always;
```

```php
// Atau di Laravel — pakai middleware
// app/Http/Middleware/SecurityHeaders.php

public function handle(Request $request, Closure $next)
{
    $response = $next($request);
    
    $response->headers->set('Content-Security-Policy', 
        "default-src 'self'; " .
        "script-src 'self' https://cdn.example.com; " .
        "style-src 'self' 'unsafe-inline'; " .
        "img-src 'self' data:; " .
        "frame-ancestors 'none';"
    );
    
    return $response;
}
```

## 3. Sanitasi Input — Jangan Percaya Sama User

Ini hukum pertama keamanan web: **JANGAN PERNAH percaya sama input user.** Entah itu form komentar, upload file, atau search bar — semuanya bisa jadi celah XSS atau SQL Injection.

```php
// ❌ JANGAN — rentan SQL Injection
$query = "SELECT * FROM users WHERE email = '" . $_POST['email'] . "'";

// ✅ AMAN — pake prepared statement
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
$stmt->execute(['email' => $_POST['email']]);
```

```php
// Sanitasi output di Laravel — Blade otomatis escape
// Tapi tetep hati-hati:

{{ $userInput }}           // ✅ auto-escaped (aman)
{!! $userInput !!}         // ⚠️ raw output (berbahaya — handle dengan purify)

// Kalau perlu raw HTML, pake HTML Purifier:
use HTMLPurifier;

$purifier = new HTMLPurifier();
$safeHtml = $purifier->purify($userInput);
```

## 4. CSRF Token — Pelindung Form

CSRF (Cross-Site Request Forgery) adalah serangan di mana user nggak sengaja ngirim request ke server karena link/script jahat. Solusinya? Token unik di setiap form.

```html
<!-- Laravel — otomatis dengan @csrf -->
<form method="POST" action="/profile">
    @csrf
    <input type="text" name="name">
    <button type="submit">Simpan</button>
</form>
```

```javascript
// Kalau pake API (axios + Laravel)
// Di app.js atau bootstrap.js:
axios.defaults.headers.common['X-CSRF-TOKEN'] = 
    document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Atau fetch API:
fetch('/api/data', {
    method: 'POST',
    headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});
```

## 5. Rate Limiting — Bendung Serangan Bruteforce

Rate limiting mencegah satu IP ngirim request berlebihan dalam waktu singkat. Ini vital buat cegah bruteforce login, DDoS, atau web scraping liar.

```php
// Laravel — built-in rate limiter
// Di App\Http\Kernel atau RouteServiceProvider:

protected $middlewareGroups = [
    'web' => [
        // ... middleware lain
        \Illuminate\Routing\Middleware\ThrottleRequests::class . ':60,1',
    ],
    'api' => [
        \Illuminate\Routing\Middleware\ThrottleRequests::class . ':100,1',
    ],
];

// Atau spesifik per route:
Route::middleware(['throttle:5,1'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});
```

```nginx
# Atau di level Nginx untuk proteksi lebih awal
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

server {
    location /login {
        limit_req zone=login burst=3 nodelay;
        proxy_pass http://backend;
    }
}
```

## 6. Backup — Jaring Pengaman Terakhir

Kalaupun semua lapisan keamanan tembus, backup adalah penyelamat. Aiman pribadi punya prinsip: **"Backup itu bukan opsional — itu harga mati."**

```bash
#!/bin/bash
# Script backup otomatis — simpan di /etc/cron.daily/backup-db

#!/bin/bash
DB_NAME="nama_database"
DB_USER="user_database"
DB_PASS="password_database"
BACKUP_DIR="/var/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Hapus backup lebih dari 7 hari
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

# Upload ke cloud storage (opsional)
# rclone copy $BACKUP_DIR/db_$DATE.sql.gz remote:backups/

echo "Backup selesai: $BACKUP_DIR/db_$DATE.sql.gz"
```

```bash
# Jadwalkan dengan cron
crontab -e
# Tambahkan baris berikut:
0 3 * * * /usr/local/bin/backup-database.sh
```

## Tabel Ringkasan 6 Lapisan Keamanan

| Lapisan | Fungsi | Proteksi Dari | Level Prioritas |
|---------|--------|:-------------:|:---------------:|
| **HTTPS** | Enkripsi data | Sniffing, MITM | ★★★★★ |
| **CSP** | Kontrol eksekusi script | XSS, injection | ★★★★☆ |
| **Sanitasi Input** | Bersihkan input user | SQLi, XSS | ★★★★★ |
| **CSRF Token** | Validasi origin request | CSRF | ★★★★☆ |
| **Rate Limiting** | Batasi request | Bruteforce, DDoS | ★★★★☆ |
| **Backup** | Pemulihan data | Semua jenis serangan | ★★★★★ |

## Checklist Keamanan dari Aiman

- [ ] HTTPS aktif (Let's Encrypt / Cloudflare)
- [ ] CSP header terpasang
- [ ] Semua input user disanitasi
- [ ] CSRF token di setiap form
- [ ] Rate limiter aktif di endpoint login/API
- [ ] Backup otomatis jalan setiap hari
- [ ] Backup diupload ke cloud/lokasi terpisah
- [ ] Update rutin: OS, web server, framework, dependensi

## Link & Sumber Daya

Pelajari lebih lanjut tentang keamanan web di repositori kami:
- [Kategori Keamanan Web](https://repo.sarjanakomputer.id/category/web-security)
- [Kategori Tools DevOps](https://repo.sarjanakomputer.id/category/devops-tools)
- [Kategori Tutorial PHP/Laravel](https://repo.sarjanakomputer.id/category/php-laravel)

---

**Gimana?** Dari 6 poin di atas, mana aja yang udah kamu terapin? Kalau masih ada yang belum, jangan khawatir — mulai dari HTTPS dan backup dulu, dua langkah paling berdampak. Ada pertanyaan atau pengalaman soal keamanan? Yuk diskusi di komentar, Aiman dan teman-teman pasti bantu. Tetap aman ya, sobat kode!
