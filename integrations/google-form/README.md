# Google Form untuk Saran & Masukan

Section **Saran & Masukan** bisa ditenagai oleh Google Form yang di-embed.
Data jawaban otomatis tersimpan di Google Spreadsheet & Google Form — tanpa
serverless function, webhook, atau environment variable di Vercel.

## Langkah 1 — Buat Google Form otomatis

1. Buka [script.google.com](https://script.google.com) → **New project**
2. Hapus isi `Code.gs`, tempel seluruh isi [`CreateForm.gs`](./CreateForm.gs)
3. Pilih fungsi `createFeedbackForm` di dropdown → klik **Run**
4. Izinkan akses saat diminta (Google akan menampilkan layar izin OAuth)
5. Buka **Execution log**. Akan tercetak JSON berisi:
   - `formUrl` — link publik form
   - `editUrl` — link edit form (untuk mengubah pertanyaan)
   - `embedUrl` — **ini yang dibutuhkan situs**
   - `spreadsheetUrl` — spreadsheet tempat jawaban masuk

Form yang dibuat otomatis berisi:
| Pertanyaan | Tipe | Wajib |
|---|---|---|
| Nama | Teks singkat | tidak |
| Email | Teks singkat, divalidasi format email | tidak |
| Kategori masukan | Pilihan ganda (6 kategori) | ya |
| Pesan atau saran | Paragraf, minimal 10 karakter | ya |

## Langkah 2 — Hubungkan ke situs

1. Buka `src/config/siteConfig.js`
2. Cari bagian `feedback` dan tempel URL dari log ke `googleFormUrl`:
   ```js
   feedback: {
     googleFormUrl:
       'https://docs.google.com/forms/d/e/1FAIpQL.../viewform?embedded=true',
   },
   ```
3. Jalankan `npm run dev` atau `npm run build` untuk melihat hasilnya.

Halaman akan menampilkan kerangka form. Jika `googleFormUrl` kosong, situs
menampilkan tombol **"Buka Formulir Saran & Masukan"** sebagai gantinya —
jadi situs tetap aman walau link belum diisi.

## Langkah 3 — Perubahan setelah form dibuat

- **Ubah pertanyaan/kategori**: lewat `editUrl`, atau langsung di
  [forms.google.com](https://forms.google.com). URL embed **tidak berubah**
  meskipun pertanyaan diubah.
- **Balasan otomatis ke Spreadsheet**: sudah aktif otomatis pada spreadsheet
  yang dibuat di langkah 1 (tab "Form Responses 1").
- **Batasi ke satu jawaban per orang**: buka form → Settings → Responses →
  aktifkan "Limit to 1 response" (responden perlu login Google).

## Memakai form yang sudah ada

Bila Anda sudah punya Google Form dan hanya ingin mengaktifkan mode embed:

1. Tempel ID form (dari URL `.../forms/d/<FORM_ID>/edit`) ke variabel
   `FORM_ID` di `CreateForm.gs`
2. Jalankan fungsi `setEmbedMode`
3. Salin `embedUrl` dari log ke `siteConfig.js` seperti langkah 2

## Catatan penting

- **Iframe memerlukan akses "Anyone"** pada form. Form yang dibuat skrip ini
  sudah otomatis tidak memerlukan login. Kalau muncul tampilan "Sign in"
  di dalam iframe, jalankan ulang `setEmbedMode`.
- **Tinggi iframe** diatur di `FeedbackForm.css` dan
  `FeedbackForm.jsx` (`FORM_HEIGHT`). Sesuaikan bila form Anda lebih panjang.
- Direktori `api/feedback.js` dan `integrations/feedback-webhook/` menjadi
  tidak terpakai bila memakai Google Form. Bisa dihapus tanpa memengaruhi
  situs — lihat catatan di akhir README utama.
