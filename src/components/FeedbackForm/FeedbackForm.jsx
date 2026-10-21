import { Info, ExternalLink } from 'lucide-react';
import siteConfig from '../../config/siteConfig';
import SectionHeading from '../ui/SectionHeading';
import './FeedbackForm.css';

const { feedback } = siteConfig;

/** Tinggi iframe (px). Sesuaikan bila form Google Anda lebih panjang. */
const FORM_HEIGHT = 900;

/** Google Form wajib dibuka di dalam iframe dengan parameter ini. */
function toEmbedUrl(url) {
  if (!url) return '';
  if (url.includes('embedded=true')) return url;
  return `${url}${url.includes('?') ? '&' : '?'}embedded=true`;
}

/**
 * Section Saran & Masukan dengan Google Form yang di-embed.
 *
 * Data jawaban disimpan sepenuhnya oleh Google (Form + Spreadsheet),
 * sehingga situs ini tidak memerlukan backend maupun environment variable.
 * Panduan menyiapkan form: integrations/google-form/README.md
 */
export default function FeedbackForm() {
  const formUrl = (feedback?.googleFormUrl || '').trim();
  const embedUrl = toEmbedUrl(formUrl);

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
                Jawaban dikirim melalui <strong>Google Form</strong> resmi panitia dan langsung
                tersimpan untuk ditindaklanjuti.
              </span>
            </li>
          </ul>
        </div>

        <div className="feedback__embed">
          {embedUrl ? (
            <iframe
              className="feedback__embed-frame"
              src={embedUrl}
              title="Formulir Saran & Masukan — Pelatihan Musyrif Profesional"
              height={FORM_HEIGHT}
              loading="lazy"
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
              {formUrl && (
                <a
                  className="btn btn--navy"
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={18} aria-hidden="true" />
                  Buka Formulir Saran &amp; Masukan
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
