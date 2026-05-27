# Panduan Pengelolaan PocketBase & Cloudinary

Dokumen ini menjelaskan cara mengelola skema PocketBase secara lokal di Git, serta cara mengunggah dan mengelola gambar menggunakan **Cloudinary** untuk field image di website Anda.

---

## 1. Sinkronisasi Skema ke Git (Local Repo)

Agar seluruh struktur tabel (*Collections*) PocketBase Anda tersimpan di Git repository lokal dan dapat di-track sejarah perubahannya:

1. **Skema Tersimpan**: File skema terbaru tersimpan di `pocketbase/pb_schema.json`.
2. **Cara Backup/Ekspor Skema dari VPS**:
   Anda bisa mengekspor skema terbaru dari VPS ke repo lokal dengan menjalankan script berikut di terminal lokal Anda:
   ```bash
   node scripts/migrate_and_seed.js
   ```
   *(Script ini otomatis akan mengambil skema terbaru dari database VPS dan memperbarui file `pocketbase/pb_schema.json` Anda).*
3. **Cara Impor Skema ke Instance Baru**:
   Jika Anda membuat PocketBase baru (misal di lokal atau server staging):
   - Masuk ke PocketBase Admin UI.
   - Pergi ke **Settings** -> **Import collections**.
   - Pilih file `pocketbase/pb_schema.json` dan klik **Import**.

---

## 2. Pengelolaan Gambar Menggunakan Cloudinary

Seluruh field gambar (`news.image`, `courses.image`) di database PocketBase didefinisikan sebagai tipe **Text** agar kompatibel dengan URL eksternal (Cloudinary).

### Cara Mengunggah & Memasukkan Gambar:

1. **Unggah ke Cloudinary**: Unggah gambar artikel atau cover kursus Anda ke dashboard Cloudinary Anda.
2. **Salin URL**: Salin URL gambar yang dihasilkan (contoh: `https://res.cloudinary.com/ddhgtgsed/image/upload/v.../sampel.jpg`).
3. **Tempel di PocketBase**: Masukkan URL tersebut langsung pada field `image` di PocketBase Admin UI.

### 🚀 Halaman Upload Gambar Premium di VPS Anda!
Saya telah membuatkan sebuah halaman web uploader khusus yang sangat praktis dan aman di server Anda.
Anda dapat membuka:
👉 **`https://cms.sarjanakomputer.id/upload.html`**

Halaman ini memungkinkan Anda untuk:
- Melakukan **Drag & Drop** gambar secara instan.
- Gambar otomatis terunggah ke Cloudinary Anda.
- Langsung menampilkan **URL Mentah** dan **Markdown Tag** yang siap di-copy untuk ditempelkan ke PocketBase.
