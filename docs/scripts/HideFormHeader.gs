/**
 * Utilitas: menyembunyikan judul & deskripsi Google Form agar tidak terlihat
 * di dalam iframe situs landing page.
 *
 * Latar masalah:
 *  - CSS situs tidak bisa menyentuh isi iframe Google (kebijakan same-origin).
 *  - Mengosongkan judul di editor membuat Google mengisi otomatis
 *    "Formulir tanpa judul", sehingga masih ada satu baris teks terlihat.
 *
 * Solusi: isi judul dengan karakter tak terlihat (zero-width characters).
 * Karakter ini bukan spasi biasa, tetap dianggap "ada" oleh Google, tetapi
 * tidak menghasilkan piksel apa pun sehingga judul tampak benar-benar hilang.
 *
 * Catatan: AppForm.setTitle() bawaan Google menolak teks yang dianggap kosong.
 * Karena itu skrip ini memakai pendekatan edit item: judul form pada Google
 * Forms disimpan sebagai item pertama bertipe "SECTION_HEADER" bernama
 * "pageBreakItem", sehingga bisa diubah judulnya lewat setName().
 *
 * Cara pakai:
 *  1. Buka https://script.google.com → New project.
 *  2. Tempel file ini, isi FORM_ID di bawah (ID dari URL /edit form).
 *  3. Jalankan `hideFormHeader` → izinkan akses.
 *  4. Buka Execution log untuk melihat hasilnya, lalu muat ulang situs.
 */

/** ID form — ambil dari URL edit: .../forms/d/<FORM_ID>/edit */
const FORM_ID = '1FAIpQLSffi3M7V9JL_UTIDfbMjp6jZcTRHy4Z_Wp2s6QSIutSpE9wDA';

/**
 * Karakter tak terlihat: ZERO WIDTH SPACE (U+200B).
 * Dipakai berulang agar Google meyakini judul tidak kosong.
 */
const INVISIBLE_TITLE = '\u200B\u200B\u200B';

function hideFormHeader() {
  const form = FormApp.openById(FORM_ID);
  const before = { title: form.getTitle(), description: form.getDescription() };

  let titleResult = 'dilewati';
  let descResult = 'dilewati';

  // 1. Judul form — coba lewat setTitle() dulu.
  try {
    form.setTitle(INVISIBLE_TITLE);
    titleResult = 'berhasil via setTitle';
  } catch (err) {
    titleResult = `setTitle gagal (${err.message}), mencoba lewat item header…`;
    // 2. Fallback: ubah item pageBreakItem pertama (judul section pertama).
    const headerItem = findFirstHeaderItem(form);
    if (headerItem) {
      headerItem.setTitle(INVISIBLE_TITLE);
      titleResult = 'berhasil via pageBreakItem';
    } else {
      titleResult = 'GAGAL — tidak ada header item yang bisa diubah';
    }
  }

  // 3. Deskripsi — tidak boleh benar-benar kosong, isi karakter tak terlihat.
  try {
    form.setDescription(INVISIBLE_TITLE);
    descResult = 'berhasil';
  } catch (err) {
    descResult = `gagal: ${err.message}`;
  }

  const after = { title: form.getTitle(), description: form.getDescription() };

  console.log('=== HASIL ===');
  console.log('Judul sebelum :', JSON.stringify(before.title));
  console.log('Judul sesudah :', JSON.stringify(after.title));
  console.log('Cara          :', titleResult);
  console.log('Deskripsi     :', descResult);
  console.log('\nLangkah berikutnya: buka form di browser dan muat ulang situs untuk cek hasilnya.');
  console.log('Bila judul masih tampak, jalankan fungsi checkHeader untuk diagnosis.');

  return { titleResult, descResult, after };
}

/** Diagnosis: tampilkan judul & daftar item yang ada di form. */
function checkHeader() {
  const form = FormApp.openById(FORM_ID);
  console.log('Judul form     :', JSON.stringify(form.getTitle()));
  console.log('Deskripsi form :', JSON.stringify(form.getDescription()));
  console.log('Jumlah item    :', form.getItems().length);
  form.getItems().forEach((item, index) => {
    console.log(
      `  [${index}] ${item.getType()} | judul=${JSON.stringify(item.getTitle())}`
    );
  });
  return form.getItems().map((item) => ({ type: String(item.getType()), title: item.getTitle() }));
}

/**
 * Cari item header pertama pada form.
 * Pada Google Forms, judul utama form direpresentasikan sebagai item
 * bertipe PAGE_BREAK di posisi paling awal.
 */
function findFirstHeaderItem(form) {
  const items = form.getItems();
  for (const item of items) {
    if (item.getType() === FormApp.ItemType.PAGE_BREAK) return item;
  }
  return items.length > 0 ? items[0] : null;
}

/** Kembalikan judul form seperti semula (bila ingin dibatalkan). */
function restoreHeader() {
  const form = FormApp.openById(FORM_ID);
  form.setTitle('Saran & Masukan');
  form.setDescription(
    'Bantu kami meningkatkan kualitas pelatihan. Tuliskan saran, masukan atau kendala yang anda temui.'
  );
  console.log('Judul & deskripsi dikembalikan:', JSON.stringify(form.getTitle()));
}
