/**
 * Endpoint serverless Vercel untuk formulir "Saran & Masukan".
 *
 * Cara kerja:
 *  1. Memvalidasi ulang input di sisi server (validasi frontend saja tidak cukup).
 *  2. Jika environment variable FEEDBACK_WEBHOOK_URL belum diisi, permintaan
 *     DITOLAK dengan status 503 dan pesan jujur bahwa pengiriman belum aktif.
 *  3. Jika sudah diisi, data diteruskan (HTTP POST JSON) ke URL tersebut,
 *     misalnya Google Apps Script Web App, Zapier/Make, atau layanan internal.
 *
 * Tidak ada kredensial, database, atau layanan eksternal yang dipasang di sini.
 */

// Daftar kategori yang diterima — harus selaras dengan src/config/siteConfig.js
// (feedbackCategories). Dikirim ulang di server karena fungsi ini berjalan
// terpisah dari bundel frontend.
const ALLOWED_CATEGORIES = [
  'Saran perbaikan',
  'Masukan materi',
  'Masukan kegiatan',
  'Kendala teknis',
  'Pertanyaan umum',
  'Lainnya',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Pembatas laju sederhana per IP (bersifat per instance / best effort). */
const lastSubmit = new Map();
const COOLDOWN_MS = 15_000;

function validate(body) {
  const errors = {};

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const category = typeof body?.category === 'string' ? body.category.trim() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (name.length > 100) errors.name = 'Nama terlalu panjang (maksimal 100 karakter).';
  if (email && !EMAIL_RE.test(email)) errors.email = 'Format email tidak valid.';
  if (email.length > 120) errors.email = 'Email terlalu panjang (maksimal 120 karakter).';
  if (!ALLOWED_CATEGORIES.includes(category)) errors.category = 'Kategori masukan tidak dikenal.';
  if (message.length < 10) errors.message = 'Pesan terlalu singkat (minimal 10 karakter).';
  if (message.length > 2000) errors.message = 'Pesan terlalu panjang (maksimal 2000 karakter).';

  return {
    errors,
    data: { name: name || undefined, email: email || undefined, category, message },
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Metode request tidak diizinkan.' });
  }

  // Honeypot: kolom tersembunyi yang seharusnya selalu kosong.
  // Data dari bot langsung dibuang tanpa diteruskan.
  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  if (body && typeof body.website === 'string' && body.website.trim() !== '') {
    return res.status(200).json({ ok: true, discarded: true });
  }

  const { errors, data } = validate(body);
  if (Object.keys(errors).length > 0) {
    return res
      .status(400)
      .json({ ok: false, message: 'Data masukan tidak valid.', errors });
  }

  const ip =
    (typeof req.headers['x-forwarded-for'] === 'string'
      ? req.headers['x-forwarded-for'].split(',')[0].trim()
      : null) || req.socket?.remoteAddress || 'unknown';

  const now = Date.now();
  const previous = lastSubmit.get(ip) || 0;
  if (now - previous < COOLDOWN_MS) {
    return res.status(429).json({
      ok: false,
      message: 'Anda mengirim masukan terlalu cepat. Silakan coba kembali beberapa saat lagi.',
    });
  }

  const webhookUrl = (process.env.FEEDBACK_WEBHOOK_URL || '').trim();

  if (!webhookUrl) {
    return res.status(503).json({
      ok: false,
      configured: false,
      message:
        'Pengiriman masukan belum aktif karena penyimpanan belum dikonfigurasi pengelola situs.',
    });
  }

  if (!/^https?:\/\//i.test(webhookUrl)) {
    return res.status(500).json({
      ok: false,
      message: 'Konfigurasi FEEDBACK_WEBHOOK_URL tidak valid pada server.',
    });
  }

  try {
    const forward = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        source: 'landing-pelatihan-musyrif-alwafi',
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!forward.ok) {
      throw new Error(`Webhook merespons dengan status ${forward.status}.`);
    }

    lastSubmit.set(ip, now);
    return res.status(200).json({ ok: true, message: 'Masukan berhasil diterima.' });
  } catch (error) {
    console.error('[feedback] Gagal meneruskan masukan:', error?.message ?? error);
    return res.status(502).json({
      ok: false,
      message:
        'Masukan belum dapat diteruskan ke layanan penyimpanan. Silakan coba lagi nanti atau hubungi panitia.',
    });
  }
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
