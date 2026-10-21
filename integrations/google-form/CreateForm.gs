/**
 * Pembuat Google Form "Saran & Masukan"
 * Landing Page Pelatihan Musyrif Profesional — STIT Al Wafi Bogor
 *
 * Cara pakai:
 *  1. Buka https://script.google.com → New project.
 *  2. Hapus isi Code.gs, tempel seluruh file ini.
 *  3. Klik "Run" pada fungsi createFeedbackForm → izinkan akses saat diminta.
 *  4. Buka menu "Execution log": form sudah dibuat, jawaban otomatis masuk
 *     ke Spreadsheet baru, dan URL embed dicetak di log.
 *  5. Salin nilai `embedUrl` ke src/config/siteConfig.js pada bagian
 *     `feedback.googleFormUrl` (atau `feedback.embedUrl`).
 *
 * Catatan: jalankan `setEmbedMode()` sekali bila form sudah ada dan hanya
 * ingin mengizinkan tampilan embed.
 */

const TIMEZONE = 'Asia/Jakarta';

const CATEGORIES = [
  'Saran perbaikan',
  'Masukan materi',
  'Masukan kegiatan',
  'Kendala teknis',
  'Pertanyaan umum',
  'Lainnya',
];

function createFeedbackForm() {
  const form = FormApp.create('Saran & Masukan — Pelatihan Musyrif Profesional');
  form.setDescription(
    'Bantu kami meningkatkan kualitas pelatihan. Tuliskan saran, masukan, atau kendala yang Anda temui.'
  );
  form.setCollectEmail(false);
  form.setAllowResponseEdits(true);
  form.setShowLinkToRespondAgain(false);
  form.setProgressBar(false);
  form.setConfirmationMessage(
    'Terima kasih! Saran dan masukan Anda sudah kami terima dan akan menjadi bahan perbaikan panitia.'
  );

  // Nama (opsional)
  form.addTextItem().setTitle('Nama').setRequired(false);

  // Email (opsional, divalidasi bila diisi)
  const emailItem = form.addTextItem().setTitle('Email').setRequired(false);
  const emailValidation = FormApp.createTextValidation()
    .setHelpText('Format email belum benar, misalnya nama@domain.com.')
    .requireTextIsEmail()
    .build();
  emailItem.setValidation(emailValidation);

  // Kategori (wajib)
  form
    .addMultipleChoiceItem()
    .setTitle('Kategori masukan')
    .setChoiceValues(CATEGORIES)
    .setRequired(true);

  // Pesan (wajib)
  const messageItem = form
    .addParagraphTextItem()
    .setTitle('Pesan atau saran')
    .setHelpText('Minimal 10 karakter.')
    .setRequired(true);
  const messageValidation = FormApp.createParagraphTextValidation()
    .setHelpText('Tulisan terlalu singkat (minimal 10 karakter).')
    .requireTextLengthGreaterThanOrEqualTo(10)
    .build();
  messageItem.setValidation(messageValidation);

  // Simpan jawaban ke Spreadsheet baru
  const spreadsheet = SpreadsheetApp.create('Jawaban Saran & Masukan — Pelatihan Musyrif');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

  enableEmbed(form);

  const embedUrl = buildEmbedUrl(form.getId());
  const info = {
    formUrl: form.getPublishedUrl(),
    editUrl: form.getEditUrl(),
    embedUrl,
    spreadsheetUrl: spreadsheet.getUrl(),
    spreadsheetId: spreadsheet.getId(),
  };

  console.log('=== HASIL PEMBUATAN GOOGLE FORM ===');
  console.log(JSON.stringify(info, null, 2));
  console.log('Tempel `embedUrl` di atas ke src/config/siteConfig.js → feedback.googleFormUrl');
  return info;
}

/** Izinkan form ditampilkan sebagai iframe (wajib untuk embed). */
function setEmbedMode() {
  const form = pickExistingForm();
  if (!form) throw new Error('Form tidak ditemukan — periksa FORM_ID di bawah.');
  enableEmbed(form);
  console.log('Embed mode aktif:', buildEmbedUrl(form.getId()));
}

/** Isi bila ingin memakai form yang sudah ada (ID dari URL /edit). */
const FORM_ID = '';

function pickExistingForm() {
  if (FORM_ID) return FormApp.openById(FORM_ID);
  const props = PropertiesService.getScriptProperties();
  const stored = props.getProperty('FORM_ID');
  return stored ? FormApp.openById(stored) : null;
}

function enableEmbed(form) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('FORM_ID', form.getId());

  const settingsForm = FormApp.openById(form.getId());
  settingsForm.setRequireLogin(false);
  settingsForm.setCollectEmail(false);

  // Batasi hanya akun dalam domain ini bila diinginkan (kosong = semua orang).
  // settingsForm.setLimitOneResponsePerUser(false);
}

function buildEmbedUrl(formId) {
  return `https://docs.google.com/forms/d/e/${toViewId(formId)}/viewform?embedded=true`;
}

/**
 * Ubah ID form (dari /edit) menjadi ID publik (dari /viewform).
 * ID publik biasanya berbentuk "1FAIpQLS...", sedangkan ID edit berbentuk
 * "1AbC...". Bila idForm sudah ID publik, kembalikan apa adanya.
 */
function toViewId(formId) {
  const form = FormApp.openById(formId);
  const published = form.getPublishedUrl(); // .../d/e/<PUBLIC_ID>/viewform
  const match = published.match(/\/d\/e\/([^/]+)\//);
  return match ? match[1] : formId;
}

/** Pratinjau cepat: mengecek form sudah dapat di-embed. */
function testEmbed() {
  const form = pickExistingForm();
  if (!form) throw new Error('Form tidak ditemukan.');
  const url = buildEmbedUrl(form.getId());
  console.log('Buka URL berikut di browser, form harus tampil di dalam area:', url);
  return url;
}
