---
title: "Fitur Baru Laravel 13 yang Wajib Kamu Coba"
date: 2026-05-31
category: "Laravel"
image: "/images/news/laravel-13-fitur-baru.png"
description: "Eksplorasi fitur baru Laravel 13: performa lebih ngebut, Folio v2, Reverb stabil, artisan canggih, dan banyak lagi. Simak ulasan lengkap Aiman."
author: "Aiman"
---

# Fitur Baru Laravel 13 yang Wajib Kamu Coba

Tahun 2026 menjadi saksi lahirnya Laravel 13 — dan Aiman harus bilang, ini bukan sekadar update biasa. Taylor Otwell dan tim sepertinya dengerin banget keluhan para developer. Mulai dari performa yang lebih ngebut sampai fitur artisan yang makin cerdas, semuanya hadir dengan sentuhan elegan khas Laravel.

Yuk, kita bedah satu per satu fitur baru yang bikin Laravel 13 layak kamu install hari ini juga!

## 1. Performa Routing Lebih Cepat

Laravel 13 menghadirkan mesin routing yang didesain ulang. Hasilnya? Waktu eksekusi routing turun hingga 40% dibanding Laravel 12.

```php
// Laravel 13 — Route cache lebih optimal
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified', 'throttle:60,1']);

// Fitur baru: Route Groups dengan caching otomatis
Route::prefix('admin')->group(function () {
    Route::resource('users', UserController::class);
    Route::resource('posts', PostController::class);
})->withTrashed(); // <-- baru! otomatis include soft deletes
```

**Tips:** Jangan lupa jalankan `php artisan route:cache` setelah update — performanya beda banget!

## 2. Laravel Reverb — Resmi Stabil

Setelah melalui fase beta di L11 dan penyempurnaan di L12, Reverb kini resmi menjadi package inti Laravel 13. WebSocket real-time tanpa Node.js, tanpa dependensi rumit. Tinggal install dan jalan.

```bash
# Install Reverb di Laravel 13
composer require laravel/reverb

# Jalankan server Reverb
php artisan reverb:start --host=0.0.0.0 --port=8080
```

```php
// Broadcasting event dengan Reverb
use App\Events\OrderShipped;

public function ship(Order $order)
{
    // ... proses pengiriman ...
    OrderShipped::dispatch($order);
    
    // Reverb akan push event ke semua client yang subscribe
}
```

## 3. Artisan Commands Makin Cerdas

`php artisan` sekarang punya mode interaktif. Cukup ketik perintah tanpa argumen, dan Artisan bakal nanya step-by-step. Nggak perlu lagi baca manual panjang buat nyari tau parameter apa aja yang dibutuhin.

```
$ php artisan make:model

┌ Laravel 13 Interactive Mode ─────────────────────┐
│ What should the model be named? › Product         │
│ Include migration? (yes/no) › yes                 │
│ Include factory? (yes/no) › yes                   │
│ Include seeder? (yes/no) › no                     │
│ Add relationships? › Category, Tags               │
└──────────────────────────────────────────────────┘

✓ Model created: app/Models/Product.php
✓ Migration created: database/migrations/...
✓ Factory created: database/factories/ProductFactory.php
```

## 4. Folio v2 — Page-Based Routing Lebih Matang

Folio, si router berbasis direktori, hadir dengan versi 2 yang lebih matang. Sekarang support nested layouts, middleware per halaman, dan render cache.

```bash
# Install Folio v2
composer require laravel/folio
php artisan folio:install
```

```
resources/views/pages/
├── index.blade.php           → /
├── auth/
│   ├── login.blade.php       → /auth/login
│   ├── register.blade.php    → /auth/register
│   └── [id]/
│       └── profile.blade.php → /auth/{id}/profile
├── dashboard.blade.php       → /dashboard
└── layouts/
    └── app.blade.php         → layout utama (auto-detected)
```

```php
<?php
 
// Di resources/views/pages/dashboard.blade.php
use function Laravel\Folio\name;
 
name('dashboard');
?>

<x-layouts.app>
    <x-slot:title>Dashboard</x-slot:title>
    
    <h1>Selamat Datang, {{ auth()->user()->name }}!</h1>
    <p>Ini halaman dashboard otomatis dari Folio v2.</p>
</x-layouts.app>
```

## 5. Query Builder dengan Lazy Loading Prevention Bawaan

Laravel 13 kini mendeteksi N+1 query secara otomatis di environment non-production. Nggak perlu install package tambahan kayak Laravel Debugbar cuma buat deteksi ini.

```php
// Sebelum (di L12 — butuh debugbar):
$posts = Post::all(); // N+1! Tapi nggak dikasih tau
foreach ($posts as $post) {
    echo $post->author->name; // query N kali!
}

// Di Laravel 13 — langsung diperingatin:
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name; // ⚠️ Lazy loading detected! 
    // Suggest: use Post::with('author')->get()
}
```

## 6. Prisma-like Schema Builder

Buat yang kangen Prisma, Laravel 13 ngasih Schema Builder gaya baru dengan syntax deklaratif.

```php
// Schema builder baru — deklaratif
Schema::create('projects', function (Blueprint $table) {
    $table->id();
    $table->string('title', 200);
    $table->text('description')->nullable();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->json('metadata')->default(null);
    $table->timestamps();
    $table->softDeletes();
    
    // Fitur baru: composite indexes lebih simpel
    $table->index(['user_id', 'status', 'created_at']);
});
```

## Tabel Perbandingan Laravel 12 vs Laravel 13

| Fitur | Laravel 12 | Laravel 13 |
|-------|:----------:|:----------:|
| Routing Speed | Normal | 40% lebih cepat |
| Reverb | Beta | Stabil (production-ready) |
| Folio | v1 | v2 (nested layouts, cache) |
| Lazy Loading Detection | Pakai package tambahan | Bawaan |
| Artisan | Manual args | Interactive mode |
| Schema Builder | Standar | Deklaratif + composite index |
| PHP Minimum | 8.2 | 8.3 |
| Support Duration | 18 bulan | 24 bulan |

## Cara Upgrade ke Laravel 13

```bash
# Via composer
composer require laravel/framework:^13.0

# Atau project baru
composer create-project laravel/laravel project-baru "^13.0"

# Jangan lupa update dependensi
composer update
```

## Link dan Referensi

Buat yang mau ngulik lebih dalam, Aiman udah siapin resource tambahan:
- [Kategori Laravel](https://repo.sarjanakomputer.id/category/laravel)
- [Kategori Tools Web Development](https://repo.sarjanakomputer.id/category/web-development)

---

**Udah cobain Laravel 13?** Atau masih betah di L12? Aiman pribadi udah migrasi semua project pribadi ke L13 dan jujur — performanya terasa banget. Share pengalaman kamu di komentar ya! Siapa tau kita bisa saling bagi tips upgrade yang mulus. Sampai jumpa di artikel selanjutnya!
