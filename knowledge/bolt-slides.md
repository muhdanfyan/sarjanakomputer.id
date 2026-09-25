# Bolt Slides - Presentasi sebagai Web App

**Repo:** https://github.com/stackblitz/bolt-slides
**Stars:** 1k+ | **License:** MIT | **Bahasa:** TypeScript
**Dibuat:** Juli 2026 | **Pengembang:** StackBlitz

## Apa Itu Bolt Slides?

Bolt Slides adalah framework open-source untuk membuat **presentasi yang merupakan web app hidup**, bukan file PowerPoint statis. Satu prompt ke AI agent → agent menyusun deck di mana **setiap slide adalah halaman web React** yang responsif.

Filosofinya: AI untuk slide biasanya menghasilkan output "slop" — layout generik, dinding bullet. Bolt Slides menyediakan building blocks yang bisa disusun agent (Claude Code, Codex, Cursor, Bolt) menjadi presentasi dengan layout bespoke, tipografi nyata, animasi terencana, dan elemen interaktif apa pun.

## Kenapa Berbeda dari Tools Presentasi AI Lain (Gamma, Tome)

| Aspek | Bolt Slides | Tools biasa |
|-------|-------------|-------------|
| **Output** | Web app React — bisa interaktif, animasi, 3D, data live | Slide statis / gambar |
| **Distribusi** | Jalan di browser, share cukup link | File yang harus dibuka aplikasi |
| **Kustomisasi** | Slide = komponen React, bisa apa saja yang bisa dibangun untuk web | Terbatas template |
| **Biaya** | Gratis, MIT, bisa self-host lokal | Langganan bulanan |
| **Interaktivitas** | Prototipe yang bisa diklik, chart animasi, visualisasi 3D | Terbatas |

## Fitur Unggulan

| Fitur | Keterangan |
|-------|-----------|
| **Agent-first** | Satu prompt ke AI agent → deck selesai. Ada skill bawaan (`.bolt/skills/slides/SKILL.md`) yang mengajarkan agent cara theming & komposisi |
| **Slide = React component** | Kalau bisa dibangun untuk web, bisa dipresentasikan. Fetch data live, mount 3D scene, embed produk asli |
| **Build steps** | `<Build at={n}>` — konten muncul pada klik ke-n, bisa maju & mundur |
| **Mode Presenter** | Tab kedua tersinkron via `BroadcastChannel`: timer, preview slide berikutnya, catatan yang bisa diedit saat presentasi |
| **Anotasi content-anchored** | Coretan pada sebuah statistik di laptop tetap melingkari statistik yang sama di HP, di mana pun layoutnya bergeser. Persist per slide |
| **Grid view & sidebar** | `G` untuk lihat semua slide sekaligus, `S` untuk rail thumbnail |
| **Deep links** | URL hash melacak slide (`/#7`) — bisa share link langsung ke slide tertentu |
| **Timeline/animasi** | Animasi dan transisi terencana, bukan tempelan |

## Navigasi Keyboard

| Key | Aksi |
|-----|------|
| `→` `↓` `Space` | Slide berikutnya (build dulu) |
| `←` `↑` | Slide sebelumnya (rewind build) |
| `Home` / `End` | Slide pertama / terakhir |
| `S` | Sidebar — rail thumbnail |
| `G` | Grid view — semua slide sekaligus |
| `A` | Anotasi — pen, highlighter, shapes, eraser |
| `F` | Fullscreen |
| `P` | Presenter mode — tab baru tersinkron |
| `H` | Sembunyikan UI |
| `Esc` | Tutup overlay |

## Component Library

| Kategori | Komponen |
|----------|----------|
| **Structure** | `Cover` `Agenda` `Section` `Split` `Bento` `Slide` |
| **Data** | `Charts` (bar · line · donut) `Table` `StatGrid` `BigNumber` `CountUp` `VisualDashboard` |
| **Story** | `Quote` `Contrast` `Comparison` `Timeline` `Steps` `Chat` |
| **Product** | `CodeWindow` `BrowserFrame` `Pricing` `Team` |
| **Flair** | `Globe` `TiltCard` `SpotlightCard` `Marquee` `Accordion` `Tabs` |

Semua responsif, semua didemokan di starter deck bawaan (26 slide demo).

## Cara Pakai

**Dengan AI agent (cara utama):**

```
Buka repo di Bolt → prompt:
"Build me a deck pitching «your thing» to «your audience»."
```

**Manual:**

```bash
git clone https://github.com/stackblitz/bolt-slides
cd bolt-slides
npm install
npm run dev
```

Dev server membuka demo 26 slide yang memakai semua komponen. Hapus slide demo di `src/App.tsx`, tulis deck sendiri.

**Authoring — tiap child dari `<Deck>` adalah satu slide:**

```tsx
<Deck>
  <Cover
    kicker="Acme · Series A"
    title={<span className="accent-text">Acme</span>}
    subtitle="Answers, not dashboards."
    notes="Welcome — set up the problem, then hold a beat."
  />
  <Slide center nav="Thesis">
    <h2 className="headline">Dashboards are everywhere.</h2>
    <Build at={1}>
      <p className="subhead">Acme turns raw events into answers — automatically.</p>
    </Build>
  </Slide>
</Deck>
```

## Theming

Semua warna, font, radius, dan shadow ada di blok `:root` pada `src/styles/tokens.css`. Ganti `--primary` → seluruh deck (termasuk chrome) berubah warna. Ada 9 arah tema siap pakai, dari editorial luxury sampai dark technical.

## Struktur Proyek

```
.bolt/skills/slides/   panduan authoring untuk agent (skill)
src/deck/              engine + chrome — Deck, Slide, Build, Reveal, Annotator
src/components/        library komponen slide
src/styles/            tokens.css (tema) + base.css (style sistem)
src/App.tsx            deck Anda (bawaan: demo komponen)
```

## Relevansi untuk CV Sarjana Komputer

1. **Materi presentasi klien** — proposal & pitch deck E-Government sebagai web app interaktif, lebih meyakinkan dari PDF statis
2. **Deliverable bernilai tambah** — kirim link deck interaktif (bukan lampiran PPT), bisa diakses di browser mana pun tanpa install
3. **Zero biaya langganan** — MIT + bisa self-host, tidak perlu langganan Gamma/Tome untuk tim
4. **Pelatihan IT & SDM** — bahan ajar interaktif untuk program pelatihan (komponen chart, timeline, code window sudah tersedia)
5. **Demo produk** — embed prototipe SIPANDA / E-Retribusi langsung di dalam deck presentasi

---

*Sumber: https://github.com/stackblitz/bolt-slides | Diverifikasi 25 Sep 2026 — 1.029 stars, MIT, TypeScript*
