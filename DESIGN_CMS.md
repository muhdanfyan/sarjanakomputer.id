# Rancangan CMS Sarjana Komputer Indonesia (Sikomindo)

## 1. Arsitektur & Teknologi
*   **Platform:** Astro JS
*   **Mode:** Hybrid (Halaman CMS menggunakan SSR, halaman publik tetap Static).
*   **Autentikasi:** Google OAuth 2.0.
    *   **Whitelist Email:** `muhdanfyan@gmail.com`, `bisasarjana.com@gmail.com`.
*   **Penyimpanan Data:** Markdown (.md) yang disimpan dalam `src/content/`.
*   **Media/Aset:** Cloudinary (Integrasi API untuk upload gambar).
*   **Visualisasi:** Mermaid.js (Dukungan chart/diagram di dalam Markdown).
*   **Penyimpanan Perubahan:** GitHub API (CMS akan melakukan commit langsung ke repository untuk memicu rebuild di Netlify).

## 2. Struktur Konten (src/content/)

### a. Berita (news)
```yaml
title: "Judul Berita"
pubDate: 2026-05-23
author: "Nama Penulis"
image: "https://res.cloudinary.com/.../image.jpg"
excerpt: "Ringkasan singkat berita..."
tags: ["tech", "education"]
```

### b. Kursus (courses)
```yaml
title: "Nama Kursus"
description: "Deskripsi lengkap kursus"
price: 500000
image: "cloudinary_url"
level: "Beginner/Intermediate/Advanced"
category: "Programming/Design/Marketing"
```

### c. Kelas (classes)
```yaml
name: "Batch 10 - Web Development"
course: "web-development" # slug dari courses
mentor: "Nama Mentor"
startDate: 2026-06-01
status: "Open/Closed"
```

### d. Profil (profiles)
```yaml
companyName: "CV. Sarjana Komputer Indonesia"
address: "Alamat Lengkap"
email: "kontak@sarjanakomputer.id"
phone: "0812..."
socialMedia:
  instagram: "@sarjanakomputer"
```

## 3. Struktur Halaman CMS (src/pages/cms/)
*   `/cms/index.astro`: Dashboard (Statistik singkat & navigasi).
*   `/cms/login.astro`: Halaman Login Google.
*   `/cms/news/index.astro`: Daftar berita.
*   `/cms/news/[slug].astro`: Form Edit/Tambah berita.
*   `/cms/courses/index.astro`: Daftar kursus.
*   `/cms/classes/index.astro`: Daftar kelas.
*   `/cms/assets.astro`: Galeri Cloudinary.

## 4. Fitur Unggulan
*   **Live Preview:** Editor Markdown dengan preview real-time termasuk Mermaid Chart.
*   **Direct Upload:** Drag & drop gambar langsung ke Cloudinary dari dalam CMS.
*   **Audit Log:** Menggunakan commit message GitHub untuk melacak siapa yang mengubah data.

---
**Rencana Implementasi Selanjutnya:**
1. Konfigurasi `src/content/config.ts` untuk skema data.
2. Integrasi Google Auth menggunakan middleware Astro.
3. Pembuatan API route untuk berinteraksi dengan GitHub (Update .md files).
4. Pembuatan UI Dashboard CMS menggunakan Tailwind/Vanilla CSS.
