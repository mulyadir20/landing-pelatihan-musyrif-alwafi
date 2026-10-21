# Landing Page Pelatihan Musyrif Profesional — STIT Al Wafi Bogor

Halaman promosi satu halaman (landing page) untuk kegiatan **Pelatihan Musyrif Profesional**
yang diselenggarakan oleh **STIT Al Wafi Bogor**.

Ringkasan proyek:

- Halaman statis + beberapa interaksi (menu mobile, lightbox brosur, formulir saran & masukan)
- Konfigurasi informasi kegiatan terpusat dalam **satu berkas**
- Siap di-deploy ke **Vercel** sebagai situs statis
- Tanpa database, tanpa API key, tanpa layanan eksternal yang dipaksakan
- Formulir saran & masukan memakai **Google Form** yang di-embed (data disimpan Google)

---

## 1. Teknologi

| Komponen     | Pilihan                                        |
| ------------ | ---------------------------------------------- |
| Framework    | React 19                                       |
| Build tool   | Vite 7                                         |
| Bahasa       | JavaScript (JSX)                              |
| Ikon         | lucide-react                                   |
| Styling      | CSS biasa per komponen + design token global   |
| Font         | Poppins (judul) & Inter (teks) — Google Fonts  |
| Formulir     | Google Form (embed iframe, tinggi adaptif)     |
| Package manager | npm                                       |

Identitas visual (warna navy + aksen emas, netral `#FAF8F5`, font Poppins/Inter) mengikuti
karakter situs referensi [alwafi.ac.id](https://alwafi.ac.id/).

---

## 2. Struktur folder

```
musyrif/
├── brosur.png                        # Sumber flyer asli (tidak dipakai langsung situs)
├── index.html                        # Meta SEO, judul, font
├── package.json
├── vite.config.js
├── vercel.json                       # Konfigurasi deploy Vercel
├── public/
│   ├── favicon.png                   # Ikon tab (dari situs resmi Al Wafi)
│   └── images/
│       ├── logo-stit-al-wafi.png     # Logo resmi STIT Al Wafi (dari alwafi.ac.id)
│       ├── flyer-musyrif.webp        # Flyer utama (tampilan penuh / lightbox)
│       ├── flyer-musyrif-640.webp    # Flyer versi kecil (srcset layar kecil)
│       └── flyer-musyrif-1280.webp   # Flyer versi sedang (srcset layar besar)
├── scripts/
│   └── optimize-assets.py            # Regenerasi aset dari brosur.png (opsional)
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── config/
    │   └── siteConfig.js             # ⭐ SELURUH INFORMASI KEGIATAN
    ├── styles/
    │   ├── tokens.css                # Warna, font, jarak, radius
    │   └── global.css                # Reset, tombol, judul section, utilitas
    └── components/
        ├── Header/                   # Sticky navigation + menu mobile
        ├── HeroSection/              # Judul, tombol CTA, flyer + lightbox
        ├── FacilitiesSection/        # Fasilitas yang didapat peserta
        ├── BenefitsSection/          # Manfaat: Murabbi, Pembina, Pemimpin Santri
        ├── ContactSection/           # Kontak panitia + tombol WhatsApp
        ├── FeedbackForm/             # Embed Google Form saran & masukan
        ├── Footer/
        └── ui/                       # SmartImage, Lightbox, SectionHeading
```

Urutan section di halaman (`src/App.jsx`):

1. **Hero** (`#home`) — judul kegiatan, tanggal/waktu/tempat, tombol **PMB STIT**, flyer + lightbox
2. **Fasilitas yang Didapat** (`#fasilitas`)
3. **Manfaat Pelatihan** (`#manfaat`) — Murabbi, Pembina, Pemimpin Santri
4. **Kontak Panitia** (`#kontak`)
5. **Saran & Masukan** (`#saran-masukan`)
6. **Footer** — logo, kolom Kontak (nomor WhatsApp, alamat), peta lokasi tertanam + tombol
   "Buka di Google Maps", baris hak cipta

> Section "Informasi Pelatihan", "Biaya Pendaftaran", dan "Pendaftaran dan Informasi Pelatihan"
> (dua barcode) dihapus atas permintaan pemilik halaman. Bila ingin dikembalikan, komponennya
> masih tersedia pada riwayat Git (commit `0b3d142`).

---

## 3. Menjalankan secara lokal

Prasyarat: **Node.js 20.19+** (dikembangkan dan diuji pada Node 24) dan **npm**.

```bash
# 1. Instal dependensi
npm install

# 2. Mode pengembangan (http://localhost:5173)
npm run dev

# 3. Build produksi ke folder dist/
npm run build

# 4. Pratinjau hasil build
npm run preview
```

Skrip tambahan:

```bash
npm run optimize:assets  # Regenerasi aset gambar dari brosur.png (butuh Python + Pillow)
```

---

## 4. Mengubah informasi kegiatan

**Semua data kegiatan berada di satu berkas: `src/config/siteConfig.js`.**

Bagian yang sering diperbarui:

| Yang diubah              | Lokasi di `siteConfig.js`            |
| ------------------------ | ------------------------------------ |
| Tanggal, waktu, tempat   | `event`                              |
| Alamat lengkap           | `event.address`                      |
| Biaya (harga coret, dll) | `pricing` (data cadangan, belum ditampilkan di halaman) |
| Fasilitas                | `facilities`                         |
| Manfaat pelatihan        | `benefits`                           |
| Nama & nomor kontak      | `contact`                            |
| Alamat & peta Google Maps| `contact.location`, `contact.map`    |
| Pesan otomatis WhatsApp  | `contact.whatsappMessages`           |
| Menu navigasi            | `navigation`                         |
| Path gambar              | `images`                             |
| Kategori form masukan    | `feedbackCategories`                 |
| URL Google Form masukan  | `feedback.googleFormUrl`             |
| **URL PMB (pendaftaran)**| `PMB_URL` (paling atas pada berkas)  |
| Label tombol pendaftaran | `cta.label` (saat ini "PMB STIT")    |

### URL PMB (pendaftaran)

Saat ini menu **PMB** dan seluruh tombol **PMB STIT** mengarah ke URL pendaftaran resmi:

```
https://siakad.alwafi.ac.id/register
```

URL disimpan pada `PMB_URL` (paling atas pada berkas `siteConfig.js`). Bila suatu saat URL
berubah, cukup ubah satu baris tersebut — komponen mana pun tidak perlu disentuh.

Jika `PMB_URL` dikosongkan kembali, menu PMB dan semua tombol daftar otomatis mengarah ke
section **Kontak** (WhatsApp panitia) sehingga pengguna tetap punya jalur pendaftaran yang valid.

Label kecil **`via WA`** menempel pada menu **Kontak** karena jalur kontak panitia memang melalui
WhatsApp. Label ini diatur lewat properti `badge` pada `navigation` di `siteConfig.js`, sehingga
bisa dipindah atau dihapus tanpa mengubah komponen.

---

## 5. Mengganti gambar

### 5.1 Flyer (brosur)

1. Letakkan flyer baru di `public/images/` (mis. `flyer-musyrif.webp` atau `flyer-musyrif.png`).
2. Bila nama filenya berbeda, ubah `images.flyer.src` (dan `srcSet` bila dipakai) di
   `src/config/siteConfig.js`.
3. Perbarui `images.flyer.width` / `height` agar rasio aspek tetap benar.

Catatan: versi yang tampil sekarang adalah hasil optimasi dari `brosur.png` (2079×2954 px,
3,0 MB) menjadi WebP 1440 px (±245 KB), 1280 px (±193 KB), dan 640 px (±75 KB) agar hemat kuota.
Untuk mengembalikan versi PNG atau membuat versi baru:

```bash
python3 scripts/optimize-assets.py /path/brosur-baru.png
```

Flyer ditampilkan dengan `object-fit: contain` sehingga tidak pernah terpotong, dan dapat
diperbesar lewat lightbox (klik gambar atau tombol "Klik untuk memperbesar", tutup dengan
tombol X atau Esc).

### 5.2 Logo

`public/images/logo-stit-al-wafi.png` adalah **logo resmi** yang diambil dari
`https://alwafi.ac.id/assets/img/stit.png` (230×84 px, PNG transparan berwarna emas).
Karena warna emas transparan, logo dipasang di header dan footer yang berlatar navy agar
kontrasnya baik. Logo tidak diregangkan, dipotong, atau diwarnai ulang.

### 5.3 Aset section yang sudah dihapus (cadangan)

Section "Informasi Pelatihan", "Biaya Pendaftaran", dan "Pendaftaran & Barcode" sudah dihapus
dari halaman, sehingga berkas berikut ikut dihapus karena tidak lagi dipakai:

- `public/images/foto-pembicara-placeholder.jpg`
- `public/images/qr-pendaftaran.png`, `public/images/qr-informasi.png`

Bila suatu saat ingin mengembalikannya:

```bash
git checkout 0b3d142 -- src/components/EventInfo src/components/RegistrationQR src/components/PricingSection
python3 scripts/optimize-assets.py     # memunculkan kembali foto & QR placeholder
```

---

## 6. Formulir Saran & Masukan (Google Form)

Section **Saran & Masukan** menampilkan **Google Form** resmi panitia di dalam halaman
(iframe), sehingga seluruh jawaban disimpan langsung oleh Google — situs ini tidak
memerlukan backend maupun environment variable.

Cara kerjanya:

1. URL form diambil dari menu **Sematkan (Embed)** di editor Google Form, lalu ditempel ke
   `feedback.googleFormUrl` di `src/config/siteConfig.js`. Parameter `?embedded=true`
   wajib ada.
2. Komponen `FeedbackForm` me-render iframe dan **menyesuaikan tingginya secara otomatis**
   lewat `postMessage` dari Google Forms (tinggi awal 720 px, batas aman 1800 px bila pesan
   tinggi tidak diterima).
3. Bila `googleFormUrl` dikosongkan, section menampilkan keterangan bahwa formulir sedang
   disiapkan, bukan form kosong atau status sukses palsu.

Mengubah pertanyaan/kategori dilakukan langsung di editor Google Form; URL embed tidak
berubah sehingga situs tidak perlu di-deploy ulang. Jawaban tersimpan di Spreadsheet yang
terhubung ke form tersebut.

---

## 7. Deploy ke Vercel

### Langkah A — siapkan Git (sekali saja)

```bash
cd musyrif
git init
git add .
git commit -m "Initial commit: landing page pelatihan musyrif profesional"
# Buat repository baru di GitHub, lalu:
git branch -M main
git remote add origin https://github.com/USERNAME-ANDA/NAMA-REPO.git
git push -u origin main
```

`.gitignore` sudah mengecualikan `node_modules/`, `dist/`, `.env`, dan `.vercel/`.

### Langkah B — impor ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new), pilih repository hasil push di atas.
2. Vercel otomatis mendeteksi proyek **Vite** (konfigurasi juga sudah ada di `vercel.json`):
   - Build Command: `vite build`
   - Output Directory: `dist`
3. Klik **Deploy**. Tidak perlu setting tambahan untuk versi dasar.
4. Setelah online, salin domain (mis. `pelatihan-musyrif.vercel.app`).

### Langkah C — opsional

- **Google Form saran & masukan**: tempel URL embed ke `feedback.googleFormUrl` di
  `src/config/siteConfig.js`, commit, push. Tidak ada environment variable yang dibutuhkan.
- **URL PMB**: ubah `PMB_URL` di `src/config/siteConfig.js`, commit, push.
- **Metadata sosial**: setelah domain final diketahui, isi URL absolut pada `og:image` dan
  tambahkan kembali `<link rel="canonical">` di `index.html` (tag canonical sengaja tidak
  dipasang karena domain produksi belum pasti dan dapat merusak build Vite bila diisi `/`).

---

## 8. Pemeriksaan yang sudah dijalankan

| Pemeriksaan                                             | Hasil  |
| ------------------------------------------------------- | ------ |
| `npm run build`                                         | ✅ lulus |
| `npm run dev` dan `npm run preview`                     | ✅ lulus |
| Uji runtime Chromium headless pada 6 lebar layar (320, 375, 430, 768, 1366, 1920 px) — 65 pemeriksaan | ✅ lulus |
| — Tidak ada overflow horizontal                         | ✅ |
| — Semua section ada, satu `h1`, hierarki heading rapi   | ✅ |
| — Semua gambar termuat dan memiliki `alt`                | ✅ |
| — Menu mobile terbuka/tutup, anchor tidak tertutup header | ✅ |
| — Lightbox brosur terbuka/tutup                         | ✅ |
| — Section saran & masukan tampil (form atau keterangan jujur) | ✅ |
| — Tidak ada error console                               | ✅ |
| — Target sentuh utama ≥ 44 px                           | ✅ |

> Catatan: pemeriksaan di atas dilakukan otomatis (struktur DOM, perilaku, dan error console).
> Penilaian keindahan visual tetap perlu dilihat langsung oleh manusia di peramban masing-masing.

---

## 9. Hal yang masih menunggu dari pihak sekolah / panitia

1. **Konfirmasi data brosur** (tanggal, waktu, tempat) — data saat ini mengikuti brosur yang
   diberikan dan dapat berubah sewaktu-waktu.

Sudah terpenuhi: URL pendaftaran (PMB) resmi → `https://siakad.alwafi.ac.id/register`.
Sudah terpenuhi: Google Form saran & masukan → `feedback.googleFormUrl`.
