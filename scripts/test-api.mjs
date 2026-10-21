/**
 * Uji lokal untuk api/feedback.js (tanpa Vercel).
 * Jalankan: node scripts/test-api.mjs
 */
import http from 'node:http';
import handler from '../api/feedback.js';

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(k, v) {
      this.headers[k] = v;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

let passed = 0;
let failed = 0;
function expect(name, actual, expected) {
  const ok = actual === expected;
  ok ? passed++ : failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  (actual=${actual}, expected=${expected})`);
}

async function call(body, method = 'POST', ip = '127.0.0.1') {
  const req = { method, body, headers: { 'x-forwarded-for': ip }, socket: {} };
  const res = mockRes();
  await handler(req, res);
  return res;
}

// 1. Metode salah
let res = await call({}, 'GET');
expect('GET ditolak 405', res.statusCode, 405);

// 2. Body kosong -> 400
res = await call({});
expect('Body kosong ditolak 400', res.statusCode, 400);

// 3. Honeypot terisi -> 200 dibuang (tidak diteruskan)
res = await call({ name: 'Bot', category: 'Lainnya', message: 'spam spam spam', website: 'http://spam' });
expect('Honeypot dibuang 200', res.statusCode, 200);
expect('Honeypot ditandai discarded', res.body?.discarded, true);

// 4. Valid tapi webhook belum dikonfigurasi -> 503 jujur
delete process.env.FEEDBACK_WEBHOOK_URL;
res = await call({
  name: 'Ustadz Test',
  email: 'test@example.com',
  category: 'Saran perbaikan',
  message: 'Semoga pelatihannya bermanfaat bagi semua musyrif.',
});
expect('Tanpa webhook -> 503', res.statusCode, 503);
expect('Tanpa webhook -> configured=false', res.body?.configured, false);

// 5. Kategori tidak dikenal -> 400
res = await call({ category: 'Kategori Asing', message: 'Pesan yang cukup panjang untuk lolos.' });
expect('Kategori asing ditolak 400', res.statusCode, 400);

// 6. Pesan terlalu pendek -> 400
res = await call({ category: 'Lainnya', message: 'pendek' });
expect('Pesan pendek ditolak 400', res.statusCode, 400);

// 7. Webhook aktif -> diteruskan
let received = null;
const server = http.createServer((req, res2) => {
  let data = '';
  req.on('data', (c) => (data += c));
  req.on('end', () => {
    received = JSON.parse(data);
    res2.writeHead(200, { 'Content-Type': 'application/json' });
    res2.end('{"ok":true}');
  });
});
await new Promise((r) => server.listen(8787, r));
process.env.FEEDBACK_WEBHOOK_URL = 'http://127.0.0.1:8787/hook';

res = await call({
  name: 'Ustadz Test',
  email: 'test@example.com',
  category: 'Masukan materi',
  message: 'Tambahkan sesi praktik lapangan pada pelatihan berikutnya.',
});
expect('Dengan webhook -> 200', res.statusCode, 200);
expect('Data diteruskan ke webhook', received?.category, 'Masukan materi');
expect('Sertakan sumber', received?.source, 'landing-pelatihan-musyrif-alwafi');

// 8. Rate limit: kiriman kedua dalam 15 detik -> 429
res = await call({
  name: 'Ustadz Test',
  category: 'Lainnya',
  message: 'Pesan kedua yang dikirim terlalu cepat setelah yang pertama.',
});
expect('Rate limit aktif 429', res.statusCode, 429);

// 9. Webhook gagal -> 502 jujur
server.close();
res = await call(
  {
    name: 'Ustadz Test',
    category: 'Lainnya',
    message: 'Pesan yang dikirim saat layanan webhook sedang mati ya.',
  },
  'POST',
  '10.0.0.99'
);
expect('Webhook mati -> 502', res.statusCode, 502);

console.log(`\n=== ${passed} lulus, ${failed} gagal ===`);
process.exit(failed ? 1 : 0);
