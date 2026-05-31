---
title: "10 Shortcut VS Code yang Bikin Coding 2x Lebih Cepat"
date: 2026-05-31
category: "VS Code Tips"
image: "/images/news/shortcut-vs-code-produktivitas.png"
description: "10 shortcut VS Code wajib hafal: Ctrl+P, Ctrl+Shift+P, Ctrl+D, Alt+Up/Down, dan lainnya. Lengkap dengan fungsi dan penjelasan praktis."
author: "Aiman"
---

# 10 Shortcut VS Code yang Bikin Coding 2x Lebih Cepat

Halo, para pejuang kode! Aiman lagi-lagi nemuin fenomena menarik: banyak developer yang udah bertahun-tahun pake VS Code tapi masih aja pindah-pindah tab pake mouse. Waduh, padahal shortcut keyboard tuh kayak jurus pamungkas — sekali hafal, produktivitas langsung naik dua kali lipat!

Di artikel ini, Aiman udah ngerangkum 10 shortcut VS Code yang paling sering dipake sehari-hari. Bonus: ada tips tambahan biar shortcut ini nempel di otot ingatan kamu.

## 1. Ctrl+P — Lompat ke File Mana Pun

Pernah ngalamin kebingungan nyari file di project besar? Tekan `Ctrl+P`, ketik nama filenya, dan langsung loncat. Ini shortcut paling sakti — bahkan Aiman lebih sering pake ini daripada file explorer.

```
Cara pakai: Ctrl+P → ketik nama file → Enter
```

**Tips:** Ketik `Ctrl+P` lalu `>` untuk akses Command Palette. Dua shortcut jadi satu!

## 2. Ctrl+Shift+P — Command Palette

Ini jantungnya VS Code. Semua perintah bisa diakses dari sini — dari install extension, ubah tema, sampai format dokumen.

```bash
# Contoh penggunaan:
Ctrl+Shift+P → ketik "Format Document" → Enter
Ctrl+Shift+P → ketik "Preferences: Color Theme" → Enter
```

**Tips:** Hafalkan `Ctrl+Shift+P` dulu. Semua fitur VS Code ada di sini.

## 3. Ctrl+D — Select Multicursor Satu Per Satu

Mau ganti nama variabel di banyak tempat? Pilih satu kata, tekan `Ctrl+D` terus sampai semua instance ke-select, lalu ketik gantinya.

```
Misal: mau ganti "user" jadi "customer" di 5 tempat
Langkah: select kata "user" pertama → Ctrl+D 4x → ketik "customer"
```

## 4. Alt+Arrow Up/Down — Pindah Baris

Pindahin satu baris atau blok kode ke atas/bawah tanpa perlu cut-paste. Ini shortcut favorit Aiman buat ngatur ulang logika kode.

```
Select satu baris → Alt+↑ (pindah ke atas)
Select satu baris → Alt+↓ (pindah ke bawah)
```

## 5. Ctrl+\` (Backtick) — Buka Terminal

Coding sambil buka terminal di panel bawah. Nggak perlu alt-tab lagi ke terminal window terpisah.

```
Ctrl+` → buka/tutup terminal
Ctrl+Shift+` → buka terminal baru di tab terpisah
```

## 6. Ctrl+B — Toggle Sidebar

Butuh fokus penuh ke editor? Tekan `Ctrl+B` buat sembunyiin sidebar. Tekan lagi buat munculin.

```
Ctrl+B → sidebar hilang (mode fokus)
Ctrl+B → sidebar muncul lagi
```

## 7. Ctrl+Shift+L — Select Semua Occurance

Ini versi gede dari Ctrl+D. Semua kata yang sama langsung ke-select dalam satu kali tekan. Cocok buat rename variabel besar-besaran.

```javascript
// Sebelum:
const user = getUser();
const userName = user.name;
const userAge = user.age;

// Pilih "user" → Ctrl+Shift+L → ketik "customer"
// Hasil:
const customer = getCustomer();
const customerName = customer.name;
const customerAge = customer.age;
```

## 8. F12 — Go to Definition

Langsung loncat ke definisi function, class, atau variable. Nggak perlu scrolling manual nyari dimana sebuah fungsi didefinisikan.

```
Kursor di nama fungsi → F12 → langsung ke file definisinya
Alt+← → balik lagi ke posisi sebelumnya
```

## 9. Ctrl+Shift+K — Delete Satu Baris

Mau hapus baris tanpa harus select dari awal? Tekan `Ctrl+Shift+K` — langsung ilang. Jauh lebih cepat daripada select pake mouse terus tekan Delete.

```
Tips: Gabungin sama Alt+↑/↓ buat edit struktur kode super cepat.
Urutan: hapus baris (Ctrl+Shift+K) → pindah baris kosong (Alt+↑/↓)
```

## 10. Ctrl+/ — Toggle Comment

Comment atau uncomment baris/blok kode dalam satu tekan. Cocok buat debugging atau matiin sementara bagian kode.

```javascript
// Select beberapa baris → Ctrl+/ → semua jadi comment:
// const data = await fetchData();
// const result = processData(data);
// console.log(result);

// Tekan Ctrl+/ lagi → balik normal
```

## Tabel Ringkasan 10 Shortcut

| No | Shortcut | Fungsi | Level Penting |
|----|----------|--------|:----:|
| 1 | `Ctrl+P` | Cari dan buka file | ★★★★★ |
| 2 | `Ctrl+Shift+P` | Command Palette | ★★★★★ |
| 3 | `Ctrl+D` | Select multicursor (satu per satu) | ★★★★☆ |
| 4 | `Alt+↑/↓` | Pindah baris | ★★★★☆ |
| 5 | `` Ctrl+` `` | Toggle terminal | ★★★★☆ |
| 6 | `Ctrl+B` | Toggle sidebar | ★★★☆☆ |
| 7 | `Ctrl+Shift+L` | Select semua occurrence | ★★★★☆ |
| 8 | `F12` | Go to definition | ★★★★★ |
| 9 | `Ctrl+Shift+K` | Delete baris | ★★★☆☆ |
| 10 | `Ctrl+/` | Toggle comment | ★★★★★ |

## Tips dari Aiman Biar Cepet Hafal

1. **Tempelin sticky note di monitor** — tulis 3 shortcut yang mau dihafal minggu ini
2. **Matikan mouse selama 1 jam sehari** — paksa diri pake keyboard aja
3. **Gunakan extension "Learn VS Code Shortcuts"** — latihan interaktif
4. **Catat di jurnal coding** — setiap nemu shortcut baru, tulis dan praktekkin 5 kali

## Link & Sumber Daya

Buat kamu yang pengen dalemin lagi soal VS Code, cek repositori tools dan konfigurasi kami:
- [Kategori VS Code Tips](https://repo.sarjanakomputer.id/category/vscode-tips)
- [Kategori Tools Produktivitas](https://repo.sarjanakomputer.id/category/productivity-tools)

---

Gimana? Udah hafal berapa shortcut dari 10 di atas? Coba deh minggu ini komitmen buat hafal 3 baru. Aiman jamin, semenjak pake shortcut ini, tangan kamu bakal ngerasa lebih enteng. Selamat mencoba, sobat kode!
