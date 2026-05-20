# Arsitektur Website

## Domain Utama: `sarjanakomputer.id`

### Halaman
| Halaman | File | Keterangan |
|---------|------|------------|
| Beranda | `html/index.html` | Hero, tentang, layanan, proyek, tim, stats, kontak |
| Tentang | `html/about.html` | Profil perusahaan, visi misi |
| Layanan | `html/services.html` | Detail layanan lengkap |
| Kontak | `html/contact.html` | Form kontak + info |
| Struktur Organisasi | `html/struktur-organisasi.html` | Struktur perusahaan & tim |

### Subdomain (Rencana)
| Subdomain | Tujuan | Status |
|-----------|--------|--------|
| `profil.sarjanakomputer.id` | Company profile resmi | 📝 Rencana |
| `academy.sarjanakomputer.id` | Sarjana Komputer Academy | 📝 Rencana |
| `blog.sarjanakomputer.id` | Tech News & blog | 📝 Rencana |

### Teknologi
- **Frontend:** HTML5, CSS3, Bootstrap 5.3, AOS Animation
- **Icons:** Bootstrap Icons
- **Font:** Inter + Plus Jakarta Sans (Google Fonts)
- **Form:** Formspree (contact form backend)
- **Deploy:** Vercel (auto-deploy dari GitHub)
- **CDN/DNS:** Cloudflare (proxy, SSL)

### Repo GitHub
- **URL:** https://github.com/muhdanfyan/sarjanakomputer.id
- **Struktur:**
  ```
  sarjanakomputer.id/
  ├── vercel.json              # Konfigurasi Vercel
  ├── README.md                # Info repo
  ├── knowledge/               # Knowledge base & dokumentasi
  │   ├── README.md
  │   ├── company-profile.md
  │   ├── team.md
  │   ├── services.md
  │   ├── roadmap.md
  │   ├── website-structure.md
  │   ├── academy.md
  │   ├── automation.md
  │   └── tech-news.md
  └── html/                    # Website files
      ├── index.html           # Halaman utama
      ├── about.html           # Tentang
      ├── services.html        # Layanan
      ├── contact.html         # Kontak
      ├── struktur-organisasi.html  # Struktur organisasi
      ├── images/              # Asset gambar
      │   ├── logo.png
      │   ├── footer_logo.png
      │   ├── team/            # Foto personil
      │   └── ...
      └── ...
  ```
