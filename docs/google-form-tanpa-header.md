# Panduan: Menghilangkan Judul & Deskripsi di Dalam Google Form

Form saran & masukan di situs ini sudah punya judul sendiri di section **Saran &
Masukan** (`SectionHeading`), sehingga judul yang muncul lagi di dalam iframe
Google Form terasa berulang dan memakan ruang.

Karena iframe Google tidak bisa disentuh oleh CSS situs (kebijakan
*same-origin*), header form harus dimatikan dari sisi Google. Ini langkah
resminya — hanya perlu sekali dan tidak menyentuh kode situs.

## Langkah

1. Buka form untuk diedit:
   <https://docs.google.com/forms/d/e/1FAIpQLSffi3M7V9JL_UTIDfbMjp6jZcTRHy4Z_Wp2s6QSIutSpE9wDA/edit>
   (atau lewat <https://forms.google.com> → pilih form "Saran & Masukan")

2. **Kosongkan judul form**
   Klik teks **"Saran & Masukan"** di bagian paling atas → hapus sampai kosong.

3. **Kosongkan deskripsi**
   Klik teks deskripsi di bawahnya → hapus sampai kosong.

4. **Pastikan blok "Nama" ada di baris pertama**
   Setelah kedua langkah di atas, pertanyaan pertama yang tampil otomatis
   adalah **Nama**. Kalau masih ada blok lain di atasnya (mis. blok section),
   hapus blok tersebut.

5. **Kirim ulang (Send) — opsional**
   URL embed **tidak berubah**, jadi tidak perlu memperbarui
   `feedback.googleFormUrl` di `src/config/siteConfig.js` dan situs tidak
   perlu di-deploy ulang. Cukup muat ulang halaman situs.

## Hasilnya

| Sebelum | Sesudah |
| --- | --- |
| Judul "Saran & Masukan" + deskripsi di dalam form | Langsung muncul pertanyaan **Nama** |
| Header ganda (situs + form) | Judul hanya di section situs |

## Catatan

- Judul tetap ada di tab browser karena diambil dari `<title>` dokumen form —
  ini tidak terlihat pengunjung di dalam iframe.
- Tinggi awal iframe di `FeedbackForm.jsx` (`INITIAL_HEIGHT`) sudah disetel
  780 px untuk kondisi tanpa judul & deskripsi. Tinggi sebenarnya tetap
  menyesuaikan otomatis lewat `postMessage` dari Google Forms.
- Kalau suatu saat judul ingin dikembalikan, cukup isi lagi judul & deskripsi
  di editor Google Form — tidak ada perubahan kode yang diperlukan.

## Bila muncul "Formulir tanpa judul"

Google tidak mengizinkan judul form benar-benar kosong: setelah dikosongkan,
judul otomatis diisi **"Formulir tanpa judul"** sehingga masih ada satu baris
teks terlihat di dalam iframe.

Untuk menghilangkannya, jalankan skrip
[`scripts/HideFormHeader.gs`](./scripts/HideFormHeader.gs). Skrip ini mengisi
judul & deskripsi form dengan karakter tak terlihat (zero-width space), yaitu
karakter yang tetap dianggap "ada" oleh Google tetapi tidak menghasilkan piksel
apa pun.

Langkahnya:

1. [script.google.com](https://script.google.com) → **New project**
2. Tempel isi `docs/scripts/HideFormHeader.gs`
3. Pilih fungsi `hideFormHeader` → **Run** → izinkan akses
4. Periksa **Execution log** (`berhasil via setTitle` / `berhasil via
   pageBreakItem` = berhasil; `GAGAL` = tidak bisa)
5. Muat ulang situs dan periksa hasilnya

Fungsi pendukung pada skrip yang sama:

| Fungsi | Kegunaan |
| --- | --- |
| `hideFormHeader` | Menyembunyikan judul & deskripsi form |
| `checkHeader` | Menampilkan judul form & daftar item untuk diagnosis |
| `restoreHeader` | Mengembalikan judul & deskripsi seperti semula |

> Catatan: jalur alternatif berupa *crop* iframe dengan offset negatif tidak
> dianjurkan. Tinggi baris judul tidak tetap, dan Google Form menjalankan
> `scrollIntoView` saat field diisi sehingga crop manual bisa bergeser dan
> memotong pertanyaan pertama.
