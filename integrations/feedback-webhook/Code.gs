/**
 * Webhook penyimpanan form "Saran & Masukan"
 * Landing Page Pelatihan Musyrif Profesional — STIT Al Wafi Bogor
 *
 * Cara pakai:
 *  1. Buka Spreadsheet Google yang akan dipakai sebagai basis data.
 *  2. Extensions → Apps Script, hapus isi Code.gs lalu tempel file ini.
 *  3. Deploy → New deployment → tipe "Web app":
 *       - Execute as : Me (email Anda)
 *       - Who has access : Anyone
 *  4. Salin URL "/exec" lalu tempel ke Vercel:
 *       Settings → Environment Variables → FEEDBACK_WEBHOOK_URL
 *  5. Redeploy project di Vercel agar env var terbaca.
 *
 * Payload yang diterima (dari api/feedback.js):
 *   { name?, email?, category, message, source, submittedAt }
 */

// Zona waktu yang dipakai untuk kolom "Waktu Terima".
const TIMEZONE = 'Asia/Jakarta';

// Nama-nama kolom (baris 1 dibuat otomatis oleh fungsi setup).
const HEADERS = [
  'Waktu Terima',
  'Waktu Kirim (ISO)',
  'Kategori',
  'Nama',
  'Email',
  'Pesan',
  'Sumber',
];

const ALLOWED_CATEGORIES = [
  'Saran perbaikan',
  'Masukan materi',
  'Masukan kegiatan',
  'Kendala teknis',
  'Pertanyaan umum',
  'Lainnya',
];

/** Dipanggil sekali dari editor ("Run") untuk menyiapkan sheet & header. */
function setup() {
  const sheet = getSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#1f2a44')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  SpreadsheetApp.getActive().toast('Setup selesai. Header siap.', 'Feedback');
}

/** Web app: pintu masuk utama. */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(5000); // cegah baris tercampur saat kiriman bersamaan

    const payload = parsePayload(e);
    if (!payload) {
      return jsonResponse(400, { ok: false, message: 'Payload tidak valid.' });
    }

    // Validasi ringan — server sudah memvalidasi, ini lapis pengaman kedua.
    if (!ALLOWED_CATEGORIES.includes(payload.category)) {
      return jsonResponse(400, { ok: false, message: 'Kategori tidak dikenal.' });
    }
    if (typeof payload.message !== 'string' || payload.message.trim().length < 1) {
      return jsonResponse(400, { ok: false, message: 'Pesan kosong.' });
    }

    getSheet().appendRow([
      new Date(),
      payload.submittedAt || '',
      payload.category,
      payload.name || '',
      payload.email || '',
      payload.message,
      payload.source || '',
    ]);

    return jsonResponse(200, { ok: true, message: 'Masukan tersimpan.' });
  } catch (err) {
    console.error('[feedback-webhook]', err);
    return jsonResponse(500, { ok: false, message: 'Gagal menyimpan masukan.' });
  } finally {
    try {
      lock.releaseLock();
    } catch (_) {
      /* abaikan */
    }
  }
}

/** Web app: cek kesehatan endpoint (buka URL /exec di browser). */
function doGet() {
  return jsonResponse(200, {
    ok: true,
    service: 'feedback-webhook',
    spreadsheet: getSheet().getName(),
  });
}

/** Ambil sheet tujuan (nama: "Masukan"), buat bila belum ada. */
function getSheet() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName('Masukan');
  if (!sheet) {
    sheet = ss.insertSheet('Masukan');
  }
  return sheet;
}

function parsePayload(e) {
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && typeof data === 'object' ? data : null;
  } catch (_) {
    return null;
  }
}

function jsonResponse(status, obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
