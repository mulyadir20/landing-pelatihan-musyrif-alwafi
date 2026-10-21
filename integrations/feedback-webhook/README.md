# Webhook Penyimpanan Masukan (Google Sheets)

Komponen opsional: menerima kiriman form **Saran & Masukan** dari situs dan
menyimpannya sebagai baris baru di Google Spreadsheet.

Tanpa webhook ini, endpoint `api/feedback.js` akan menolak pengiriman dengan
pesan "Pengiriman masukan belum aktif" (status 503) — tidak ada data yang
disimpan di mana pun.

## Cara pasang (± 5 menit)

1. **Siapkan Spreadsheet**
   Buka [sheets.google.com](https://sheets.google.com) → buat spreadsheet baru,
   misalnya "Masukan Pelatihan Musyrif".

2. **Pasang skrip**
   Dari spreadsheet: **Extensions → Apps Script**. Hapus isi `Code.gs`, lalu
   tempel seluruh isi [`Code.gs`](./Code.gs) di folder ini.

3. **Jalankan setup (sekali saja)**
   Pada dropdown fungsi di editor pilih `setup` → klik **Run**. Izinkan akses
   saat diminta. Ini membuat sheet "Masukan" lengkap dengan header otomatis.

4. **Deploy sebagai Web App**
   Klik **Deploy → New deployment → Web app**:
   - **Description**: `feedback-webhook`
   - **Execute as**: `Me` (email Anda)
   - **Who has access**: `Anyone`
   Klik **Deploy**, lalu salin URL yang berakhiran **`/exec`**.

5. **Hubungkan ke Vercel**
   Dashboard Vercel → project situs ini → **Settings → Environment Variables**:
   - Name: `FEEDBACK_WEBHOOK_URL`
   - Value: URL `/exec` dari langkah 4
   Klik **Save**, lalu **Redeploy** situsnya (Deployments → pilih terbaru →
   ⋯ → Redeploy), karena env var hanya dibaca saat build/deploy.

6. **Uji**
   Kirim satu masukan lewat formulir di situs, lalu cek spreadsheet — baris baru
   akan muncul dalam beberapa detik.

## Catatan

- Buka URL `/exec` langsung di browser untuk cek kesehatan (harus membalas
  `{"ok":true,"service":"feedback-webhook",...}`).
- Kolom: `Waktu Terima` · `Waktu Kirim (ISO)` · `Kategori` · `Nama` · `Email` ·
  `Pesan` · `Sumber`.
- Zona waktu kolom "Waktu Terima" diatur di `TIMEZONE` dalam `Code.gs`
  (default `Asia/Jakarta`).
- Perubahan kode setelah deploy pertama butuh **Deploy → Manage deployments →
  Edit → Version: New version → Deploy** agar versi web app ikut diperbarui.
