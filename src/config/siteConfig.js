/**
 * ============================================================================
 * KONFIGURASI SITUS — SATU-SATUNYA TEMPAT MENGUBAH INFORMASI KEGIATAN
 * ============================================================================
 * Semua data kegiatan (tanggal, biaya, kontak, path gambar, URL PMB) berada
 * di file ini. Komponen tidak menyimpan informasi yang sama secara terpisah.
 * ============================================================================
 */

/** GANTI dengan URL pendaftaran (PMB) resmi STIT Al Wafi.
 *  Contoh: "https://pmb.alwafi.ac.id/daftar"
 *  Selama masih KOSONG, semua tombol "Daftar Sekarang" dan menu PMB akan
 *  mengarahkan pengguna ke section Kontak (WhatsApp panitia) agar pengguna
 *  tetap punya jalur pendaftaran yang valid. */
const PMB_URL = '';

const WHATSAPP_NUMBER = '6289527217662'; // format internasional, tanpa angka 0 di awal

const WHATSAPP_MESSAGES = {
  default:
    "Assalamu'alaikum, saya ingin bertanya mengenai Pelatihan Musyrif Profesional.",
  register:
    "Assalamu'alaikum, saya ingin mendaftar Pelatihan Musyrif Profesional STIT Al Wafi Bogor.",
};

/** Membuat tautan WhatsApp dengan pesan otomatis. */
export function getWhatsAppUrl(message = WHATSAPP_MESSAGES.default) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Tujuan tombol pendaftaran.
 * Mengembalikan URL PMB resmi jika sudah dikonfigurasi,
 * atau null jika belum (maka UI akan mengarah ke #kontak).
 */
export function getPmbUrl() {
  const url = (PMB_URL || '').trim();
  if (!url || url === '#') return null;
  return url;
}

/**
 * Mengubah tujuan menu (lihat `navigation`) menjadi href yang benar.
 * Item dengan tujuan 'pmb' mengikuti konfigurasi PMB_URL di atas.
 */
export function getNavHref(href) {
  if (href === 'pmb') return getPmbUrl() ?? '#kontak';
  return href;
}

const siteConfig = {
  /** Identitas kegiatan & institusi */
  eventName: 'Pelatihan Musyrif Profesional',
  institution: 'STIT Al Wafi Bogor',
  tagline: 'Membentuk Musyrif Profesional sebagai Murabbi, Pembina, dan Pemimpin Santri.',
  shortDescription:
    'Pelatihan terapan bagi guru, pengasuh, dan pengelola pendidikan Islam untuk meningkatkan ' +
    'kualitas bimbingan, pembinaan, dan kepemimpinan di lingkungan pesantren serta sekolah.',

  /** Menu navigasi. `href` berupa anchor internal atau URL eksternal. */
  navigation: [
    { label: 'Home', href: '#home' },
    { label: 'PMB', href: 'pmb' }, // 'pmb' -> mengikuti konfigurasi PMB_URL di atas
    { label: 'Kontak', href: '#kontak' },
    { label: 'Saran & Masukan', href: '#saran-masukan' },
  ],

  /** Kontak panitia */
  contact: {
    person: 'Ustadz Said',
    phoneDisplay: '0895 2721 7662',
    whatsappNumber: WHATSAPP_NUMBER,
    whatsappMessages: WHATSAPP_MESSAGES,
    institution: 'STIT Al Wafi Bogor',
    location: 'Kampus B Al Wafi, Jalan Pengasinan, Sawangan, Depok, Jawa Barat',
  },

  /** Detail pelatihan (sumber: brosur resmi) */
  event: {
    date: 'Senin, 26 Oktober 2026',
    time: '07.30 - 16.00 WIB',
    venue: 'Aula STIT Al Wafi Bogor',
    address: 'Kampus B Al Wafi, Jalan Pengasinan, Sawangan, Depok, Jawa Barat',
    note: 'Informasi berdasarkan brosur resmi dan dapat diperbarui oleh panitia.',
  },

  /** Biaya pendaftaran (sumber: brosur resmi) */
  pricing: {
    normalPrice: 'Rp375.000',
    registrationFee: 'Rp50.000',
    packageFee: 'Rp150.000',
    note: 'Biaya mengikuti brosur resmi dan dapat berubah sewaktu-waktu. Konfirmasi terbaru kepada panitia.',
  },

  /** Fasilitas yang didapat peserta */
  facilities: [
    { name: 'E-Sertifikat', description: 'Sertifikat elektronik sebagai bukti keikutsertaan.' },
    { name: 'Materi Pelatihan', description: 'Materi terstruktur siap dipakai kembali.' },
    { name: 'Snack', description: 'Konsumsi ringan pada pagi hari.' },
    { name: 'Coffee Break', description: 'Istirahat singkat di sela sesi pelatihan.' },
    { name: 'Lunch', description: 'Makan siang selama kegiatan berlangsung.' },
  ],

  /** Manfaat pelatihan */
  benefits: [
    {
      title: 'Murabbi',
      description:
        'Meningkatkan kemampuan membimbing dan membina santri dengan pendekatan yang terarah, sabar, dan terukur.',
    },
    {
      title: 'Pembina',
      description:
        'Mengembangkan keterampilan pembinaan, kedisiplinan, dan pendampingan santri dalam keseharian.',
    },
    {
      title: 'Pemimpin Santri',
      description:
        'Memperkuat kemampuan kepemimpinan dan komunikasi agar mampu menggerakkan dan mengayomi fellow santri.',
    },
  ],

  /** Kategori pada formulir saran & masukan */
  feedbackCategories: [
    'Saran perbaikan',
    'Masukan materi',
    'Masukan kegiatan',
    'Kendala teknis',
    'Pertanyaan umum',
    'Lainnya',
  ],

  /**
   * Aset gambar.
   * Untuk mengganti gambar: letakkan file baru di public/images/
   * lalu ubah path di bawah ini (atau cukup ganti nama file yang sama).
   */
  images: {
    logo: '/images/logo-stit-al-wafi.png',
    flyer: {
      src: '/images/flyer-musyrif.webp',
      srcSet: '/images/flyer-musyrif-640.webp 640w, /images/flyer-musyrif-1280.webp 1280w',
      alt: 'Brosur resmi Pelatihan Musyrif Profesional STIT Al Wafi Bogor',
      // Rasio aspek flyer: 1440 x 2046 (≈ 0.70)
      width: 1440,
      height: 2046,
    },
    speakerPhoto: {
      src: '/images/foto-pembicara-placeholder.jpg',
      alt: 'Foto representatif kegiatan Pelatihan Musyrif Profesional',
      width: 1200,
      height: 1500,
      isPlaceholder: true,
    },
    qrRegistration: {
      src: '/images/qr-pendaftaran.png',
      alt: 'QR code pendaftaran Pelatihan Musyrif Profesional',
    },
    qrInformation: {
      src: '/images/qr-informasi.png',
      alt: 'QR code informasi tambahan Pelatihan Musyrif Profesional',
    },
  },

  /** Identitas teknis */
  seo: {
    title: 'Pelatihan Musyrif Profesional | STIT Al Wafi Bogor',
  },
};

export default siteConfig;
