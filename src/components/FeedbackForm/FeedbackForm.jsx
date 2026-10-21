import { useEffect, useRef, useState } from 'react';
import { Info, ExternalLink } from 'lucide-react';
import siteConfig from '../../config/siteConfig';
import SectionHeading from '../ui/SectionHeading';
import './FeedbackForm.css';

const { feedback } = siteConfig;

/**
 * Tinggi awal iframe sebelum Google melaporkan tinggi aslinya (px).
 * Nilai ini mengikuti tinggi total kartu formulir sebelumnya (2 kolom isian,
 * 1 pilihan kategori, 1 area pesan ± 140 px, pesan bantuan, dan tombol kirim),
 * dikurangi tinggi judul & deskripsi form yang dikosongkan di editor Google.
 */
const INITIAL_HEIGHT = 780;

/** Batas aman tinggi iframe agar tidak pernah memenuhi seluruh layar. */
const MAX_HEIGHT = 1800;

/**
 * Pesan yang dikirim Google Form saat tinggi kontennya berubah,
 * mis. ketika muncul pesan "Jawaban Anda telah direkam".
 */
const HEIGHT_MESSAGE_PREFIX = 'f';

/**
 * Section Saran & Masukan dengan Google Form yang di-embed.
 *
 * Tinggi iframe menyesuaikan otomatis lewat postMessage dari Google Forms,
 * sehingga tidak ada scrollbar di dalam form maupun ruang kosong di bawahnya.
 * Bila pesan tersebut tidak diterima (mis. kebijakan privasi browser),
 * tinggi tetap memakai nilai awal yang aman.
 */
export default function FeedbackForm() {
  const formUrl = (feedback?.googleFormUrl || '').trim();
  const [height, setHeight] = useState(INITIAL_HEIGHT);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!formUrl) return undefined;

    function handleMessage(event) {
      // Hanya terima pesan dari Google Docs (tempat Google Form di-host).
      if (!/^https:\/\/docs\.google\.com$/.test(event.origin)) return;

      const payload = typeof event.data === 'string' ? event.data : '';
      if (!payload.startsWith(HEIGHT_MESSAGE_PREFIX)) return;

      const next = Number.parseInt(payload.slice(HEIGHT_MESSAGE_PREFIX.length), 10);
      if (!Number.isFinite(next) || next < 200) return;

      setHeight(Math.min(next, MAX_HEIGHT));
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [formUrl]);

  return (
    <section className="section" id="saran-masukan" aria-labelledby="saran-title">
      <div className="container feedback">
        <div className="feedback__intro">
          <SectionHeading
            eyebrow="Komunikasi Terbuka"
            title="Saran & Masukan"
            description="Bantu kami meningkatkan kualitas pelatihan. Tuliskan saran, masukan, atau kendala yang Anda temui."
            id="saran-title"
          />

          <ul className="feedback__info" role="list">
            <li>
              <Info size={16} aria-hidden="true" />
              <span>
                Kolom <strong>Nama</strong> dan <strong>Email</strong> bersifat opsional, hanya
                diminta bila Anda ingin panitia dapat membalas langsung.
              </span>
            </li>
            <li>
              <Info size={16} aria-hidden="true" />
              <span>
                Jawaban dikirim melalui <strong>Google Form</strong> resmi panitia, sehingga
                langsung tersimpan dan tidak menampilkan sukses palsu.
              </span>
            </li>
          </ul>
        </div>

        <div className="feedback__embed">
          {formUrl ? (
            <iframe
              ref={frameRef}
              className="feedback__embed-frame"
              src={formUrl}
              title="Formulir Saran & Masukan — Pelatihan Musyrif Profesional"
              height={height}
              style={{ height }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            >
              Memuat formulir…
            </iframe>
          ) : (
            <div className="feedback__fallback">
              <p>
                Formulir saran &amp; masukan sedang disiapkan oleh panitia. Sementara itu, Anda
                dapat menyampaikan masukan langsung kepada kontak panitia di bagian bawah
                halaman.
              </p>
              <a
                className="btn btn--navy"
                href={siteConfig.contact.map.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={18} aria-hidden="true" />
                Hubungi Panitia
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
